import { Star } from "lucide-react";

interface ReviewRatingProps {
  count: number; // rating count (e.g., 4.5 or 3)
  max?: number; // maximum stars, default 5
}

const ReviewRating = ({ count, max = 5 }: ReviewRatingProps) => {
  const fullStars = Math.floor(count);
  const hasHalfStar = count % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {/* Render stars */}
      {Array.from({ length: max }).map((_, i) => {
        if (i < fullStars) {
          // full star
          return (
            <Star key={i} className="w-5 h-5 text-[#EFCB39] fill-[#EFCB39]" />
          );
        } else if (i === fullStars && hasHalfStar) {
          // half star
          return (
            <Star
              key={i}
              className="w-5 h-5 text-[#EFCB39]"
              style={{
                fill: "url(#half-gradient)",
              }}
            />
          );
        } else {
          // empty star
          return (
            <Star
              key={i}
              className="w-5 h-5 text-gray-300 dark:text-gray-600"
            />
          );
        }
      })}

      {/* Gradient definition for half star */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-gradient" x1="0" x2="100%" y1="0" y2="0">
            <stop offset="50%" stopColor="#EFCB39" /> {/* yellow-400 */}
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ReviewRating;
