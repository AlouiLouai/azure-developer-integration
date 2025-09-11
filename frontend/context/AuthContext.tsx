"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser(); // No token needed, it's in HttpOnly cookie
  }, []);

  const fetchUser = async () => { // Removed token parameter
    try {
      const cachedUser = sessionStorage.getItem("cachedUser");
      const cachedTimestamp = sessionStorage.getItem("cachedUserTimestamp");

      if (cachedUser && cachedTimestamp) {
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        if (Date.now() - parseInt(cachedTimestamp) < fiveMinutes) {
          const userData: User = JSON.parse(cachedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          return; // Use cached data and exit
        }
      }

      // Assuming an API endpoint to get user details
      // The browser will automatically send the HttpOnly cookie
      const response = await fetch("http://localhost:7071/api/user", {credentials: 'include'}); // Add credentials: 'include'
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem("cachedUser", JSON.stringify(userData));
        sessionStorage.setItem("cachedUserTimestamp", Date.now().toString());
      } else {
        console.error("Failed to fetch user data:", response.statusText);
        // No localStorage.removeItem("authToken"); needed
        sessionStorage.removeItem("cachedUser");
        sessionStorage.removeItem("cachedUserTimestamp");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // No localStorage.removeItem("authToken"); needed
      sessionStorage.removeItem("cachedUser");
      sessionStorage.removeItem("cachedUserTimestamp");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = () => {
    // Redirect to your Google authentication API endpoint
    window.location.href = "http://localhost:7071/api/auth/google";
  };

  const signOut = async () => { // Made async
    try {
      await fetch("http://localhost:7071/api/auth/signout", { method: "POST", credentials: 'include' }); // Call backend to clear cookie
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      sessionStorage.removeItem("cachedUser"); // Clear frontend cache
      sessionStorage.removeItem("cachedUserTimestamp"); // Clear frontend cache
      setUser(null);
      setIsAuthenticated(false);
      router.push("/"); // Redirect to home or login page after sign out
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
