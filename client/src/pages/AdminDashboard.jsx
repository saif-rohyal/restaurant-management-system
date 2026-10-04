import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const [bookingsResponse, foodOrdersResponse] =
        await Promise.all([
          api.get("/bookings"),
          api.get("/food-orders"),
        ]);

      setBookings(
        Array.isArray(bookingsResponse.data)
          ? bookingsResponse.data
          : []
      );

      setFoodOrders(
        Array.isArray(foodOrdersResponse.data)
          ? foodOrdersResponse.data
          : []
      );
    } catch (err) {
      console.error("Admin dashboard error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [navigate]);

  /* =========================
     ROOM BOOKING ACTIONS
  ========================= */

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await api.put(
        `/bookings/${bookingId}/status`,
        { status }
      );

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? data : booking
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to update booking status."
      );
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/bookings/${bookingId}`);

      setBookings((current) =>
        current.filter(
          (booking) => booking._id !== bookingId
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to delete booking."
      );
    }
  };

  /* =========================
     HELPERS
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================
     ROOM STATS
  ========================= */

  const pending = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmed = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const checkedIn = bookings.filter(
    (booking) => booking.status === "checked-in"
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const cancelled = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const roomRevenue = bookings
    .filter(
      (booking) => booking.status !== "cancelled"
    )
    .reduce(
      (sum, booking) =>
        sum + Number(booking.totalAmount || 0),
      0
    );

  /* =========================
     FOOD STATS
  ========================= */

  const foodPending = foodOrders.filter(
    (order) => order.status === "pending"
  ).length;

  const foodPreparing = foodOrders.filter(
    (order) => order.status === "preparing"
  ).length;

  const foodReady = foodOrders.filter(
    (order) => order.status === "ready"
  ).length;

  const foodCompleted = foodOrders.filter(
    (order) => order.status === "completed"
  ).length;

  const foodCancelled = foodOrders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const foodRevenue = foodOrders
    .filter(
      (order) => order.status !== "cancelled"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

  const totalRevenue = roomRevenue + foodRevenue;

  /* =========================
     ROOM FILTERS
  ========================= */

  const roomTypes = useMemo(() => {
    const types = bookings
      .map((booking) => booking.room?.roomType)
      .filter(Boolean);

    return [...new Set(types)];
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const guest =
        booking.guestName?.toLowerCase() || "";

      const email =
        booking.user?.email?.toLowerCase() || "";

      const phone =
        booking.phone?.toLowerCase() || "";

      const room =
        booking.room?.title?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        guest.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        room.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter;

      const matchesRoom =
        roomFilter === "all" ||
        booking.room?.roomType === roomFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRoom
      );
    });
  }, [
    bookings,
    search,
    statusFilter,
    roomFilter,
  ]);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="admin-page">
      <Header />

      {/* HERO */}

      <section className="admin-hero">
        <div className="admin-hero-overlay" />

        <div className="admin-hero-content">
          <span className="eyebrow light">
            KHAN RESTAURANT · MANAGEMENT
          </span>

          <h1>
            Control your
            <br />
            <em>entire operation.</em>
          </h1>

          <p>
            Manage reservations, rooms, food orders,
            guests and revenue from one central dashboard.
          </p>
        </div>
      </section>

      <main className="admin-section">

        {/* TOP BAR */}

        <div className="admin-topbar">
          <div>
            <span className="eyebrow">
              ADMIN OVERVIEW
            </span>

            <h2>Restaurant management</h2>
          </div>

          <div className="admin-top-actions">
            <button
              type="button"
              className="admin-refresh"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

            <Link
              to="/admin/rooms"
              className="gold-btn"
            >
              Manage Rooms →
            </Link>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* MAIN STATS */}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <span>ROOM BOOKINGS</span>
            <strong>{bookings.length}</strong>
            <small>All reservations</small>
          </div>

          <div className="admin-stat-card pending-card">
            <span>PENDING BOOKINGS</span>
            <strong>{pending}</strong>
            <small>Need attention</small>
          </div>

          <div className="admin-stat-card">
            <span>FOOD ORDERS</span>
            <strong>{foodOrders.length}</strong>
            <small>All food orders</small>
          </div>

          <div className="admin-stat-card food-card">
            <span>FOOD PENDING</span>
            <strong>{foodPending}</strong>
            <small>Kitchen queue</small>
          </div>

          <div className="admin-stat-card">
            <span>ACTIVE GUESTS</span>
            <strong>{checkedIn}</strong>
            <small>Currently checked-in</small>
          </div>

          <div className="admin-stat-card revenue">
            <span>TOTAL REVENUE</span>
            <strong>
              Rs. {totalRevenue.toLocaleString()}
            </strong>
            <small>
              Rooms + food · cancelled excluded
            </small>
          </div>

        </section>

        {/* MANAGEMENT CARDS */}

        <section className="admin-management-grid">

          <div className="admin-management-card">
            <div className="management-card-icon">
              01
            </div>

            <div className="management-card-content">
              <span>ACCOMMODATION</span>

              <h3>Room bookings</h3>

              <p>
                Manage reservations, guest details,
                check-ins, payments and booking status.
              </p>

              <div className="management-card-stats">
                <span>
                  {confirmed} CONFIRMED
                </span>

                <span>
                  {pending} PENDING
                </span>
              </div>

              <a
                href="#bookings"
                className="management-link"
              >
                MANAGE BOOKINGS →
              </a>
            </div>
          </div>

          <div className="admin-management-card featured">
            <div className="management-card-icon">
              02
            </div>

            <div className="management-card-content">
              <span>RESTAURANT</span>

              <h3>Food orders</h3>

              <p>
                View incoming food orders and control
                their preparation and completion status.
              </p>

              <div className="management-card-stats">
                <span>
                  {foodPending} PENDING
                </span>

                <span>
                  {foodPreparing} PREPARING
                </span>
              </div>

              <Link
                to="/admin/food-orders"
                className="management-link"
              >
                MANAGE FOOD ORDERS →
              </Link>
            </div>
          </div>

          <div className="admin-management-card">
            <div className="management-card-icon">
              03
            </div>

            <div className="management-card-content">
              <span>PROPERTY</span>

              <h3>Rooms & inventory</h3>

              <p>
                Add rooms, update prices, edit amenities
                and maintain your accommodation inventory.
              </p>

              <div className="management-card-stats">
                <span>
                  ROOM MANAGEMENT
                </span>
              </div>

              <Link
                to="/admin/rooms"
                className="management-link"
              >
                MANAGE ROOMS →
              </Link>
            </div>
          </div>

        </section>

        {/* REVENUE STRIP */}

        <section className="admin-revenue-strip">

          <div>
            <span>ROOM REVENUE</span>
            <strong>
              Rs. {roomRevenue.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>FOOD REVENUE</span>
            <strong>
              Rs. {foodRevenue.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>COMPLETED FOOD ORDERS</span>
            <strong>{foodCompleted}</strong>
          </div>

          <div>
            <span>CANCELLED ORDERS</span>
            <strong>{foodCancelled}</strong>
          </div>

        </section>

        {/* ROOM BOOKINGS */}

        <div
          className="admin-table-wrapper"
          id="bookings"
        >

          <div className="admin-table-heading">
            <div>
              <span className="eyebrow">
                RESERVATIONS
              </span>

              <h3>Room bookings</h3>
            </div>

            <span className="admin-count">
              {filteredBookings.length} of{" "}
              {bookings.length}
            </span>
          </div>

          {/* FILTERS */}

          <div className="admin-filters">

            <div className="admin-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search guest, email, phone or room..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="checked-in">
                Checked-in
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

            <select
              value={roomFilter}
              onChange={(event) =>
                setRoomFilter(event.target.value)
              }
            >
              <option value="all">
                All Room Types
              </option>

              {roomTypes.map((type) => (
                <option
                  value={type}
                  key={type}
                >
                  {type}
                </option>
              ))}
            </select>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="admin-loading">
              <div className="loading-spinner" />
              <p>
                Loading dashboard...
              </p>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            bookings.length === 0 && (
              <div className="admin-empty">
                <div className="admin-empty-icon">
                  KR
                </div>

                <h3>No bookings yet</h3>

                <p>
                  Customer reservations will appear
                  here once a booking is created.
                </p>

                <Link
                  to="/rooms"
                  className="gold-btn"
                >
                  Explore Rooms →
                </Link>
              </div>
            )}

          {/* NO FILTER RESULTS */}

          {!loading &&
            !error &&
            bookings.length > 0 &&
            filteredBookings.length === 0 && (
              <div className="admin-empty">
                <div className="admin-empty-icon">
                  ?
                </div>

                <h3>
                  No matching bookings
                </h3>

                <p>
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  className="admin-clear-btn"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setRoomFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}

          {/* BOOKINGS */}

          {!loading &&
            !error &&
            filteredBookings.length > 0 && (
              <div className="admin-bookings">

                {filteredBookings.map((booking) => {

                  const room = booking.room;
                  const user = booking.user;

                  return (
                    <div
                      className="admin-booking"
                      key={booking._id}
                    >

                      <div className="admin-booking-main">

                        <div className="admin-room">
                          {room?.images?.[0] ? (
                            <img
                              src={room.images[0]}
                              alt={
                                room.title || "Room"
                              }
                            />
                          ) : (
                            <div className="admin-room-placeholder">
                              KR
                            </div>
                          )}
                        </div>

                        <div className="admin-guest">
                          <span className="admin-label">
                            GUEST
                          </span>

                          <h4>
                            {booking.guestName}
                          </h4>

                          <p>
                            {user?.email || "-"}
                          </p>

                          <small>
                            {booking.phone || "-"}
                          </small>
                        </div>

                        <div className="admin-room-info">
                          <span className="admin-label">
                            ROOM
                          </span>

                          <strong>
                            {room?.title ||
                              "Reserved Room"}
                          </strong>

                          <small>
                            {room?.roomType || "-"}
                          </small>
                        </div>

                        <div className="admin-dates">
                          <span className="admin-label">
                            STAY
                          </span>

                          <strong>
                            {formatDate(
                              booking.checkIn
                            )}
                          </strong>

                          <small>
                            to{" "}
                            {formatDate(
                              booking.checkOut
                            )}
                          </small>

                          <small>
                            {booking.numberOfNights || 0}{" "}
                            night(s)
                          </small>
                        </div>

                        <div className="admin-total">
                          <span className="admin-label">
                            TOTAL
                          </span>

                          <strong>
                            Rs.{" "}
                            {Number(
                              booking.totalAmount || 0
                            ).toLocaleString()}
                          </strong>

                          <small>
                            {booking.numberOfGuests || 0}{" "}
                            guest(s)
                          </small>

                          <small>
                            {booking.paymentMethod ||
                              "cash"}
                          </small>
                        </div>

                      </div>

                      <div className="admin-booking-actions">

                        <div
                          className={`admin-status-badge status-${
                            booking.status || "pending"
                          }`}
                        >
                          {(booking.status ||
                            "pending")
                            .replace("-", " ")
                            .toUpperCase()}
                        </div>

                        <select
                          value={
                            booking.status ||
                            "pending"
                          }
                          onChange={(event) =>
                            updateBookingStatus(
                              booking._id,
                              event.target.value
                            )
                          }
                          className="admin-status-select"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="checked-in">
                            Checked-in
                          </option>

                          <option value="completed">
                            Completed
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>

                        <button
                          type="button"
                          className="admin-delete"
                          onClick={() =>
                            deleteBooking(
                              booking._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;