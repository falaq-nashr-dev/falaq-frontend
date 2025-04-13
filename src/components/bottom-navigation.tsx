import { FiSearch, FiUser } from "react-icons/fi";
import { BiFoodMenu } from "react-icons/bi";
import logo from "../../public/brand-logo.png";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const location = useLocation();

  return (
    <div className=" max-w-xl left-1/2 -translate-x-1/2 h-[80px] navigation-shadow fixed bottom-0 w-full  bg-white rounded-t-[24px] flex items-center justify-between px-4 pb-1">
      <div
        onClick={() => navigate("/main")}
        className={`text-center flex flex-col items-center cursor-pointer  ${
          location.pathname === "/main" ? "text-blue-500" : ""
        }`}
      >
        <BiFoodMenu className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Bo'limlar</p>
      </div>
      <div
        onClick={() => navigate("/all-products?type=all")}
        className={`text-center flex flex-col items-center cursor-pointer ${
          location.pathname?.startsWith("/all-products") ? "text-blue-500" : ""
        }`}
      >
        <FiSearch className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Qidirish</p>
      </div>
      {/* logo */}
      <div
        onClick={() => navigate("/")}
        className={`text-center flex justify-center items-center cursor-pointer ${
          location.pathname === "/" ? "text-blue-500" : ""
        }`}
      >
        <img
          className={`${
            location.pathname === "/" ? "grayscale-0" : "grayscale"
          } `}
          width={45}
          src={logo}
          alt="logo"
        />
      </div>
      <div
        onClick={() => navigate("/cart")}
        className={`text-center flex flex-col items-center cursor-pointer relative ${
          location.pathname === "/cart" && "text-blue-500"
        }`}
      >
        {cart.length > 0 && (
          <div className="w-4 h-4 flex justify-center items-center rounded-full text-[10px] bg-red-500 text-white absolute -top-1 right-2">
            {cart?.length}
          </div>
        )}

        <RiShoppingBasket2Line className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Savatcha</p>
      </div>
      <div
        onClick={() => navigate("/profile")}
        className={`text-center flex flex-col items-center cursor-pointer ${
          location.pathname === "/profile" && "text-blue-500"
        }`}
      >
        <FiUser className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Profil</p>
      </div>
    </div>
  );
};

export default BottomNavigation;
