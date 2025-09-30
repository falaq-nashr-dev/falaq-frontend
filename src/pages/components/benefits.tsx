// components/FeaturesSection.tsx
import { Bolt, ShieldCheck, ThumbsUp, Star } from "lucide-react";

const features = [
  {
    icon: <Bolt className="h-6 w-6 text-blue-700" />,
    title: "Tez yetkazib berish",
    description: "Buyurtmalaringizni tez va ishonchli yetkazib beramiz",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-blue-700" />,
    title: "Xavfsiz to'lov",
    description: "To‘lovlaringiz xavfsiz  tarzda amalga oshiriladi",
  },
  {
    icon: <ThumbsUp className="h-6 w-6 text-blue-700" />,
    title: "Eng yaxshi sifat",
    description: "Mahsulotlarimiz yuqori sifat standartlariga javob beradi",
  },
  {
    icon: <Star className="h-6 w-6 text-blue-700" />,
    title: "Qaytish kafolati",
    description: "Agar mahsulot yoqmasa, uni qaytarishingiz mumkin.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-[#E9F2F8] py-7">
      <div className="container max-w-7xl mx-auto px-3 sm:px-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-xs flex items-start gap-4 hover:shadow-sm transition"
          >
            <div className="bg-blue-100 p-3 rounded-xl flex items-center justify-center">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
