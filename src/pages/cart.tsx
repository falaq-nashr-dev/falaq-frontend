import { Input } from "@/components/ui/input";
import EmptyCart from "../components/empty-cart";
import { Product, useCartStore } from "../store/useCartStore";
import CartDesktopItem from "./components/cart-desktop-item";
import { Button } from "@/components/ui/button";
import CartItem from "./components/cart-item";
import { getImage } from "@/helpers/image";
import useUser from "@/hooks/use-user";
import toast from "react-hot-toast";
import CheckoutModal from "./components/modals/checkout-modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useStore } from "@/store/useStore";
import { Request } from "@/helpers/Request";
import CompletedMessage from "./components/completed-message";
import NavNavigate from "@/components/nav-navigate";

interface OrderErrors {
  phone: string;
  shopName: string;
}

interface OrderData {
  products: Array<{
    productId: string | number;
    amount: number;
  }>;
  customerPhoneNumber: string;
  customerFullName: string;
}

const PHONE_REGEX = /^\+998\d{9}$/;

const Cart = () => {
  const { totalPrice, cart, clearCart } = useCartStore();
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const { phoneNumber, setSelectedPhone, shopName, setSelectedShopName } =
    useStore();

  const [checkoutModal, setCheckoutModal] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [errors, setErrors] = useState<OrderErrors>({
    phone: "",
    shopName: "",
  });
  const [loading, setLoading] = useState(false);

  // Memoized calculations
  const totalWithDelivery = useMemo(() => {
    return totalPrice || 0;
  }, [totalPrice]);

  const isFormValid = useMemo(() => {
    return PHONE_REGEX.test(phoneNumber) && shopName.trim().length > 0;
  }, [phoneNumber, shopName]);

  // Initialize user data when user changes
  useEffect(() => {
    if (user) {
      const trimmedPhone = user.phoneNumber?.trim();
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      if (trimmedPhone) setSelectedPhone(trimmedPhone);
      if (fullName) setSelectedShopName(fullName);
    }
  }, [user, setSelectedPhone, setSelectedShopName]);

  // Reset ordered state on component unmount
  useEffect(() => {
    return () => setOrdered(false);
  }, []);

  // Memoized price getter
  const getPrice = useCallback((item: Product) => {
    return item.salePrice || 0;
  }, []);

  // Validate phone number
  const validatePhone = useCallback((phone: string) => {
    if (!phone) return "Telefon raqam kiritilmagan";
    if (!PHONE_REGEX.test(phone)) return "Telefon raqam noto'g'ri formatda";
    return "";
  }, []);

  // Validate shop name
  const validateShopName = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return "To'liq ism kiriting";
    if (trimmedName.length < 2)
      return "Ism kamida 2 ta harfdan iborat bo'lishi kerak";
    return "";
  }, []);

  // Handle checkout modal
  const handleCheckout = useCallback(() => {
    if (!user) {
      toast.error("Iltimos sotib olish uchun ro'yhatdan o'ting");
      return;
    }
    setCheckoutModal(true);
  }, [user]);

  // Handle phone input change
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");

      // Ensure it starts with 998
      if (!value.startsWith("998")) {
        value = "998" + value.replace(/^998/, "");
      }

      // Limit to 12 digits (998 + 9 digits)
      if (value.length > 12) {
        value = value.slice(0, 12);
      }

      const formattedPhone = "+" + value;
      setSelectedPhone(formattedPhone);

      // Validate and set error
      const phoneError = validatePhone(formattedPhone);
      setErrors((prev) => ({ ...prev, phone: phoneError }));
    },
    [setSelectedPhone, validatePhone]
  );

  // Handle shop name change
  const handleShopNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSelectedShopName(value);

      // Validate and set error
      const nameError = validateShopName(value);
      setErrors((prev) => ({ ...prev, shopName: nameError }));
    },
    [setSelectedShopName, validateShopName]
  );

  // Handle purchase
  const handleBuy = useCallback(async () => {
    // Validate all fields
    const newErrors: OrderErrors = {
      phone: validatePhone(phoneNumber),
      shopName: validateShopName(shopName),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
      toast.error("Savatcha bo'sh");
      return;
    }

    try {
      setLoading(true);

      const orderData: OrderData = {
        products: cart.map((item) => ({
          productId: item.id,
          amount: item.quantity,
        })),
        customerPhoneNumber: phoneNumber,
        customerFullName: shopName.trim(),
      };

      await Request("/orders", "POST", orderData, true);

      clearCart();
      setOrdered(true);
      setCheckoutModal(false);
      toast.success("Buyurtma muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Xatolik yuz berdi. Keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, shopName, cart, clearCart, validatePhone, validateShopName]);

  // Handle clear cart with confirmation
  const handleClearCart = useCallback(() => {
    if (cart.length === 0) return;

    if (
      window.confirm("Haqiqatan ham barcha mahsulotlarni o'chirmoqchimisiz?")
    ) {
      clearCart();
    }
  }, [cart.length, clearCart]);

  // Close checkout modal
  const closeCheckoutModal = useCallback(() => {
    setCheckoutModal(false);
  }, []);

  // Early return for completed order or empty cart
  if (cart.length === 0 && ordered) {
    return (
      <div className="bg-white sm:bg-[#E9F2F8] pt-1 sm:py-3 px-2 md:py-12">
        <div className="container mt-12 max-w-7xl mx-auto px-3 sm:px-1">
          <CompletedMessage />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white sm:bg-[#E9F2F8] pt-1 sm:py-3 px-2 md:py-12">
        <div className="container max-w-7xl mx-auto px-3 sm:px-1">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white sm:bg-[#E9F2F8] pt-1 sm:py-3 px-2 md:py-12">
        <NavNavigate />
        {/* Desktop View */}
        <div className="hidden sm:block container max-w-7xl mx-auto px-3 sm:px-1">
          <div>
            <h1 className="text-4xl text-[#11142D] font-bold">Savatcha</h1>
            <div className="mt-6 flex flex-col md:flex-row gap-6 justify-between">
              {/* Left side - Products */}
              <div className="md:w-2/3">
                <div className="flex items-center justify-between">
                  <p className="text-[#53585F] text-lg font-medium">
                    {cart.length} ta mahsulot
                  </p>
                  <button
                    onClick={handleClearCart}
                    className="text-[#53585F] cursor-pointer hover:text-red-600 text-lg font-medium transition-colors"
                    type="button"
                  >
                    Hammasini o'chirish
                  </button>
                </div>
                <div className="min-h-[400px] bg-white p-6 rounded-[10px] mt-2 flex flex-col gap-3">
                  {cart.map((item, index) => (
                    <CartDesktopItem
                      key={`${item.id}-${index}`}
                      author={item.author?.fullName || "Noma'lum muallif"}
                      id={item.id}
                      imageUrl={getImage(item.photo?.prefix, item.photo?.name)}
                      name={item.name}
                      price={getPrice(item)}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              </div>

              {/* Right side - Order Summary */}
              <div className="md:w-1/3 p-8 rounded-xl bg-white h-fit md:mt-9">
                <h2 className="text-[#212121] select-none font-semibold text-lg">
                  Umumiy buyurtma
                </h2>
                <hr className="mt-6" />
                <div className="text-[#212121] mt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Kitoblar narxi</p>
                    <p className="font-bold">
                      {totalPrice?.toLocaleString() || "0"} UZS
                    </p>
                  </div>
                </div>
                <hr className="mt-6" />
                <div className="mt-6 space-y-4">
                  <div>
                    <Input
                      value={shopName}
                      onChange={handleShopNameChange}
                      placeholder="Ismingiz"
                      className="py-6 bg-[#F1F2F4] placeholder-[#212121] border-0 rounded-[10px] pl-6 placeholder:text-base focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="To'liq ism"
                    />
                    {errors.shopName && (
                      <p className="text-red-500 text-sm mt-1" role="alert">
                        {errors.shopName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="+998"
                      className="py-6 bg-[#F1F2F4] placeholder-[#212121] border-0 rounded-[10px] pl-6 placeholder:text-base focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Telefon raqam"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <p className="font-semibold">Jami</p>
                    <p className="font-bold text-[20px]">
                      {totalWithDelivery.toLocaleString()} UZS
                    </p>
                  </div>

                  <Button
                    disabled={loading || !isFormValid}
                    onClick={handleBuy}
                    className="w-full cursor-pointer bg-[#007AFF] py-6 rounded-[10px] font-medium text-[16px] mt-4 hover:bg-[#007bffd6] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Kuting..." : "Sotib olish"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden px-2 space-y-2 mt-3 pb-36">
          <h1 className="font-medium text-[#212121] text-[18px]">Savatcha</h1>
          {cart.map((item, index) => (
            <CartItem
              key={`mobile-${item.id}-${index}`}
              index={index}
              author={item.author?.fullName || "Noma'lum muallif"}
              id={item.id}
              imageUrl={getImage(item.photo?.prefix, item.photo?.name)}
              name={item.name}
              price={getPrice(item)}
              quantity={item.quantity}
            />
          ))}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {cart.length > 0 && (
        <div className="fixed sm:hidden shadow-[0_-4px_8px_0_#C0C0C01F] bottom-[4.8rem] py-3 bg-white w-full">
          <div className="container px-[24px] mb-1 mx-auto max-w-xl flex justify-between items-center">
            <div>
              <p className="text-gray-600">{cart.length} xil kitob</p>
              <h1 className="text-[#162B4C] font-semibold text-lg">
                {totalWithDelivery.toLocaleString()} so'm
              </h1>
            </div>
            <button
              onClick={handleCheckout}
              className="text-white group focus:ring-1 focus:outline-none focus:ring-blue-300 bg-[#2962FF] rounded-lg px-[16px] py-[11px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 w-1/2 justify-center transition-all duration-300"
              type="button"
            >
              Sotib olish
            </button>
          </div>
        </div>
      )}

      {/* Mobile Checkout Modal */}
      {isMobile && cart.length > 0 && (
        <CheckoutModal
          open={checkoutModal}
          handleClose={closeCheckoutModal}
          setOrdered={setOrdered}
        />
      )}
    </>
  );
};

export default Cart;
