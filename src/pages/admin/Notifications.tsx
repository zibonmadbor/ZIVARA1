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
import { Bell, ShoppingCart, Settings, Send, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NotificationType = "order" | "system" | "user";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link: string | null;
  createdAt: string;
}

const typeOptions = [
  { value: "order", label: "Order", icon: ShoppingCart },
  { value: "user", label: "User", icon: Bell },
  { value: "system", label: "System", icon: Settings },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("zivara_token");
      const res = await fetch("/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      toast({ title: "Failed to fetch notifications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast({ title: "Notification deleted" });
    } catch (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/admin/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Mark read failed");
      
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/admin/notifications/mark-all-read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Mark all read failed");
      
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast({ title: "All notifications marked as read" });
    } catch (error) {
      console.error(error);
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    const typeOption = typeOptions.find((t) => t.value === type);
    const Icon = typeOption?.icon || Bell;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeBadgeColor = (type: NotificationType) => {
    switch (type) {
      case "order": return "bg-blue-500/20 text-blue-400";
      case "user": return "bg-primary/20 text-primary";
      case "system": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const columns = [
    {
      key: "notification", header: "Notification",
      render: (notification: Notification) => (
        <div className={`max-w-md ${notification.is_read ? 'opacity-70' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getTypeBadgeColor(notification.type)}>
              {getTypeIcon(notification.type)}
              <span className="ml-1 capitalize">{notification.type}</span>
            </Badge>
            {!notification.is_read && (
              <Badge variant="default" className="bg-primary hover:bg-primary">New</Badge>
            )}
          </div>
          <p className={`font-medium ${!notification.is_read ? 'text-primary' : ''}`}>{notification.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        </div>
      ),
    },
    { key: "created_at", header: "Received", render: (notification: Notification) => <span className="text-sm text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</span> },
    {
      key: "actions", header: "Actions",
      render: (notification: Notification) => (
        <div className="flex items-center gap-2">
          {!notification.is_read && (
            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification._id)} className="text-muted-foreground">
               <Check className="h-4 w-4 mr-1" /> Read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleDelete(notification._id)} className="text-destructive hover:text-destructive">Delete</Button>
        </div>
      ),
    },
  ];

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Notifications</h1>
            <p className="text-muted-foreground">View system and order notifications</p>
          </div>
          {unreadCount > 0 && (
             <Button variant="outline" onClick={handleMarkAllRead}>
               <Check className="mr-2 h-4 w-4" /> Mark All as Read
             </Button>
          )}
        </div>
        
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : (
           <DataTable columns={columns} data={notifications} isLoading={false} searchPlaceholder="Search notifications..." />
        )}
      </div>
    </AdminLayout>
  );
}
