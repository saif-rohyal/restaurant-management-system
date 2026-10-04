import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";
import "./AdminFoodOrdersPage.css";

const AdminFoodOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/food-orders");

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Admin food orders error:",
        err
      );

      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load food orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      await api.put(
        `/food-orders/${orderId}/status`,
        { status }
      );

      await loadOrders();
    } catch (err) {
      console.error(
        "Order status update error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

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
    return `admin-order-status status-${status}`;
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const totalRevenue = orders
    .filter(
      (order) =>
        order.status !== "cancelled"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

  return (
    <div className="admin-food-orders-page">
      <Header />

      <main className="admin-food-orders-container">

        {/* PAGE HEADER */}

        <div className="admin-food-orders-heading">

          <div>
            <span>
              KHAN RESTAURANT · ADMIN
            </span>

            <h1>
              Food <em>orders.</em>
            </h1>

            <p>
              Manage restaurant orders and
              update their preparation status.
            </p>
          </div>

          <Link
            to="/admin"
            className="admin-back-button"
          >
            ← ADMIN DASHBOARD
          </Link>

        </div>

        {/* STATS */}

        <section className="admin-order-stats">

          <div className="admin-stat-card">
            <span>TOTAL ORDERS</span>
            <strong>{totalOrders}</strong>
          </div>

          <div className="admin-stat-card">
            <span>PENDING</span>
            <strong>{pendingOrders}</strong>
          </div>

          <div className="admin-stat-card">
            <span>PREPARING</span>
            <strong>{preparingOrders}</strong>
          </div>

          <div className="admin-stat-card">
            <span>COMPLETED</span>
            <strong>{completedOrders}</strong>
          </div>

          <div className="admin-stat-card revenue">
            <span>REVENUE</span>

            <strong>
              Rs.{" "}
              {totalRevenue.toLocaleString()}
            </strong>
          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="admin-orders-error">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="admin-orders-message">
            <span>
              LOADING FOOD ORDERS...
            </span>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="admin-orders-empty">

              <div>◇</div>

              <h2>
                No food orders yet.
              </h2>

              <p>
                Customer food orders will
                appear here when they are
                placed.
              </p>

            </div>
          )}

        {/* ORDERS */}

        {!loading &&
          orders.length > 0 && (
            <div className="admin-food-orders-list">

              {orders.map((order) => (
                <article
                  className="admin-food-order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}

                  <div className="admin-food-order-header">

                    <div>

                      <span className="admin-order-label">
                        ORDER
                      </span>

                      <h2>
                        #
                        {order._id
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

                      {order.status?.toUpperCase()}
                    </div>

                  </div>

                  {/* CUSTOMER INFO */}

                  <div className="admin-customer-section">

                    <div className="admin-customer-info">

                      <span>
                        CUSTOMER
                      </span>

                      <strong>
                        {order.user?.name ||
                          "Unknown customer"}
                      </strong>

                      <small>
                        {order.user?.email ||
                          "No email"}
                      </small>

                    </div>

                    <div className="admin-order-type">

                      <span>
                        ORDER TYPE
                      </span>

                      <strong>
                        {order.orderType}
                      </strong>

                    </div>

                    {order.roomNumber && (
                      <div className="admin-room-info">

                        <span>
                          ROOM
                        </span>

                        <strong>
                          {order.roomNumber}
                        </strong>

                      </div>
                    )}

                    <div className="admin-order-total">

                      <span>
                        TOTAL
                      </span>

                      <strong>
                        Rs.{" "}
                        {Number(
                          order.totalAmount
                        ).toLocaleString()}
                      </strong>

                    </div>

                  </div>

                  {/* FOOD ITEMS */}

                  <div className="admin-food-order-items">

                    {order.items?.map(
                      (item, index) => {

                        const food =
                          item.foodItem;

                        if (!food) {
                          return null;
                        }

                        return (
                          <div
                            className="admin-food-order-item"
                            key={
                              food._id ||
                              index
                            }
                          >

                            <div className="admin-food-item-image">

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

                            <div className="admin-food-item-info">

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

                            <strong className="admin-food-item-total">
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

                  {/* STATUS CONTROLS */}

                  <div className="admin-order-actions">

                    <span>
                      UPDATE STATUS
                    </span>

                    <div className="status-buttons">

                      <button
                        className={
                          order.status ===
                          "pending"
                            ? "active"
                            : ""
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "pending"
                          )
                        }
                      >
                        PENDING
                      </button>

                      <button
                        className={
                          order.status ===
                          "preparing"
                            ? "active"
                            : ""
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "preparing"
                          )
                        }
                      >
                        PREPARING
                      </button>

                      <button
                        className={
                          order.status ===
                          "ready"
                            ? "active"
                            : ""
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "ready"
                          )
                        }
                      >
                        READY
                      </button>

                      <button
                        className={
                          order.status ===
                          "completed"
                            ? "active"
                            : ""
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "completed"
                          )
                        }
                      >
                        COMPLETED
                      </button>

                      <button
                        className={
                          order.status ===
                          "cancelled"
                            ? "active cancelled"
                            : ""
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "cancelled"
                          )
                        }
                      >
                        CANCELLED
                      </button>

                    </div>

                    {updatingId ===
                      order._id && (
                      <small>
                        Updating order...
                      </small>
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

export default AdminFoodOrdersPage;