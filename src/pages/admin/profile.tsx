import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../helpers/Request";
import { CgSpinnerTwoAlt } from "react-icons/cg";

type Response = {
  success: boolean;
  id: string;
};

const Profile = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (username.trim() === "" || password === "") {
      toast.error("Telefon raqam va parolni kiriting");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put<Response>(
        `${BASE_URL}/admin?token=${localStorage.getItem("token")}`,
        {
          username,
          password,
          oldPassword,
        }
      );
      toast.success("Parol muvaffaqiyatli o'zgartirildi");
      setUsername("");
      setPassword("");
      setOldPassword("");
      localStorage.setItem("token", data.id);
    } catch (error) {
      // Ensure error is properly typed
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("Telefon raqam noto'g'ri");
        } else if (error.response?.status === 401) {
          toast.error("Oldingi parol noto'g'ri");
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

  return (
    <div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Telefon raqam
            </label>
            <div className="mt-2">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="phone number..."
                className="block w-full border rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password_old"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Oldingi parol
              </label>
            </div>
            <div className="mt-2">
              <input
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                id="password_old"
                name="password"
                type="password"
                required
                placeholder="old password..."
                autoComplete="current-password"
                className="block border w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Yangi parol
              </label>
            </div>
            <div className="mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
                placeholder="new password..."
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
                "O'zgartirish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
