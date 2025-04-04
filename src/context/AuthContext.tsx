/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { Request } from "../helpers/Request";

interface User {
  isAuthenticated: boolean;
  role: string | null;
}

interface AuthResponse {
  birthYear: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

interface AuthContextType {
  user: User;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState<User>({
    isAuthenticated: false,
    role: null,
  });

  const login = (role: string) => setUser({ isAuthenticated: true, role });
  const logout = () => setUser({ isAuthenticated: false, role: null });

  const fetchCurrentUser = async () => {
    try {
      const { data } = await Request<AuthResponse>(
        "/auth/profile",
        "GET",
        {},
        true
      );

      if (!data) {
        setUser({ isAuthenticated: false, role: null });
      } else {
        setUser({
          isAuthenticated: true,
          role: data.role,
        });
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    if (!["/login", "/register"].includes(location.pathname)) {
      fetchCurrentUser();
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
