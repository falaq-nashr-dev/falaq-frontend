import AdsSection from "./components/ads-section";
import Benefits from "./components/benefits";
import BookShowcaseSection from "./components/book-show-case";
import HomeProducts from "./components/home-products";

const Home = () => {
  return (
    <div className="min-h-screen pb-12 bg-white">
      <div>
        <AdsSection />
      </div>
      <div className="hidden xs:block">
        <Benefits />
      </div>
      <div>
        <BookShowcaseSection />
      </div>
      <div>
        <HomeProducts />
      </div>
    </div>
  );
};

export default Home;
