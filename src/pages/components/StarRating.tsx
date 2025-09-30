import React, { useState } from "react";

type StarRatingProps = {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  onRatingChange,
}) => {
  const [rating, setRating] = useState<number>(initialRating);

  const handleClick = (starValue: number) => {
    setRating(starValue);
    onRatingChange?.(starValue);
  };

  return (
    <div className="flex flex-row gap-x-3 w-fit  mb-5">
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        return (
          <span
            key={starNumber}
            onClick={() => handleClick(starNumber)}
            className={`cursor-pointer text-4xl ${
              starNumber <= rating ? "text-[#EFCB39]" : "text-gray-400"
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
