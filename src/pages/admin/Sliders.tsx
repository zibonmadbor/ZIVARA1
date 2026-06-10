
// ============================================================
// ADMIN SLIDERS PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET    /api/admin/sliders      -> list all sliders
//   POST   /api/admin/sliders      -> create slider
//   PUT    /api/admin/sliders/:id  -> update slider
//   DELETE /api/admin/sliders/:id  -> delete slider
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Slider {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link: string | null;
  button_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const MOCK_SLIDERS: Slider[] = [
  { id: "1", title: "New Summer Collection", subtitle: "Discover the latest trends", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", link: "/products?filter=new", button_text: "Shop Now", is_active: true, sort_order: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "2", title: "Exclusive Flash Sale", subtitle: "Up to 50% off selected items", image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04", link: "/products?filter=sale", button_text: "View Deals", is_active: true, sort_order: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "3", title: "AI Virtual Try-On", subtitle: "See how clothes look on you", image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b", link: "/ai-tryon", button_text: "Try Now", is_active: false, sort_order: 3, created_at: "2024-01-01T00:00:00Z" },
];

export default function AdminSliders() {
  const [sliders, setSliders] = useState<Slider[]>(MOCK_SLIDERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({ title: "", subtitle: "", image_url: "", link: "", button_text: "", is_active: true, sort_order: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sliderData: Slider = {
      id: editingSlider?.id || Date.now().toString(),
      title: formData.title, subtitle: formData.subtitle || null,
      image_url: formData.image_url, link: formData.link || null,
      button_text: formData.button_text || null, is_active: formData.is_active,
      sort_order: formData.sort_order, created_at: editingSlider?.created_at || new Date().toISOString(),
    };
    // TODO: PUT /api/admin/sliders/:id or POST /api/admin/sliders
    if (editingSlider) {
      setSliders((prev) => prev.map((s) => (s.id === editingSlider.id ? sliderData : s)));
      toast({ title: "Slider updated successfully" });
    } else {
      setSliders((prev) => [...prev, sliderData]);
      toast({ title: "Slider created successfully" });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({ title: slider.title, subtitle: slider.subtitle || "", image_url: slider.image_url, link: slider.link || "", button_text: slider.button_text || "", is_active: slider.is_active, sort_order: slider.sort_order });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    // TODO: DELETE /api/admin/sliders/:id
    setSliders((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Slider deleted successfully" });
  };

  const resetForm = () => {
    setEditingSlider(null);
    setFormData({ title: "", subtitle: "", image_url: "", link: "", button_text: "", is_active: true, sort_order: 0 });
  };

  const columns = [
    {
      key: "title", header: "Slider",
      render: (slider: Slider) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-20 overflow-hidden rounded-lg bg-muted">
            {slider.image_url ? (
              <img src={slider.image_url} alt={slider.title} className="h-full w-full object-cover" />
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
      key: "sort_order", header: "Order",
      render: (slider: Slider) => <span className="text-muted-foreground">{slider.sort_order}</span>,
    },
    {
      key: "is_active", header: "Status",
      render: (slider: Slider) => (
        <Badge variant={slider.is_active ? "default" : "secondary"}>{slider.is_active ? "Active" : "Inactive"}</Badge>
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
                <div className="space-y-2"><Label htmlFor="image_url">Image URL *</Label><Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." required /></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="link">Link URL</Label><Input id="link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="button_text">Button Text</Label><Input id="button_text" value={formData.button_text} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="sort_order">Sort Order</Label><Input id="sort_order" type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} /></div>
                <div className="flex items-center gap-2"><Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} /><Label htmlFor="is_active">Active</Label></div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingSlider ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={sliders} isLoading={false} searchPlaceholder="Search sliders..." />
      </div>
    </AdminLayout>
  );
}
