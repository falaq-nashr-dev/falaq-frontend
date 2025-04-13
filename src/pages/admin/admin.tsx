import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Logo from "./logo";
import useAdminAuthCheck from "../../hooks/useAdminAuthCheck";
import { TbCategory2, TbCheck, TbClock, TbX } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { RiAdminLine, RiBookShelfLine } from "react-icons/ri";
import { VscTypeHierarchySuper } from "react-icons/vsc";
import { FaUserPen } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { PiUsersThreeFill } from "react-icons/pi";

const adminRoutes = [
  {
    icon: RiBookShelfLine,
    label: "Kitoblar",
    href: "/admin/books",
  },
  {
    icon: TbCategory2,
    label: "Kitob sahifalar",
    href: "/admin/book-pages",
  },
  {
    icon: TbCategory2,
    label: "Kategoriyalar",
    href: "/admin/categories",
  },

  {
    icon: VscTypeHierarchySuper,
    label: "Turlar",
    href: "/admin/types",
  },
  {
    icon: FaUserPen,
    label: "Mualliflar",
    href: "/admin/authors",
  },
];

const operatorRoutes = [
  {
    icon: TbClock, // Icon for "Inprogress Orders"
    label: "Inprogress Orders",
    href: "/admin/orders-progress",
  },
  {
    icon: TbCheck, // Icon for "Completed Orders"
    label: "Completed Orders",
    href: "/admin/orders-completed",
  },
  {
    icon: TbX, // Icon for "Declined Orders"
    label: "Declined Orders",
    href: "/admin/orders-declined",
  },
];

const superAdminRoutes = [
  {
    icon: FaUsers,
    label: "Operatorlar",
    href: "/admin/operators",
  },
  {
    icon: RiAdminLine,
    label: "Adminlar",
    href: "/admin/admins",
  },
  {
    icon: PiUsersThreeFill,
    label: "Foydalanuvchilar",
    href: "/admin/users",
  },
];

const Admin = () => {
  const location = useLocation();
  const { isAuthenticated, loading, currentRole } = useAdminAuthCheck();
  const navigate = useNavigate();

  const routes =
    currentRole === "ADMIN"
      ? adminRoutes
      : currentRole === "SUPER_ADMIN"
      ? superAdminRoutes
      : operatorRoutes;

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-lg">Iltimos kuting...</p>
      </div>
    );

  if (isAuthenticated === false) {
    return <Navigate to="/sign-in" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="min-w-[280px] border-r bg-gray-50 text-white">
        <div className="px-3 py-4">
          <Logo />
        </div>
        <div className="px-2 mt-2 flex flex-col items-center space-y-2">
          {routes.map(({ href, icon: Icon, label }) => (
            <Link key={href} className="w-full" to={href}>
              <div
                className={`hover:bg-blue-500 hover:text-white cursor-pointer px-3 py-3 w-full rounded-md border border-blue-500 ${
                  location.pathname === href
                    ? "bg-blue-500 hover:bg-blue-400"
                    : "text-black"
                } `}
              >
                <div className="flex items-center gap-x-3 pl-2">
                  {<Icon className="size-6" />} {label}
                </div>
              </div>
            </Link>
          ))}
          <div
            onClick={handleLogout}
            className={`hover:bg-blue-500 hover:text-white cursor-pointer px-3 py-3 w-full rounded-md border border-blue-500    text-black !mt-8`}
          >
            <div className="flex items-center gap-x-3 pl-2">
              <CiLogout className="size-6" /> Chiqish
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 w-full py-4 max-w-6xl overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
