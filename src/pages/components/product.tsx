import { getImage } from "@/helpers/image";
import { AdminBooks } from "@/types";
import { useNavigate } from "react-router-dom";

const Product = ({ book }: { book: AdminBooks; isLiked?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${book.id}`)}
      className="w-full rounded-xl cursor-pointer hover:scale-[101%] transition-transform duration-300"
    >
      {/* Image wrapper */}
      <div className="relative flex justify-center items-center w-full aspect-[3/4] bg-[#F7F7F7] rounded-lg overflow-hidden">
        <img
          src={getImage(book.photo.prefix, book.photo.name)}
          alt="Book Cover"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Texts */}
      <div className="mt-2">
        <p className="line-clamp-1 text-base sm:text-lg font-semibold">
          {book.name}
        </p>
        <p className="text-[#7C7C7C] text-xs sm:text-sm line-clamp-1">
          {book.author.fullName}
        </p>
        <p className="font-bold text-[#207BBE] text-base sm:text-xl mt-1">
          {book.salePrice?.toLocaleString()} so’m
        </p>
      </div>
    </div>
  );
};

export default Product;
