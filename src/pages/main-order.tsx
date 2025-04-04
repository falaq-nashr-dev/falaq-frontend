import Header from "./components/header";
import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { useCartStore } from "../store/useCartStore";
import { Request } from "../helpers/Request";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/use-user";

const MainOrder = () => {
  const { phoneNumber, setSelectedPhone, shopName, setSelectedShopName } =
    useStore();
  const { cart, clearCart } = useCartStore();
  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      setSelectedPhone(user.phoneNumber);
      setSelectedShopName(user.firstName + " " + user.lastName);
    }
  }, [user]);

  useEffect(() => {
    if (cart.length <= 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phone: "",
    shopName: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (!value.startsWith("998")) {
      value = "998"; // Ensure it always starts with '998'
    }

    if (value.length > 12) {
      value = value.slice(0, 12); // Max length for Uzbekistan phone
    }

    setSelectedPhone("+" + value);
    setErrors((prev) => ({
      ...prev,
      phone: value.length === 12 ? "" : "Telefon raqam noto’g’ri",
    }));
  };

  const handleCheckout = async () => {
    const newErrors = {
      phone: phoneNumber.length === 13 ? "" : "Telefon raqam noto’g’ri",
      shopName: shopName.trim() ? "" : "To'liq ism kiriting",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      await Request(
        `/orders`,
        "POST",
        {
          products: cart.map((c) => ({
            productId: c?.id,
            amount: c?.quantity,
          })),
          customerPhoneNumber: phoneNumber,
          customerFullName: shopName,
        },
        true
      );

      toast.success(
        "Sizning buyurtmangiz qabul qilindi. Operator tez orada aloqaga chiqadi",
        {
          duration: 3000,
        }
      );
      clearCart();
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi. Keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-2">
      <div className="container py-3 px-4 mx-auto max-w-xl min-h-[500px]">
        <Header name="Orqaga" />
        <div className="mt-5 space-y-5 min-h-[300px]">
          {/* Phone Number Input */}
          <div>
            <label className="font-medium" htmlFor="phone">
              Telefon
            </label>
            <input
              value={phoneNumber}
              onChange={handlePhoneChange}
              id="phone"
              type="tel"
              placeholder="+998"
              className={`block mt-1 w-full h-[48px] bg-gray-100 rounded-2xl pl-4 focus:outline-blue-500 ${
                errors.phone ? "border border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          {/* FullName Input */}
          <div>
            <label className="font-medium" htmlFor="name">
              Ism Familiya
            </label>
            <input
              value={shopName}
              onChange={(e) => {
                setSelectedShopName(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  shopName: e.target.value.trim() ? "" : "To'liq ism kiriting",
                }));
              }}
              id="name"
              type="text"
              placeholder="Ismingizni yozing"
              className={`block mt-1 w-full h-[48px] bg-gray-100 rounded-2xl pl-4 focus:outline-blue-500 ${
                errors.shopName ? "border border-red-500" : ""
              }`}
            />
            {errors.shopName && (
              <p className="text-red-500 text-sm">{errors.shopName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed w-full bottom-4">
        <div className="container max-w-xl mx-auto px-4">
          <button
            onClick={handleCheckout}
            disabled={
              Object.values(errors).some((error) => error !== "") || loading
            }
            className={`text-white w-full bg-[#348AEC] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-xl px-[16px] py-[10px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 justify-center transition-all duration-300 ${
              Object.values(errors).some((error) => error !== "")
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? "Saqlanmoqda..." : "Tasdiqlash"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainOrder;
