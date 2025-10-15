'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Search, 
  Filter,
  Eye,
  User,
  Calendar,
  Clock,
  Activity,
  Shield,
  Database,
  Settings,
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Loader2,
  Info,
  Trash2
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  resourceName?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'success' | 'failure' | 'warning';
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  duration?: number; // in milliseconds
  details?: {
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    changes?: string[];
    metadata?: Record<string, any>;
  };
  category: 'auth' | 'users' | 'products' | 'orders' | 'settings' | 'system' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditStats {
  totalLogs: number;
  logsToday: number;
  successfulActions: number;
  failedActions: number;
  uniqueUsers: number;
  topActions: { action: string; count: number }[];
  securityEvents: number;
  criticalEvents: number;
}

// Mock API functions
const auditApi = {
  getLogs: async (filters?: any): Promise<AuditLog[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        userId: 'admin1',
        userName: 'John Admin',
        userEmail: 'admin@bandencentrale.be',
        action: 'Update Product',
        resource: 'products',
        resourceId: 'prod123',
        resourceName: 'Michelin Pilot Sport 4',
        method: 'PUT',
        status: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_abc123',
        duration: 245,
        details: {
          changes: ['price: €150 → €145', 'stock: 25 → 30'],
          metadata: { reason: 'Price adjustment for promotion' }
        },
        category: 'products',
        severity: 'low',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userId: 'admin2',
        userName: 'Sarah Manager',
        userEmail: 'sarah@bandencentrale.be',
        action: 'Create User',
        resource: 'users',
        resourceId: 'user456',
        resourceName: 'Mike Johnson',
        method: 'POST',
        status: 'success',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        sessionId: 'sess_def456',
        duration: 180,
        details: {
          newValues: { role: 'customer', email: 'mike@example.com', verified: false },
          metadata: { source: 'admin_panel' }
        },
        category: 'users',
        severity: 'medium',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        userId: 'system',
        userName: 'System',
        userEmail: 'system@bandencentrale.be',
        action: 'Failed Login Attempt',
        resource: 'authentication',
        method: 'POST',
        status: 'failure',
        ipAddress: '203.0.113.45',
        userAgent: 'curl/7.68.0',
        sessionId: 'sess_failed',
        duration: 50,
        details: {
          metadata: { 
            attemptedEmail: 'admin@bandencentrale.be',
            reason: 'Invalid password',
            attemptCount: 3
          }
        },
        category: 'security',
        severity: 'high',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        userId: 'admin1',
        userName: 'John Admin',
        userEmail: 'admin@bandencentrale.be',
        action: 'Update System Settings',
        resource: 'settings',
        resourceId: 'general_settings',
        method: 'PUT',
        status: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_abc123',
        duration: 320,
        details: {
          changes: ['freeShippingThreshold: €100 → €75', 'defaultTaxRate: 21% → 20%'],
          metadata: { section: 'ecommerce' }
        },
        category: 'settings',
        severity: 'medium',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        userId: 'admin3',
        userName: 'David Tech',
        userEmail: 'david@bandencentrale.be',
        action: 'Database Backup',
        resource: 'system',
        method: 'POST',
        status: 'success',
        ipAddress: '192.168.1.110',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        sessionId: 'sess_ghi789',
        duration: 15000,
        details: {
          metadata: { 
            backupSize: '2.3 GB',
            includeUploads: true,
            type: 'manual'
          }
        },
        category: 'system',
        severity: 'low',
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId: 'customer1',
        userName: 'Jane Customer',
        userEmail: 'jane@example.com',
        action: 'Place Order',
        resource: 'orders',
        resourceId: 'ord789',
        resourceName: 'Order #789',
        method: 'POST',
        status: 'success',
        ipAddress: '81.246.123.45',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        sessionId: 'sess_customer1',
        duration: 2500,
        details: {
          newValues: { 
            total: 245.50,
            items: 2,
            paymentMethod: 'stripe'
          },
          metadata: { customerType: 'returning' }
        },
        category: 'orders',
        severity: 'low',
      },
      {
        id: '7',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        userId: 'system',
        userName: 'System',
        userEmail: 'system@bandencentrale.be',
        action: 'Security Scan Completed',
        resource: 'security',
        method: 'GET',
        status: 'warning',
        ipAddress: '127.0.0.1',
        userAgent: 'SecurityBot/1.0',
        sessionId: 'sess_security',
        duration: 30000,
        details: {
          metadata: { 
            threatsFound: 0,
            vulnerabilities: 2,
            lastScan: '2024-03-15T10:00:00Z'
          }
        },
        category: 'security',
        severity: 'medium',
      },
    ];
  },
  getStats: async (): Promise<AuditStats> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      totalLogs: 15420,
      logsToday: 234,
      successfulActions: 14250,
      failedActions: 180,
      uniqueUsers: 45,
      topActions: [
        { action: 'View Product', count: 5420 },
        { action: 'Update Product', count: 890 },
        { action: 'Place Order', count: 650 },
        { action: 'Login', count: 520 },
        { action: 'View Order', count: 340 },
      ],
      securityEvents: 25,
      criticalEvents: 3,
    };
  },
};

const getStatusColor = (status: AuditLog['status']) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    failure: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: AuditLog['status']) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-4 h-4" />;
    case 'failure':
      return <XCircle className="w-4 h-4" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: AuditLog['severity']) => {
  const colors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800';
};

const getCategoryIcon = (category: AuditLog['category']) => {
  switch (category) {
    case 'auth':
      return <Shield className="w-4 h-4" />;
    case 'users':
      return <Users className="w-4 h-4" />;
    case 'products':
      return <Package className="w-4 h-4" />;
    case 'orders':
      return <ShoppingCart className="w-4 h-4" />;
    case 'settings':
      return <Settings className="w-4 h-4" />;
    case 'system':
      return <Database className="w-4 h-4" />;
    case 'security':
      return <Shield className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch audit logs
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs', { searchTerm, categoryFilter, statusFilter, severityFilter, dateRange }],
    queryFn: () => auditApi.getLogs({ searchTerm, categoryFilter, statusFilter, severityFilter, dateRange }),
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['audit-stats'],
    queryFn: auditApi.getStats,
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.resourceName && log.resourceName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
  });

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setIsViewModalOpen(true);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-2">Monitor and track all system activities and user actions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Archive Old Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Logs</p>
                  <p className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold">{stats.logsToday}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Successful</p>
                  <p className="text-2xl font-bold">{stats.successfulActions.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold">{stats.failedActions}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Security Events</p>
                  <p className="text-2xl font-bold">{stats.securityEvents}</p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Events</p>
                  <p className="text-2xl font-bold">{stats.criticalEvents}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Action</p>
                  <p className="text-lg font-bold">{stats.topActions[0]?.action}</p>
                  <p className="text-xs text-gray-500">{stats.topActions[0]?.count} times</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="logs" className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="logs" className="p-6">
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="orders">Orders</SelectItem>
                      <SelectItem value="settings">Settings</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failure">Failure</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-full lg:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full lg:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Logs Table */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading audit logs...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Resource</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {new Date(log.timestamp).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">{log.userName}</p>
                                  <p className="text-xs text-gray-500">{log.userEmail}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(log.category)}
                                <div>
                                  <p className="text-sm font-medium">{log.action}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {log.method}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium capitalize">{log.resource}</p>
                                {log.resourceName && (
                                  <p className="text-xs text-gray-500">{log.resourceName}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(log.status)}>
                                {getStatusIcon(log.status)}
                                <span className="ml-1 capitalize">{log.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getSeverityColor(log.severity)}>
                                {log.severity.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {log.duration ? formatDuration(log.duration) : '-'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-mono">{log.ipAddress}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewLog(log)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {filteredLogs.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
                        <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Actions</h3>
                  <div className="space-y-3">
                    {stats?.topActions.map((action, index) => (
                      <div key={action.action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <span className="font-medium">{action.action}</span>
                        </div>
                        <Badge variant="outline">{action.count.toLocaleString()}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Success Rate</h3>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {stats ? ((stats.successfulActions / stats.totalLogs) * 100).toFixed(1) : 0}%
                      </div>
                      <p className="text-green-800">Overall success rate</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Security Events</h3>
                    <div className="text-center p-6 bg-orange-50 rounded-lg">
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        {stats?.securityEvents || 0}
                      </div>
                      <p className="text-orange-800">Events this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Log Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Action:</span>
                      <span className="font-medium">{selectedLog.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resource:</span>
                      <span className="font-medium capitalize">{selectedLog.resource}</span>
                    </div>
                    {selectedLog.resourceName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resource Name:</span>
                        <span className="font-medium">{selectedLog.resourceName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <Badge variant="outline">{selectedLog.method}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedLog.status)}>
                        {selectedLog.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity:</span>
                      <Badge className={getSeverityColor(selectedLog.severity)}>
                        {selectedLog.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">User & Session</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User:</span>
                      <span className="font-medium">{selectedLog.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedLog.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IP Address:</span>
                      <span className="font-mono text-xs">{selectedLog.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session:</span>
                      <span className="font-mono text-xs">{selectedLog.sessionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="font-medium">
                        {new Date(selectedLog.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {selectedLog.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{formatDuration(selectedLog.duration)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">User Agent</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-mono break-all">{selectedLog.userAgent}</p>
                </div>
              </div>
              
              {selectedLog.details && (
                <div>
                  <h4 className="font-semibold mb-3">Details</h4>
                  <div className="space-y-4">
                    {selectedLog.details.changes && (
                      <div>
                        <h5 className="font-medium mb-2">Changes Made:</h5>
                        <ul className="space-y-1">
                          {selectedLog.details.changes.map((change, index) => (
                            <li key={index} className="text-sm bg-blue-50 p-2 rounded">
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedLog.details.oldValues && (
                      <div>
                        <h5 className="font-medium mb-2">Previous Values:</h5>
                        <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(selectedLog.details.oldValues, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {selectedLog.details.newValues && (
                      <div>
                        <h5 className="font-medium mb-2">New Values:</h5>
                        <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(selectedLog.details.newValues, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {selectedLog.details.metadata && (
                      <div>
                        <h5 className="font-medium mb-2">Metadata:</h5>
                        <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(selectedLog.details.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
