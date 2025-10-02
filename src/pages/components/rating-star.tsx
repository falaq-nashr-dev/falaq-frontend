import { Star } from "lucide-react";
import { useId } from "react";

interface RatingStarProps {
  count: number; // rating count (e.g., 4.5 or 3)
  max?: number; // maximum stars, default 5
  isShowNumber: boolean;
  color?: "black" | "orange";
}

const RatingStar = ({
  count,
  max = 5,
  isShowNumber,
  color = "orange",
}: RatingStarProps) => {
  const fullStars = Math.floor(count);
  const hasHalfStar = count % 1 !== 0;

  // Dynamic star color
  const starColor = color === "black" ? "#000000" : "#FF754C";

  // Generate unique gradient id for this component
  const gradientId = useId();

  return (
    <div className="flex items-center gap-1">
      {/* Render stars */}
      {Array.from({ length: max }).map((_, i) => {
        if (i < fullStars) {
          // full star
          return (
            <Star
              key={i}
              className="w-5 h-5"
              style={{ color: starColor, fill: starColor }}
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          // half star
          return (
            <Star
              key={i}
              className="w-5 h-5"
              style={{ color: starColor, fill: `url(#${gradientId})` }}
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

      {/* Show rating count */}
      {isShowNumber && (
        <span className="ml-0.5 sm:ml-2 text-sm text-[#11142D] font-bold">
          {count?.toFixed(1)}
        </span>
      )}

      {/* Gradient definition for half star */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="100%" y1="0" y2="0">
            <stop offset="50%" stopColor={starColor} />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default RatingStar;
