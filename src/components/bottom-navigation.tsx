import { FiHome, FiSearch, FiUser } from "react-icons/fi";
import logo from "../../public/new-logo.png";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();

  return (
    <div className="h-[80px] navigation-shadow fixed bottom-0 w-full  bg-white rounded-t-[24px] flex items-center justify-between px-5">
      <div
        onClick={() => navigate("/")}
        className="text-center flex flex-col items-center cursor-pointer"
      >
        <FiHome className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Asosiy</p>
      </div>
      <div
        onClick={() => navigate("/all-products?type=all")}
        className="text-center flex flex-col items-center cursor-pointer"
      >
        <FiSearch className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Qidirish</p>
      </div>
      {/* logo */}
      <div
        onClick={() => navigate("/main")}
        className="text-center flex justify-center items-center cursor-pointer"
      >
        <img src={logo} alt="logo" />
      </div>
      <div
        onClick={() => navigate("/cart")}
        className="text-center flex flex-col items-center cursor-pointer relative"
      >
        {cart.length > 0 && (
          <div className="w-4 h-4 flex justify-center items-center rounded-full text-[10px] bg-blue-500 text-white absolute -top-1 right-2">
            {cart?.length}
          </div>
        )}

        <RiShoppingBasket2Line className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Savatcha</p>
      </div>
      <div
        onClick={() => navigate("/profile")}
        className="text-center flex flex-col items-center cursor-pointer"
      >
        <FiUser className="size-5 font-medium" />
        <p className="mt-2 font-medium text-[14px]">Profil</p>
      </div>
    </div>
  );
};

export default BottomNavigation;
