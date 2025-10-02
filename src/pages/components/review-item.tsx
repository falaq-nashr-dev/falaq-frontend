import ReviewRating from "./review-rating";

interface ReviewItemProps {
  username: string;
  count: number;
  content: string;
  date: string;
  isLastHide?: boolean;
}

const ReviewItem = ({
  content,
  count,
  date,
  username,
  isLastHide,
}: ReviewItemProps) => {
  console.log(date);

  return (
    <>
      <div className="mb-1 xs:mb-5 bg-white rounded-[16px] max-w-[735px] px-0 py-3 xs:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-[#212121] text-lg">{username}</h5>
            <div className="mt-2">
              <ReviewRating count={count} />
            </div>
          </div>
          <p className="text-[14px] text-[#53585F] font-medium">28.04.2025</p>
        </div>
        <p className="font-medium text-base text-[#53585F] mt-6">{content}</p>
      </div>
      {!isLastHide && <hr className="text-gray-400 sm:hidden" />}
    </>
  );
};

export default ReviewItem;
