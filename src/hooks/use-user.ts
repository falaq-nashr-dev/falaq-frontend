import { useState, useEffect } from "react";
import { Request } from "../helpers/Request";
import { useLocation, useNavigate } from "react-router-dom";

const OPEN_PAGES: string[] = [
  "/start",
  "/",
  "/main",
  "/all-products",
  "/product",
  "/sign-in",
  "/cart",
];

interface User {
  firstName: string;
  lastName: string;
  birthYear: number;
  phoneNumber: string;
  role: "USER" | "SUPER_ADMIN" | "ADMIN" | "OPERATOR";
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (
      OPEN_PAGES.includes(currentPath) ||
      currentPath.startsWith("/product/")
    ) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await Request<User>("/auth/profile", "GET", {}, true);
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
        if (currentPath.startsWith("/admin")) {
          navigate("/sign-in");
        } else {
          navigate("/start");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentPath, navigate]);

  return { user, loading, error };
};

export default useUser;
