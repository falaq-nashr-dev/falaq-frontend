import Header from "./components/header";
import { LuShoppingCart } from "react-icons/lu";
import { useCartStore } from "../store/useCartStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Request } from "../helpers/Request";
import { AdminBooks, Review } from "../types";
import DetailSkeleton from "../components/detail-skeleton";
import BottomNavigation from "../components/bottom-navigation";
import { getImage } from "../helpers/image";
import AboutModal from "./components/modals/about-modal";
import DescriptionModal from "./components/modals/description-modal";
import DemoModal from "./components/modals/demo-modal";
import ReviewModal from "./components/modals/review-modal";

import userLogo from "/avatar.png";

const ProductDetail = () => {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // modal states
  const [aboutOpen, setAboutOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [currentProduct, setCurrentProduct] = useState<AdminBooks | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const params = useParams();
  const navigate = useNavigate();

  // Scroll to top when the page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!params.id) {
      navigate("/");
      return;
    }
    fetchCurrentBook();
    fetchCurrentBookReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, navigate]);

  const fetchCurrentBook = async () => {
    try {
      setLoading(true);
      const { data } = await Request<AdminBooks>(
        `/products/${params.id}`,
        "GET",
        {},
        true
      );
      if (!data) {
        navigate("/");
        return;
      }
      setCurrentProduct(data);
      // Reset quantity when a new product is loaded
      setQuantity(1);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentBookReviews = async () => {
    if (!params.id) return;
    try {
      const { data } = await Request<Review[]>(
        `/product-rating/product/${params.id}`,
        "GET",
        {},
        true
      );
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const changeQuantity = (delta: number) => {
    setQuantity((prev) => {
      let newQuantity = prev + delta;
      if (newQuantity < 1) newQuantity = 1;
      if (currentProduct && newQuantity > currentProduct.quantity) {
        newQuantity = currentProduct.quantity;
      }
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (!currentProduct) {
      toast.error("Mahsulot topilmadi!");
      return;
    }
    if (currentProduct.quantity < quantity) {
      toast.error("Sotuvdagi mahsulot yetarli emas!");
      return;
    }
    addToCart(currentProduct, quantity);
    toast.success("Savatga qo'shildi");
  };

  return (
    <div className="min-h-screen bg-white pt-2 pb-20">
      <div className="container py-3 px-4 mx-auto max-w-xl min-h-[500px]">
        <Header name="Kitoblar" />
        {loading ? (
          <DetailSkeleton />
        ) : (
          <div className="mt-3 min-h-[500px] ">
            <div>
              <img
                src={
                  currentProduct?.photo
                    ? getImage(
                        currentProduct.photo.prefix,
                        currentProduct.photo.name
                      )
                    : "new.png"
                }
                alt={currentProduct?.name || "Product Image"}
                className="mx-auto w-[200px]"
              />
              <h4 className="font-semibold text-xl mt-3 text-center">
                {currentProduct?.name}
              </h4>
              <p className="text-gray-600 text-center mt-[4px]">
                {currentProduct?.author.fullName}
              </p>
              <p className="text-center text-xl mt-4 font-bold">
                {currentProduct && currentProduct.quantity === 0
                  ? "Sotuvda yo'q"
                  : currentProduct?.salePrice?.toLocaleString() + " so’m"}
              </p>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-x-3 justify-between">
                <div className="flex items-center gap-x-3">
                  <button
                    disabled={quantity <= 10}
                    onClick={() => changeQuantity(-10)}
                    className="p-2 flex justify-center items-center w-[66px] h-[49px] hover:bg-gray-200 rounded-md bg-gray-100 disabled:opacity-60 disabled:hover:bg-gray-100 text-lg font-medium"
                  >
                    -10
                  </button>
                  <button
                    disabled={quantity <= 1}
                    onClick={() => changeQuantity(-1)}
                    className="p-2 flex justify-center items-center w-[56px] h-[48px] hover:bg-gray-200 rounded-md bg-gray-100 disabled:opacity-60 disabled:hover:bg-gray-100 text-lg font-medium"
                  >
                    -1
                  </button>
                </div>

                <p className="p-2 text-gray-800 text-xl font-medium">
                  {quantity}
                </p>
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => changeQuantity(1)}
                    disabled={
                      currentProduct
                        ? quantity >= currentProduct.quantity
                        : false
                    }
                    className="p-2 flex justify-center items-center w-[56px] h-[48px] hover:bg-gray-200 rounded-md bg-gray-100 disabled:opacity-60 disabled:hover:bg-gray-100 text-lg font-medium"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => changeQuantity(10)}
                    disabled={
                      currentProduct
                        ? quantity + 10 > currentProduct.quantity
                        : false
                    }
                    className="p-2 flex justify-center items-center w-[66px] h-[49px] hover:bg-gray-200 rounded-md bg-gray-100 disabled:opacity-60 disabled:hover:bg-gray-100 text-lg font-medium"
                  >
                    +10
                  </button>
                </div>
              </div>

              {/* Add-to-cart button */}
              <button
                disabled={
                  !currentProduct ||
                  currentProduct.quantity === 0 ||
                  (currentProduct && quantity > currentProduct.quantity)
                }
                onClick={handleAddToCart}
                className="text-white group bg-[#2473F2] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-[16px] py-[9px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 text-lg justify-center mt-5 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
              >
                <LuShoppingCart className="size-5" />
                <span className="mt-[2px]">
                  {currentProduct && currentProduct.quantity === 0
                    ? "Sotuvda yo'q"
                    : (
                        (currentProduct?.salePrice ?? 0) * quantity
                      )?.toLocaleString() + " so’m"}
                </span>
              </button>
              {/* About book */}
              <button
                onClick={() => setAboutOpen(true)}
                className="group bg-[#EFEEF0] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-[16px] py-[9px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 text-lg justify-center mt-5 w-full"
              >
                Kitob haqida
              </button>
            </div>
            <h5 className="mt-4 text-[15px] text-[#212121] font-medium">
              Nima uchun bu kitobni o’qishingiz kerak?
            </h5>
            <div>
              <button
                onClick={() => setMoreOpen(true)}
                className="group bg-[#EFEEF0] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-[16px] py-[9px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 text-lg justify-center mt-3 w-full"
              >
                Batafsil
              </button>
              <button
                onClick={() => setDemoOpen(true)}
                className="group bg-[#EFEEF0] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-[16px] py-[9px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 text-lg justify-center mt-4 w-full"
              >
                Demo
              </button>
              <button
                onClick={() => setReviewOpen(true)}
                className="group bg-[#EFEEF0] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-[16px] py-[9px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2 text-lg justify-center mt-4 w-full"
              >
                Izoh qoldirish
              </button>
              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex gap-x-1 items-center">
                      <div className="w-[45px] h-[45px] border rounded-full flex justify-center items-center">
                        <img
                          src={userLogo}
                          alt="user"
                          className="w-[40px] h-[40px]"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-x-1">
                          <span className="cursor-pointer text-2xl text-yellow-400">
                            ★
                          </span>
                          <p className="mt-1">{review.rating}</p>
                        </div>
                        <h3>{review.userFullName}</h3>
                      </div>
                    </div>
                    <div className="mt-2">{review.review}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNavigation />
      <div>
        <AboutModal
          about={currentProduct?.about ?? ""}
          handleClose={() => setAboutOpen(false)}
          open={aboutOpen}
        />
        <DescriptionModal
          description={currentProduct?.description ?? ""}
          handleClose={() => setMoreOpen(false)}
          open={moreOpen}
        />
        <DemoModal
          currentBookId={params.id || ""}
          handleClose={() => setDemoOpen(false)}
          open={demoOpen}
        />
        <ReviewModal
          currentBookId={params.id || ""}
          handleClose={() => setReviewOpen(false)}
          open={reviewOpen}
          refresh={fetchCurrentBookReviews}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
