import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Image as ImageIcon, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Slider {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function AdminSliders() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "", subtitle: "", image: "", link: "", buttonText: "", isActive: true, order: 0
  });

  const getToken = () => localStorage.getItem("zivara_token") || "";

  const fetchSliders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/sliders", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to fetch sliders");
      const data = await res.json();
      setSliders(data.map((s: any) => ({ ...s, id: s._id || s.id })));
    } catch (err) {
      toast({ title: "Error", description: "Could not load sliders.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSlider ? `/api/admin/sliders/${editingSlider.id}` : "/api/admin/sliders";
      const method = editingSlider ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save slider");
      }

      await fetchSliders();
      toast({ title: `Slider ${editingSlider ? "updated" : "created"} successfully` });
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title, subtitle: slider.subtitle || "",
      image: slider.image, link: slider.link || "", buttonText: slider.buttonText || "",
      isActive: slider.isActive, order: slider.order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to delete slider");
      setSliders(prev => prev.filter(s => s.id !== id));
      toast({ title: "Slider deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingSlider(null);
    setFormData({ title: "", subtitle: "", image: "", link: "", buttonText: "", isActive: true, order: 0 });
  };

  const columns = [
    {
      key: "title", header: "Slider",
      render: (slider: Slider) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-20 overflow-hidden rounded-lg bg-muted">
            {slider.image ? (
              <img src={slider.image} alt={slider.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>
            )}
          </div>
          <div>
            <p className="font-medium">{slider.title}</p>
            <p className="text-xs text-muted-foreground">{slider.subtitle}</p>
          </div>
        </div>
      ),
    },
    {
      key: "link", header: "Link",
      render: (slider: Slider) => <span className="text-muted-foreground">{slider.link || "—"}</span>,
    },
    {
      key: "order", header: "Order",
      render: (slider: Slider) => <span className="text-muted-foreground">{slider.order}</span>,
    },
    {
      key: "isActive", header: "Status",
      render: (slider: Slider) => (
        <Badge variant={slider.isActive ? "default" : "secondary"}>{slider.isActive ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (slider: Slider) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(slider)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(slider.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Sliders & Banners</h1>
            <p className="text-muted-foreground">Manage homepage sliders and banners</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSliders} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" />Add Slider</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSlider ? "Edit Slider" : "Add New Slider"}</DialogTitle>
                  <DialogDescription>Fill in the slider details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="subtitle">Subtitle</Label><Input id="subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="image">Image URL *</Label><Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." required /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="link">Link URL</Label><Input id="link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} /></div>
                    <div className="space-y-2"><Label htmlFor="buttonText">Button Text</Label><Input id="buttonText" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="order">Sort Order</Label><Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} /></div>
                  <div className="flex items-center gap-2"><Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} /><Label htmlFor="isActive">Active</Label></div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingSlider ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <DataTable columns={columns} data={sliders} isLoading={isLoading} searchPlaceholder="Search sliders..." />
      </div>
    </AdminLayout>
  );
}
