import { House, Search, Trash2, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../public/images/logo.svg";
import { useCartStore } from "@/store/useCartStore";

const BottomNavigation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cart } = useCartStore();

  const navItems = [
    {
      id: "asosiy",
      label: "Bo'limlar",
      href: "/main",
      icon: <House className="w-6 h-6" />,
      isActive: pathname === "/main",
    },
    {
      id: "qidirish",
      label: "Qidirish",
      href: "/all-products?type=all",
      icon: <Search className="w-6 h-6" />,
      isActive: pathname.startsWith("/all-products"),
    },
    {
      id: "falaq",
      label: "Falaq Nashr",
      href: "/",
      isActive: pathname === "/",
      icon: (
        <div className="mt-[-6px]">
          <img
            className={`${pathname === "/" ? "grayscale-0" : "grayscale-0"} `}
            alt="Falaq Nashr"
            src={logo}
            width={44}
            height={44}
          />
        </div>
      ),
    },
    {
      id: "savatcha",
      label: "Savatcha",
      href: "/cart",
      isActive: pathname === "/cart",
      // ✅ wrap the icon with a relative container
      icon: (
        <div className="relative">
          <Trash2 className="w-6 h-6" />
          {cart.length > 0 && (
            <span
              className="absolute -top-2 -right-2 inline-flex items-center justify-center 
                         w-5 h-5 text-[10px] font-bold text-white bg-blue-600 
                         rounded-full shadow ring-2 ring-white"
            >
              {cart.length > 99 ? "99+" : cart.length}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "profil",
      label: "Profil",
      href: "/profile",
      isActive: pathname === "/settings/profile",
      icon: <User className="w-6 h-6" />,
    },
  ];

  return (
    <div className="fixed z-[100] bottom-0 left-0 right-0 bg-white px-3 py-2 sm:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.href)}
            className={`flex flex-col items-center py-2 px-3 min-w-0 cursor-pointer ${
              item.isActive ? "text-[#2962FF]" : "text-[#A9C0FF]"
            }`}
          >
            <div className="mb-1 flex-shrink-0">{item.icon}</div>
            <div className="text-center">
              <div
                className={`text-xs font-medium leading-tight ${
                  item.isActive ? "text-[#2962FF]" : "text-[#A9C0FF]"
                }`}
              >
                {item.label}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
