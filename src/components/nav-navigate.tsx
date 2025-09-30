import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface NavNavigateProps {
  name: string;
}

const NavNavigate = ({ name }: NavNavigateProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(-1)}
      className="min-h-[40px] px-1 bg-white flex items-center  ml-1 cursor-pointer"
    >
      <FaChevronLeft className="size-4 text-gray-600" />
      <p className="font-semibold text-lg">{name}</p>
    </div>
  );
};

export default NavNavigate;
