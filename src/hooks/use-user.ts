import { useState, useEffect } from "react";
import { Request } from "../helpers/Request";
import { useLocation, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await Request<User>("/auth/profile", "GET", {}, true);
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
        if (
          location.pathname === "/sign-in" ||
          location.pathname.startsWith("/admin")
        ) {
          navigate("/sign-in");
        } else {
          navigate("/start");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [location.pathname, navigate]);

  return { user, loading, error };
};

export default useUser;
