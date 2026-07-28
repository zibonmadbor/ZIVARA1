import { toast } from "@/hooks/use-toast";

export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_IS_DEMO === "true";
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
