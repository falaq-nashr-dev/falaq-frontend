import { Request } from "@/helpers/Request";
import useUser from "@/hooks/use-user";
import { useCartStore } from "@/store/useCartStore";
import { useStore } from "@/store/useStore";
import { useCallback, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Drawer } from "vaul";

interface CheckoutModalProps {
  open: boolean;
  handleClose: () => void;
  setOrdered: (val: boolean) => void;
}

interface FormErrors {
  phone: string;
  shopName: string;
}

interface OrderProduct {
  productId: string | number;
  amount: number;
}

const CheckoutModal = ({
  handleClose,
  open,
  setOrdered,
}: CheckoutModalProps) => {
  const { phoneNumber, setSelectedPhone, shopName, setSelectedShopName } =
    useStore();
  const { cart, clearCart } = useCartStore();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    phone: "",
    shopName: "",
  });

  // Memoize cart validation to prevent unnecessary re-renders
  const hasValidCart = useMemo(() => cart.length > 0, [cart.length]);

  // Initialize user data when user changes
  useEffect(() => {
    if (user?.phoneNumber && user?.firstName && user?.lastName) {
      setSelectedPhone(user.phoneNumber);
      setSelectedShopName(`${user.firstName} ${user.lastName}`);
    }
  }, [
    user?.phoneNumber,
    user?.firstName,
    user?.lastName,
    setSelectedPhone,
    setSelectedShopName,
  ]);

  // Validate phone number format
  const validatePhone = useCallback((phone: string): boolean => {
    // Remove '+' and check if it's exactly 12 digits starting with 998
    const cleanPhone = phone.replace(/^\+/, "");
    return /^998\d{9}$/.test(cleanPhone);
  }, []);

  // Validate shop name
  const validateShopName = useCallback((name: string): boolean => {
    return name.trim().length >= 2; // Minimum 2 characters
  }, []);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");

      // Ensure it always starts with '998'
      if (!value.startsWith("998")) {
        value = "998";
      }

      // Limit to 12 digits maximum
      if (value.length > 12) {
        value = value.slice(0, 12);
      }

      const formattedPhone = `+${value}`;
      setSelectedPhone(formattedPhone);

      // Update error state
      setErrors((prev) => ({
        ...prev,
        phone: validatePhone(formattedPhone)
          ? ""
          : "Telefon raqam noto'g'ri formatda",
      }));
    },
    [setSelectedPhone, validatePhone]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSelectedShopName(value);

      // Update error state
      setErrors((prev) => ({
        ...prev,
        shopName: validateShopName(value) ? "" : "Kamida 2 ta harf kiriting",
      }));
    },
    [setSelectedShopName, validateShopName]
  );

  // Validate form before submission
  const validateForm = useCallback((): FormErrors => {
    return {
      phone: validatePhone(phoneNumber)
        ? ""
        : "Telefon raqam noto'g'ri formatda",
      shopName: validateShopName(shopName) ? "" : "Kamida 2 ta harf kiriting",
    };
  }, [phoneNumber, shopName, validatePhone, validateShopName]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return validatePhone(phoneNumber) && validateShopName(shopName);
  }, [phoneNumber, shopName, validatePhone, validateShopName]);

  const handleCheckout = useCallback(async () => {
    // Prevent multiple submissions
    if (loading) return;

    const formErrors = validateForm();
    setErrors(formErrors);

    // Check if there are any errors
    if (Object.values(formErrors).some((error) => error !== "")) {
      return;
    }

    // Validate cart has items
    if (!hasValidCart) {
      toast.error("Savat bo'sh");
      return;
    }

    try {
      setLoading(true);

      // Prepare order data
      const orderProducts: OrderProduct[] = cart
        .filter((item) => item?.id && item?.quantity > 0) // Filter valid items
        .map((item) => ({
          productId: item.id,
          amount: item.quantity,
        }));

      if (orderProducts.length === 0) {
        toast.error("Buyurtma uchun yaroqli mahsulotlar topilmadi");
        return;
      }

      await Request(
        "/orders",
        "POST",
        {
          products: orderProducts,
          customerPhoneNumber: phoneNumber,
          customerFullName: shopName.trim(),
        },
        true
      );

      // Success actions
      toast.success("Buyurtma muvaffaqiyatli yuborildi!");
      setOrdered(true);
      clearCart();
      handleClose();
    } catch (error) {
      console.error("Checkout error:", error);

      // More specific error handling
      if (error instanceof Error) {
        toast.error(`Xatolik: ${error.message}`);
      } else {
        toast.error("Xatolik yuz berdi. Keyinroq urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    validateForm,
    hasValidCart,
    cart,
    phoneNumber,
    shopName,
    clearCart,
    handleClose,
    setOrdered,
  ]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, loading, handleClose]);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(isOpen) => !isOpen && !loading && handleClose()}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[199]" />
        <Drawer.Content className="bg-gray-100 flex flex-col h-screen items-center rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 outline-none z-[200] max-w-xl mx-auto">
          <Drawer.Title className="sr-only">Buyurtmani tasdiqlash</Drawer.Title>
          <Drawer.Description className="sr-only">
            Buyurtmani tasdiqlash uchun telefon raqam va ismingizni kiriting
          </Drawer.Description>

          <div className="w-full h-full p-4 border bg-white rounded-t-[10px] flex flex-col">
            {/* Handle bar */}
            <div
              aria-hidden="true"
              className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-6 flex-shrink-0"
            />

            {/* Form content */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-5">
                {/* Phone Number Input */}
                <div>
                  <label className="block font-medium mb-1" htmlFor="phone">
                    Telefon raqam *
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    id="phone"
                    type="tel"
                    placeholder="+998"
                    disabled={loading}
                    autoComplete="tel"
                    className={`block w-full h-[48px] bg-gray-100 rounded-2xl px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.phone ? "ring-2 ring-red-500" : ""
                    }`}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p
                      id="phone-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Full Name Input */}
                <div>
                  <label className="block font-medium mb-1" htmlFor="name">
                    To'liq ism *
                  </label>
                  <input
                    value={shopName}
                    onChange={handleNameChange}
                    id="name"
                    type="text"
                    placeholder="Ismingizni kiriting"
                    disabled={loading}
                    autoComplete="name"
                    className={`block w-full h-[48px] bg-gray-100 rounded-2xl px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.shopName ? "ring-2 ring-red-500" : ""
                    }`}
                    aria-invalid={!!errors.shopName}
                    aria-describedby={
                      errors.shopName ? "name-error" : undefined
                    }
                  />
                  {errors.shopName && (
                    <p
                      id="name-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.shopName}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button - Fixed at bottom */}
              <div className="pt-4 pb-safe">
                <button
                  onClick={handleCheckout}
                  disabled={!isFormValid || loading}
                  type="button"
                  className={`w-full bg-[#348AEC] text-white font-medium rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px] ${
                    !isFormValid || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#2c7bd4] active:bg-[#2470c7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }`}
                  aria-label={
                    loading ? "Buyurtma yuklanmoqda" : "Buyurtmani tasdiqlash"
                  }
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : (
                    "Tasdiqlash"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default CheckoutModal;
