/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Request } from "../helpers/Request";

interface AuthResponse {
  birthYear: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "USER";
}

const useAdminAuthCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<
    "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "USER"
  >("USER");

  useEffect(() => {
    const checkAdminAuth = async () => {
      if (location.pathname.startsWith("/admin")) {
        try {
          const { data } = await Request<AuthResponse>(
            "/auth/profile",
            "GET",
            {},
            true
          );

          if (!["OPERATOR", "ADMIN", "SUPER_ADMIN"].includes(data.role)) {
            setIsAuthenticated(false);
            navigate("/sign-in");
          }
          setCurrentRole(data.role);
        } catch (error) {
          setIsAuthenticated(false);
          navigate("/sign-in");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [location.pathname, navigate]);

  return { isAuthenticated, loading, currentRole };
};

export default useAdminAuthCheck;
