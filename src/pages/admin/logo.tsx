import logo from "/brand-logo.png";

const Logo = () => {
  return (
    <div className="size-28 mx-auto flex justify-center items-center">
      <img width={80} src={logo} alt="logo" />
    </div>
  );
};

export default Logo;
