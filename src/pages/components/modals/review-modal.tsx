import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { Drawer } from "vaul";
import { Request } from "../../../helpers/Request";
import toast from "react-hot-toast";
import StarRating from "../StarRating";

interface ReviewModalProps {
  open: boolean;
  handleClose: () => void;
  currentBookId: string;
  refresh: () => Promise<void>;
}

const ReviewModal = ({
  handleClose,
  open,
  currentBookId,
  refresh,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSendReview = async () => {
    try {
      await Request(
        "/product-rating",
        "POST",
        {
          productId: currentBookId,
          rating,
          review,
        },
        true
      );
      refresh();
      handleClose();
    } catch (error) {
      console.log(typeof error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div>
      <Drawer.Root onClose={handleClose} open={open} onOpenChange={handleClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-gray-100 flex flex-col items-center rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-[200] max-w-xl mx-auto">
            <Drawer.Title className="hidden"></Drawer.Title>
            <Drawer.Description className="hidden"></Drawer.Description>

            <div className="w-full p-4 bg-white rounded-t-[10px] relative">
              {/* Handle Drawer */}
              <button
                onClick={handleClose}
                className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-gray-50 absolute top-1 right-1 group"
              >
                <CgClose className="size-4 group-hover:text-blue-500" />
              </button>
              <div
                aria-hidden
                className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-6"
              />
              <div className="h-[80vh] overflow-y-auto">
                {/* 5 star for review */}
                <StarRating onRatingChange={handleRatingChange} />
                <div>
                  <label htmlFor="content" className="font-medium mb-1"></label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    id="content"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500"
                    placeholder="Fikringizni yozib qoldiring..."
                  ></textarea>
                </div>
                <div className="flex mt-5">
                  <button
                    onClick={handleSendReview}
                    disabled={rating === 0 || review === ""}
                    type="button"
                    className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-9 py-2.5 cursor-pointer focus:outline-none disabled:opacity-60 w-full"
                  >
                    Fikr qoldirish
                  </button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default ReviewModal;
