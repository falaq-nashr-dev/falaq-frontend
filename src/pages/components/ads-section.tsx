import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getImage } from "@/helpers/image";
import { Request } from "@/helpers/Request";
import type { BookWithType } from "@/types";

type Product = NonNullable<BookWithType["products"]>[number];

const FIRST = 0;

const AdsSection = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BookWithType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchBooksWithType = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      // If your Request helper supports an options param, pass { signal }.
      // Otherwise, it will be ignored — AbortController still protects native fetches.
      const { data } = await Request<BookWithType[]>(
        "/products/by-type",
        "GET",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { signal } as any,
        true
      );

      setBooks(Array.isArray(data) ? data : []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.name === "AbortError") return; // unmounted or aborted
      console.error("Failed to fetch books:", err);
      setError("Ma'lumotlarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBooksWithType(controller.signal);
    return () => controller.abort();
  }, [fetchBooksWithType]);

  const includesCI = (text: string | undefined | null, q: string) =>
    (text ?? "").toLowerCase().includes(q.toLowerCase());

  // Pre-compute the two sections we care about
  const bestsellerType = useMemo(
    () => books.find((b) => includesCI(b?.typeName, "bestseller")),
    [books]
  );

  // "popular" here is inferred from "yangi" (new arrivals)
  const popularType = useMemo(
    () =>
      books.find(
        (b) =>
          includesCI(b?.typeName, "yangi qo'shilgan") ||
          includesCI(b?.typeName, "yangi")
      ),
    [books]
  );

  // Safely pick the first product in each category
  const bestsellerProduct: Product | undefined =
    bestsellerType?.products?.[FIRST];
  const popularProduct: Product | undefined = popularType?.products?.[FIRST];

  const handleNavigate = (typeId?: string, typeName?: string) => {
    if (!typeId || !typeName) return;
    navigate(
      `/all-products?type=${encodeURIComponent(typeName.toLowerCase())}`,
      {
        state: { typeId, typeName },
      }
    );
  };

  const priceText = (p?: number | null) =>
    typeof p === "number" ? `${p.toLocaleString()} UZS` : "0 UZS";

  // Small, shared subcomponent to avoid duplication
  const PromoCard = ({
    title,
    subtitle,
    product,
    bgUrl,
    onClick,
    imgAltFallback = "Kitob rasmi",
    desktop = false,
  }: {
    title: string;
    subtitle: string;
    type?: BookWithType;
    product?: Product;
    bgUrl: string;
    onClick?: () => void;
    imgAltFallback?: string;
    desktop?: boolean;
  }) => (
    <div
      style={{ backgroundImage: `url(${bgUrl})` }}
      className={`relative rounded-2xl overflow-hidden shadow-lg ${
        desktop ? "p-6 max-w-sm mx-auto h-full" : "p-4 sm:p-6 h-full"
      } text-center bg-cover bg-center`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
    >
      <div className="relative z-10">
        <h2
          className={`text-white font-bold ${
            desktop ? "text-3xl" : "text-xl sm:text-3xl"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-white/90 ${
            desktop
              ? "text-[15px] mb-4"
              : "hidden sm:block text-xs sm:text-[15px] mb-2 sm:mb-4"
          }`}
        >
          {subtitle}
        </p>

        <Carousel className={`w-full ${desktop ? "" : "mt-2 sm:mt-0"}`}>
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col items-center">
                <div
                  className={`relative ${
                    desktop
                      ? "w-40 h-56 mb-4"
                      : "w-24 h-32 sm:w-40 sm:h-56 mb-2 sm:mb-4"
                  }`}
                >
                  {product?.photo ? (
                    <img
                      src={getImage(product.photo.prefix, product.photo.name)}
                      alt={product?.name || imgAltFallback}
                      width={desktop ? 200 : 160}
                      height={desktop ? 280 : 224}
                      loading="lazy"
                      decoding="async"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-white/20 backdrop-blur-sm grid place-items-center text-white/80 text-sm">
                      Rasm yo‘q
                    </div>
                  )}
                </div>

                <p
                  className={`text-white font-semibold ${
                    desktop ? "text-lg mb-2" : "text-sm sm:text-lg mb-1 sm:mb-2"
                  } line-clamp-1`}
                >
                  {product?.name || "Kitob nomi"}
                </p>

                <button
                  type="button"
                  className={`bg-white text-black font-bold rounded-xl shadow cursor-pointer hover:opacity-80 ${
                    desktop
                      ? "text-lg px-6 py-2"
                      : "text-sm sm:text-lg px-3 py-1 sm:px-6 sm:py-2"
                  }`}
                  aria-label="Mahsulotlar ro‘yxatini ochish"
                >
                  {priceText(product?.salePrice)}
                </button>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* If you add prev/next later, keep them keyboard-accessible */}
      </div>

      {/* Click shield to ensure full-card tap area if onClick exists */}
      {onClick && <span className="absolute inset-0" aria-hidden="true" />}
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl py-2 pb-8 md:py-14 px-3 md:px-1">
      {/* Loading & Error states */}
      {loading && (
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 h-[220px] sm:h-[280px] lg:h-[320px] rounded-2xl bg-slate-200" />
          <div className="h-[220px] rounded-2xl bg-slate-200" />
          <div className="h-[220px] rounded-2xl bg-slate-200" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-red-50 text-red-700 p-4">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* CENTER CARD */}
          <div className="lg:col-span-2 lg:order-2">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-blue-300 to-blue-400">
              {/* Aspect ratio: 624x442 ≈ 1.41 */}
              <div className="relative w-full aspect-[624/382] sm:aspect-[16/9] lg:aspect-[624/442] min-h-[160px]">
                <img
                  src="/images/ads.png"
                  alt="Reklama banneri"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
                  sizes="(min-width:1024px) 800px, 100vw"
                />
              </div>
            </div>
          </div>

          {/* MOBILE/TABLET SIDE CARDS */}
          <div className="col-span-1 lg:hidden grid grid-cols-2 gap-4">
            <PromoCard
              title="Best Seller"
              subtitle="Bu hafta eng ko‘p sotilgan"
              type={bestsellerType}
              product={bestsellerProduct}
              bgUrl="/images/ads-overlay1.svg"
              onClick={
                bestsellerType
                  ? () =>
                      handleNavigate(bestsellerType.id, bestsellerType.typeName)
                  : undefined
              }
            />
            <PromoCard
              title="Chegirma"
              subtitle="Bu hafta eng ko‘p chegirmada sotilgan"
              type={popularType}
              product={popularProduct}
              bgUrl="/images/ads-overlay2.svg"
              onClick={
                popularType
                  ? () => handleNavigate(popularType.id, popularType.typeName)
                  : undefined
              }
              imgAltFallback="Kitob rasmi"
            />
          </div>

          {/* DESKTOP LEFT */}
          <div className="hidden lg:block lg:order-1">
            <PromoCard
              desktop
              title="Best Seller"
              subtitle="Bu hafta eng ko‘p sotilgan"
              type={bestsellerType}
              product={bestsellerProduct}
              bgUrl="/images/ads-overlay1.svg"
              onClick={
                bestsellerType
                  ? () =>
                      handleNavigate(bestsellerType.id, bestsellerType.typeName)
                  : undefined
              }
            />
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden lg:block lg:order-3">
            <PromoCard
              desktop
              title="Chegirma"
              subtitle="Bu hafta chegirmada sotilganlar"
              type={popularType}
              product={popularProduct}
              bgUrl="/images/ads-overlay2.svg"
              onClick={
                popularType
                  ? () => handleNavigate(popularType.id, popularType.typeName)
                  : undefined
              }
              imgAltFallback="Kitob rasmi"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsSection;
