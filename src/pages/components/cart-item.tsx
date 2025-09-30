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
  index: number;
}

const CartItem = ({
  author,
  id,
  imageUrl,
  name,
  price,
  quantity,
  index,
}: CartItemProps) => {
  const { decrease, increase, removeItem, cart } = useCartStore();
  return (
    <>
      <div className="rounded-md flex justify-between gap-5 py-2.5 px-1">
        <div className="h-full w-full flex  items-center gap-x-6">
          <img
            className="rounded max-w-[70px] h-[104px]"
            src={`${imageUrl}`}
            alt={name}
          />
          <div className="w-full">
            <div className="flex w-full justify-between">
              <div>
                <h5 className="line-clamp-1 text-[#212121] font-semibold">
                  {name}
                </h5>
                <p className="line-clamp-1 mt-1 text-[#6B7280]">{author}</p>
              </div>
              <RiDeleteBinLine
                onClick={() => removeItem(id)}
                className="size-5 text-gray-600 hover:text-red-500 transition-all duration-200 cursor-pointer"
              />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="font-bold text-[#0E1A23] text-lg mt-1">
                {price?.toLocaleString()} so’m
              </p>
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
      </div>
      {index + 1 !== cart.length && <hr />}
    </>
  );
};

export default CartItem;
