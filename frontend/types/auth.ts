
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  fetchUser: () => Promise<void>;
}
