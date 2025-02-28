import { auth } from "@/lib/firebaseConfig"; 
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState, createContext, useContext } from "react";

// Auth Context
const AuthContext = createContext<{ user: User | null; login: () => void; logout: () => void }>({
  user: null,
  login: () => {},
  logout: () => {},
});

// Auth Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

// Hook to use authentication
export function useAuth() {
  return useContext(AuthContext);
}
