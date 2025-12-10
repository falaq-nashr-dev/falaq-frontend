import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Request } from "@/helpers/Request";
import { AdminBooks, BookWithType } from "@/types";
import { getImage } from "@/helpers/image";
import { useNavigate } from "react-router-dom";

/* -------------------- UI Primitives -------------------- */

type CarouselProps = {
  children: React.ReactNode;
  className?: string;
};

const Carousel: React.FC<CarouselProps> = React.memo(
  ({ children, className = "" }) => {
    return <div className={`relative ${className}`}>{children}</div>;
  }
);
Carousel.displayName = "Carousel";

type CarouselContentProps = {
  children: React.ReactNode;
};

const CarouselContent: React.FC<CarouselContentProps> = React.memo(
  ({ children }) => {
    return (
      <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4">
        {children}
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

type CarouselItemProps = {
  children: React.ReactNode;
};

const CarouselItem: React.FC<CarouselItemProps> = React.memo(({ children }) => {
  return <div className="flex-none">{children}</div>;
});
CarouselItem.displayName = "CarouselItem";

type CarouselButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

const CarouselNext: React.FC<CarouselButtonProps> = ({
  onClick,
  disabled,
  ariaLabel = "right",
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className="absolute -right-4 top-[43%] -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  );
};

/* -------------------- Cards -------------------- */

const BookCard: React.FC<AdminBooks> = React.memo(({ name, photo, id }) => {
  const imageUrl = useMemo(
    () => getImage(photo?.prefix, photo?.name) ?? "",
    [photo?.prefix, photo?.name]
  );

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="w-32 h-44 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
    >
      <div className="w-full h-full relative flex items-center justify-center p-3">
        {/* Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={(e) => {
              // fail silently on bad image
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        {/* Hover veil */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
    </div>
  );
});
BookCard.displayName = "BookCard";

const SkeletonCard: React.FC = () => (
  <div className="w-32 h-44 rounded-xl overflow-hidden shadow-md bg-gray-200 animate-pulse" />
);

/* -------------------- Section -------------------- */

type ShowcaseBlockProps = {
  title: string;
  description: string;
  bucket?: BookWithType;
  loading: boolean;
  onSeeAll?: () => void;
};

const ShowcaseBlock: React.FC<ShowcaseBlockProps> = ({
  title,
  description,
  bucket,
  loading,
  onSeeAll,
}) => {
  const products = bucket?.products?.slice(0, 4) ?? [];

  return (
    <div className="rounded-3xl p-5 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md">
          {description}
        </p>
      </div>

      <Carousel>
        <CarouselContent>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem key={`skeleton-${i}`}>
                <SkeletonCard />
              </CarouselItem>
            ))
          ) : products.length > 0 ? (
            products.map((book) => (
              <CarouselItem key={book.id ?? book.name}>
                <BookCard {...book} />
              </CarouselItem>
            ))
          ) : (
            <div className="text-sm text-gray-500">Hozircha ma'lumot yo‘q.</div>
          )}
        </CarouselContent>

        <CarouselNext onClick={onSeeAll} disabled={loading || !bucket} />
      </Carousel>
    </div>
  );
};

/* -------------------- Main -------------------- */

const BookShowcaseSection: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<BookWithType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchBooksWithType = useCallback(async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      setError(null);
      const { data } = await Request<BookWithType[]>(
        "/products/by-type",
        "GET",
        {}
      );
      setBooks(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      // Keep console for debugging, but show friendly UI
      console.error("Failed to fetch books:", err);
      setError("Ma'lumotlarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchBooksWithType();
  }, [fetchBooksWithType]);

  // Helper to normalize includes checks safely
  const includesCI = (text: string | undefined, q: string) =>
    (text ?? "").toLowerCase().includes(q.toLowerCase());

  const forYouBooks = useMemo(
    () => books.find((b) => includesCI(b.typeName, "siz uchun")),
    [books]
  );

  const popularBooks = useMemo(
    () =>
      books.find(
        (b) =>
          includesCI(b.typeName, "best") || includesCI(b.typeName, "eng ko'p")
      ),
    [books]
  );

  const handleNavigate = useCallback(
    (bucket?: BookWithType) => {
      if (!bucket) return;
      navigate(`/all-products?type=${(bucket.typeName ?? "").toLowerCase()}`, {
        state: {
          typeId: bucket.id,
          typeName: bucket.typeName,
        },
      });
    },
    [navigate]
  );

  return (
    <div className="w-full container max-w-7xl mx-auto py-6 px-3 sm:px-1 space-y-6">
      {/* Error banner */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* For You */}
        <div className="bg-gradient-to-br w-full from-orange-100 to-orange-200 rounded-2xl sm:rounded-3xl">
          <ShowcaseBlock
            title="Siz uchun maxsus"
            description="Ushbu bo‘limda siz sevimli kitoblaringiz bilan yanada chuqurroq tanishishingiz mumkin."
            bucket={forYouBooks}
            loading={loading}
            onSeeAll={() => handleNavigate(forYouBooks)}
          />
        </div>

        {/* Popular */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-3xl">
          <ShowcaseBlock
            title="Eng ko'p sotilganlar"
            description="Ushbu bo'limda kitobsevarlar tomonidan ko'p sotib olingan kitoblar bilan tanishishingiz mumkin."
            bucket={popularBooks}
            loading={loading}
            onSeeAll={() => handleNavigate(popularBooks)}
          />
        </div>
      </div>
    </div>
  );
};

export default BookShowcaseSection;
