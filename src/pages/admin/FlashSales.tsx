import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw } from "lucide-react";

export default function AdminFlashSales() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    flashSaleActive: false,
    flashSaleTitle: "Summer Flash Sale",
    flashSaleDiscount: "Up to 50% Off",
    flashSaleEndTime: "",
  });

  const getToken = () => localStorage.getItem("zivara_token") || "";

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      
      let formattedDate = "";
      if (data.flashSaleEndTime) {
        const dateObj = new Date(data.flashSaleEndTime);
        // Format for datetime-local input: YYYY-MM-DDThh:mm
        const offset = dateObj.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(dateObj.getTime() - offset)).toISOString().slice(0, 16);
        formattedDate = localISOTime;
      }

      setFormData({
        flashSaleActive: data.flashSaleActive || false,
        flashSaleTitle: data.flashSaleTitle || "Summer Flash Sale",
        flashSaleDiscount: data.flashSaleDiscount || "Up to 50% Off",
        flashSaleEndTime: formattedDate,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        flashSaleEndTime: formData.flashSaleEndTime ? new Date(formData.flashSaleEndTime).toISOString() : null
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save settings");
      }

      toast({ title: "Flash Sale settings updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Flash Sales</h1>
            <p className="text-muted-foreground">Manage active flash sales and countdown timers</p>
          </div>
          <Button variant="outline" onClick={fetchSettings} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center"><RefreshCw className="animate-spin w-8 h-8 mx-auto text-primary" /></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <Switch 
                id="flashSaleActive" 
                checked={formData.flashSaleActive} 
                onCheckedChange={(checked) => setFormData({ ...formData, flashSaleActive: checked })} 
              />
              <Label htmlFor="flashSaleActive" className="text-lg font-medium">Enable Flash Sale Countdown</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flashSaleTitle">Sale Title</Label>
                <Input 
                  id="flashSaleTitle" 
                  value={formData.flashSaleTitle} 
                  onChange={(e) => setFormData({ ...formData, flashSaleTitle: e.target.value })} 
                  placeholder="e.g. Summer Clearance"
                  disabled={!formData.flashSaleActive}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="flashSaleDiscount">Discount Text</Label>
                <Input 
                  id="flashSaleDiscount" 
                  value={formData.flashSaleDiscount} 
                  onChange={(e) => setFormData({ ...formData, flashSaleDiscount: e.target.value })} 
                  placeholder="e.g. Up to 50% Off"
                  disabled={!formData.flashSaleActive}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flashSaleEndTime">End Time</Label>
                <Input 
                  id="flashSaleEndTime" 
                  type="datetime-local" 
                  value={formData.flashSaleEndTime} 
                  onChange={(e) => setFormData({ ...formData, flashSaleEndTime: e.target.value })} 
                  disabled={!formData.flashSaleActive}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
