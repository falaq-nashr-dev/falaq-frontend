import EmptyCart from "../components/empty-cart";
import { Product, useCartStore } from "../store/useCartStore";
import CartItem from "./components/cart-item";
import Header from "./components/header";
import BottomCartNavigation from "../components/bottom-cart-navigation";
import { getImage } from "../helpers/image";

const Cart = () => {
  const { totalPrice, cart } = useCartStore();

  // Function to determine correct price
  const getPrice = (item: Product) => {
    return item.salePrice;
  };

  return (
    <div className="min-h-screen bg-white py-2">
      <div className="container py-3 px-4 mx-auto max-w-xl min-h-[500px]">
        <Header name="Orqaga" />
        <div className="space-y-2 mt-3 pb-12">
          {cart.length <= 0 && <EmptyCart />}
          {cart.map((item, ind) => (
            <CartItem
              key={ind}
              author={item.author.fullName}
              id={item.id}
              imageUrl={getImage(item.photo.prefix, item.photo.name)}
              name={item.name}
              price={getPrice(item)}
              quantity={item.quantity}
            />
          ))}
        </div>
      </div>

      <BottomCartNavigation cart={cart} totalPrice={totalPrice} />
    </div>
  );
};

export default Cart;
