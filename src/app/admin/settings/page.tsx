"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUpload, { UploadedImage } from "@/components/image-upload";
import { 
  Save,
  Upload,
  Bell,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Users,
  Key,
  Database,
  Palette,
  Languages
} from "lucide-react";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoImages, setLogoImages] = useState<UploadedImage[]>([]);

  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: "BandenCentrale",
    storeDescription: "Premium Tire Solutions in Belgium",
    storeEmail: "info@bandencentrale.be",
    storePhone: "+32 467 87 1205",
    storeAddress: "123 Main Street, Ghent, Belgium",
    currency: "EUR",
    timezone: "Europe/Brussels",
    language: "en",
    logo: "/api/placeholder/200/80"
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    customerMessages: true,
    paymentAlerts: true,
    systemUpdates: false,
    marketingEmails: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    bankTransferEnabled: true,
    codEnabled: false,
    testMode: false,
    stripePublishableKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    paypalClientId: "...",
    paypalClientSecret: "..."
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 100,
    standardShippingRate: 25,
    expressShippingRate: 45,
    internationalShipping: true,
    packagingFee: 5,
    handlingTime: 2,
    deliveryTime: "3-5",
    trackingEnabled: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    ipWhitelist: "",
    auditLogging: true,
    dataBackups: true,
    sslRedirect: true
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log(`Saved ${section} settings`);
    }, 1000);
  };

  const handleLogoImagesChange = (images: UploadedImage[]) => {
    setLogoImages(images);
    // Update the store logo with the first uploaded image
    if (images.length > 0 && images[0].uploadResult?.success && images[0].uploadResult.url) {
      setStoreSettings({
        ...storeSettings,
        logo: images[0].uploadResult.url
      });
    }
  };

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your store configuration and preferences</p>
          </div>
          <Button className="bg-tire-gradient">
            <Save className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Save All Changes</span>
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="flex space-x-2 overflow-x-auto w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="storeEmail">Store Email</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={storeSettings.storeEmail}
                        onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="storePhone">Store Phone</Label>
                      <Input
                        id="storePhone"
                        value={storeSettings.storePhone}
                        onChange={(e) => setStoreSettings({...storeSettings, storePhone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={storeSettings.currency} onValueChange={(value) => setStoreSettings({...storeSettings, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="storeDescription">Store Description</Label>
                      <Textarea
                        id="storeDescription"
                        value={storeSettings.storeDescription}
                        onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="storeAddress">Store Address</Label>
                      <Textarea
                        id="storeAddress"
                        value={storeSettings.storeAddress}
                        onChange={(e) => setStoreSettings({...storeSettings, storeAddress: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={storeSettings.timezone} onValueChange={(value) => setStoreSettings({...storeSettings, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Brussels">Europe/Brussels</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Label className="text-base font-medium">Store Logo</Label>
                  <p className="text-sm text-gray-500 mb-4">Upload your store logo. Recommended size: 200x80px</p>
                  
                  {/* Current Logo Preview */}
                  {storeSettings.logo && (
                    <div className="mb-4">
                      <Label className="text-sm text-gray-600">Current Logo</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={storeSettings.logo} />
                          <AvatarFallback>Logo</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  )}

                  {/* Logo Upload Component */}
                  <ImageUpload
                    onImagesChange={handleLogoImagesChange}
                    existingImages={storeSettings.logo ? [storeSettings.logo] : []}
                    maxFiles={1}
                    uploadType="logo"
                    title="Upload Company Logo"
                    description="Choose a high-quality logo that represents your brand"
                    acceptedFormats="PNG, JPG, SVG"
                    maxFileSize="5MB"
                    className="border-dashed border-2 border-gray-300 rounded-lg p-6"
                  />
                </div>

                <Button onClick={() => handleSave('general')} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save General Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Alert Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, [key]: checked})
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications).slice(6).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, [key]: checked})
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => handleSave('notifications')} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Notification Settings"}
            </Button>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Stripe Payments</Label>
                        <p className="text-sm text-gray-500">Accept credit cards</p>
                      </div>
                      <Switch
                        checked={paymentSettings.stripeEnabled}
                        onCheckedChange={(checked) => 
                          setPaymentSettings({...paymentSettings, stripeEnabled: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>PayPal</Label>
                        <p className="text-sm text-gray-500">Accept PayPal payments</p>
                      </div>
                      <Switch
                        checked={paymentSettings.paypalEnabled}
                        onCheckedChange={(checked) => 
                          setPaymentSettings({...paymentSettings, paypalEnabled: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Bank Transfer</Label>
                        <p className="text-sm text-gray-500">Direct bank transfers</p>
                      </div>
                      <Switch
                        checked={paymentSettings.bankTransferEnabled}
                        onCheckedChange={(checked) => 
                          setPaymentSettings({...paymentSettings, bankTransferEnabled: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Cash on Delivery</Label>
                        <p className="text-sm text-gray-500">Payment on delivery</p>
                      </div>
                      <Switch
                        checked={paymentSettings.codEnabled}
                        onCheckedChange={(checked) => 
                          setPaymentSettings({...paymentSettings, codEnabled: checked})
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
                      <Input
                        id="stripeKey"
                        value={paymentSettings.stripePublishableKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripePublishableKey: e.target.value})}
                        placeholder="pk_live_..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                      <Input
                        id="stripeSecret"
                        type="password"
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                        placeholder="sk_live_..."
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Test Mode</Label>
                        <p className="text-sm text-gray-500">Use test environment</p>
                      </div>
                      <Switch
                        checked={paymentSettings.testMode}
                        onCheckedChange={(checked) => 
                          setPaymentSettings({...paymentSettings, testMode: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('payments')} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Payment Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="freeShipping">Free Shipping Threshold (€)</Label>
                      <Input
                        id="freeShipping"
                        type="number"
                        value={shippingSettings.freeShippingThreshold}
                        onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="standardRate">Standard Shipping Rate (€)</Label>
                      <Input
                        id="standardRate"
                        type="number"
                        value={shippingSettings.standardShippingRate}
                        onChange={(e) => setShippingSettings({...shippingSettings, standardShippingRate: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="expressRate">Express Shipping Rate (€)</Label>
                      <Input
                        id="expressRate"
                        type="number"
                        value={shippingSettings.expressShippingRate}
                        onChange={(e) => setShippingSettings({...shippingSettings, expressShippingRate: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="packagingFee">Packaging Fee (€)</Label>
                      <Input
                        id="packagingFee"
                        type="number"
                        value={shippingSettings.packagingFee}
                        onChange={(e) => setShippingSettings({...shippingSettings, packagingFee: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="handlingTime">Handling Time (days)</Label>
                      <Input
                        id="handlingTime"
                        type="number"
                        value={shippingSettings.handlingTime}
                        onChange={(e) => setShippingSettings({...shippingSettings, handlingTime: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time (days)</Label>
                      <Input
                        id="deliveryTime"
                        value={shippingSettings.deliveryTime}
                        onChange={(e) => setShippingSettings({...shippingSettings, deliveryTime: e.target.value})}
                        placeholder="3-5"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>International Shipping</Label>
                        <p className="text-sm text-gray-500">Ship outside Belgium</p>
                      </div>
                      <Switch
                        checked={shippingSettings.internationalShipping}
                        onCheckedChange={(checked) => 
                          setShippingSettings({...shippingSettings, internationalShipping: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Tracking Enabled</Label>
                        <p className="text-sm text-gray-500">Provide tracking numbers</p>
                      </div>
                      <Switch
                        checked={shippingSettings.trackingEnabled}
                        onCheckedChange={(checked) => 
                          setShippingSettings({...shippingSettings, trackingEnabled: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('shipping')} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Shipping Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Require 2FA for admin access</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, twoFactorEnabled: checked})
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxAttempts"
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Audit Logging</Label>
                        <p className="text-sm text-gray-500">Log admin actions</p>
                      </div>
                      <Switch
                        checked={securitySettings.auditLogging}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, auditLogging: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic Backups</Label>
                        <p className="text-sm text-gray-500">Daily data backups</p>
                      </div>
                      <Switch
                        checked={securitySettings.dataBackups}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, dataBackups: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Force SSL</Label>
                        <p className="text-sm text-gray-500">Redirect HTTP to HTTPS</p>
                      </div>
                      <Switch
                        checked={securitySettings.sslRedirect}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, sslRedirect: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('security')} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Security Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Cache Management</Label>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">Clear Cache</Button>
                      <Button variant="outline" size="sm">Clear Logs</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Database</Label>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">Backup Now</Button>
                      <Button variant="outline" size="sm">Optimize</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Maintenance Mode</Label>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">Put site in maintenance mode</span>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      value="bc_live_..."
                      readOnly
                      type="password"
                    />
                  </div>

                  <div>
                    <Label>Rate Limiting</Label>
                    <Select defaultValue="1000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 requests/hour</SelectItem>
                        <SelectItem value="500">500 requests/hour</SelectItem>
                        <SelectItem value="1000">1000 requests/hour</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Generate New Key</Button>
                    <Button variant="outline" size="sm">View Docs</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default SettingsPage;
