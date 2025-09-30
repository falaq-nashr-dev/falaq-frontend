import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState(() => {
    const first = user?.firstName ?? "";
    const last = user?.lastName ?? "";
    return (first + " " + last).trim();
  });
  const [phone, setPhone] = useState(() => user?.phoneNumber ?? "");

  useEffect(() => {
    if (!user) return;
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    setName(fullName);
    setPhone(user.phoneNumber ?? "");
  }, [user]);

  const handleLogOut = () => {
    try {
      localStorage.removeItem("token");
    } catch {
      // ignore storage errors
    }
    navigate("/start");
  };

  return (
    <div className={"bg-white"}>
      <div className="container max-w-7xl mx-auto px-3 md:px-1 py-2 md:py-8">
        <h1 className="text-[#11142D] md:mt-2 text-lg font-bold md:text-[36px]">
          Profil Sozlamalari
        </h1>

        <div className="mt-6 max-w-[612px] sm:bg-[#F7F7F7]/85 rounded-xl p-0 xs:p-3 md:!p-6">
          <div>
            <label htmlFor="name">Ism</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Islom"
              autoComplete="name"
              className="py-5 mt-1 sm:bg-white focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="phone">Telefon raqam</label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 88 111 47 47"
              autoComplete="tel"
              inputMode="tel"
              className="py-5 mt-1 sm:bg-white focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Button
              type="button"
              className="bg-[#2962FF] w-full xs:w-auto shadow-[0_2px_6px_0_#7367f04d] hover:bg-[#2962ffdd] font-medium text-[15px] active:scale-110 transition-all duration-300"
            >
              Saqlash
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="bg-[#80839029] w-full xs:w-auto text-[#808390] hover:bg-[#80839036] font-medium text-[15px] active:scale-110 transition-all duration-300"
            >
              Bekor qilish
            </Button>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 max-w-[612px] sm:bg-[#F7F7F7]/85 rounded-xl p-0 xs:p-3 md:p-6">
          <Button
            type="button"
            onClick={handleLogOut}
            className="bg-[#FF1117] w-full xs:w-auto text-white shadow-[0_2px_6px_0_#7367f04d] hover:bg-[#ff1119d9] font-medium text-[15px] active:scale-110 transition-all duration-300"
          >
            Profildan chiqish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
