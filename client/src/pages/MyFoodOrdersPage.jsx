import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";
import "./MyFoodOrdersPage.css";

const MyFoodOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/food-orders/my");

        setOrders(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "My food orders error:",
          err
        );

        if (err?.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Unable to load your food orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-PK",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    return `order-status status-${status}`;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "PENDING";

      case "preparing":
        return "PREPARING";

      case "ready":
        return "READY";

      case "completed":
        return "COMPLETED";

      case "cancelled":
        return "CANCELLED";

      default:
        return status?.toUpperCase() || "UNKNOWN";
    }
  };

  return (
    <div className="my-orders-page">
      <Header />

      <main className="my-orders-container">

        {/* HEADER */}
        <div className="my-orders-heading">
          <div>
            <span>
              KHAN RESTAURANT · KALAM
            </span>

            <h1>
              My food <em>orders.</em>
            </h1>

            <p>
              Keep track of your restaurant
              orders and their current status.
            </p>
          </div>

          <Link
            to="/menu"
            className="my-orders-menu-button"
          >
            ORDER MORE →
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="my-orders-message">
            <span>
              LOADING YOUR ORDERS...
            </span>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="my-orders-error">
            <strong>
              Unable to load orders
            </strong>

            <p>{error}</p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="my-orders-empty">
              <div className="empty-icon">
                ◇
              </div>

              <h2>
                No food orders yet.
              </h2>

              <p>
                Your restaurant orders will
                appear here after you place one.
              </p>

              <Link
                to="/menu"
                className="empty-menu-button"
              >
                EXPLORE MENU →
              </Link>
            </div>
          )}

        {/* ORDERS */}
        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="orders-list">

              {orders.map((order) => (
                <article
                  className="food-order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}
                  <div className="food-order-header">

                    <div>
                      <span className="order-label">
                        ORDER
                      </span>

                      <h2>
                        #{order._id
                          ?.slice(-6)
                          .toUpperCase()}
                      </h2>

                      <p>
                        {formatDate(
                          order.createdAt
                        )}{" "}
                        ·{" "}
                        {formatTime(
                          order.createdAt
                        )}
                      </p>
                    </div>

                    <div
                      className={getStatusClass(
                        order.status
                      )}
                    >
                      <span className="status-dot" />

                      {getStatusLabel(
                        order.status
                      )}
                    </div>

                  </div>

                  {/* ORDER INFO */}
                  <div className="food-order-meta">

                    <div>
                      <span>
                        ORDER TYPE
                      </span>

                      <strong>
                        {order.orderType}
                      </strong>
                    </div>

                    {order.roomNumber && (
                      <div>
                        <span>
                          ROOM
                        </span>

                        <strong>
                          {order.roomNumber}
                        </strong>
                      </div>
                    )}

                    <div>
                      <span>
                        ITEMS
                      </span>

                      <strong>
                        {order.items?.reduce(
                          (total, item) =>
                            total +
                            item.quantity,
                          0
                        ) || 0}
                      </strong>
                    </div>

                    <div>
                      <span>
                        TOTAL
                      </span>

                      <strong className="order-total">
                        Rs.{" "}
                        {Number(
                          order.totalAmount
                        ).toLocaleString()}
                      </strong>
                    </div>

                  </div>

                  {/* ORDER ITEMS */}
                  <div className="food-order-items">

                    {order.items?.map(
                      (item, index) => {
                        const food =
                          item.foodItem;

                        if (!food) {
                          return null;
                        }

                        return (
                          <div
                            className="food-order-item"
                            key={
                              food._id ||
                              index
                            }
                          >

                            <div className="food-order-item-image">
                              {food.image ? (
                                <img
                                  src={
                                    food.image
                                  }
                                  alt={
                                    food.name
                                  }
                                />
                              ) : (
                                <span>
                                  KHAN
                                </span>
                              )}
                            </div>

                            <div className="food-order-item-info">
                              <strong>
                                {food.name}
                              </strong>

                              <span>
                                Rs.{" "}
                                {Number(
                                  food.price
                                ).toLocaleString()}{" "}
                                ×{" "}
                                {item.quantity}
                              </span>
                            </div>

                            <strong className="food-order-item-total">
                              Rs.{" "}
                              {(
                                Number(
                                  food.price
                                ) *
                                item.quantity
                              ).toLocaleString()}
                            </strong>

                          </div>
                        );
                      }
                    )}

                  </div>

                </article>
              ))}

            </div>
          )}

      </main>
    </div>
  );
};

export default MyFoodOrdersPage;