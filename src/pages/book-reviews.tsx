import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Review } from "@/types";
import { Request } from "@/helpers/Request";
import ReviewItem from "./components/review-item";
import EmptyReviews from "./components/empty-reviews";
import NavNavigate from "@/components/nav-navigate";

const ReviewSkeleton = () => (
  <div className="animate-pulse border-b py-4">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const BookReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentBookReviews = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await Request<Review[]>(
          `/product-rating/product/${id}`,
          "GET",
          {},
          true
        );
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentBookReviews();
  }, [id]);

  // Scroll to top when the page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pb-12 bg-white xs:bg-[#E9F2F8]">
      <NavNavigate />
      <div className="container max-w-7xl mx-auto px-3 md:px-1 py-2 md:py-8">
        <h1 className="text-[#11142D] text-lg font-bold md:text-[36px]">
          Barcha izohlar ({reviews.length})
        </h1>

        <div className="mt-4">
          {/* 🔹 Loading state */}
          {loading && (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          )}

          {/* 🔹 Empty state */}
          {!loading && reviews.length <= 0 && (
            <EmptyReviews description="Hozircha izohlar mavjud emas" />
          )}

          {/* 🔹 Reviews list */}
          {!loading &&
            reviews.map((item, ind) => (
              <ReviewItem
                key={ind}
                content={item.review}
                username={item.userFullName}
                count={item.rating}
                date=""
                isLastHide={reviews.length - 1 === ind}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BookReviews;
