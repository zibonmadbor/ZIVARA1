import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ban, CheckCircle, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type AppRole = "super_admin" | "admin" | "moderator" | "customer";

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  is_blocked: boolean;
  created_at: string;
  role: AppRole;
}

const roleOptions: AppRole[] = ["super_admin", "admin", "moderator", "customer"];

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { role: currentUserRole, user: currentUser } = useAuth();

  const getToken = () => localStorage.getItem("zivara_token") || "";

  // Fetch all users from the real API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle block/unblock a user
  const toggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: data.is_blocked } : u));
      toast({ title: data.message });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Update a user's role
  const updateRole = async (userId: string, newRole: AppRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast({ title: `Role updated to ${newRole.replace("_", " ")}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case "super_admin": return "bg-primary text-primary-foreground";
      case "admin": return "bg-blue-500/20 text-blue-400";
      case "moderator": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const columns = [
    {
      key: "user", header: "User",
      render: (user: UserWithRole) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.full_name || "No name"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role", header: "Role",
      render: (user: UserWithRole) => (
        currentUserRole === "super_admin" && user.id !== currentUser?.id ? (
          <Select value={user.role} onValueChange={(value) => updateRole(user.id, value as AppRole)}>
            <SelectTrigger className="w-[140px]">
              <Badge className={getRoleBadgeColor(user.role)}>
                <Shield className="mr-1 h-3 w-3" />{user.role.replace("_", " ")}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>{role.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge className={getRoleBadgeColor(user.role)}>
            <Shield className="mr-1 h-3 w-3" />{user.role.replace("_", " ")}
          </Badge>
        )
      ),
    },
    {
      key: "phone", header: "Phone",
      render: (user: UserWithRole) => <span className="text-muted-foreground">{user.phone || "—"}</span>,
    },
    {
      key: "status", header: "Status",
      render: (user: UserWithRole) => (
        <Badge variant={user.is_blocked ? "destructive" : "outline"}>
          {user.is_blocked ? <><Ban className="mr-1 h-3 w-3" />Blocked</> : <><CheckCircle className="mr-1 h-3 w-3" />Active</>}
        </Badge>
      ),
    },
    {
      key: "created_at", header: "Joined",
      render: (user: UserWithRole) => (
        <span className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (user: UserWithRole) => (
        user.id !== currentUser?.id && (
          <Button
            variant={user.is_blocked ? "outline" : "destructive"}
            size="sm"
            onClick={() => toggleBlock(user.id, user.is_blocked)}
          >
            {user.is_blocked
              ? <><CheckCircle className="mr-1 h-4 w-4" />Unblock</>
              : <><Ban className="mr-1 h-4 w-4" />Block</>}
          </Button>
        )
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          searchPlaceholder="Search users..."
        />
      </div>
    </AdminLayout>
  );
}
