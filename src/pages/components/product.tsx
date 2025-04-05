import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { HomeBook } from "../../types";
import { getImage } from "../../helpers/image";

const Product = ({ book }: { book: HomeBook }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  return (
    <div
      onClick={() => navigate(`/product/${book.id}`)}
      className="max-w-[145px] flex-shrink-0 w-full rounded-md cursor-pointer"
    >
      <div className="max-w-[165px]  flex justify-center items-center">
        {loading && (
          <div className="w-max h-[220px]  bg-gray-200 animate-pulse rounded-md"></div>
        )}
        <img
          onLoad={() => setLoading(false)}
          src={
            book.photo
              ? getImage(book.photo.prefix, book.photo.name)
              : "new.png"
          }
          alt="book image"
          className={`w-full h-full transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
      <div className="mt-[6px]">
        <p className="line-clamp-1 font-medium text-[15px]">{book.name}</p>
        <div className="mt-1 flex items-center gap-x-1">
          <FaStar className="size-4 -mt-1 text-[#EFCB39]" />
          <p className="text-gray-600 text-[13px] font-medium">{book.rating}</p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="font-semibold text-[15px] text-[#0E1A23]">
            {book.salePrice?.toLocaleString() || "0"} so’m
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
