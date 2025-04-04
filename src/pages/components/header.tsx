import { BsCart3 } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import logoIcon from "../../assets/logo.svg";
import { LuSearch } from "react-icons/lu";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useStore } from "../../store/useStore";

const Header = ({ name }: { name: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const isHome = location.pathname === "/";
  const isDetail = location.pathname.startsWith("/product/");
  const isProfile = location.pathname.startsWith("/profile");
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

          {!isProfile && !isDetail && (
            <Link to="/cart">
              <button className="p-2 rounded-full hover:bg-gray-50 transition-all duration-300 relative">
                <BsCart3 className="size-6 text-gray-800" />
                {cart?.length ? (
                  <div className="w-5 h-5 flex justify-center items-center rounded-full text-xs bg-blue-500 text-white absolute top-0 right-0">
                    {cart.length}
                  </div>
                ) : null}
              </button>
            </Link>
          )}
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
