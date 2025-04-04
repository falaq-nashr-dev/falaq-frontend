import { useState } from "react";
import toast from "react-hot-toast";
import { Request } from "../../helpers/Request";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSave = async () => {
    if (username.trim() === "" || password === "") {
      toast.error("Telefon raqam va parolni kiriting");
      return;
    }
    try {
      setLoading(true);
      const { data } = await Request<string>("/auth/login", "POST", {
        phoneNumber: username.trim(),
        password,
      });
      const token = extractToken(data);
      localStorage.setItem("token", token!);
      navigate("/admin");
    } catch (error) {
      // Ensure error is properly typed
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("Bunday telefon raqam topilmadi");
        } else if (error.response?.status === 403) {
          toast.error("Parol noto'g'ri kiritildi");
        } else {
          toast.error("Xatolik yuz berdi");
        }
      } else {
        toast.error("Noma'lum xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneFocus = () => {
    if (!username.startsWith("+998")) {
      setUsername((prev) => "+998" + prev);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="flex  min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Profilga kirish
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Phone
              </label>
              <div className="mt-2">
                <input
                  placeholder="+998..."
                  value={username}
                  onFocus={handlePhoneFocus}
                  onChange={(e) => setUsername(e.target.value)}
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="block w-full border rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  placeholder="parol..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block border w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={loading}
                type="button"
                onClick={handleSave}
                className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <CgSpinnerTwoAlt className="size-6 animate-spin" />
                ) : (
                  "Kirish"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
