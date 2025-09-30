import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
interface CartDesktopItemProps {
  id: string;
  name: string;
  author: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

const CartDesktopItem = ({
  author,
  imageUrl,
  name,
  price,
  quantity,
  id,
}: CartDesktopItemProps) => {
  const { decrease, increase, removeItem } = useCartStore();

  return (
    <div className="p-4 rounded-[10px] border border-[#E0E2E5] flex justify-between items-center gap-4">
      <div className="flex items-center gap-5">
        <img width={75} src={imageUrl} alt="" />
        <div>
          <h4 className="text-[#11142D] text-lg font-bold line-clamp-1">
            {name}
          </h4>
          <p className="text-[#11142D] text-base font-medium mt-1.5 line-clamp-1">
            {author}
          </p>
          <p className="text-[#207BBE] font-bold mt-3 text-lg">
            {price?.toLocaleString()} UZS
          </p>
        </div>
      </div>
      <div>
        <p className="text-[#207BBE] text-lg font-bold">
          {(price * quantity)?.toLocaleString()} UZS
        </p>
        <div className="flex items-center gap-6 mt-6">
          <div className="w-[120px] p-3 h-[40px] rounded-[8px] border border-[#E0E2E5] flex justify-between items-center">
            <Minus
              onClick={() => decrease(id)}
              className="size-5 cursor-pointer active:scale-125 transition-all duration-300"
            />
            <p className="text-[#212121] text-[15px] select-none">{quantity}</p>
            <Plus
              onClick={() => increase(id)}
              className="size-5 cursor-pointer active:scale-125 transition-all duration-300"
            />
          </div>
          <Trash2
            onClick={() => removeItem(id)}
            className="size-5 cursor-pointer hover:text-red-500 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default CartDesktopItem;
