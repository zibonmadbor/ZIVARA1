
// ============================================================
// ADMIN USERS PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET  /api/admin/users            -> list all users
//   PUT  /api/admin/users/:id/role   -> update user role { role }
//   PUT  /api/admin/users/:id/block  -> toggle block { is_blocked }
//
// MongoDB User Model (reference):
//   { _id, email, full_name, phone, avatar_url, role, is_blocked, created_at }
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ban, CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type AppRole = "super_admin" | "admin" | "moderator" | "customer";

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_blocked: boolean;
  created_at: string;
  role: AppRole;
}

const roleOptions: AppRole[] = ["super_admin", "admin", "moderator", "customer"];

// TODO: Replace with data from GET /api/admin/users
const MOCK_USERS: UserWithRole[] = [
  { id: "1", email: "admin@zivara.com", full_name: "Super Admin", avatar_url: null, phone: "+1 555-0001", is_blocked: false, created_at: "2024-01-01T00:00:00Z", role: "super_admin" },
  { id: "2", email: "moderator@zivara.com", full_name: "Moderator User", avatar_url: null, phone: "+1 555-0002", is_blocked: false, created_at: "2024-01-05T00:00:00Z", role: "moderator" },
  { id: "3", email: "customer@zivara.com", full_name: "John Doe", avatar_url: null, phone: "+1 555-0003", is_blocked: false, created_at: "2024-02-10T00:00:00Z", role: "customer" },
  { id: "4", email: "jane@example.com", full_name: "Jane Smith", avatar_url: null, phone: "+1 555-0004", is_blocked: false, created_at: "2024-02-15T00:00:00Z", role: "customer" },
  { id: "5", email: "bob@example.com", full_name: "Bob Wilson", avatar_url: null, phone: null, is_blocked: true, created_at: "2024-03-01T00:00:00Z", role: "customer" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>(MOCK_USERS);
  const { toast } = useToast();
  const { role: currentUserRole, user: currentUser } = useAuth();

  const toggleBlock = (userId: string, currentlyBlocked: boolean) => {
    // TODO: PUT /api/admin/users/:id/block  { is_blocked: !currentlyBlocked }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_blocked: !currentlyBlocked } : u));
    toast({ title: currentlyBlocked ? "User unblocked" : "User blocked" });
  };

  const updateRole = (userId: string, newRole: AppRole) => {
    if (currentUserRole !== "super_admin") {
      toast({ title: "Permission denied", description: "Only super admins can change user roles.", variant: "destructive" });
      return;
    }
    // TODO: PUT /api/admin/users/:id/role  { role: newRole }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    toast({ title: `User role updated to ${newRole}` });
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
          <Button variant={user.is_blocked ? "outline" : "destructive"} size="sm"
            onClick={() => toggleBlock(user.id, user.is_blocked)}>
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
        <div>
          <h1 className="text-3xl font-display font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <DataTable columns={columns} data={users} isLoading={false} searchPlaceholder="Search users..." />
      </div>
    </AdminLayout>
  );
}
