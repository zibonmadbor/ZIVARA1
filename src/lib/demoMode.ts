import { toast } from "@/hooks/use-toast";

export const isDemoMode = (): boolean => {
  // Explicit override
  if (import.meta.env.VITE_IS_DEMO === "false") return false;
  if (import.meta.env.VITE_IS_DEMO === "true") return true;

  // Auto-detect Netlify, Vercel, or custom live domain when no local backend is present
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("netlify.app") || host.includes("vercel.app") || host.includes("github.io") || host !== "localhost") {
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
