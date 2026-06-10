
// ============================================================
// ADMIN CATEGORIES PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET    /api/admin/categories        -> list all categories
//   POST   /api/admin/categories        -> create category
//   PUT    /api/admin/categories/:id    -> update category
//   DELETE /api/admin/categories/:id    -> delete category
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Men", slug: "men", description: "Men's fashion collection", image_url: null, is_active: true, sort_order: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "2", name: "Women", slug: "women", description: "Women's fashion collection", image_url: null, is_active: true, sort_order: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "3", name: "Kids", slug: "kids", description: "Kids' fashion collection", image_url: null, is_active: true, sort_order: 3, created_at: "2024-01-01T00:00:00Z" },
  { id: "4", name: "Accessories", slug: "accessories", description: "Fashion accessories", image_url: null, is_active: false, sort_order: 4, created_at: "2024-01-01T00:00:00Z" },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({ name: "", slug: "", description: "", image_url: "", is_active: true, sort_order: 0 });

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const catData: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || null,
      image_url: formData.image_url || null,
      is_active: formData.is_active,
      sort_order: formData.sort_order,
      created_at: editingCategory?.created_at || new Date().toISOString(),
    };
    // TODO: if editing: PUT /api/admin/categories/:id else POST /api/admin/categories
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? catData : c)));
      toast({ title: "Category updated successfully" });
    } else {
      setCategories((prev) => [...prev, catData]);
      toast({ title: "Category created successfully" });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, description: category.description || "", image_url: category.image_url || "", is_active: category.is_active, sort_order: category.sort_order });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    // TODO: DELETE /api/admin/categories/:id
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Category deleted successfully" });
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", image_url: "", is_active: true, sort_order: 0 });
  };

  const columns = [
    {
      key: "name", header: "Category",
      render: (category: Category) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderTree className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-xs text-muted-foreground">/{category.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description", header: "Description",
      render: (category: Category) => <p className="max-w-xs truncate text-muted-foreground">{category.description || "—"}</p>,
    },
    {
      key: "sort_order", header: "Order",
      render: (category: Category) => <span className="text-muted-foreground">{category.sort_order}</span>,
    },
    {
      key: "is_active", header: "Status",
      render: (category: Category) => (
        <Badge variant={category.is_active ? "default" : "secondary"}>{category.is_active ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (category: Category) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" />Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogDescription>Fill in the category details below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated from name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input id="sort_order" type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingCategory ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={categories} isLoading={false} searchPlaceholder="Search categories..." />
      </div>
    </AdminLayout>
  );
}
