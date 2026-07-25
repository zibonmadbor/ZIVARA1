import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, BellRing, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [formValues, setFormValues] = useState({
    storeName: "ZIVARA",
    contactEmail: "support@zivara.com",
    bkashMerchantNumber: "01700-000000",
    notificationActive: true,
    notificationText: "Free shipping on all orders over $150",
    notificationLink: "/products"
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const getToken = () => localStorage.getItem("zivara_token") || "";

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      
      setFormValues({
        storeName: data.storeName || "ZIVARA",
        contactEmail: data.contactEmail || "support@zivara.com",
        bkashMerchantNumber: data.bkashMerchantNumber || "01700-000000",
        notificationActive: data.notificationActive !== undefined ? data.notificationActive : true,
        notificationText: data.notificationText || "Free shipping on all orders over $150",
        notificationLink: data.notificationLink || "/products"
      });
    } catch (err) {
      toast({ title: "Error", description: "Could not load settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(formValues)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save settings");
      }
      
      toast({ title: "Settings saved successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your website settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSettings} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isLoading}>
              {isSaving ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />General Settings
                </CardTitle>
                <CardDescription>Basic website configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" value={formValues.storeName} onChange={(e) => setFormValues({ ...formValues, storeName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" value={formValues.contactEmail} onChange={(e) => setFormValues({ ...formValues, contactEmail: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* bKash Payment Settings */}
            <Card className="border-[#E2136E]/30 bg-gradient-to-br from-[#E2136E]/5 to-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E2136E]">
                  <div className="w-6 h-6 rounded bg-[#E2136E] text-white flex items-center justify-center font-bold text-[10px]">
                    bK
                  </div>
                  bKash Payment Gateway Settings
                </CardTitle>
                <CardDescription>Set your bKash Merchant or Personal Account Number for receiving payments from customers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bkashMerchantNumber">Store bKash Merchant / Agent / Personal Number</Label>
                  <Input
                    id="bkashMerchantNumber"
                    placeholder="e.g. 01712345678"
                    value={formValues.bkashMerchantNumber}
                    onChange={(e) => setFormValues({ ...formValues, bkashMerchantNumber: e.target.value })}
                    className="border-[#E2136E]/30 focus:border-[#E2136E]"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the bKash number displayed to customers on the checkout page.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Top Notification Bar */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />Top Notification Bar
                </CardTitle>
                <CardDescription>Configure the announcement bar shown at the top of the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                  <Switch 
                    id="notificationActive" 
                    checked={formValues.notificationActive} 
                    onCheckedChange={(checked) => setFormValues({ ...formValues, notificationActive: checked })} 
                  />
                  <Label htmlFor="notificationActive">Show Notification Bar</Label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationText">Notification Text</Label>
                    <Input 
                      id="notificationText" 
                      value={formValues.notificationText} 
                      onChange={(e) => setFormValues({ ...formValues, notificationText: e.target.value })} 
                      disabled={!formValues.notificationActive}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notificationLink">Link (Optional)</Label>
                    <Input 
                      id="notificationLink" 
                      value={formValues.notificationLink} 
                      onChange={(e) => setFormValues({ ...formValues, notificationLink: e.target.value })} 
                      disabled={!formValues.notificationActive}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
