'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail,
  Send,
  Search, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  Plus,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  htmlContent?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  subscriberCount: number;
  openRate?: number;
  clickRate?: number;
  unsubscribeCount?: number;
  bounceCount?: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  segments?: string[];
}

interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
  tags?: string[];
  segments?: string[];
  preferences?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
  };
}

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedThisMonth: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalNewslettersSent: number;
}

interface NewsletterFormData {
  subject: string;
  content: string;
  scheduledAt: string;
  segments: string[];
  tags: string[];
}

// Mock API functions
const newsletterApi = {
  getAll: async (): Promise<Newsletter[]> => {
    return [
      {
        id: '1',
        subject: 'Spring Tire Maintenance Tips',
        content: 'As spring arrives, it\'s time to check your tire condition and prepare for warmer weather driving...',
        status: 'sent',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        subscriberCount: 1250,
        openRate: 24.5,
        clickRate: 3.2,
        unsubscribeCount: 2,
        bounceCount: 8,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['maintenance', 'spring'],
        segments: ['all-customers'],
      },
      {
        id: '2',
        subject: 'New Summer Tire Collection 2024',
        content: 'Discover our latest summer tire collection featuring the best brands and latest technology...',
        status: 'draft',
        subscriberCount: 0,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['products', 'summer'],
        segments: ['interested-in-summer-tires'],
      },
      {
        id: '3',
        subject: 'Special Offer: 20% Off Wheel Alignment',
        content: 'Limited time offer on our professional wheel alignment service. Book now and save!',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        subscriberCount: 850,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['promotion', 'service'],
        segments: ['service-customers'],
      },
    ];
  },
  getSubscribers: async (): Promise<Subscriber[]> => {
    return [
      {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['customer'],
        segments: ['all-customers', 'frequent-buyers'],
        preferences: {
          frequency: 'weekly',
          categories: ['maintenance', 'products'],
        },
      },
      {
        id: '2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        status: 'active',
        subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['prospect'],
        segments: ['interested-in-summer-tires'],
        preferences: {
          frequency: 'monthly',
          categories: ['products'],
        },
      },
    ];
  },
  create: async (data: any): Promise<Newsletter> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now().toString(),
      ...data,
      status: 'draft',
      subscriberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  update: async (id: string, data: any): Promise<Newsletter> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, ...data, updatedAt: new Date().toISOString() };
  },
  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
  send: async (id: string): Promise<Newsletter> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { 
      id, 
      status: 'sent', 
      sentAt: new Date().toISOString() 
    } as Newsletter;
  },
};

const getStatusColor = (status: Newsletter['status']) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    sent: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: Newsletter['status']) => {
  switch (status) {
    case 'sent':
      return <CheckCircle className="w-4 h-4" />;
    case 'failed':
      return <XCircle className="w-4 h-4" />;
    case 'scheduled':
      return <Clock className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export default function NewslettersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('newsletters');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [viewingNewsletter, setViewingNewsletter] = useState<Newsletter | null>(null);
  const [newsletterToDelete, setNewsletterToDelete] = useState<Newsletter | null>(null);
  const [formData, setFormData] = useState<NewsletterFormData>({
    subject: '',
    content: '',
    scheduledAt: '',
    segments: [],
    tags: [],
  });

  const queryClient = useQueryClient();

  // Fetch newsletters
  const { data: newsletters = [], isLoading } = useQuery({
    queryKey: ['newsletters'],
    queryFn: newsletterApi.getAll,
  });

  // Fetch subscribers
  const { data: subscribers = [] } = useQuery({
    queryKey: ['subscribers'],
    queryFn: newsletterApi.getSubscribers,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: newsletterApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Newsletter created successfully');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create newsletter');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      newsletterApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Newsletter updated successfully');
      setIsEditModalOpen(false);
      setEditingNewsletter(null);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update newsletter');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: newsletterApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Newsletter deleted successfully');
      setIsDeleteDialogOpen(false);
      setNewsletterToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete newsletter');
    },
  });

  // Send mutation
  const sendMutation = useMutation({
    mutationFn: newsletterApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Newsletter sent successfully');
    },
    onError: () => {
      toast.error('Failed to send newsletter');
    },
  });

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || newsletter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newsletterStats: NewsletterStats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    unsubscribedThisMonth: subscribers.filter(s => 
      s.status === 'unsubscribed' && 
      s.unsubscribedAt && 
      new Date(s.unsubscribedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    averageOpenRate: newsletters.filter(n => n.openRate).reduce((sum, n) => sum + (n.openRate || 0), 0) / 
                    newsletters.filter(n => n.openRate).length || 0,
    averageClickRate: newsletters.filter(n => n.clickRate).reduce((sum, n) => sum + (n.clickRate || 0), 0) / 
                     newsletters.filter(n => n.clickRate).length || 0,
    totalNewslettersSent: newsletters.filter(n => n.status === 'sent').length,
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      content: '',
      scheduledAt: '',
      segments: [],
      tags: [],
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (newsletter: Newsletter) => {
    setFormData({
      subject: newsletter.subject,
      content: newsletter.content,
      scheduledAt: newsletter.scheduledAt || '',
      segments: newsletter.segments || [],
      tags: newsletter.tags || [],
    });
    setEditingNewsletter(newsletter);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!editingNewsletter) return;
    updateMutation.mutate({ id: editingNewsletter.id, data: formData });
  };

  const handleView = (newsletter: Newsletter) => {
    setViewingNewsletter(newsletter);
    setIsViewModalOpen(true);
  };

  const handleDelete = (newsletter: Newsletter) => {
    setNewsletterToDelete(newsletter);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!newsletterToDelete) return;
    deleteMutation.mutate(newsletterToDelete.id);
  };

  const handleSend = (newsletter: Newsletter) => {
    sendMutation.mutate(newsletter.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-gray-600 mt-2">Create and manage email newsletters for your subscribers</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Subscribers
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Newsletter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold">{newsletterStats.totalSubscribers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{newsletterStats.activeSubscribers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unsubscribed</p>
                <p className="text-2xl font-bold">{newsletterStats.unsubscribedThisMonth}</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Open Rate</p>
                <p className="text-2xl font-bold">{newsletterStats.averageOpenRate.toFixed(1)}%</p>
              </div>
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Click Rate</p>
                <p className="text-2xl font-bold">{newsletterStats.averageClickRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{newsletterStats.totalNewslettersSent}</p>
              </div>
              <Send className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="newsletters" className="p-6">
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search newsletters..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['newsletters'] })}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Newsletters List */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading newsletters...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNewsletters.map((newsletter) => (
                      <Card key={newsletter.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold">{newsletter.subject}</h3>
                                <Badge className={getStatusColor(newsletter.status)}>
                                  {getStatusIcon(newsletter.status)}
                                  <span className="ml-1 capitalize">{newsletter.status}</span>
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-4 line-clamp-2">{newsletter.content}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Created</p>
                                  <p className="font-medium">{new Date(newsletter.createdAt).toLocaleDateString()}</p>
                                </div>
                                {newsletter.scheduledAt && (
                                  <div>
                                    <p className="text-gray-500">Scheduled</p>
                                    <p className="font-medium">{new Date(newsletter.scheduledAt).toLocaleDateString()}</p>
                                  </div>
                                )}
                                {newsletter.sentAt && (
                                  <div>
                                    <p className="text-gray-500">Sent</p>
                                    <p className="font-medium">{new Date(newsletter.sentAt).toLocaleDateString()}</p>
                                  </div>
                                )}
                                {newsletter.status === 'sent' && (
                                  <>
                                    <div>
                                      <p className="text-gray-500">Open Rate</p>
                                      <p className="font-medium">{newsletter.openRate?.toFixed(1)}%</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Click Rate</p>
                                      <p className="font-medium">{newsletter.clickRate?.toFixed(1)}%</p>
                                    </div>
                                  </>
                                )}
                                <div>
                                  <p className="text-gray-500">Subscribers</p>
                                  <p className="font-medium">{newsletter.subscriberCount.toLocaleString()}</p>
                                </div>
                              </div>

                              {newsletter.tags && newsletter.tags.length > 0 && (
                                <div className="flex items-center space-x-2 mt-4">
                                  <span className="text-sm text-gray-500">Tags:</span>
                                  {newsletter.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col space-y-2 ml-4">
                              {newsletter.status === 'draft' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSend(newsletter)}
                                  disabled={sendMutation.isPending}
                                >
                                  {sendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => handleView(newsletter)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(newsletter)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(newsletter)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredNewsletters.length === 0 && (
                      <div className="text-center py-12">
                        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletters found</h3>
                        <p className="text-gray-600">Create your first newsletter to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="subscribers" className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Segments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium">{subscriber.email}</TableCell>
                        <TableCell>
                          {subscriber.firstName && subscriber.lastName 
                            ? `${subscriber.firstName} ${subscriber.lastName}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            subscriber.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscriber.status === 'unsubscribed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {subscriber.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">
                            {subscriber.preferences?.frequency || 'weekly'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {subscriber.segments?.slice(0, 2).map((segment) => (
                              <Badge key={segment} variant="outline" className="text-xs">
                                {segment}
                              </Badge>
                            ))}
                            {subscriber.segments && subscriber.segments.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{subscriber.segments.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {subscribers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
                    <p className="text-gray-600">Start building your subscriber list.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Newsletter Modal */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Create New Newsletter</ModalTitle>
          </ModalHeader>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div>
              <Label htmlFor="subject">Subject Line *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter newsletter subject"
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your newsletter content..."
                rows={8}
              />
            </div>

            <div>
              <Label htmlFor="scheduledAt">Schedule (Optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">Leave empty to save as draft</p>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                })}
                placeholder="e.g., promotion, maintenance, summer"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={createMutation.isPending || !formData.subject || !formData.content}
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Newsletter
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* View Newsletter Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Newsletter Preview</DialogTitle>
          </DialogHeader>
          {viewingNewsletter && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <h3 className="text-xl font-semibold">{viewingNewsletter.subject}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                  <span>Status: <Badge className={getStatusColor(viewingNewsletter.status)}>{viewingNewsletter.status}</Badge></span>
                  <span>Created: {new Date(viewingNewsletter.createdAt).toLocaleDateString()}</span>
                  {viewingNewsletter.sentAt && (
                    <span>Sent: {new Date(viewingNewsletter.sentAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Content</h4>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{viewingNewsletter.content}</p>
                </div>
              </div>
              
              {viewingNewsletter.status === 'sent' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{viewingNewsletter.subscriberCount}</p>
                    <p className="text-sm text-blue-800">Sent</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{viewingNewsletter.openRate?.toFixed(1)}%</p>
                    <p className="text-sm text-green-800">Open Rate</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{viewingNewsletter.clickRate?.toFixed(1)}%</p>
                    <p className="text-sm text-purple-800">Click Rate</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{viewingNewsletter.unsubscribeCount}</p>
                    <p className="text-sm text-red-800">Unsubscribed</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <XCircle className="w-5 h-5 mr-2" />
              Delete Newsletter
            </DialogTitle>
          </DialogHeader>
          {newsletterToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete the newsletter "<strong>{newsletterToDelete.subject}</strong>"? 
                  This action cannot be undone.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Delete Newsletter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
