import { Link } from "react-router-dom";
import logo from "../../../public/images/logo.svg";

const Logo = () => {
  return (
    <Link to={"/"}>
      <div className="flex items-center gap-3">
        <img alt="Falaq Nashr logo" src={logo} width={50} height={50} />
        <h1 className="text-2xl font-medium">Falaq Nashr</h1>
      </div>
    </Link>
  );
};

export default Logo;
