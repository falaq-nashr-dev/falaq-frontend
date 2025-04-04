import { FiHome, FiSearch, FiUser } from "react-icons/fi";
import logo from "../../public/bottom-logo.svg";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Product } from "../store/useCartStore";
import useUser from "../hooks/use-user";
import toast from "react-hot-toast";

interface BottomCartNavigationProps {
  totalPrice: number;
  cart: Product[];
}

const BottomCartNavigation = ({
  cart,
  totalPrice,
}: BottomCartNavigationProps) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleCheckout = () => {
    if (user !== null) {
      navigate("/order-main");
    } else {
      toast.error("Iltimos sotib olish uchun ro'yhatdan o'ting");
    }
  };
  return (
    <div
      className={` ${
        cart.length > 0 ? "h-[160px]" : "h-[80px] pt-4"
      }  navigation-shadow fixed bottom-0 w-full  bg-white rounded-t-[24px]`}
    >
      {cart.length > 0 && (
        <div className="container px-[24px] mb-1  py-[20px]  mx-auto max-w-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600">{cart?.length ?? 0} xil kitob</p>
            <h1 className="text-[#162B4C] font-semibold text-lg">
              {totalPrice?.toLocaleString()} so’m
            </h1>
          </div>
          <button
            onClick={handleCheckout}
            className={`text-white group bg-[#348AEC] focus:ring-1 focus:outline-none focus:ring-blue-300  rounded-lg  px-[16px] py-[11px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 w-1/2 justify-center transition-all duration-300`}
          >
            Sotib olish
          </button>
        </div>
      )}

      <div className="flex items-center justify-between px-5">
        <div
          onClick={() => navigate("/")}
          className="text-center flex flex-col items-center cursor-pointer"
        >
          <FiHome className="size-5 font-medium" />
          <p className="mt-2 font-medium text-[14px]">Asosiy</p>
        </div>
        <div
          onClick={() => navigate("/all-products")}
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
    </div>
  );
};

export default BottomCartNavigation;
