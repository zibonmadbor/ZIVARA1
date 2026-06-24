
// ============================================================
// CUSTOMER REGISTER PAGE - Frontend Only
// ============================================================
// TODO: Connect to MongoDB + Express backend:
//   POST /api/auth/register  { fullName, email, phone, password }
//   -> { token, user: { id, email, full_name, role } }
//   Or send email verification link before granting access.
//
// MongoDB User Model example:
//   const userSchema = new mongoose.Schema({
//     full_name: String,
//     email: { type: String, unique: true },
//     phone: String,
//     password: String, // bcrypt hashed
//     role: { type: String, default: 'customer' },
//     is_blocked: { type: Boolean, default: false },
//     created_at: { type: Date, default: Date.now }
//   });
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast({ title: "Password Too Short", description: "Password must be at least 8 characters long.", variant: "destructive" });
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      toast({ title: "Password Requirements", description: "Password must contain at least one uppercase letter.", variant: "destructive" });
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      toast({ title: "Password Requirements", description: "Password must contain at least one number.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(
      formData.fullName,
      formData.email,
      formData.phone || "",
      formData.password
    );
    setIsLoading(false);

    if (error) {
      toast({ title: "Registration Failed", description: error, variant: "destructive" });
      return;
    }

    toast({ title: "Welcome to ZIVARA!", description: "Your account has been created. A verification email has been sent." });
    navigate("/");
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);

    if (error) {
      toast({ title: "Google Sign-In Failed", description: error, variant: "destructive" });
      return;
    }

    toast({ title: "Welcome to ZIVARA!", description: "Your account has been created successfully." });
    navigate("/");
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One number", met: /[0-9]/.test(formData.password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 min-h-screen flex items-center">
        <div className="container-premium">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Join ZIVARA
              </h1>
              <p className="text-muted-foreground">Create your account to start shopping</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required disabled={isLoading} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required disabled={isLoading} />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      disabled={isLoading} />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input id="password" name="password" type={showPassword ? "text" : "password"}
                      value={formData.password} onChange={handleChange} placeholder="••••••••"
                      className="w-full h-12 pl-12 pr-12 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-3 space-y-1">
                      {passwordRequirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <Check className={`w-3 h-3 ${req.met ? "text-green-500" : "text-muted-foreground"}`} />
                          <span className={req.met ? "text-green-500" : "text-muted-foreground"}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-border" required disabled={isLoading} />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2"
                  disabled={isLoading || !allRequirementsMet}>
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
                  ) : (
                    <>Create Account<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <button onClick={handleGoogleSignIn} disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 h-12 border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-center mt-6 text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </motion.p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
