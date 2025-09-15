"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    console.log("document.cookie:", document.cookie);
    try {
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
        const errorBody = await response.text();
        console.error("Failed to fetch user data:", response.statusText, errorBody);
        sessionStorage.removeItem("cachedUser");
        sessionStorage.removeItem("cachedUserTimestamp");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      value={{ user, isAuthenticated, loading, signIn, signOut, fetchUser }}
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
