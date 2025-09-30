import { CircleUser, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";

const Header = () => {
  const links = [
    {
      id: 1,
      name: "Asosiy",
      link: "/",
    },
    {
      id: 2,
      name: "Bo'limlar",
      link: "/main",
    },
    {
      id: 3,
      name: "Barcha kitoblar",
      link: "/all-products",
    },
  ];
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const { cart } = useCartStore();

  return (
    <header
      className={`min-h-[84px] flex items-center ${
        pathname == "/cart" || pathname.startsWith("/product")
          ? "bg-white"
          : "bg-[#E9F2F8]"
      } `}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-3">
        <Logo />
        {/* <div className="relative w-1/3 hidden sm:block">
            <SearchIcon
              size={18}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            />
            <Input placeholder="Qidirish..." className="pl-10" />
            <ChevronDown
              size={18}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 right-3"
            />
          </div> */}
        <ul className="gap-5 lg:gap-7 hidden md:flex">
          {links.map((item, index) => (
            <Link key={index} to={item.link}>
              <li
                className={`font-medium cursor-pointer hover:text-blue-500 transition-all duration-300 ${
                  item.link === pathname && "text-blue-500"
                }`}
              >
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/cart")}
            size={"icon"}
            variant={"link"}
            className="cursor-pointer group"
          >
            <div className="relative">
              <ShoppingCart
                size={33}
                className="size-7 scale-125 group-hover:scale-150 transition-all duration-300"
              />

              {cart.length > 0 && (
                <span
                  className="absolute -top-2 -right-3 inline-flex items-center justify-center
               w-4 h-4 text-[10px] font-semibold text-white bg-blue-600 rounded-full
               shadow-md ring-2 ring-white"
                >
                  {cart.length > 99 ? "99+" : cart.length}
                </span>
              )}
            </div>
          </Button>
          {/* <Button
              onClick={() => navigate("/wishlist")}
              size={"icon"}
              variant={"link"}
              className="cursor-pointer group"
            >
              <div className="relative">
                <Heart
                  size={33}
                  className="size-7 scale-125 group-hover:scale-150 transition-all duration-300"
                />

                {wishlist.length > 0 && (
                  <span
                    className="absolute -top-2 -right-3 inline-flex items-center justify-center
               w-4 h-4 text-[10px] font-semibold text-white bg-red-600 rounded-full
               shadow-md ring-2 ring-white"
                  >
                    {wishlist.length > 99 ? "99+" : wishlist.length}
                  </span>
                )}
              </div>
            </Button> */}
          <Button
            onClick={() => navigate("/profile")}
            aria-label="User"
            size={"icon"}
            variant={"link"}
            className="cursor-pointer group"
          >
            <CircleUser className="size-6 scale-125 group-hover:scale-150 transition-all duration-300" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
