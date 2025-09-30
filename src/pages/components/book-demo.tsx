import { Request } from "@/helpers/Request";
import { BookPage } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";

interface BookDemoProps {
  imageUrl: string;
  currentBookId: string;
}

export default function BookDemo({ currentBookId, imageUrl }: BookDemoProps) {
  const [bookPages, setBookPages] = useState<BookPage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const mountedRef = useRef(true);

  const totalPages = useMemo(() => {
    return (bookPages?.length ?? 0) + 1;
  }, [bookPages]);

  const clamp = useCallback(
    (val: number) => Math.max(0, Math.min(val, totalPages - 1)),
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage((prev) => clamp(prev + 1));
  }, [clamp]);

  const prevPage = useCallback(() => {
    setPage((prev) => clamp(prev - 1));
  }, [clamp]);

  const handlers = useSwipeable({
    onSwipedLeft: nextPage,
    onSwipedRight: prevPage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setPage(0);

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await Request<BookPage[]>(
          `/book-pages/by-book/${currentBookId}`,
          "GET",
          {},
          true
        );

        if (cancelled || !mountedRef.current) return;

        const sortedPages = (data ?? [])
          .slice()
          .sort((a, b) => (a.pageNumber ?? 0) - (b.pageNumber ?? 0));

        setBookPages(sortedPages);
      } catch (error) {
        console.error(error);
        if (!cancelled && mountedRef.current) {
          setBookPages([]);
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentBookId]);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  const isCover = page === 0;
  const content = !isCover ? bookPages[page - 1] : null;

  return (
    <div
      {...handlers}
      className="group relative h-[600px] bg-white rounded-lg overflow-hidden"
    >
      {/* Page Content */}
      <div className="overflow-y-auto h-full p-2">
        {isCover ? (
          <div className="h-full flex items-center">
            <img
              draggable={false}
              src={imageUrl}
              alt="Book Cover"
              width={300}
              height={400}
              className="mx-auto rounded-md"
            />
          </div>
        ) : content ? (
          <p className="text-gray-800 text-justify leading-relaxed">
            {content.content}
          </p>
        ) : (
          <p className="text-gray-500">Sahifa topilmadi</p>
        )}
      </div>

      {/* Page Number */}
      <div className="absolute bottom-1 font-semibold right-2 text-gray-600 text-sm">
        Bet {page + 1}/{totalPages}
      </div>

      {/* Desktop Prev/Next Buttons */}
      <div className="hidden md:flex justify-between items-center absolute top-1/2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevPage}
          disabled={page === 0}
          aria-label="Previous page"
          className="bg-gray-100 size-10 rounded-full flex justify-center items-center shadow hover:bg-gray-300 disabled:opacity-40"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextPage}
          disabled={page === totalPages - 1}
          aria-label="Next page"
          className="bg-gray-100 size-10 rounded-full flex justify-center items-center shadow hover:bg-gray-300 disabled:opacity-40"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
