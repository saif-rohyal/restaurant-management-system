import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + Number(item.foodItem.price) * item.quantity,
    0
  );

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <Header />

        <main className="cart-empty">
          <span>KHAN RESTAURANT · KALAM</span>
          <h1>Your cart is <em>empty.</em></h1>
          <p>
            Add something delicious from our menu to continue.
          </p>

          <Link to="/menu" className="cart-primary-button">
            EXPLORE MENU →
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-container">
        <div className="cart-heading">
          <div>
            <span>KHAN RESTAURANT · KALAM</span>
            <h1>Your <em>selection.</em></h1>
          </div>

          <div className="cart-count">
            {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
          </div>
        </div>

        <div className="cart-layout">
          <section className="cart-items">
            {items.map((item) => {
              const food = item.foodItem;
              const itemTotal = Number(food.price) * item.quantity;

              return (
                <article className="cart-item" key={food._id}>
                  <div className="cart-item-image">
                    {food.image ? (
                      <img src={food.image} alt={food.name} />
                    ) : (
                      <span>KHAN</span>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h2>{food.name}</h2>

                    <p>
                      {food.description ||
                        "Prepared fresh at Khan Restaurant."}
                    </p>

                    <div className="cart-item-price">
                      Rs. {Number(food.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            food._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            food._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <strong>
                      Rs. {itemTotal.toLocaleString()}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(food._id)}
                    >
                      REMOVE
                    </button>
                  </div>
                </article>
              );
            })}

            <button className="clear-cart" onClick={clearCart}>
              CLEAR CART
            </button>
          </section>

          <aside className="cart-summary">
            <span>ORDER SUMMARY</span>

            <h2>Your order</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{cartCount}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>TOTAL</span>
              <strong>Rs. {total.toLocaleString()}</strong>
            </div>

            <button
              className="checkout-button"
              onClick={() => navigate("/food-checkout")}
            >
              PROCEED TO CHECKOUT
              <span>→</span>
            </button>

            <Link to="/menu" className="continue-shopping">
              ← CONTINUE SHOPPING
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;