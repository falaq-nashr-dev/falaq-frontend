import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getImage } from "../../helpers/image";
import { FaStar } from "react-icons/fa";
import { Product } from "../all-products";

const ProductCard = ({ book }: { book: Product }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  return (
    <div
      onClick={() => navigate(`/product/${book.id}`)}
      className="max-w-[165px] w-full rounded-md cursor-pointer"
    >
      <div className="max-w-[165px] flex justify-center items-center">
        {loading && (
          <div className=" w-max h-[220px] bg-gray-200 animate-pulse rounded-md"></div>
        )}
        <img
          src={getImage(book.photo.prefix, book.photo.name)}
          alt={book.name}
          className={`w-full transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
        />
      </div>
      <div className="mt-[6px]">
        <p className="line-clamp-1 font-medium">{book.name}</p>
        <div className="mt-1 flex items-center gap-x-1">
          <FaStar className="size-4 text-[#EFCB39] -mt-[2px]" />
          <p className="text-gray-600 font-medium">{book.rating}</p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="font-semibold text-lg text-[#0E1A23]">
            {book?.salePrice?.toLocaleString() || "0"} so’m
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
