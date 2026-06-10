
// ============================================================
// ADMIN SETTINGS PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET /api/admin/settings       -> list all website settings
//   PUT /api/admin/settings       -> update settings { key, value }[]
//
// MongoDB Settings Model (reference):
//   { _id, key: String, value: Mixed, description: String }
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Fetch from GET /api/admin/settings
const INITIAL_SETTINGS: Record<string, string> = {
  site_name: "ZIVARA",
  site_description: "Premium fashion for the modern lifestyle",
  currency: "USD",
  tax_rate: "8.5",
  shipping_cost: "9.99",
  free_shipping_threshold: "150",
};

export default function AdminSettings() {
  const [formValues, setFormValues] = useState<Record<string, string>>(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);

    // TODO: Replace with:
    //   const res = await fetch('/api/admin/settings', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //     body: JSON.stringify(formValues)
    //   });
    //   if (!res.ok) { toast error; return; }

    await new Promise((r) => setTimeout(r, 800)); // simulate save
    toast({ title: "Settings saved successfully" });
    setIsSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your website settings</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
          </Button>
        </div>

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
                <Label htmlFor="site_name">Site Name</Label>
                <Input id="site_name" value={formValues.site_name} onChange={(e) => setFormValues({ ...formValues, site_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea id="site_description" value={formValues.site_description} onChange={(e) => setFormValues({ ...formValues, site_description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={formValues.currency} onChange={(e) => setFormValues({ ...formValues, currency: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />Pricing & Shipping
              </CardTitle>
              <CardDescription>Configure pricing and shipping options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input id="tax_rate" type="number" step="0.01" value={formValues.tax_rate} onChange={(e) => setFormValues({ ...formValues, tax_rate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_cost">Shipping Cost ($)</Label>
                <Input id="shipping_cost" type="number" step="0.01" value={formValues.shipping_cost} onChange={(e) => setFormValues({ ...formValues, shipping_cost: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free_shipping_threshold">Free Shipping Threshold ($)</Label>
                <Input id="free_shipping_threshold" type="number" step="0.01" value={formValues.free_shipping_threshold} onChange={(e) => setFormValues({ ...formValues, free_shipping_threshold: e.target.value })} />
                <p className="text-xs text-muted-foreground">Orders above this amount get free shipping</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
