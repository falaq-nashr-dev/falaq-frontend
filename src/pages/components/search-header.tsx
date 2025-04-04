import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const SearchHeader = () => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate("/all-products")} className="relative">
      <LuSearch className="size-5 text-gray-600 absolute top-1/2 -translate-y-1/2 left-3" />
      <input
        id="search"
        type="text"
        placeholder="Qidirish..."
        className={`block mt-1 w-full h-[48px] bg-gray-100 rounded-xl pl-10 focus:outline-none `}
      />
    </div>
  );
};

export default SearchHeader;
