import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const NavNavigate = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(-1)}
      className="min-h-[40px] px-1 bg-white flex items-center  ml-1 cursor-pointer xs:hidden"
    >
      <Button
        size={"icon"}
        className="rounded-full bg-gray-200 hover:bg-gray-200/70"
      >
        <FaChevronLeft className="size-4 text-gray-600" />
      </Button>
    </div>
  );
};

export default NavNavigate;
