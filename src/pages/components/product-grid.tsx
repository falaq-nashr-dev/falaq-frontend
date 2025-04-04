import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ProductGridProps {
  id: string;
  name: string;
  rating: number;
  price: number;
  imageUrl: string;
}

const ProductGrid = ({
  id,
  price,
  rating,
  name,
  imageUrl,
}: ProductGridProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="flex gap-5 cursor-pointer"
    >
      <div>
        <img width={60} src={imageUrl} alt={name} />
      </div>
      <div>
        <h2 className="line-clamp-1 max-w-[300px]">{name}</h2>
        <div className="mt-1 flex items-center gap-x-1">
          <FaStar className="size-4 text-[#EFCB39]" />
          <p className="text-gray-600 font-medium">{rating}</p>
        </div>
        <p className="font-semibold text-lg text-[#0E1A23]">
          {price.toLocaleString()} so’m
        </p>
      </div>
    </div>
  );
};

export default ProductGrid;
