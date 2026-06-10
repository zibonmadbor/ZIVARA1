
// ============================================================
// ADMIN NOTIFICATIONS PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET    /api/admin/notifications        -> list all notifications
//   POST   /api/admin/notifications        -> send notification { title, message, type, link }
//   DELETE /api/admin/notifications/:id    -> delete notification
//
// For real push notifications, integrate:
//   - Firebase Cloud Messaging (FCM)
//   - OneSignal
//   - Web Push API
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Bell, ShoppingCart, Zap, Settings, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NotificationType = "order" | "promotion" | "system" | "review";

interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const typeOptions: { value: NotificationType; label: string; icon: React.ElementType }[] = [
  { value: "order", label: "Order", icon: ShoppingCart },
  { value: "promotion", label: "Promotion", icon: Zap },
  { value: "system", label: "System", icon: Settings },
  { value: "review", label: "Review", icon: Bell },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", user_id: null, title: "Summer Sale Started!", message: "Up to 50% off on selected items this weekend.", type: "promotion", is_read: false, link: "/products?filter=sale", created_at: "2024-06-01T09:00:00Z" },
  { id: "2", user_id: "3", title: "Your order has been shipped", message: "Order ZIV-001 is on its way!", type: "order", is_read: true, link: "/account", created_at: "2024-01-16T10:00:00Z" },
  { id: "3", user_id: null, title: "System Maintenance", message: "Scheduled maintenance on Sunday 2AM-4AM UTC.", type: "system", is_read: false, link: null, created_at: "2024-03-10T08:00:00Z" },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({ title: "", message: "", type: "promotion" as NotificationType, link: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /api/admin/notifications  { title, message, type, link, user_id: null (broadcast) }
    const newNotification: Notification = {
      id: Date.now().toString(),
      user_id: null,
      title: formData.title,
      message: formData.message,
      type: formData.type,
      is_read: false,
      link: formData.link || null,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    toast({ title: "Notification sent successfully" });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    // TODO: DELETE /api/admin/notifications/:id
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({ title: "Notification deleted" });
  };

  const resetForm = () => {
    setFormData({ title: "", message: "", type: "promotion", link: "" });
  };

  const getTypeIcon = (type: NotificationType) => {
    const typeOption = typeOptions.find((t) => t.value === type);
    const Icon = typeOption?.icon || Bell;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeBadgeColor = (type: NotificationType) => {
    switch (type) {
      case "order": return "bg-blue-500/20 text-blue-400";
      case "promotion": return "bg-primary/20 text-primary";
      case "system": return "bg-muted text-muted-foreground";
      case "review": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const columns = [
    {
      key: "notification", header: "Notification",
      render: (notification: Notification) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getTypeBadgeColor(notification.type)}>
              {getTypeIcon(notification.type)}
              <span className="ml-1 capitalize">{notification.type}</span>
            </Badge>
          </div>
          <p className="font-medium">{notification.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        </div>
      ),
    },
    { key: "target", header: "Target", render: (notification: Notification) => <span className="text-sm text-muted-foreground">{notification.user_id ? "User" : "All Users"}</span> },
    { key: "created_at", header: "Sent", render: (notification: Notification) => <span className="text-sm text-muted-foreground">{new Date(notification.created_at).toLocaleString()}</span> },
    {
      key: "actions", header: "Actions",
      render: (notification: Notification) => (
        <Button variant="ghost" size="sm" onClick={() => handleDelete(notification.id)} className="text-destructive hover:text-destructive">Delete</Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Notifications</h1>
            <p className="text-muted-foreground">Send and manage push notifications</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button onClick={resetForm}><Send className="mr-2 h-4 w-4" />Send Notification</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Send Notification</DialogTitle><DialogDescription>Create and send a notification to all users.</DialogDescription></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as NotificationType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => <SelectItem key={type.value} value={type.value}><div className="flex items-center gap-2"><type.icon className="h-4 w-4" />{type.label}</div></SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Notification title" required /></div>
                <div className="space-y-2"><Label htmlFor="message">Message *</Label><Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Notification message..." rows={3} required /></div>
                <div className="space-y-2"><Label htmlFor="link">Link (optional)</Label><Input id="link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="/products or https://..." /></div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit"><Send className="mr-2 h-4 w-4" />Send</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={notifications} isLoading={false} searchPlaceholder="Search notifications..." />
      </div>
    </AdminLayout>
  );
}
