import { Button } from "@/components/ui/button";
import logo from "../../../public/images/success-cart.svg";
import { useNavigate } from "react-router-dom";

const CompletedMessage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <img src={logo} alt="success" />
      <h1 className="text-[#212121] font-semibold text-[24px] mt-5">
        Tabriklaymiz
      </h1>
      <p className="mt-1 text-[#53585F] text-lg text-center">
        Buyurmangiz muvaffaqiyatli qabul qilindi, operator tez orada aloqaga
        chiqadi
      </p>
      <Button
        onClick={() => navigate("/main")}
        className="max-w-[358px] h-[48px] mt-6 w-full bg-[#007AFF] hover:bg-[#007bffe7] rounded-xl"
      >
        Bosh sahifaga qaytish
      </Button>
    </div>
  );
};

export default CompletedMessage;
