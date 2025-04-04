import { FaStar } from "react-icons/fa";

const ProductGridSkeleton = () => {
  return (
    <div className="flex gap-5 animate-pulse">
      <div className="w-[60px] h-[80px] bg-gray-300 rounded"></div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-[200px] bg-gray-300 rounded"></div>
        <div className="flex items-center gap-x-1">
          <FaStar className="size-4 text-gray-300" />
          <div className="h-4 w-10 bg-gray-300 rounded"></div>
        </div>
        <div className="h-6 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ProductGridSkeleton;
