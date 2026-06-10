
// ============================================================
// ADMIN LOGIN PAGE - Frontend Only
// ============================================================
// TODO: Connect to MongoDB + Express backend:
//   POST /api/auth/login  { email, password }
//   -> { token, user: { id, email, full_name, role } }
//
// Then check: if role !== 'admin' | 'super_admin' | 'moderator'
//   -> show "Access Denied"
//
// Demo credentials (mock only):
//   admin@zivara.com     (super_admin)
//   moderator@zivara.com (moderator)
// ============================================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error, user } = await signIn(email, password);

    if (error) {
      toast({ title: "Login Failed", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Check role from the freshly returned user (not stale context state)
    const role = user?.role;
    const hasAdminAccess = role === "super_admin" || role === "admin" || role === "moderator";

    if (!hasAdminAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({ title: "Welcome back!", description: `Logged in as ${role?.replace("_", " ")}.` });
    navigate("/admin");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Crown className="h-10 w-10 text-primary" />
            <span className="font-display text-3xl font-bold text-primary">ZIVARA</span>
          </div>
          <p className="mt-2 text-muted-foreground">Admin Panel</p>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo hint */}
            <div className="mb-4 p-3 bg-primary/10 rounded-lg text-xs text-muted-foreground">
              <strong>Demo:</strong> Use <code>admin@zivara.com</code> or{" "}
              <code>moderator@zivara.com</code> with any password.
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@zivara.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
