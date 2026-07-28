
// ============================================================
// ADMIN LAYOUT - Frontend Only
// ============================================================
// TODO: Replace mock role check with real JWT-based auth guard.
// On route load, verify token via GET /api/auth/me and check role.
// If role is not admin/moderator, redirect to /admin/login.
// ============================================================

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "./AdminSidebar";
import { Loader2, Info } from "lucide-react";
import { isDemoMode } from "@/lib/demoMode";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isModerator } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isModerator) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {isDemoMode() && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs sm:text-sm text-amber-500 flex items-center justify-center gap-2 font-medium shrink-0">
            <Info className="h-4 w-4 shrink-0" />
            <span>
              <strong>🎭 Demo Mode Active:</strong> You are exploring the Admin Panel demo. All actions (Create/Edit/Delete) are simulated locally and will not alter the real database.
            </span>
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <div className="container-premium py-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
