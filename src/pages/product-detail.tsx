import { useCartStore } from "../store/useCartStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Request } from "../helpers/Request";
import { AdminBooks, Review } from "../types";
import { getImage } from "../helpers/image";

import reviewLogo from "../../public/chat.svg";

import { Button } from "@/components/ui/button";
import { IoBookOutline } from "react-icons/io5";
import { PiBookOpenUserLight, PiNotebook } from "react-icons/pi";
import RatingStar from "./components/rating-star";
import { ChevronRight, Minus, Plus, X } from "lucide-react";
import { FiExternalLink, FiShoppingCart } from "react-icons/fi";
import ReviewItem from "./components/review-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StarRating from "./components/StarRating";
import EmptyReviews from "./components/empty-reviews";
import ModalDrawer from "@/components/modal-drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import BookDemo from "./components/book-demo";
import { CgSpinner } from "react-icons/cg";

const ProductDetail = () => {
  const { addToCart } = useCartStore();
  const isMobile = useMediaQuery("(max-width: 500px)");

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  // console.log(loading);

  // modal states
  const [aboutOpen, setAboutOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [currentProduct, setCurrentProduct] = useState<AdminBooks | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

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

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSendReview = async () => {
    if (rating == 0 || !review) {
      toast.error("Iltimos sharh maydonlarini to'ldiring");
      return;
    }
    try {
      await Request(
        "/product-rating",
        "POST",
        {
          productId: currentProduct?.id,
          rating,
          review,
        },
        true
      );
      fetchCurrentBookReviews();
      fetchCurrentBook();
      clearForm();
    } catch (error) {
      console.log(typeof error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const clearForm = () => {
    setReviewOpen(false);
    setReview("");
    setRating(0);
  };

  if (loading) {
    return (
      <div className="h-[10rem] flex justify-center items-center">
        <div className="text-center flex flex-col items-center gap-2">
          <CgSpinner className="size-8 text-blue-600 animate-spin" />
          <p>Kitob ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white xs:bg-[#E9F2F8] md:py-8 xs:py-12 pb-20 sm:pb-0 xs:pb-20">
        <div className="container mx-auto max-w-7xl px-1 md:px-2">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full sm:w-1/2 lg:w-[38%] flex justify-center md:justify-normal">
              <img
                src={
                  currentProduct?.photo
                    ? getImage(
                        currentProduct.photo.prefix,
                        currentProduct.photo.name
                      )
                    : "new.png"
                }
                alt="image"
                className="w-40 rounded md:rounded-xl transition-all duration-300 sm:w-64 md:w-80 lg:w-[300px] xl:w-[300px] h-auto object-contain"
              />
            </div>
            <div className="w-full px-3 xs:px-0">
              <h1 className="font-bold text-center md:text-left text-[22px] sm:text-[32px]">
                {currentProduct?.name ?? "Book name"}
              </h1>
              <div className="flex gap-2 flex-col sm:flex-row items-center justify-between mt-5 w-full">
                {/* ratings and reviews */}
                <div className="flex gap-2 items-center justify-center sm:justify-between w-full max-w-[375px]">
                  <RatingStar
                    isShowNumber
                    count={currentProduct?.rating ?? 5}
                  />
                  <div className="hidden sm:flex items-center gap-2">
                    <img src={reviewLogo} alt="logo" />
                    <p className="text-[#11142D] font-semibold text-[14px]">
                      {reviews.length} Reviews
                    </p>
                  </div>
                </div>
                {/* buttons */}
                <div className="flex mt-3 xs:mt-1 flex-col-reverse xs:flex-row items-center gap-3 w-full xs:w-auto px-3 sm:px-0">
                  <Button
                    onClick={() => setDemoOpen(true)}
                    className="flex items-center gap-x-2 text-[#F18712] xs:text-white bg-[#FCF3E8] hover:bg-[#fbefe1] xs:bg-[#61C3E2] xs:max-w-xs w-full xs:hover:bg-[#61c4e2bf] rounded-xl py-6 font-medium text-[15px] shadow-none active:scale-105 transition-all duration-300"
                  >
                    <IoBookOutline size={24} className="size-6" />
                    <span>Namuna o’qing</span>
                    <PiBookOpenUserLight size={24} className="size-6" />
                  </Button>
                  <Button
                    onClick={() => setAboutOpen(true)}
                    className="flex w-full max-w-[18rem] xs:max-w-none xs:w-auto items-center gap-x-2 rounded-xl py-6 font-medium text-[15px] shadow-none bg-[#AAAAAA] hover:bg-[#aaaaaad1] active:scale-105 transition-all duration-300"
                  >
                    <PiNotebook size={24} className="size-6" />
                    <span>Kitob haqida</span>
                  </Button>
                </div>
              </div>
              <p className="mt-7 text-base">
                {currentProduct?.description ?? ""}
              </p>
              <div className="mt-4">
                <div>
                  <p className="text-[#AAAAAA] text-base">Yozuvchi</p>
                  <h3 className="text-[#11142D] font-semibold text-[20px] mt-1">
                    {currentProduct?.author.fullName ?? ""}
                  </h3>
                </div>
              </div>
              <div className="border border-dashed border-[#AAAAAA] mt-4"></div>
              <div className="mt-4 bg-white sm:bg-transparent sticky sm:static bottom-[5.6rem] flex-col xs:flex-row flex items-center justify-between py-2 sm:py-0">
                <h2 className="font-bold text-[#11142D] text-[25px] sm:text-[36px]">
                  {currentProduct?.salePrice?.toLocaleString()} UZS
                </h2>
                <div className="mt-2 xs:mt-0 flex items-center gap-2">
                  <div className="w-[155px] h-[54px] border-2 rounded-[14px] border-[#207BBE1A] flex justify-between items-center p-3 xs:p-6">
                    <Button
                      variant={"outline"}
                      className="border-0 xs:p-1 hover:bg-transparent bg-transparent shadow-none"
                      disabled={quantity <= 1}
                      onClick={() => changeQuantity(-1)}
                    >
                      <Minus className="size-5 text-[#207BBE] cursor-pointer active:scale-125 transition-all duration-300" />
                    </Button>

                    <span className="select-none text-[20px] font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant={"outline"}
                      className="border-0 xs:p-1 hover:bg-transparent bg-transparent shadow-none"
                      onClick={() => changeQuantity(1)}
                      disabled={
                        currentProduct
                          ? quantity >= currentProduct.quantity
                          : false
                      }
                    >
                      <Plus className="size-5 text-[#207BBE] cursor-pointer active:scale-125 transition-all duration-300" />
                    </Button>
                  </div>
                  <Button
                    disabled={
                      !currentProduct ||
                      currentProduct.quantity === 0 ||
                      (currentProduct && quantity > currentProduct.quantity)
                    }
                    onClick={handleAddToCart}
                    className="flex items-center gap-x-3 py-5 bg-[#207BBE] hover:bg-[#207cbecd] shadow-[0_25px_33px_0_#207BBE40] rounded-[14px] w-[190px] h-[54px] active:scale-105 transition-all duration-300"
                  >
                    <FiShoppingCart className="size-5" />
                    <span className="text-white font-bold text-base select-none">
                      Savatga
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* reviews mobile */}
          <div className="sm:hidden mt-10 px-2">
            <div
              onClick={() => navigate(`/product/reviews/${currentProduct?.id}`)}
              className="flex items-center hover:underline transition-all duration-300 cursor-pointer w-fit"
            >
              <p className="font-semibold">Mijozlarning sharhlari</p>
              <ChevronRight size={18} className="text-gray-500" />
            </div>
            <div className="mt-3 flex justify-between items-center">
              <h1 className="font-bold text-5xl">{currentProduct?.rating}</h1>
              <div>
                <RatingStar
                  color="black"
                  count={currentProduct?.rating ?? 5}
                  isShowNumber={false}
                />
                <p className="text-center text-[15px] font-medium text-gray-500 mt-0.5">
                  {reviews.length} Ratings
                </p>
              </div>
            </div>
          </div>
          {/* reviews desktop */}
          <div className="mt-10 hidden sm:block">
            <div className="px-2 xs:px-0 flex items-center max-w-[735px] justify-between">
              <h1 className="text-[#11142D] font-bold text-lg sm:text-[36px] select-none">
                Mijozlarning sharhlari
              </h1>
              <Button
                onClick={() => setReviewOpen(true)}
                className="w-[140px] h-[34px] xs:w-[174px] xs:h-[36px] bg-[#207BBE] hover:bg-[#207cbed2] text-white font-medium text-sm xs:text-base active:scale-105 transition-all duration-300 rounded-[12px] py-5"
              >
                Sharx qoldirish
              </Button>
            </div>
            <div className="mt-4 hidden sm:block">
              {reviews.length <= 0 && (
                <EmptyReviews
                  description="Sharh qoldirish tugmasini bosish orqali sharhingizni qoldirishingiz
        mumkin"
                />
              )}
              {reviews.slice(0, 3).map((rev, ind) => (
                <ReviewItem
                  key={ind}
                  content={rev.review}
                  username={rev.userFullName}
                  count={rev.rating}
                  date=""
                />
              ))}
            </div>

            {reviews.length > 0 && (
              <div className="max-w-[735px] flex justify-end mt-5">
                <Link to={`/product/reviews/${currentProduct?.id}`}>
                  <div className="flex items-center cursor-pointer hover:underline gap-1 mr-2 md:mr-0 text-[#207BBE]">
                    <p className="font-medium text-base">
                      Barcha izohlarni ko’rish
                    </p>
                    <FiExternalLink className="size-6 text-[#207BBE]" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* add review modal */}
        <div>
          <Dialog open={reviewOpen}>
            <DialogContent className="sm:max-w-[450px] !rounded-[20px]">
              <DialogHeader className="relative">
                <DialogTitle className="text-[#212121] font-semibold text-[20px]">
                  Sharh qoldirish
                </DialogTitle>
                <DialogDescription></DialogDescription>
                <button
                  onClick={() => setReviewOpen(false)}
                  className="absolute right-2 -top-1 rounded-sm opacity-70 ring-offset-background 
                       transition-opacity hover:opacity-100 focus:outline-none 
                       focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </button>
              </DialogHeader>
              <div>
                <p className="text-[#212121] font-medium text-base">
                  Baholash uchun teging
                </p>
                <div className="mt-2">
                  <StarRating onRatingChange={handleRatingChange} />
                </div>
              </div>
              <div>
                <label
                  htmlFor="review"
                  className="text-[#33383E] font-medium text-base"
                >
                  Sharh qoldiring
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  id="review"
                  rows={4}
                  placeholder="Bu ziplayn juda ham zo’r. Har hafta aynan shu ziplaynda uchaman 👍😊"
                  className="mt-2 w-full resize-none p-3 pl-4 rounded-[10px] text-[#212121] border border-[#CACCD1] bg-[#FBFBFB]"
                ></textarea>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSendReview}
                  className="bg-[#007AFF] rounded-[10px] py-6 font-semibold text-base text-white hover:bg-[#007bffe4]"
                >
                  Izohni yuborish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* about and demo modals */}
      <div>
        <ModalDrawer
          open={aboutOpen}
          onOpenChange={setAboutOpen}
          isModal={!isMobile}
        >
          <div className="text-justify mt-2 overflow-y-auto max-h-[80vh]">
            {currentProduct?.about ?? "Hech qanda ma'lumot mavjud emas"}
          </div>
        </ModalDrawer>
        {/* demo modal */}
        <ModalDrawer
          open={demoOpen}
          onOpenChange={setDemoOpen}
          isModal={!isMobile}
        >
          <div className="mt-2 overflow-y-auto max-h-[90vh]">
            <BookDemo
              currentBookId={currentProduct?.id ?? ""}
              imageUrl={
                currentProduct?.photo
                  ? getImage(
                      currentProduct.photo.prefix,
                      currentProduct.photo.name
                    )
                  : "new.png"
              }
            />
          </div>
        </ModalDrawer>
      </div>
    </>
  );
};

export default ProductDetail;
