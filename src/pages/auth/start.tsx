import { useState } from "react";
import logo from "../../../public/brand-logo.png";
import { useNavigate } from "react-router-dom";
import { Request } from "../../helpers/Request";
import axios from "axios";

const StartPage = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const extractToken = (text: string) => {
    const prefix = "Here is your token: ";
    const startIndex = text.indexOf(prefix);

    if (startIndex !== -1) {
      return text.slice(startIndex + prefix.length).trim(); // Extracts the token after the prefix
    }

    return null;
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const { data } = await Request("/auth/register", "POST", {
        firstName: name,
        lastName: "",
        birthYear: 0,
        phoneNumber: phone,
        password: phone,
      });
      const token = extractToken(data as string);
      localStorage.setItem("token", token!);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const { data } = await Request("/auth/login", "POST", {
          phoneNumber: phone,
          password: phone,
        });
        const token = extractToken(data as string);
        localStorage.setItem("token", token!);
        navigate("/");
      } else {
        console.error("Registration error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Ism kiritish majburiy!");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhone = () => {
    const uzbPhoneRegex = /^\+998\d{9}$/;
    if (!uzbPhoneRegex.test(phone)) {
      setPhoneError("To'g'ri telefon raqam kiriting");
      return false;
    }
    setPhoneError("");
    return true;
  };

  return (
    <div className="h-screen flex py-5 overflow-y-scroll">
      <div
        className={`min-h-[440px] flex flex-col  max-w-[94%] mx-auto w-full pb-10`}
      >
        <div>
          <div className="w-max mx-auto">
            <img width={70} src={logo} alt="falaq nashr" />
          </div>
          <h5 className="text-center font-medium mt-3">
            Online do’koniga xush kelibsiz
          </h5>
          <div className="my-3">
            <label htmlFor="name">Sizning ismingiz</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validateName}
              id="name"
              type="text"
              placeholder="Islom Muhammad..."
              className={`block mt-1 w-full h-[48px] bg-gray-100 rounded-2xl pl-4 focus:outline-blue-500 ${
                nameError ? "border border-red-500" : ""
              }`}
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>
          <div className="my-2">
            <label htmlFor="phone">Sizning telefon raqamingiz</label>
            <input
              onFocus={() => {
                if (!phone) setPhone("+998");
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={validatePhone}
              id="phone"
              type="tel"
              placeholder="+998..."
              className={`block mt-1 w-full h-[48px] bg-gray-100 rounded-2xl pl-4 focus:outline-blue-500 ${
                phoneError ? "border border-red-500" : ""
              }`}
            />
            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
          </div>
          <div className="mt-6">
            <button
              disabled={loading}
              onClick={handleRegister}
              className={`w-full h-[48px] rounded-xl bg-[#007AFF] hover:opacity-80 text-white flex items-center justify-center`}
            >
              {loading ? "Yuklanmoqda..." : "Ro'yhatdan o'tish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
