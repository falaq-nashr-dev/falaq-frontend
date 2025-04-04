import { useEffect, useState } from "react";
import logo from "../../../public/logo.svg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Request } from "../../helpers/Request";
import axios from "axios";

const StartPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const extractToken = (text: string) => {
    const prefix = "Here is your token: ";
    const startIndex = text.indexOf(prefix);

    if (startIndex !== -1) {
      return text.slice(startIndex + prefix.length).trim(); // Extracts the token after the prefix
    }

    return null;
  };

  useEffect(() => {
    const registerAndNavigate = async () => {
      if (currentStep === 4) {
        await handleRegister();
        setCurrentStep(1);
        navigate("/");
      }
    };

    registerAndNavigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, navigate]);

  const handleRegister = async () => {
    try {
      const { data } = await Request("/auth/register", "POST", {
        firstName: name,
        lastName: "",
        birthYear: 0,
        phoneNumber: phone,
        password: phone,
      });
      const token = extractToken(data as string);
      localStorage.setItem("token", token!);
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

  const handleNext = () => {
    if (currentStep === 2 && !validateName()) return;
    if (currentStep === 3 && !validatePhone()) return;
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="h-screen flex items-end">
      <div className="min-h-[440px] flex flex-col justify-between max-w-[94%] mx-auto w-full pb-10">
        {currentStep === 1 && (
          <div>
            <div className="w-max mx-auto">
              <img width={110} src={logo} alt="falaq nashr" />
            </div>
            <h5 className="text-center font-medium mt-6">
              Falaq Nashr <br /> Online do’koniga xush kelibsiz
            </h5>
          </div>
        )}
        {currentStep === 2 && (
          <div className="min-h-[370px]">
            <h2 className="font-medium text-[26px]">
              Assalomu alaykum! <br /> Keling tanishib olamiz,
              <br />
              mening ismim Islom, siznikichi?
            </h2>
          </div>
        )}
        {currentStep === 3 && (
          <div className="min-h-[370px]">
            <h2 className="font-medium text-[26px]">
              Mening telefon raqamim <br />
              +998 88 111 4747, <br />
              siznikichi?
            </h2>
          </div>
        )}
        <div className={`mt-5`}>
          {currentStep === 2 && (
            <div className="mb-5">
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
          )}
          {currentStep === 3 && (
            <div className="mb-5">
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
              {phoneError && (
                <p className="text-red-500 text-sm">{phoneError}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between max-w-[400px] mx-auto w-full">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className={`w-[48px] h-[48px] rounded-full border border-[#007AFF] hover:bg-gray-50 flex items-center justify-center ${
                currentStep == 1 && "invisible"
              }`}
            >
              <FaArrowLeft className="size-4 text-[#007AFF]" />
            </button>
            <div className="min-h-[40px] flex justify-center items-center gap-1 max-w-[100px]  w-full">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`${
                    currentStep === step
                      ? "w-[12px] h-[12px] bg-[#007AFF]"
                      : "w-[8px] h-[8px] opacity-15 bg-[#007AFF]"
                  } rounded-full`}
                ></div>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-[48px] h-[48px] rounded-full hover:bg-opacity-80 bg-[#007AFF] flex items-center justify-center"
            >
              <FaArrowRight className="size-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
