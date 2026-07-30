import { toast } from "@/hooks/use-toast";

export const isDemoMode = (): boolean => {
  // Explicit override via environment variable
  if (import.meta.env.VITE_IS_DEMO === "false") return false;
  if (import.meta.env.VITE_IS_DEMO === "true") return true;

  // Only auto-detect demo mode on known demo hosting platforms (not Vercel production)
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Don't auto-activate demo mode on Vercel — the backend is deployed there too
    if (host.includes("github.io")) {
      return true;
    }
  }

  return false;
};

export const DEMO_ADMIN_USER = {
  id: "demo-admin-id",
  firebaseUid: "demo-uid",
  email: "admin@zivara.com",
  full_name: "Demo Super Admin",
  phone: "+8801700000000",
  role: "super_admin" as const,
};

export const notifyDemoAction = (actionName: string, detail?: string) => {
  toast({
    title: "🎭 Demo Mode Active",
    description: detail || `${actionName} simulated successfully! Database was not modified.`,
  });
};
