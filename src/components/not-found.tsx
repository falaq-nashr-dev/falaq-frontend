import { IoBookOutline } from "react-icons/io5";

const NotFound = () => {
  return (
    <div className="p-5 min-h-[140px] flex flex-col  justify-center items-center h-screen">
      <IoBookOutline className="size-11" />
      <p className="text-gray-600 font-medium text-xl mt-1">Page not found</p>
    </div>
  );
};

export default NotFound;
