import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/auth/login";
import Admin from "./pages/admin/admin";
import NewOrders from "./pages/admin/orders/new/new-orders";
import InprogressOrders from "./pages/admin/orders/inprogress/inprogress-orders";
import CompletedOrders from "./pages/admin/orders/completed/completed-orders";
import CanceledOrders from "./pages/admin/orders/cancel/canceled-orders";
import Users from "./pages/admin/users";
import { ToastProvider } from "./providers/toast-provider";
import Cart from "./pages/cart";
import NotFound from "./components/not-found";
import ProductDetail from "./pages/product-detail";
import Books from "./pages/admin/books";
import BooksForm from "./pages/admin/components/books-form";
import MainOrder from "./pages/main-order";
import Profile from "./pages/admin/profile";
import StartPage from "./pages/auth/start";
import AllProducts from "./pages/all-products";
import Categories from "./pages/admin/categories/categories";
import BookTypes from "./pages/admin/book-types/book-types";
import Authors from "./pages/admin/authors/authors";
import Operators from "./pages/admin/operator/operators";
import Admins from "./pages/admin/admins/admins";
import Settings from "./pages/profile/settings";
import BookPages from "./pages/admin/book-pages/book-pages";
import OneBookPageData from "./pages/admin/book-pages/components/one-book-page-data";
import { useEffect, useMemo } from "react";
import useUser from "./hooks/use-user";
import CardProducts from "./pages/card-products";
import Header from "./pages/components/header";
import MobileNavbar from "./pages/components/mobile-navbar";
import Footer from "./pages/components/footer";
import BottomNavigation from "./pages/components/bottom-navigation";
import BookReviews from "./pages/book-reviews";
import MyProfile from "./pages/my-profile";
import Wishlist from "./pages/wishlist";

interface TelegramWebApp {
  ready: () => void;
  setBackgroundColor: (color: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, user } = useUser();

  // Memoize the static array to prevent unnecessary re-renders
  const userPages = useMemo(
    () => [
      "/",
      "/cart",
      "/main-order",
      "/profile",
      "/product/*",
      "/profile/settings",
      "/all-products",
      "/main",
    ],
    []
  );

  const shouldShowHeader =
    !location.pathname.includes("/start") &&
    !location.pathname.includes("/admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (userPages.includes(location.pathname)) {
      if (!loading && !user && !token) {
        navigate("/start", { replace: true });
      }
    }
  }, [loading, location.pathname, navigate, user, userPages]);

  useEffect(() => {
    // Make sure Telegram is available, then call its methods
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  return (
    <div>
      <ToastProvider />
      {shouldShowHeader && (
        <div>
          <div className="hidden xs:block">
            <Header />
          </div>
          <div className="xs:hidden py-2 xs:py-0">
            {location.pathname === "/" && <MobileNavbar />}
          </div>
        </div>
      )}

      <Routes>
        {/* auth routes */}
        <Route path="/start" index element={<StartPage />} />
        <Route path="/sign-in" element={<Login />} />

        {/* user routes */}
        <Route path="/main" element={<CardProducts />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/reviews/:id" element={<BookReviews />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-main" element={<MainOrder />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/profile/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/admin" element={<Admin />}>
          {/* admin routes */}
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/books/create" element={<BooksForm />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/types" element={<BookTypes />} />
          <Route path="/admin/authors" element={<Authors />} />
          <Route path="/admin/book-pages" element={<BookPages />} />
          <Route path="/admin/book-pages/:id" element={<OneBookPageData />} />

          {/* super admin routes */}
          <Route path="/admin/operators" element={<Operators />} />
          <Route path="/admin/admins" element={<Admins />} />
          <Route path="/admin/users" element={<Users />} />

          {/* operator routes */}
          <Route path="/admin/orders-new" element={<NewOrders />} />
          <Route path="/admin/orders-progress" element={<InprogressOrders />} />
          <Route path="/admin/orders-completed" element={<CompletedOrders />} />
          <Route path="/admin/orders-declined" element={<CanceledOrders />} />

          {/* additional routes */}
          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Routes>
      {shouldShowHeader && (
        <div>
          <div className="hidden sm:block">
            <Footer />
          </div>
          <div className="pb-5 sm:pb-0">
            <BottomNavigation />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
