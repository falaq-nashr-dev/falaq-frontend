import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Drawer } from "vaul";

import { Request } from "@/helpers/Request";
import useUser from "@/hooks/use-user";
import { useCartStore } from "@/store/useCartStore";
import { useStore } from "@/store/useStore";

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

// --- Helpers outside component (re-create bo'lmaydi har renderda) ---
const extractToken = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const prefix = "Here is your token: ";
  const startIndex = raw.indexOf(prefix);
  return startIndex !== -1
    ? raw.slice(startIndex + prefix.length).trim()
    : null;
};

// Telefon raqam formatini tekshirish
const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/^\+/, "");
  return /^998\d{9}$/.test(cleanPhone);
};

// F.I.Sh validatsiya
const isValidShopName = (name: string): boolean => {
  return name.trim().length >= 2;
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  handleClose,
  open,
  setOrdered,
}) => {
  const { phoneNumber, setSelectedPhone, shopName, setSelectedShopName } =
    useStore();
  const { cart, clearCart } = useCartStore();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    phone: "",
    shopName: "",
  });

  const hasValidCart = useMemo(() => cart.length > 0, [cart.length]);

  // User o'zgarganda formani avtomatik to'ldirish
  useEffect(() => {
    if (user?.phoneNumber && user?.firstName && user?.lastName) {
      setSelectedPhone(user.phoneNumber);
      setSelectedShopName(`${user.firstName} ${user.lastName}`);
    }
  }, [user, setSelectedPhone, setSelectedShopName]);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");

      // Har doim 998 bilan boshlansin
      if (!value.startsWith("998")) {
        value = "998" + value.replace(/^998/, "");
      }

      // 12 ta raqamdan oshmasin (+ bilan 13 belgiga teng bo'ladi)
      if (value.length > 12) {
        value = value.slice(0, 12);
      }

      const formattedPhone = `+${value}`;
      setSelectedPhone(formattedPhone);

      setErrors((prev) => ({
        ...prev,
        phone: isValidPhone(formattedPhone)
          ? ""
          : "Telefon raqam noto'g'ri formatda",
      }));
    },
    [setSelectedPhone]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSelectedShopName(value);

      setErrors((prev) => ({
        ...prev,
        shopName: isValidShopName(value) ? "" : "Kamida 2 ta harf kiriting",
      }));
    },
    [setSelectedShopName]
  );

  const validateForm = useCallback(
    (): FormErrors => ({
      phone: isValidPhone(phoneNumber)
        ? ""
        : "Telefon raqam noto'g'ri formatda",
      shopName: isValidShopName(shopName) ? "" : "Kamida 2 ta harf kiriting",
    }),
    [phoneNumber, shopName]
  );

  const isFormValid = useMemo(
    () => isValidPhone(phoneNumber) && isValidShopName(shopName),
    [phoneNumber, shopName]
  );

  // ✅ Auth'dan keyingi redirect helper
  const redirectAfterAuth = useCallback(
    (token: string) => {
      localStorage.setItem("token", token);

      const state = location.state as
        | {
            from?: string;
            pendingOrder?: { phoneNumber?: string; shopName?: string };
          }
        | undefined
        | null;

      const from = state?.from || "/";
      const pendingOrder = state?.pendingOrder;

      navigate(from, {
        replace: true,
        state: pendingOrder ? { pendingOrder } : undefined,
      });
    },
    [location.state, navigate]
  );

  // ✅ Register or login user (bir martalik helper)
  const registerOrLogin = useCallback(
    async (phone: string, name: string): Promise<boolean> => {
      try {
        // 1) Register qilishga harakat
        const { data } = await Request("/auth/register", "POST", {
          firstName: name,
          lastName: "",
          birthYear: 0,
          phoneNumber: phone.trim(),
          password: phone.trim(),
        });

        const token = extractToken(data);
        if (token) {
          redirectAfterAuth(token);
          return true;
        }

        console.error("No token found in registration response");
        return false;
      } catch (error) {
        // 2) Agar 400 bo'lsa → user mavjud, login qilamiz
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          try {
            const { data } = await Request("/auth/login", "POST", {
              phoneNumber: phone.trim(),
              password: phone.trim(),
            });

            const token = extractToken(data);
            if (token) {
              redirectAfterAuth(token);
              return true;
            }

            console.error("No token found in login response");
            return false;
          } catch (loginError) {
            console.error("Login error:", loginError);
            return false;
          }
        }

        console.error("Registration error:", error);
        return false;
      }
    },
    [redirectAfterAuth]
  );

  const handleCheckout = useCallback(async () => {
    if (loading) return;

    const formErrors = validateForm();
    setErrors(formErrors);

    // Agar validatsiyada xato bo'lsa
    if (Object.values(formErrors).some((error) => error !== "")) {
      return;
    }

    if (!hasValidCart) {
      toast.error("Savat bo'sh");
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        const success = await registerOrLogin(phoneNumber, shopName.trim());
        if (!success) {
          toast.error("Avval ro'yhatdan o'tish kerak.");
          return;
        }
      }

      const orderProducts: OrderProduct[] = cart
        .filter((item) => item?.id && item?.quantity > 0)
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

      toast.success("Buyurtma muvaffaqiyatli yuborildi!");
      setOrdered(true);
      clearCart();
      handleClose();
    } catch (error) {
      console.error("Checkout error:", error);
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
    user,
    registerOrLogin,
    cart,
    phoneNumber,
    shopName,
    setOrdered,
    clearCart,
    handleClose,
  ]);

  // ESC bosganda modalni yopish (loading bo'lsa yopilmaydi)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loading, handleClose]);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !loading) {
          handleClose();
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[199]" />
        <Drawer.Content className="bg-gray-100 flex flex-col h-[98vh] items-center rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 outline-none z-[200] max-w-xl mx-auto">
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

            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-5">
                {/* Full Name Input */}
                <div>
                  <label className="block font-medium mb-1" htmlFor="name">
                    To&apos;liq ism *
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
              </div>

              {/* Submit Button */}
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
