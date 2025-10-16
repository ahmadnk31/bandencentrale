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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  MessageSquare, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical
} from 'lucide-react';

interface Review {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  productId?: string;
  productName?: string;
  serviceId?: string;
  serviceName?: string;
  orderId?: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  adminResponse?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  totalReviews: number;
  pendingReviews: number;
  averageRating: number;
  approvedReviews: number;
  rejectedReviews: number;
  spamReviews: number;
}

interface ReviewFilters {
  search: string;
  status: string;
  rating: string;
  type: string;
  verified: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState<ReviewFilters>({
    search: '',
    status: 'all',
    rating: 'all',
    type: 'all',
    verified: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1
  });

  useEffect(() => {
    loadReviews();
  }, [filters]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: '10',
        ...(filters.search && { search: filters.search }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.rating && filters.rating !== 'all' && { rating: filters.rating }),
      });

      const response = await fetch(`/api/reviews?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        // Transform API response to match component interface
        const transformedReviews: Review[] = result.data.map((review: any) => ({
          id: review.id,
          userId: review.userId,
          customerName: review.userName || review.reviewerName || 'Anonymous',
          customerEmail: review.userEmail || review.reviewerEmail || '',
          productId: review.productId,
          productName: review.productName,
          serviceId: review.serviceId,
          serviceName: review.serviceName,
          orderId: review.orderId,
          rating: review.rating,
          title: review.title || '',
          comment: review.content,
          status: review.status,
          isVerifiedPurchase: review.isVerifiedPurchase,
          helpfulCount: review.helpfulCount || 0,
          notHelpfulCount: 0, // Not in DB schema yet
          adminResponse: '', // Not implemented yet
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        }));

        setReviews(transformedReviews);
        setTotalPages(result.pagination.totalPages);

        // Calculate stats from the data
        const stats: ReviewStats = {
          totalReviews: result.pagination.totalCount,
          pendingReviews: transformedReviews.filter(r => r.status === 'pending').length,
          approvedReviews: transformedReviews.filter(r => r.status === 'approved').length,
          rejectedReviews: transformedReviews.filter(r => r.status === 'rejected').length,
          spamReviews: transformedReviews.filter(r => r.status === 'spam').length,
          averageRating: transformedReviews.length > 0 
            ? transformedReviews.reduce((sum, r) => sum + r.rating, 0) / transformedReviews.length 
            : 0,
        };
        setStats(stats);
      } else {
        console.error('Failed to load reviews:', result.error);
        setReviews([]);
        const emptyStats: ReviewStats = {
          totalReviews: 0,
          pendingReviews: 0,
          averageRating: 0,
          approvedReviews: 0,
          rejectedReviews: 0,
          spamReviews: 0
        };
        setStats(emptyStats);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
      const emptyStats: ReviewStats = {
        totalReviews: 0,
        pendingReviews: 0,
        averageRating: 0,
        approvedReviews: 0,
        rejectedReviews: 0,
        spamReviews: 0
      };
      setStats(emptyStats);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reviewId: string, newStatus: Review['status']) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          moderationNotes: `Status changed to ${newStatus}`,
          // moderatedBy is now automatically set by the API using the authenticated admin user
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Review status updated successfully');
        await loadReviews();
      } else {
        console.error('Failed to update review status:', result.error);
        alert('Failed to update review status: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to update review status:', error);
      alert('Failed to update review status. Please try again.');
    }
  };

  const handleAddResponse = async () => {
    if (!selectedReview || !adminResponse.trim()) return;
    
    try {
      // Simulate API call
      console.log('Adding admin response:', selectedReview.id, adminResponse);
      setIsResponseDialogOpen(false);
      setAdminResponse('');
      await loadReviews();
    } catch (error) {
      console.error('Failed to add admin response:', error);
    }
  };

  const handleDeleteReview = (review: Review) => {
    setReviewToDelete(review);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    setIsDeleting(true);
    try {
      // Simulate API call
      console.log('Deleting review:', reviewToDelete.id);
      await loadReviews();
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleRespondToReview = (review: Review) => {
    setSelectedReview(review);
    setAdminResponse(review.adminResponse || '');
    setIsResponseDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'spam': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const StatCard = ({ title, value, change, changeType, description, icon: Icon }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {typeof value === 'number' && title.includes('Rating') 
                ? value.toFixed(1) 
                : value.toLocaleString()
              }
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
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews and ratings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            change="+18"
            changeType="increase"
            description="this month"
            icon={MessageSquare}
          />
          <StatCard
            title="Pending"
            value={stats.pendingReviews}
            change="+5"
            changeType="increase"
            description="need moderation"
            icon={AlertTriangle}
          />
          <StatCard
            title="Average Rating"
            value={stats.averageRating}
            change="+0.2"
            changeType="increase"
            description="this month"
            icon={Star}
          />
          <StatCard
            title="Approved"
            value={stats.approvedReviews}
            change="+15"
            changeType="increase"
            description="this month"
            icon={CheckCircle}
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedReviews}
            change="-2"
            changeType="decrease"
            description="this month"
            icon={XCircle}
          />
          <StatCard
            title="Spam"
            value={stats.spamReviews}
            change="-1"
            changeType="decrease"
            description="this month"
            icon={Flag}
          />
        </div>
      )}

      {/* Filters and Reviews Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Customer Reviews
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                </SelectContent>
              </Select>

              {/* Rating Filter */}
              <Select 
                value={filters.rating} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh */}
              <Button variant="outline" size="sm" onClick={loadReviews} disabled={loading}>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Product/Service</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Helpful</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{review.customerName}</p>
                        <p className="text-sm text-gray-500">{review.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{review.productName || review.serviceName}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          {review.productId && <Package className="w-3 h-3" />}
                          {review.serviceId && <User className="w-3 h-3" />}
                          <span>{review.productId ? 'Product' : 'Service'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(review.rating)}
                        <span className="text-sm font-medium ml-2">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div>
                        <p className="font-medium text-sm truncate">{review.title}</p>
                        <p className="text-sm text-gray-600 truncate">{review.comment}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={review.status}
                        onValueChange={(value) => handleUpdateStatus(review.id, value as Review['status'])}
                      >
                        <SelectTrigger className="w-28">
                          <Badge className={`${getStatusColor(review.status)} border-0`}>
                            {review.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="spam">Spam</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {review.isVerifiedPurchase ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">Guest</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center space-x-1 text-green-600">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{review.helpfulCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-red-600">
                          <ThumbsDown className="w-3 h-3" />
                          <span>{review.notHelpfulCount}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewReview(review)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRespondToReview(review)}>
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteReview(review)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {reviews.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your filters or wait for customers to leave reviews.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedReview.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedReview.customerEmail}</span>
                    </div>
                    {selectedReview.isVerifiedPurchase && (
                      <Badge className="bg-green-100 text-green-800">Verified Purchase</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Review Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>{selectedReview.productName || selectedReview.serviceName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(selectedReview.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {getRatingStars(selectedReview.rating)}
                        <span className="ml-2 font-medium">{selectedReview.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Review Content</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedReview.title}</h4>
                  <p className="text-gray-800">{selectedReview.comment}</p>
                </div>
              </div>
              
              {selectedReview.adminResponse && (
                <div>
                  <h3 className="font-semibold mb-3">Admin Response</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-800">{selectedReview.adminResponse}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{selectedReview.helpfulCount} helpful</span>
                  </div>
                  <div className="flex items-center space-x-2 text-red-600">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{selectedReview.notHelpfulCount} not helpful</span>
                  </div>
                </div>
                <Badge className={getStatusColor(selectedReview.status)}>
                  {selectedReview.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Response</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminResponse">Response Message</Label>
              <Textarea
                id="adminResponse"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Write your response to the customer..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddResponse} disabled={!adminResponse.trim()}>
                {selectedReview?.adminResponse ? 'Update Response' : 'Add Response'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Review
            </DialogTitle>
          </DialogHeader>
          {reviewToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete this review from <strong>{reviewToDelete.customerName}</strong>? 
                  This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteReview} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Review
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
