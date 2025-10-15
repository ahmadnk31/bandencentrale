'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  Save,
  RotateCcw,
  Shield,
  Bell,
  Mail,
  Database,
  FileText,
  Globe,
  Palette,
  Lock,
  Key,
  CreditCard,
  Truck,
  Store,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Info,
  Upload,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
  };
  business: {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    vatNumber: string;
    businessHours: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
  };
  ecommerce: {
    defaultTaxRate: number;
    freeShippingThreshold: number;
    lowStockThreshold: number;
    allowGuestCheckout: boolean;
    requireAccountVerification: boolean;
    autoApproveReviews: boolean;
    showOutOfStockProducts: boolean;
    enableWishlist: boolean;
    enableCompareProducts: boolean;
  };
  payments: {
    enableStripe: boolean;
    enablePayPal: boolean;
    enableBankTransfer: boolean;
    enableCashOnDelivery: boolean;
    stripePublishableKey?: string;
    paypalClientId?: string;
  };
  shipping: {
    defaultShippingRate: number;
    freeShippingEnabled: boolean;
    localDeliveryEnabled: boolean;
    localDeliveryRadius: number;
    shippingCalculationMethod: 'flat' | 'weight' | 'price' | 'zone';
  };
  notifications: {
    emailNotifications: {
      newOrders: boolean;
      lowStock: boolean;
      newReviews: boolean;
      newCustomers: boolean;
      systemUpdates: boolean;
    };
    smsNotifications: {
      orderStatusUpdates: boolean;
      appointmentReminders: boolean;
      promotionalMessages: boolean;
    };
  };
  security: {
    enableTwoFactor: boolean;
    requireStrongPasswords: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableIpWhitelist: boolean;
    enableAuditLog: boolean;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    allowedIps: string[];
  };
  backups: {
    autoBackupEnabled: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionDays: number;
    includeUploads: boolean;
  };
}

// Mock API functions
const settingsApi = {
  get: async (): Promise<SystemSettings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      general: {
        siteName: 'Bandencentrale',
        siteDescription: 'Premium tire service and sales in Belgium',
        siteUrl: 'https://bandencentrale.be',
        adminEmail: 'admin@bandencentrale.be',
        timezone: 'Europe/Brussels',
        language: 'en',
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
      },
      business: {
        companyName: 'Bandencentrale BVBA',
        companyAddress: '123 Tire Street, 9000 Ghent, Belgium',
        companyPhone: '+32 9 123 45 67',
        companyEmail: 'info@bandencentrale.be',
        vatNumber: 'BE0123456789',
        businessHours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '09:00', close: '17:00', closed: false },
          sunday: { open: '10:00', close: '16:00', closed: true },
        },
      },
      ecommerce: {
        defaultTaxRate: 21,
        freeShippingThreshold: 100,
        lowStockThreshold: 5,
        allowGuestCheckout: true,
        requireAccountVerification: false,
        autoApproveReviews: false,
        showOutOfStockProducts: true,
        enableWishlist: true,
        enableCompareProducts: true,
      },
      payments: {
        enableStripe: true,
        enablePayPal: true,
        enableBankTransfer: true,
        enableCashOnDelivery: false,
        stripePublishableKey: 'pk_test_...',
        paypalClientId: 'AXxxx...',
      },
      shipping: {
        defaultShippingRate: 15,
        freeShippingEnabled: true,
        localDeliveryEnabled: true,
        localDeliveryRadius: 50,
        shippingCalculationMethod: 'weight',
      },
      notifications: {
        emailNotifications: {
          newOrders: true,
          lowStock: true,
          newReviews: true,
          newCustomers: false,
          systemUpdates: true,
        },
        smsNotifications: {
          orderStatusUpdates: true,
          appointmentReminders: true,
          promotionalMessages: false,
        },
      },
      security: {
        enableTwoFactor: false,
        requireStrongPasswords: true,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        enableIpWhitelist: false,
        enableAuditLog: true,
      },
      maintenance: {
        maintenanceMode: false,
        maintenanceMessage: 'Our website is currently undergoing maintenance. Please check back soon.',
        allowedIps: ['127.0.0.1'],
      },
      backups: {
        autoBackupEnabled: true,
        backupFrequency: 'daily',
        retentionDays: 30,
        includeUploads: true,
      },
    };
  },
  update: async (settings: SystemSettings): Promise<SystemSettings> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return settings;
  },
  testConnection: async (service: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Math.random() > 0.2; // 80% success rate
  },
  backup: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
  },
};

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: settingsApi.get,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Settings updated successfully');
      setHasChanges(false);
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: settingsApi.testConnection,
    onSuccess: (success, service) => {
      if (success) {
        toast.success(`${service} connection successful`);
      } else {
        toast.error(`${service} connection failed`);
      }
      setTestingConnection(null);
    },
    onError: (_, service) => {
      toast.error(`Failed to test ${service} connection`);
      setTestingConnection(null);
    },
  });

  // Backup mutation
  const backupMutation = useMutation({
    mutationFn: settingsApi.backup,
    onSuccess: () => {
      toast.success('Backup created successfully');
      setIsBackingUp(false);
    },
    onError: () => {
      toast.error('Failed to create backup');
      setIsBackingUp(false);
    },
  });

  const handleSave = () => {
    if (settings) {
      updateMutation.mutate(settings);
    }
  };

  const handleReset = () => {
    queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    setHasChanges(false);
    toast.info('Settings reset to last saved state');
  };

  const handleTestConnection = (service: string) => {
    setTestingConnection(service);
    testConnectionMutation.mutate(service);
  };

  const handleBackup = () => {
    setIsBackingUp(true);
    backupMutation.mutate();
  };

  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    };
    
    queryClient.setQueryData(['system-settings'], newSettings);
    setHasChanges(true);
  };

  const updateNestedSettings = (section: keyof SystemSettings, parentField: string, field: string, value: any) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [parentField]: {
          ...(settings[section] as any)[parentField],
          [field]: value,
        },
      },
    };
    
    queryClient.setQueryData(['system-settings'], newSettings);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load settings</h3>
        <p className="text-gray-600">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure your application settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </div>
            
            {/* General Settings */}
            <TabsContent value="general" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    General Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteUrl">Site URL</Label>
                      <Input
                        id="siteUrl"
                        value={settings.general.siteUrl}
                        onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        value={settings.general.siteDescription}
                        onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={settings.general.adminEmail}
                        onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.general.timezone} onValueChange={(value) => updateSettings('general', 'timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Brussels">Europe/Brussels</SelectItem>
                          <SelectItem value="Europe/Amsterdam">Europe/Amsterdam</SelectItem>
                          <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={settings.general.language} onValueChange={(value) => updateSettings('general', 'language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="nl">Dutch</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={settings.general.currency} onValueChange={(value) => updateSettings('general', 'currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={settings.general.dateFormat} onValueChange={(value) => updateSettings('general', 'dateFormat', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select value={settings.general.timeFormat} onValueChange={(value) => updateSettings('general', 'timeFormat', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 Hour</SelectItem>
                          <SelectItem value="12h">12 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Business Settings */}
            <TabsContent value="business" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.business.companyName}
                        onChange={(e) => updateSettings('business', 'companyName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vatNumber">VAT Number</Label>
                      <Input
                        id="vatNumber"
                        value={settings.business.vatNumber}
                        onChange={(e) => updateSettings('business', 'vatNumber', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="companyAddress">Company Address</Label>
                      <Textarea
                        id="companyAddress"
                        value={settings.business.companyAddress}
                        onChange={(e) => updateSettings('business', 'companyAddress', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyPhone">Phone Number</Label>
                      <Input
                        id="companyPhone"
                        value={settings.business.companyPhone}
                        onChange={(e) => updateSettings('business', 'companyPhone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyEmail">Business Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={settings.business.companyEmail}
                        onChange={(e) => updateSettings('business', 'companyEmail', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Business Hours
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(settings.business.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-24">
                          <Label className="capitalize">{day}</Label>
                        </div>
                        <Switch
                          checked={!hours.closed}
                          onCheckedChange={(checked) => 
                            updateNestedSettings('business', 'businessHours', day, { ...hours, closed: !checked })
                          }
                        />
                        {!hours.closed && (
                          <>
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => 
                                updateNestedSettings('business', 'businessHours', day, { ...hours, open: e.target.value })
                              }
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => 
                                updateNestedSettings('business', 'businessHours', day, { ...hours, close: e.target.value })
                              }
                              className="w-32"
                            />
                          </>
                        )}
                        {hours.closed && <span className="text-gray-500">Closed</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* E-commerce Settings */}
            <TabsContent value="ecommerce" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    E-commerce Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                      <Input
                        id="defaultTaxRate"
                        type="number"
                        value={settings.ecommerce.defaultTaxRate}
                        onChange={(e) => updateSettings('ecommerce', 'defaultTaxRate', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (€)</Label>
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        value={settings.ecommerce.freeShippingThreshold}
                        onChange={(e) => updateSettings('ecommerce', 'freeShippingThreshold', parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={settings.ecommerce.lowStockThreshold}
                        onChange={(e) => updateSettings('ecommerce', 'lowStockThreshold', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium">Customer Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Allow Guest Checkout</Label>
                          <p className="text-sm text-gray-500">Allow customers to checkout without creating an account</p>
                        </div>
                        <Switch
                          checked={settings.ecommerce.allowGuestCheckout}
                          onCheckedChange={(checked) => updateSettings('ecommerce', 'allowGuestCheckout', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Account Verification</Label>
                          <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                        </div>
                        <Switch
                          checked={settings.ecommerce.requireAccountVerification}
                          onCheckedChange={(checked) => updateSettings('ecommerce', 'requireAccountVerification', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-approve Reviews</Label>
                          <p className="text-sm text-gray-500">Automatically approve customer reviews</p>
                        </div>
                        <Switch
                          checked={settings.ecommerce.autoApproveReviews}
                          onCheckedChange={(checked) => updateSettings('ecommerce', 'autoApproveReviews', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Out of Stock Products</Label>
                          <p className="text-sm text-gray-500">Display products that are out of stock</p>
                        </div>
                        <Switch
                          checked={settings.ecommerce.showOutOfStockProducts}
                          onCheckedChange={(checked) => updateSettings('ecommerce', 'showOutOfStockProducts', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Wishlist</Label>
                          <p className="text-sm text-gray-500">Allow customers to save products to wishlist</p>
                        </div>
                        <Switch
                          checked={settings.ecommerce.enableWishlist}
                          onCheckedChange={(checked) => updateSettings('ecommerce', 'enableWishlist', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Product Comparison</Label>
                          <p className="text-sm text-gray-500">Allow customers to compare products</p>
                        </div>
                        <Switch
                          checked={settings.ecommerce.enableCompareProducts}
                          onCheckedChange={(checked) => updateSettings('ecommerce', 'enableCompareProducts', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Payments Settings */}
            <TabsContent value="payments" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Methods
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <Label>Stripe</Label>
                          <p className="text-sm text-gray-500">Credit card payments via Stripe</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConnection('Stripe')}
                          disabled={testingConnection === 'Stripe'}
                        >
                          {testingConnection === 'Stripe' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Test'
                          )}
                        </Button>
                        <Switch
                          checked={settings.payments.enableStripe}
                          onCheckedChange={(checked) => updateSettings('payments', 'enableStripe', checked)}
                        />
                      </div>
                    </div>

                    {settings.payments.enableStripe && (
                      <div className="ml-4 space-y-3">
                        <div>
                          <Label htmlFor="stripePublishableKey">Stripe Publishable Key</Label>
                          <Input
                            id="stripePublishableKey"
                            type="password"
                            value={settings.payments.stripePublishableKey || ''}
                            onChange={(e) => updateSettings('payments', 'stripePublishableKey', e.target.value)}
                            placeholder="pk_..."
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <Label>PayPal</Label>
                          <p className="text-sm text-gray-500">PayPal payments</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConnection('PayPal')}
                          disabled={testingConnection === 'PayPal'}
                        >
                          {testingConnection === 'PayPal' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Test'
                          )}
                        </Button>
                        <Switch
                          checked={settings.payments.enablePayPal}
                          onCheckedChange={(checked) => updateSettings('payments', 'enablePayPal', checked)}
                        />
                      </div>
                    </div>

                    {settings.payments.enablePayPal && (
                      <div className="ml-4 space-y-3">
                        <div>
                          <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                          <Input
                            id="paypalClientId"
                            type="password"
                            value={settings.payments.paypalClientId || ''}
                            onChange={(e) => updateSettings('payments', 'paypalClientId', e.target.value)}
                            placeholder="AXxxx..."
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <Label>Bank Transfer</Label>
                          <p className="text-sm text-gray-500">Direct bank transfer</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.payments.enableBankTransfer}
                        onCheckedChange={(checked) => updateSettings('payments', 'enableBankTransfer', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <Label>Cash on Delivery</Label>
                          <p className="text-sm text-gray-500">Pay upon delivery</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.payments.enableCashOnDelivery}
                        onCheckedChange={(checked) => updateSettings('payments', 'enableCashOnDelivery', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Shipping Settings */}
            <TabsContent value="shipping" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Shipping Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="defaultShippingRate">Default Shipping Rate (€)</Label>
                      <Input
                        id="defaultShippingRate"
                        type="number"
                        value={settings.shipping.defaultShippingRate}
                        onChange={(e) => updateSettings('shipping', 'defaultShippingRate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingCalculationMethod">Calculation Method</Label>
                      <Select 
                        value={settings.shipping.shippingCalculationMethod} 
                        onValueChange={(value: 'flat' | 'weight' | 'price' | 'zone') => updateSettings('shipping', 'shippingCalculationMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat Rate</SelectItem>
                          <SelectItem value="weight">By Weight</SelectItem>
                          <SelectItem value="price">By Price</SelectItem>
                          <SelectItem value="zone">By Zone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="localDeliveryRadius">Local Delivery Radius (km)</Label>
                      <Input
                        id="localDeliveryRadius"
                        type="number"
                        value={settings.shipping.localDeliveryRadius}
                        onChange={(e) => updateSettings('shipping', 'localDeliveryRadius', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium">Shipping Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Free Shipping</Label>
                          <p className="text-sm text-gray-500">Enable free shipping option</p>
                        </div>
                        <Switch
                          checked={settings.shipping.freeShippingEnabled}
                          onCheckedChange={(checked) => updateSettings('shipping', 'freeShippingEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Local Delivery</Label>
                          <p className="text-sm text-gray-500">Enable local delivery option</p>
                        </div>
                        <Switch
                          checked={settings.shipping.localDeliveryEnabled}
                          onCheckedChange={(checked) => updateSettings('shipping', 'localDeliveryEnabled', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(settings.notifications.emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                          <p className="text-sm text-gray-500">
                            {key === 'newOrders' && 'Receive notifications for new orders'}
                            {key === 'lowStock' && 'Receive notifications when products are low in stock'}
                            {key === 'newReviews' && 'Receive notifications for new customer reviews'}
                            {key === 'newCustomers' && 'Receive notifications for new customer registrations'}
                            {key === 'systemUpdates' && 'Receive notifications for system updates'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            updateNestedSettings('notifications', 'emailNotifications', key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(settings.notifications.smsNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                          <p className="text-sm text-gray-500">
                            {key === 'orderStatusUpdates' && 'Send SMS for order status changes'}
                            {key === 'appointmentReminders' && 'Send SMS reminders for appointments'}
                            {key === 'promotionalMessages' && 'Send promotional SMS messages'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            updateNestedSettings('notifications', 'smsNotifications', key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value) || 0)}
                          min="5"
                          max="1440"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value) || 0)}
                          min="1"
                          max="20"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                        </div>
                        <Switch
                          checked={settings.security.enableTwoFactor}
                          onCheckedChange={(checked) => updateSettings('security', 'enableTwoFactor', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Strong Password Requirements</Label>
                          <p className="text-sm text-gray-500">Enforce strong password policy</p>
                        </div>
                        <Switch
                          checked={settings.security.requireStrongPasswords}
                          onCheckedChange={(checked) => updateSettings('security', 'requireStrongPasswords', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>IP Whitelist</Label>
                          <p className="text-sm text-gray-500">Restrict admin access to specific IPs</p>
                        </div>
                        <Switch
                          checked={settings.security.enableIpWhitelist}
                          onCheckedChange={(checked) => updateSettings('security', 'enableIpWhitelist', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Audit Logging</Label>
                          <p className="text-sm text-gray-500">Log all admin actions</p>
                        </div>
                        <Switch
                          checked={settings.security.enableAuditLog}
                          onCheckedChange={(checked) => updateSettings('security', 'enableAuditLog', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Maintenance Settings */}
            <TabsContent value="maintenance" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Maintenance Mode
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                      <div>
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-gray-600">Enable maintenance mode to temporarily disable public access</p>
                      </div>
                      <Switch
                        checked={settings.maintenance.maintenanceMode}
                        onCheckedChange={(checked) => updateSettings('maintenance', 'maintenanceMode', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                      <Textarea
                        id="maintenanceMessage"
                        value={settings.maintenance.maintenanceMessage}
                        onChange={(e) => updateSettings('maintenance', 'maintenanceMessage', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Backup Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select 
                          value={settings.backups.backupFrequency} 
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => updateSettings('backups', 'backupFrequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="retentionDays">Retention Days</Label>
                        <Input
                          id="retentionDays"
                          type="number"
                          value={settings.backups.retentionDays}
                          onChange={(e) => updateSettings('backups', 'retentionDays', parseInt(e.target.value) || 0)}
                          min="1"
                          max="365"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Backup</Label>
                          <p className="text-sm text-gray-500">Automatically create backups</p>
                        </div>
                        <Switch
                          checked={settings.backups.autoBackupEnabled}
                          onCheckedChange={(checked) => updateSettings('backups', 'autoBackupEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Include Uploads</Label>
                          <p className="text-sm text-gray-500">Include uploaded files in backups</p>
                        </div>
                        <Switch
                          checked={settings.backups.includeUploads}
                          onCheckedChange={(checked) => updateSettings('backups', 'includeUploads', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleBackup}
                        disabled={isBackingUp}
                      >
                        {isBackingUp ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Database className="w-4 h-4 mr-2" />
                        )}
                        Create Backup Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
