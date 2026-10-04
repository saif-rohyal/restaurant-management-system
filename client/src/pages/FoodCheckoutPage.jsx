import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./FoodCheckoutPage.css";

const FoodCheckoutPage = () => {
  const { items, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("Dine In");
  const [roomNumber, setRoomNumber] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.foodItem.price) * item.quantity,
    0
  );

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      orderType === "Room Service" &&
      !roomNumber.trim()
    ) {
      setError(
        "Please enter your room number for room service."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const orderData = {
        items: items.map((item) => ({
          foodItem: item.foodItem._id,
          quantity: item.quantity,
        })),
        roomNumber:
          orderType === "Room Service"
            ? roomNumber.trim()
            : "",
        orderType,
      };

      await api.post("/food-orders", orderData);

      clearCart();

      navigate("/my-food-orders");
    } catch (err) {
      console.error("Food order error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="food-checkout-page">
        <Header />

        <main className="checkout-empty">
          <span>KHAN RESTAURANT · KALAM</span>

          <h1>
            Nothing to <em>checkout.</em>
          </h1>

          <p>Your cart is currently empty.</p>

          <Link
            to="/menu"
            className="checkout-primary-button"
          >
            EXPLORE MENU →
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="food-checkout-page">
      <Header />

      <main className="checkout-container">

        <div className="checkout-heading">
          <div>
            <span>KHAN RESTAURANT · KALAM</span>

            <h1>
              Complete your <em>order.</em>
            </h1>
          </div>

          <Link
            to="/cart"
            className="checkout-back"
          >
            ← BACK TO CART
          </Link>
        </div>

        {!user && (
          <div className="checkout-login-notice">
            <strong>Login required</strong>

            <span>
              Please login before placing your food
              order.
            </span>

            <Link to="/login">
              LOGIN →
            </Link>
          </div>
        )}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >
          <section className="checkout-form">

            <div className="checkout-section">
              <span className="checkout-section-label">
                01 · ORDER TYPE
              </span>

              <h2>
                How would you like
                <br />
                your order?
              </h2>

              <div className="order-type-grid">

                <button
                  type="button"
                  className={
                    orderType === "Dine In"
                      ? "order-type-card active"
                      : "order-type-card"
                  }
                  onClick={() =>
                    setOrderType("Dine In")
                  }
                >
                  <span className="order-icon">
                    ◆
                  </span>

                  <strong>DINE IN</strong>

                  <small>
                    Enjoy your meal at the
                    restaurant.
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    orderType === "Takeaway"
                      ? "order-type-card active"
                      : "order-type-card"
                  }
                  onClick={() =>
                    setOrderType("Takeaway")
                  }
                >
                  <span className="order-icon">
                    ◇
                  </span>

                  <strong>TAKEAWAY</strong>

                  <small>
                    Pick up your order from
                    the restaurant.
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    orderType === "Room Service"
                      ? "order-type-card active"
                      : "order-type-card"
                  }
                  onClick={() =>
                    setOrderType("Room Service")
                  }
                >
                  <span className="order-icon">
                    □
                  </span>

                  <strong>ROOM SERVICE</strong>

                  <small>
                    Delivered directly to your
                    room.
                  </small>
                </button>

              </div>

              {orderType === "Room Service" && (
                <div className="room-number-field">
                  <label htmlFor="roomNumber">
                    ROOM NUMBER
                  </label>

                  <input
                    id="roomNumber"
                    type="text"
                    value={roomNumber}
                    onChange={(event) =>
                      setRoomNumber(
                        event.target.value
                      )
                    }
                    placeholder="e.g. 204"
                  />
                </div>
              )}
            </div>

            <div className="checkout-section">
              <span className="checkout-section-label">
                02 · CUSTOMER
              </span>

              <h2>Your account</h2>

              {user ? (
                <div className="customer-card">
                  <div className="customer-avatar">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div>
                    <strong>{user.name}</strong>

                    <span>{user.email}</span>
                  </div>
                </div>
              ) : (
                <div className="customer-login-card">
                  <p>
                    You need to login before
                    placing this order.
                  </p>

                  <Link to="/login">
                    LOGIN TO CONTINUE →
                  </Link>
                </div>
              )}
            </div>

          </section>

          <aside className="checkout-summary">

            <span className="summary-label">
              03 · YOUR ORDER
            </span>

            <h2>Order summary</h2>

            <div className="checkout-items">
              {items.map((item) => (
                <div
                  className="checkout-item"
                  key={item.foodItem._id}
                >
                  <div className="checkout-item-image">
                    {item.foodItem.image ? (
                      <img
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                      />
                    ) : (
                      <span>KHAN</span>
                    )}
                  </div>

                  <div className="checkout-item-info">
                    <strong>
                      {item.foodItem.name}
                    </strong>

                    <span>
                      {item.quantity} × Rs.{" "}
                      {Number(
                        item.foodItem.price
                      ).toLocaleString()}
                    </span>
                  </div>

                  <b>
                    Rs.{" "}
                    {(
                      Number(
                        item.foodItem.price
                      ) * item.quantity
                    ).toLocaleString()}
                  </b>
                </div>
              ))}
            </div>

            <div className="summary-line">
              <span>ITEMS</span>
              <strong>{itemCount}</strong>
            </div>

            <div className="summary-line">
              <span>SUBTOTAL</span>

              <strong>
                Rs. {total.toLocaleString()}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-grand-total">
              <span>TOTAL</span>

              <strong>
                Rs. {total.toLocaleString()}
              </strong>
            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={placingOrder || !user}
            >
              {placingOrder
                ? "PLACING ORDER..."
                : "PLACE ORDER"}

              <span>→</span>
            </button>

            {!user && (
              <p className="summary-login-text">
                Login is required to place
                your order.
              </p>
            )}

            <Link
              to="/menu"
              className="summary-menu-link"
            >
              ← CONTINUE SHOPPING
            </Link>

          </aside>
        </form>
      </main>
    </div>
  );
};

export default FoodCheckoutPage;