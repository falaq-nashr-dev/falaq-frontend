import { RiDeleteBinLine } from "react-icons/ri";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useCartStore } from "../../store/useCartStore";

interface CartItemProps {
  id: string;
  name: string;
  author: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

const CartItem = ({
  author,
  id,
  imageUrl,
  name,
  price,
  quantity,
}: CartItemProps) => {
  const { decrease, increase, removeItem } = useCartStore();
  return (
    <>
      <div className="min-h-[140px] rounded-md flex gap-5 py-4 px-1">
        <div className="h-full flex items-center gap-x-2">
          <img
            className="rounded max-w-[70px] h-[104px]"
            src={`${imageUrl}`}
            alt={name}
          />
        </div>
        <div className="w-[250px] pt-1">
          <div className="flex justify-between items-center ">
            <h5 className="line-clamp-1 text-gray-800 font-semibold">{name}</h5>
            <RiDeleteBinLine
              onClick={() => removeItem(id)}
              className="size-5 text-gray-600 hover:text-red-500 transition-all duration-200 cursor-pointer"
            />
          </div>

          <p className="line-clamp-1 mt-1 text-gray-500">{author}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-x-2 ">
              <p className="font-bold text-gray-900 text-lg mt-1">
                {price?.toLocaleString()} so’m
              </p>
            </div>
            <div className="flex items-center ">
              <button
                onClick={() => decrease(id)}
                className="p-2 flex justify-center items-center text-lg w-[32px] h-[32px] hover:bg-gray-100 rounded-md bg-gray-50"
              >
                <FaMinus className="size-3" />
              </button>
              <p className="p-2 text-gray-800">{quantity}</p>
              <button
                onClick={() => increase(id)}
                className="p-2 flex justify-center items-center text-lg w-[32px] h-[32px] hover:bg-gray-100 rounded-md bg-gray-50"
              >
                <FaPlus className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default CartItem;
