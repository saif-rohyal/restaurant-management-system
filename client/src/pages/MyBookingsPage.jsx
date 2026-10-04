import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

const MyBookingsPage = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await api.get("/bookings/my");
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return `booking-status status-${status}`;
  };

  return (
    <div className="bookings-page">

      <Header />

      <section className="bookings-hero">
        <div className="bookings-hero-overlay"></div>

        <div className="bookings-hero-content">
          <span className="eyebrow light">
            GUEST AREA
          </span>

          <h1>
            Your mountain
            <br />
            <em>reservations.</em>
          </h1>

          <p>
            View and manage your upcoming and previous
            stays at Khan Restaurant Kalam.
          </p>
        </div>
      </section>

      <main className="bookings-section">

        <div className="bookings-heading">
          <div>
            <span className="eyebrow">
              MY BOOKINGS
            </span>

            <h2>
              Your stay details
            </h2>
          </div>

          <Link
            to="/rooms"
            className="gold-btn"
          >
            Book Another Stay ↗
          </Link>
        </div>

        {loading && (
          <div className="bookings-loading">
            <div className="loading-spinner"></div>
            <p>Loading your reservations...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bookings-error">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bookings-empty">

            <div className="empty-icon">
              KR
            </div>

            <h3>
              No bookings yet
            </h3>

            <p>
              You haven't made a reservation yet.
              Explore our rooms and start planning
              your Kalam escape.
            </p>

            <Link
              to="/rooms"
              className="gold-btn"
            >
              Explore Rooms ↗
            </Link>

          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="bookings-list">

            {bookings.map((booking) => {

              const room = booking.room;

              return (
                <article
                  key={booking._id}
                  className="booking-card"
                >

                  <div className="booking-card-image">

                    {room?.images?.[0] ? (
                      <img
                        src={room.images[0]}
                        alt={room.title || "Khan Restaurant room"}
                      />
                    ) : (
                      <div className="booking-image-placeholder">
                        KHAN
                      </div>
                    )}

                  </div>

                  <div className="booking-card-content">

                    <div className="booking-card-top">

                      <div>
                        <span className="booking-label">
                          ROOM
                        </span>

                        <h3>
                          {room?.title || "Reserved Room"}
                        </h3>
                      </div>

                      <span
                        className={getStatusClass(
                          booking.status
                        )}
                      >
                        {booking.status || "pending"}
                      </span>

                    </div>

                    <div className="booking-details-grid">

                      <div>
                        <span>CHECK-IN</span>
                        <strong>
                          {formatDate(booking.checkIn)}
                        </strong>
                      </div>

                      <div>
                        <span>CHECK-OUT</span>
                        <strong>
                          {formatDate(booking.checkOut)}
                        </strong>
                      </div>

                      <div>
                        <span>GUESTS</span>
                        <strong>
                          {booking.numberOfGuests}
                        </strong>
                      </div>

                      <div>
                        <span>NIGHTS</span>
                        <strong>
                          {booking.numberOfNights}
                        </strong>
                      </div>

                    </div>

                    <div className="booking-card-bottom">

                      <div>
                        <span>
                          TOTAL STAY
                        </span>

                        <strong>
                          Rs.{" "}
                          {Number(
                            booking.totalAmount || 0
                          ).toLocaleString()}
                        </strong>
                      </div>

                      <div>
                        <span>
                          PAYMENT
                        </span>

                        <strong className="payment-method">
                          {booking.paymentMethod || "cash"}
                        </strong>
                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
};

export default MyBookingsPage;