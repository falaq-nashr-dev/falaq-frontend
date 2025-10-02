import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../../../public/images/logo.svg";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import useUser from "@/hooks/use-user";
import { formatUzbekPhoneNumber } from "@/helpers/phone";

const MobileNavbar = () => {
  const navigate = useNavigate();

  const cart = useCartStore((s) => s.cart);
  const cartCount = Array.isArray(cart) ? cart.length : 0;

  const { user } = useUser();
  const displayName = user?.firstName ?? "Foydalanuvchi";

  const formattedPhone = user?.phoneNumber
    ? formatUzbekPhoneNumber(user.phoneNumber)
    : undefined;

  return (
    <header>
      <div className="container px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className=" rounded-full ">
            <img
              alt="User avatar"
              src={logo}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <div>
            <h4 className="text-gray-900 text-[14px] font-semibold">
              {displayName}
            </h4>
            {formattedPhone && (
              <p className="text-gray-400 text-[11px]">{formattedPhone}</p>
            )}
          </div>
        </div>

        <Button
          type="button"
          onClick={() => navigate("/cart")}
          aria-label="Open cart"
          title="Savat"
          size="icon"
          className="cursor-pointer relative bg-blue-100 hover:bg-blue-100 w-10 h-10"
        >
          <ShoppingCart className="size-6 text-blue-500" aria-hidden="true" />
          {cartCount > 0 && (
            <span
              className="absolute top-0 right-0 inline-flex items-center justify-center
               w-4 h-4 text-[10px] font-semibold text-white bg-blue-600 rounded-full
               shadow-md"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default MobileNavbar;
