import { MessageCircle, Star } from "lucide-react";

export default function EmptyReviews({ description }: { description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-10 h-10 text-blue-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 text-yellow-600" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        Hali sharhlar yoq
      </h3>

      <p className="text-gray-600 max-w-md leading-relaxed mb-8">
        {description}
      </p>
    </div>
  );
}
