import { FaChevronLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import logoIcon from "../../assets/logo.svg";
import { LuSearch } from "react-icons/lu";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useStore } from "../../store/useStore";

const Header = ({ name }: { name: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [value, setValue] = useState("");

  const { setSearchValue, setCurrentPage } = useStore();

  return (
    <>
      <div className="flex items-center justify-between">
        {isHome ? (
          <div className="flex items-center gap-x-3">
            <img src={logoIcon} alt="logo" />
            <p className="font-medium text-lg">Falaq Nashr</p>
          </div>
        ) : (
          <div
            onClick={() => navigate(-1)}
            className="flex items-center gap-x-1 cursor-pointer"
          >
            <FaChevronLeft className="mt-[1px]" />
            <p className="font-medium text-gray-700">{name}</p>
          </div>
        )}

        <div className="flex items-center">
          {isHome &&
            (isSearchVisible ? (
              <button
                onClick={() => {
                  setValue("");
                  setSearchValue("");
                  setIsSearchVisible(false);
                }}
                aria-label="search"
                className="p-2 rounded-full hover:bg-gray-50 transition-all duration-300"
              >
                <AiOutlineClose className="size-6" />
              </button>
            ) : (
              <button
                onClick={() => setIsSearchVisible(true)}
                aria-label="search"
                className="p-2 rounded-full hover:bg-gray-50 transition-all duration-300"
              >
                <LuSearch className="size-6" />
              </button>
            ))}
        </div>
      </div>
      {isSearchVisible && (
        <div className="py-2  animate-fade-in flex items-center gap-x-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="search"
            id="search"
            className=" border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="qidirish..."
          />

          <button
            onClick={() => {
              setCurrentPage(1);
              setSearchValue(value);
            }}
            aria-label="search"
            className="p-2 rounded-full hover:bg-gray-50 transition-all duration-300"
          >
            <LuSearch className="size-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
