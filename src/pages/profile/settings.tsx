import { useRef, useState, useEffect } from "react";
import BottomNavigation from "../../components/bottom-navigation";
import Header from "../components/header";
import useUser from "../../hooks/use-user";

const Settings = () => {
  const { loading, user } = useUser();
  const phoneRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [nameError, setNameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  // Function to validate Uzbek phone number (+998XXXXXXXXX)
  const isValidUzbekPhone = (phone: string): boolean => {
    const uzbPhoneRegex = /^\+998\d{9}$/;
    return uzbPhoneRegex.test(phone);
  };

  const isValidName = (name: string): boolean =>
    /^[A-Za-zА-Яа-яЎўҚқҒғҲҳ']+$/.test(name);

  // Fill input fields with user details if logged in
  useEffect(() => {
    if (!loading && user) {
      if (phoneRef.current) {
        phoneRef.current.value = user.phoneNumber || "+998";
      }
      if (nameRef.current) {
        nameRef.current.value = user.firstName || "";
      }
    }
  }, [loading, user]);

  // Handle form submission
  const handleSave = () => {
    const phoneValue = phoneRef.current?.value.trim() || "";
    const nameValue = nameRef.current?.value.trim() || "";

    let valid = true;

    if (!isValidName(nameValue)) {
      setNameError("Ismingizni to‘liq kiriting!");
      valid = false;
    } else {
      setNameError("");
    }

    if (!isValidUzbekPhone(phoneValue)) {
      setPhoneError("Telefon raqam noto‘g‘ri!");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (!valid) return;

    console.log("Saved data:", { phone: phoneValue, name: nameValue });
    // Here, you can proceed with form submission (e.g., API call)
  };

  // Handle phone input focus to set default "+998"
  const handlePhoneFocus = () => {
    if (phoneRef.current && phoneRef.current.value === "") {
      phoneRef.current.value = "+998";
    }
  };

  // Handle phone input change to prevent removing "+998"
  const handlePhoneChange = () => {
    if (phoneRef.current && !phoneRef.current.value.startsWith("+998")) {
      phoneRef.current.value = "+998";
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
              Sizning telefon raqamingiz
            </label>
            <input
              ref={phoneRef}
              id="phone"
              type="tel"
              placeholder="+998"
              className="block mt-1 w-full h-[48px] bg-gray-100 rounded-2xl pl-4 focus:outline-blue-500"
              onFocus={handlePhoneFocus}
              onChange={handlePhoneChange}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
          {/* Full Name Input */}
          <div>
            <label className="font-medium" htmlFor="name">
              Sizning ismingiz
            </label>
            <input
              ref={nameRef}
              id="name"
              type="text"
              placeholder="Islom Muhammad"
              className="block mt-1 w-full h-[48px] bg-gray-100 rounded-2xl pl-4 focus:outline-blue-500"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="fixed w-full bottom-[102px]">
        <div className="container max-w-xl mx-auto px-4">
          <button
            onClick={handleSave}
            className="text-[#3ABC0B] w-full bg-[#3ABC0B1A] focus:ring-1 focus:outline-none focus:ring-green-300 rounded-xl px-[16px] py-[10px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 justify-center transition-all duration-300"
          >
            Saqlash
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Settings;
