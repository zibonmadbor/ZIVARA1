import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  sendEmailVerification,
  User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type AppRole = "super_admin" | "admin" | "moderator" | "customer";

interface DBUser {
  id: string;
  firebaseUid: string;
  email: string;
  full_name: string;
  phone?: string;
  role: AppRole;
}

interface AuthContextType {
  user: DBUser | null;
  role: AppRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (fullName: string, email: string, phone: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => void;
  updateProfile: (fullName: string, phone: string) => Promise<{ error?: string, user?: DBUser }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile details with MongoDB Express backend
  const syncBackendUser = async (firebaseUser: FirebaseUser, token: string): Promise<DBUser | null> => {
    try {
      localStorage.setItem("zivara_token", token);
      
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user details from server");
      }

      const data = await res.json();
      return data.user;
    } catch (err) {
      console.error("Error syncing user with backend:", err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("zivara_token", token);
          const syncedUser = await syncBackendUser(firebaseUser, token);
          setUser(syncedUser);
        } catch (err) {
          console.error("Auth state synchronization error:", err);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("zivara_token");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string, user?: DBUser }> => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("zivara_token", token);
      
      // Let onAuthStateChanged handle setting user, or sync immediately
      const syncedUser = await syncBackendUser(userCredential.user, token);
      if (!syncedUser) {
        return { error: "Failed to load user profile from Express server." };
      }
      setUser(syncedUser);
      return { user: syncedUser };
    } catch (err: any) {
      console.error("Sign-in error:", err);
      let errorMsg = "Invalid email or password.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMsg = "Invalid email or password.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Try again later.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      return { error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      let firebaseUser: FirebaseUser;
      let token: string;

      try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
        token = await firebaseUser.getIdToken();
        
        // 1.b Send verification email
        try {
          await sendEmailVerification(firebaseUser);
        } catch (emailErr) {
          console.error("Failed to send verification email:", emailErr);
          // Continue anyway, we can still register them
        }
      } catch (fbErr: any) {
        if (fbErr.code === "auth/email-already-in-use") {
          // Firebase user exists (from a previous partial registration). Sign in instead.
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            firebaseUser = userCredential.user;
            token = await firebaseUser.getIdToken();
          } catch (signInErr: any) {
            return { error: "This email is already registered. Please log in instead." };
          }
        } else {
          throw fbErr;
        }
      }

      // 2. Call backend /api/auth/register to upsert in MongoDB
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, phone })
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.message || "Registration failed on server" };
      }

      setUser(data.user);
      localStorage.setItem("zivara_token", token);
      return {};
    } catch (err: any) {
      console.error("Sign-up error:", err);
      let errorMsg = "Registration failed. Try again.";
      if (err.code === "auth/configuration-not-found") {
        errorMsg = "Firebase Email/Password sign-in is not enabled. Enable it in Firebase Console.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      return { error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("zivara_token", token);
      
      const syncedUser = await syncBackendUser(result.user, token);
      if (!syncedUser) {
        return { error: "Failed to load user profile from Express server." };
      }
      setUser(syncedUser);
      return {};
    } catch (err: any) {
      console.error("Google Sign-In error:", err);
      return { error: err.message || "Google Sign-In failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.removeItem("zivara_token");
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  const updateProfile = async (fullName: string, phone: string): Promise<{ error?: string, user?: DBUser }> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("zivara_token");
      if (!token) throw new Error("No authorization token found");

      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: fullName, phone })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const data = await res.json();
      setUser(data.user);
      return { user: data.user };
    } catch (err: any) {
      console.error("Update profile error:", err);
      return { error: err.message || "Failed to update profile" };
    } finally {
      setIsLoading(false);
    }
  };

  const role = user?.role ?? null;
  const isAdmin = role === "super_admin" || role === "admin";
  const isModerator = role === "super_admin" || role === "admin" || role === "moderator";

  return (
    <AuthContext.Provider value={{ user, role, isLoading, isAdmin, isModerator, signIn, signUp, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
