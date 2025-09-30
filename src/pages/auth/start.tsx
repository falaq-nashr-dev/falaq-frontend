import { useState } from "react";
import logo from "../../../public/images/signup.svg";
import { Link, useNavigate } from "react-router-dom";
import { Request } from "../../helpers/Request";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "../components/logo";
import falaqLogo from "../../../public/images/logo.svg";

const StartPage = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedError, setIsCheckedError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const extractToken = (text: string) => {
    const prefix = "Here is your token: ";
    const startIndex = text.indexOf(prefix);
    return startIndex !== -1
      ? text.slice(startIndex + prefix.length).trim()
      : null;
  };

  const handleRegister = async () => {
    if (!validateName() || !validatePhone() || !validateCheckbox()) return;

    try {
      setLoading(true);
      const { data } = await Request("/auth/register", "POST", {
        firstName: name,
        lastName: "",
        birthYear: 0,
        phoneNumber: phone.trim(),
        password: phone.trim(),
      });

      const token = extractToken(data as string);
      if (token) {
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        console.error("No token found in response");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        // User already exists → login
        const { data } = await Request("/auth/login", "POST", {
          phoneNumber: phone.trim(),
          password: phone.trim(),
        });
        const token = extractToken(data as string);
        if (token) {
          localStorage.setItem("token", token);
          navigate("/");
        }
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

  const validateCheckbox = () => {
    if (!isChecked) {
      setIsCheckedError("Shartlarga rozilik bildirish majburiy!");
      return false;
    }
    setIsCheckedError("");
    return true;
  };

  return (
    <div className="h-screen flex lg:flex-row items-center p-4 md:p-[10px] gap-5">
      {/* Left side image */}
      <div className="w-full max-w-[705px] h-auto md:h-full rounded-[16px] bg-[#7BCFEB] justify-center items-center hidden md:flex relative">
        <div className="absolute top-6 left-7">
          <Logo />
        </div>
        <img alt="image" src={logo} width={400} height={400} />
      </div>

      {/* Right side form */}
      <div className="w-full h-full flex justify-center items-center">
        <div className="max-w-[24rem] w-full">
          <div className="mb-8 md:hidden mx-auto flex flex-col items-center">
            <img width={100} src={falaqLogo} alt="Falaq Nashr" />
            <h1 className="font-semibold text-xl mt-1">Falaq Nashr</h1>
          </div>
          <h1 className="text-center text-gray-900 font-semibold text-xl md:text-2xl">
            Kirish
          </h1>

          {/* Name Input */}
          <div className="mt-1">
            <label htmlFor="name" className="text-gray-700 text-sm">
              Ism
            </label>
            <Input
              id="name"
              placeholder="Ismingizni kiriting"
              className="mt-2 py-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1">{nameError}</p>
            )}
          </div>

          {/* Phone Input */}
          <div className="mt-3">
            <label htmlFor="phone" className="text-gray-700 text-sm">
              Telefon raqam
            </label>
            <Input
              id="phone"
              placeholder="+998"
              className="mt-2 py-6"
              onFocus={() => {
                if (!phone) setPhone("+998");
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          {/* Terms */}
          <div className="mt-3">
            <label htmlFor="term" className="flex items-start gap-3">
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(Boolean(checked))}
                id="term"
                className="data-[state=checked]:bg-[#007AFF] data-[state=checked]:border-[#007AFF] w-5 h-5 mt-[2px]"
              />
              <span className="select-none">
                I have read and agree to the{" "}
                <Link className="text-[#007AFF]" to={""}>
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link to={""} className="text-[#007AFF]">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {isCheckedError && (
              <p className="text-red-500 text-xs mt-1">{isCheckedError}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-[#007AFF] hover:bg-[#007bffe5] active:scale-95 transition-all duration-300 cursor-pointer py-7 mt-10 font-bold text-[15px]"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Yuklanmoqda..." : "Tizimga kirish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
