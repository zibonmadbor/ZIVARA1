import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  image: string;
  description?: string;
  isNew: boolean;
  isSale: boolean;
  isBestSeller: boolean;
}

const CATEGORIES = [
  { id: "men", name: "Men" },
  { id: "women", name: "Women" },
  { id: "kids", name: "Kids" },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "", slug: "", description: "", price: "", originalPrice: "",
    category: "", subcategory: "", image: "", isNew: false, isSale: false, isBestSeller: false
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((p: any) => ({
          ...p,
          id: p._id || p.id,
        }));
        setProducts(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast({ title: "Failed to load products", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      category: formData.category,
      subcategory: formData.subcategory,
      image: formData.image || "/src/assets/product-1.jpg", // Default image if empty
      description: formData.description,
      isNew: formData.isNew,
      isSale: formData.isSale,
      isBestSeller: formData.isBestSeller,
    };

    try {
      const token = localStorage.getItem("zivara_token");
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save product");
      }

      await fetchProducts(); // Refresh list
      toast({ title: `Product ${editingProduct ? "updated" : "created"} successfully` });
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, slug: product.slug, description: product.description || "",
      price: product.price.toString(), originalPrice: product.originalPrice?.toString() || "",
      category: product.category, subcategory: product.subcategory, image: product.image,
      isNew: product.isNew, isSale: product.isSale, isBestSeller: product.isBestSeller
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: "", slug: "", description: "", price: "", originalPrice: "",
      category: "", subcategory: "", image: "", isNew: false, isSale: false, isBestSeller: false });
  };

  const columns = [
    {
      key: "name", header: "Product",
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">/{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price", header: "Price",
      render: (product: Product) => (
        <div>
          <p className="font-medium">${product.price}</p>
          {product.originalPrice && <p className="text-xs text-muted-foreground line-through">${product.originalPrice}</p>}
        </div>
      ),
    },
    {
      key: "category", header: "Category",
      render: (product: Product) => (
        <Badge variant="outline" className="capitalize">
          {product.category} / {product.subcategory}
        </Badge>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" />Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>Fill in the product details below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generated from name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input id="price" type="number" step="0.01" value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input id="originalPrice" type="number" step="0.01" value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <Input id="subcategory" value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2 border-t border-border pt-4">
                  <Label htmlFor="image">Image Path/URL *</Label>
                  <Input id="image" value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/src/assets/product-1.jpg" required />
                </div>
                <div className="flex flex-wrap gap-6 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <Switch id="isNew" checked={formData.isNew}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })} />
                    <Label htmlFor="isNew">New Arrival</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="isSale" checked={formData.isSale}
                      onCheckedChange={(checked) => setFormData({ ...formData, isSale: checked })} />
                    <Label htmlFor="isSale">On Sale</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="isBestSeller" checked={formData.isBestSeller}
                      onCheckedChange={(checked) => setFormData({ ...formData, isBestSeller: checked })} />
                    <Label htmlFor="isBestSeller">Best Seller</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingProduct ? "Update Product" : "Create Product"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={products} isLoading={isLoading} searchPlaceholder="Search products..." />
      </div>
    </AdminLayout>
  );
}
