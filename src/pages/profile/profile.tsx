import { TbLogout } from "react-icons/tb";
import Header from "../components/header";
import BottomNavigation from "../../components/bottom-navigation";
import logo from "/avatar.png";
import { FiChevronRight, FiPhone } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../../hooks/use-user";
import { formatUzbekPhoneNumber } from "../../helpers/phone";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/start");
  };

  return (
    <div className="min-h-screen bg-white py-2">
      <div className="container py-3 px-4 mx-auto max-w-xl min-h-[500px]">
        <Header name="Profil" />
        <div className="mt-5">
          <div className="mx-auto">
            <div className="w-[80px] h-[80px] rounded-full bg-gray-300 mx-auto flex justify-center items-center">
              <img width={80} src={logo} alt="logo" />
            </div>
            <h4 className="font-semibold text-[18px] text-center mt-4">
              {user ? user?.firstName + user?.lastName : "Ism Familiya"}
            </h4>
            <p className="text-[12px] text-[#212121] mt-[4px] text-center">
              {user
                ? formatUzbekPhoneNumber(user.phoneNumber)
                : "+998 95 0990337"}
            </p>
          </div>
          <div className="mt-10 min-h-[200px]">
            <Link target="_blank" to={`https://t.me/Falaq_nashr_admin`}>
              <div className="h-[48px] flex items-center justify-between mx-auto bg-[#F4F5F7] cursor-pointer hover:opacity-90 rounded-xl px-[20px] py-[14px]">
                <div className="flex items-center gap-2">
                  <FiPhone className="size-5" />
                  <p className="font-medium text-[#212121]">Biz bilan aloqa</p>
                </div>
                <div>
                  <FiChevronRight className="size-5" />
                </div>
              </div>
            </Link>

            {/* <div
              onClick={() => navigate("/profile/settings")}
              className="h-[48px] mt-4 flex items-center justify-between mx-auto bg-[#F4F5F7] rounded-xl px-[20px] py-[14px] cursor-pointer hover:opacity-90"
            >
              <div className="flex items-center gap-2">
                <IoSettingsOutline className="size-5" />
                <p className="font-medium text-[#212121]">Sozlamalar</p>
              </div>
              <div>
                <FiChevronRight className="size-5" />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Log out Button */}
      <div className="fixed w-full bottom-[102px]">
        <div className="container max-w-xl mx-auto px-4">
          <button
            onClick={handleLogOut}
            className={`text-[#FF4C51] w-full bg-[#ff4c5227] focus:ring-1 focus:outline-none focus:ring-red-300 rounded-xl px-[16px] py-[10px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 justify-center transition-all duration-300 `}
          >
            <TbLogout className="size-5" />
            Chiqish
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Profile;
