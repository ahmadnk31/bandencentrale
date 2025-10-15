'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Send,
  Pause,
  Play,
  Copy,
  BarChart3,
  Users,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Archive,
  Download,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'transactional' | 'announcement';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  content: string;
  recipientCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  template?: string;
  targetAudience?: string;
}

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRecipients: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalSent: number;
  scheduledCampaigns: number;
  draftCampaigns: number;
}

interface CampaignFilters {
  search: string;
  status: string;
  type: string;
  dateRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const CAMPAIGN_TYPES = [
  { value: 'newsletter', label: 'Newsletter', color: 'bg-blue-100 text-blue-800' },
  { value: 'promotional', label: 'Promotional', color: 'bg-green-100 text-green-800' },
  { value: 'transactional', label: 'Transactional', color: 'bg-purple-100 text-purple-800' },
  { value: 'announcement', label: 'Announcement', color: 'bg-orange-100 text-orange-800' }
];

const CAMPAIGN_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sending', label: 'Sending', color: 'bg-blue-100 text-blue-800' },
  { value: 'sent', label: 'Sent', color: 'bg-green-100 text-green-800' },
  { value: 'paused', label: 'Paused', color: 'bg-orange-100 text-orange-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<EmailCampaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<CampaignFilters>({
    search: '',
    status: 'all',
    type: 'all',
    dateRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    type: 'newsletter' as EmailCampaign['type'],
    content: '',
    scheduledAt: '',
    targetAudience: 'all',
    template: '',
    tags: [] as string[]
  });

  useEffect(() => {
    loadCampaigns();
  }, [filters]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockCampaigns: EmailCampaign[] = [
        {
          id: '1',
          name: 'Winter Tire Special - November 2024',
          subject: '🌨️ Get Ready for Winter - Special Tire Deals Inside!',
          type: 'promotional',
          status: 'sent',
          content: 'Our exclusive winter tire collection is now available with special discounts...',
          recipientCount: 15420,
          sentCount: 15420,
          openRate: 24.5,
          clickRate: 3.8,
          bounceRate: 1.2,
          unsubscribeRate: 0.3,
          sentAt: '2024-11-01T09:00:00Z',
          createdBy: 'Sarah Johnson',
          createdAt: '2024-10-28T14:30:00Z',
          updatedAt: '2024-11-01T09:00:00Z',
          tags: ['winter', 'promotional', 'discount'],
          template: 'promotional-template',
          targetAudience: 'all_customers'
        },
        {
          id: '2',
          name: 'Monthly Newsletter - October 2024',
          subject: 'Your Monthly Tire Care Tips & Industry News',
          type: 'newsletter',
          status: 'sent',
          content: 'Welcome to our monthly newsletter featuring tire maintenance tips...',
          recipientCount: 18750,
          sentCount: 18750,
          openRate: 31.2,
          clickRate: 5.6,
          bounceRate: 0.8,
          unsubscribeRate: 0.4,
          sentAt: '2024-10-15T08:00:00Z',
          createdBy: 'Mike Wilson',
          createdAt: '2024-10-10T11:20:00Z',
          updatedAt: '2024-10-15T08:00:00Z',
          tags: ['newsletter', 'tips', 'monthly'],
          template: 'newsletter-template',
          targetAudience: 'newsletter_subscribers'
        },
        {
          id: '3',
          name: 'Black Friday Mega Sale 2024',
          subject: '🔥 BLACK FRIDAY: Up to 50% Off Premium Tires!',
          type: 'promotional',
          status: 'scheduled',
          content: 'The biggest sale of the year is here! Don\'t miss out on incredible savings...',
          recipientCount: 22500,
          sentCount: 0,
          openRate: 0,
          clickRate: 0,
          bounceRate: 0,
          unsubscribeRate: 0,
          scheduledAt: '2024-11-29T06:00:00Z',
          createdBy: 'David Brown',
          createdAt: '2024-10-20T16:45:00Z',
          updatedAt: '2024-10-25T10:30:00Z',
          tags: ['black-friday', 'sale', 'promotional'],
          template: 'promotional-template',
          targetAudience: 'high_value_customers'
        },
        {
          id: '4',
          name: 'New Product Announcement - Continental EcoContact 7',
          subject: 'Introducing the Future of Eco-Friendly Driving',
          type: 'announcement',
          status: 'sending',
          content: 'We\'re excited to announce the arrival of Continental\'s latest innovation...',
          recipientCount: 12800,
          sentCount: 8540,
          openRate: 18.3,
          clickRate: 2.1,
          bounceRate: 1.0,
          unsubscribeRate: 0.2,
          sentAt: '2024-10-11T10:00:00Z',
          createdBy: 'Lisa Garcia',
          createdAt: '2024-10-08T13:15:00Z',
          updatedAt: '2024-10-11T10:00:00Z',
          tags: ['announcement', 'new-product', 'continental'],
          template: 'announcement-template',
          targetAudience: 'eco_conscious_customers'
        },
        {
          id: '5',
          name: 'Summer Tire Maintenance Guide',
          subject: 'Essential Summer Tire Care Tips',
          type: 'newsletter',
          status: 'draft',
          content: 'As temperatures rise, proper tire maintenance becomes crucial...',
          recipientCount: 0,
          sentCount: 0,
          openRate: 0,
          clickRate: 0,
          bounceRate: 0,
          unsubscribeRate: 0,
          createdBy: 'John Doe',
          createdAt: '2024-10-05T09:30:00Z',
          updatedAt: '2024-10-08T14:20:00Z',
          tags: ['newsletter', 'summer', 'maintenance'],
          template: 'newsletter-template',
          targetAudience: 'all_customers'
        },
        {
          id: '6',
          name: 'Customer Satisfaction Survey',
          subject: 'Help Us Serve You Better - Quick 2-Minute Survey',
          type: 'transactional',
          status: 'paused',
          content: 'Your feedback is important to us. Please take a moment to share your experience...',
          recipientCount: 5600,
          sentCount: 2800,
          openRate: 35.7,
          clickRate: 12.4,
          bounceRate: 0.5,
          unsubscribeRate: 0.1,
          sentAt: '2024-09-15T12:00:00Z',
          createdBy: 'Sarah Johnson',
          createdAt: '2024-09-10T10:45:00Z',
          updatedAt: '2024-09-20T15:30:00Z',
          tags: ['survey', 'feedback', 'transactional'],
          template: 'survey-template',
          targetAudience: 'recent_customers'
        }
      ];

      const mockStats: CampaignStats = {
        totalCampaigns: 24,
        activeCampaigns: 3,
        totalRecipients: 75070,
        averageOpenRate: 26.8,
        averageClickRate: 4.9,
        totalSent: 45510,
        scheduledCampaigns: 2,
        draftCampaigns: 4
      };

      setCampaigns(mockCampaigns);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      // Simulate API call
      console.log('Creating campaign:', formData);
      setIsAddDialogOpen(false);
      resetForm();
      await loadCampaigns();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleUpdateCampaign = async () => {
    try {
      // Simulate API call
      console.log('Updating campaign:', selectedCampaign);
      setIsEditDialogOpen(false);
      setSelectedCampaign(null);
      await loadCampaigns();
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDeleteCampaign = (campaign: EmailCampaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    setIsDeleting(true);
    try {
      // Simulate API call
      console.log('Deleting campaign:', campaignToDelete.id);
      await loadCampaigns();
      setIsDeleteDialogOpen(false);
      setCampaignToDelete(null);
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setIsViewDialogOpen(true);
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      type: campaign.type,
      content: campaign.content,
      scheduledAt: campaign.scheduledAt ? campaign.scheduledAt.slice(0, 16) : '',
      targetAudience: campaign.targetAudience || 'all',
      template: campaign.template || '',
      tags: campaign.tags || []
    });
    setIsEditDialogOpen(true);
  };

  const handleDuplicateCampaign = async (campaign: EmailCampaign) => {
    try {
      // Simulate API call
      console.log('Duplicating campaign:', campaign.id);
      await loadCampaigns();
    } catch (error) {
      console.error('Failed to duplicate campaign:', error);
    }
  };

  const handlePauseCampaign = async (campaign: EmailCampaign) => {
    try {
      // Simulate API call
      console.log('Pausing campaign:', campaign.id);
      await loadCampaigns();
    } catch (error) {
      console.error('Failed to pause campaign:', error);
    }
  };

  const handleResumeCampaign = async (campaign: EmailCampaign) => {
    try {
      // Simulate API call
      console.log('Resuming campaign:', campaign.id);
      await loadCampaigns();
    } catch (error) {
      console.error('Failed to resume campaign:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      type: 'newsletter',
      content: '',
      scheduledAt: '',
      targetAudience: 'all',
      template: '',
      tags: []
    });
  };

  const getTypeConfig = (type: string) => {
    return CAMPAIGN_TYPES.find(t => t.value === type) || CAMPAIGN_TYPES[0];
  };

  const getStatusConfig = (status: string) => {
    return CAMPAIGN_STATUSES.find(s => s.value === status) || CAMPAIGN_STATUSES[0];
  };

  const getProgressPercentage = (campaign: EmailCampaign) => {
    if (campaign.recipientCount === 0) return 0;
    return (campaign.sentCount / campaign.recipientCount) * 100;
  };

  const StatCard = ({ title, value, change, changeType, description, icon: Icon, format }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {format ? format(value) : value.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        {change && (
          <div className="flex items-center mt-4">
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Campaign Management</h1>
          <p className="text-gray-600 mt-2">Create and manage email marketing campaigns</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
          <StatCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            change="+4"
            changeType="increase"
            description="this month"
            icon={Mail}
          />
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={Send}
          />
          <StatCard
            title="Total Recipients"
            value={stats.totalRecipients}
            change="+2,450"
            changeType="increase"
            description="this month"
            icon={Users}
          />
          <StatCard
            title="Avg Open Rate"
            value={stats.averageOpenRate}
            format={(val: number) => `${val.toFixed(1)}%`}
            change="+2.3%"
            changeType="increase"
            description="vs last month"
            icon={Eye}
          />
          <StatCard
            title="Avg Click Rate"
            value={stats.averageClickRate}
            format={(val: number) => `${val.toFixed(1)}%`}
            change="+0.8%"
            changeType="increase"
            description="vs last month"
            icon={Target}
          />
          <StatCard
            title="Total Sent"
            value={stats.totalSent}
            change="+12,340"
            changeType="increase"
            description="this month"
            icon={CheckCircle}
          />
          <StatCard
            title="Scheduled"
            value={stats.scheduledCampaigns}
            icon={Calendar}
          />
          <StatCard
            title="Drafts"
            value={stats.draftCampaigns}
            icon={FileText}
          />
        </div>
      )}

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Campaigns
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {CAMPAIGN_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {CAMPAIGN_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Refresh */}
              <Button variant="outline" size="sm" onClick={loadCampaigns} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const typeConfig = getTypeConfig(campaign.type);
                  const statusConfig = getStatusConfig(campaign.status);
                  const progress = getProgressPercentage(campaign);
                  
                  return (
                    <TableRow key={campaign.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{campaign.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{campaign.subject}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${typeConfig.color} border-0`}>
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig.color} border-0`}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{campaign.recipientCount.toLocaleString()}</span>
                          {campaign.sentCount > 0 && (
                            <span className="text-sm text-gray-500">
                              {campaign.sentCount.toLocaleString()} sent
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {campaign.status === 'sending' ? (
                          <div className="space-y-1">
                            <Progress value={progress} className="w-20" />
                            <span className="text-xs text-gray-500">{progress.toFixed(0)}%</span>
                          </div>
                        ) : campaign.status === 'sent' ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Complete</span>
                          </div>
                        ) : campaign.status === 'scheduled' ? (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-600">Scheduled</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {campaign.openRate > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{campaign.openRate.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{campaign.clickRate.toFixed(1)}%</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-400">{campaign.createdBy}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaign)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDuplicateCampaign(campaign)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          {campaign.status === 'draft' && (
                            <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {campaign.status === 'sending' && (
                            <Button variant="ghost" size="sm" onClick={() => handlePauseCampaign(campaign)}>
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                          {campaign.status === 'paused' && (
                            <Button variant="ghost" size="sm" onClick={() => handleResumeCampaign(campaign)}>
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCampaign(campaign)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {campaigns.length === 0 && !loading && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600">Try adjusting your filters or create your first campaign to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Campaign Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Black Friday Sale 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Campaign Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as EmailCampaign['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPAIGN_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="🔥 BLACK FRIDAY: Up to 50% Off Premium Tires!"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="newsletter_subscribers">Newsletter Subscribers</SelectItem>
                    <SelectItem value="high_value_customers">High Value Customers</SelectItem>
                    <SelectItem value="recent_customers">Recent Customers</SelectItem>
                    <SelectItem value="eco_conscious_customers">Eco-Conscious Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Email Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotional-template">Promotional Template</SelectItem>
                    <SelectItem value="newsletter-template">Newsletter Template</SelectItem>
                    <SelectItem value="announcement-template">Announcement Template</SelectItem>
                    <SelectItem value="survey-template">Survey Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Email Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your email content here..."
                rows={8}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Schedule Send (Optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleCreateCampaign}>
                Save as Draft
              </Button>
              <Button onClick={handleCreateCampaign}>
                {formData.scheduledAt ? 'Schedule Campaign' : 'Send Now'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Campaign Name *</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Black Friday Sale 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editType">Campaign Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as EmailCampaign['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPAIGN_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editSubject">Email Subject *</Label>
              <Input
                id="editSubject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="🔥 BLACK FRIDAY: Up to 50% Off Premium Tires!"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTargetAudience">Target Audience *</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="newsletter_subscribers">Newsletter Subscribers</SelectItem>
                    <SelectItem value="high_value_customers">High Value Customers</SelectItem>
                    <SelectItem value="recent_customers">Recent Customers</SelectItem>
                    <SelectItem value="eco_conscious_customers">Eco-Conscious Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTemplate">Email Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotional-template">Promotional Template</SelectItem>
                    <SelectItem value="newsletter-template">Newsletter Template</SelectItem>
                    <SelectItem value="announcement-template">Announcement Template</SelectItem>
                    <SelectItem value="survey-template">Survey Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editContent">Email Content *</Label>
              <Textarea
                id="editContent"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your email content here..."
                rows={8}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editScheduledAt">Schedule Send (Optional)</Label>
              <Input
                id="editScheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCampaign}>
                Update Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Campaign Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCampaign.name}</h3>
                  <p className="text-gray-600">{selectedCampaign.subject}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusConfig(selectedCampaign.status).color}>
                      {getStatusConfig(selectedCampaign.status).label}
                    </Badge>
                    <Badge className={getTypeConfig(selectedCampaign.type).color}>
                      {getTypeConfig(selectedCampaign.type).label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedCampaign.recipientCount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Recipients</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedCampaign.sentCount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedCampaign.openRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Open Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedCampaign.clickRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Click Rate</p>
                </div>
              </div>
              
              {selectedCampaign.status === 'sending' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sending Progress</span>
                    <span className="text-sm text-gray-500">
                      {selectedCampaign.sentCount.toLocaleString()} / {selectedCampaign.recipientCount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={getProgressPercentage(selectedCampaign)} />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Campaign Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Audience:</span>
                      <span className="font-medium">{selectedCampaign.targetAudience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium">{selectedCampaign.template || 'Custom'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created By:</span>
                      <span className="font-medium">{selectedCampaign.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{new Date(selectedCampaign.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bounce Rate:</span>
                      <span className="font-medium">{selectedCampaign.bounceRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unsubscribe Rate:</span>
                      <span className="font-medium">{selectedCampaign.unsubscribeRate.toFixed(1)}%</span>
                    </div>
                    {selectedCampaign.scheduledAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled:</span>
                        <span className="font-medium">{new Date(selectedCampaign.scheduledAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedCampaign.sentAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sent:</span>
                        <span className="font-medium">{new Date(selectedCampaign.sentAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedCampaign.tags && selectedCampaign.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-3">Email Content Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCampaign.content}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Campaign
            </DialogTitle>
          </DialogHeader>
          {campaignToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete <strong>{campaignToDelete.name}</strong>? 
                  This action cannot be undone and will permanently remove all campaign data and analytics.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteCampaign} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Campaign
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
