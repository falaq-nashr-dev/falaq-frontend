import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const formatUZS = (value: number) =>
  new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  })
    .format(value)
    // Optional: replace UZS with "so’m" if you prefer that suffix
    .replace("UZS", "")
    .trim() + " so’m";

interface NewCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  addToCart: () => void;
}

const NewCard = ({ imageUrl, price, title, id, addToCart }: NewCardProps) => {
  const navigate = useNavigate();

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addToCart();
    toast.success("Savatga qo'shildi");
  };

  return (
    <div onClick={() => navigate(`/product/${id}`)} className="cursor-pointer">
      <div className="w-[360px] max-w-full">
        {/* Card */}
        <div className="rounded-3xl bg-white ring-black/5">
          {/* Image area */}
          <div className="rounded-xl sm:rounded-3xl bg-[#F7F7F7] h-[200px] xs:h-[240px] sm:!h-[300px] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={title}
              className="h-40 xs:h-48 sm:h-52 md:h-60 lg:!h-64 object-contain rounded-lg sm:rounded-xl drop-shadow-sm"
            />
          </div>

          {/* Title */}
          <h3 className="mt-2 text-[17px] line-clamp-1 leading-8 text-gray-900">
            {title}
          </h3>

          {/* Price */}
          <div className="mt-4 flex items-end gap-2">
            <span className="text-base leading-none font-semibold text-[#212121] tracking-tight">
              {formatUZS(price)}
            </span>
          </div>

          {/* add to cart button */}
          <button
            onClick={handleAdd}
            className="mt-5 sm:mt-6 w-full rounded-2xl bg-[#348AEC]/15 text-[#348AEC] text-base font-medium h-[46px] transition-colors hover:bg-blue-200/75"
          >
            Savatga qo'shish
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCard;
