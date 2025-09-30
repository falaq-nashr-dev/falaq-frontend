import { FiShoppingBag } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80px] py-12 flex flex-col items-center justify-center">
      <FiShoppingBag className="size-9 md:size-20" />
      <p className="mt-2 md:mt-4 font-medium md:text-xl">
        Sizning savatingiz bo'sh
      </p>
      <button
        onClick={() => navigate("/")}
        className={`text-white group bg-[#007AFF] focus:ring-1 focus:outline-none focus:ring-blue-300  rounded-xl  px-[32px] py-[10px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2  justify-center mt-2 md:mt-3`}
      >
        <span>Xarid qilish</span>
        <GoArrowRight className="size-5" />
      </button>
    </div>
  );
};

export default EmptyCart;
