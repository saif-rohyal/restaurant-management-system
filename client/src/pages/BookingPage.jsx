import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    guestName: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    paymentMethod: "cash",
  });

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoadingRoom(true);
        setError("");

        const { data } = await api.get(`/rooms/${roomId}`);
        setRoom(data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Unable to load this room."
        );
      } finally {
        setLoadingRoom(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;

    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);

    const difference = end - start;

    if (difference <= 0) return 0;

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }, [form.checkIn, form.checkOut]);

  const total = nights * (room?.pricePerNight || 0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!form.guestName || !form.phone) {
      setError("Please enter your name and phone number.");
      return;
    }

    if (!form.checkIn || !form.checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (
      Number(form.numberOfGuests) < 1 ||
      Number(form.numberOfGuests) > room.capacity
    ) {
      setError(
        `This room allows up to ${room.capacity} guests.`
      );
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/bookings", {
        roomId,
        guestName: form.guestName,
        phone: form.phone,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        numberOfGuests: Number(form.numberOfGuests),
        paymentMethod: form.paymentMethod,
      });

      setSuccess(
        "Your booking request has been submitted successfully."
      );

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1200);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to complete your booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRoom) {
    return (
      <div className="booking-page">
        <Header />

        <div className="booking-loading">
          <div className="loading-spinner"></div>
          <p>Preparing your room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="booking-page">
        <Header />

        <div className="booking-error-page">
          <h1>Room not found</h1>
          <p>
            We couldn't find the room you selected.
          </p>

          <Link to="/rooms" className="gold-btn">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Header />

      {/* PAGE HERO */}
      <section className="booking-hero">
        <div
          className="booking-hero-bg"
          style={{
            backgroundImage: `url(${
              room.images?.[0] ||
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1800&q=90"
            })`,
          }}
        ></div>

        <div className="booking-hero-overlay"></div>

        <div className="container booking-hero-content">
          <span className="eyebrow light">
            KHAN RESTAURANT · KALAM
          </span>

          <h1>
            Reserve your
            <br />
            <em>mountain stay.</em>
          </h1>

          <p>
            Choose your dates and tell us a little
            about your stay.
          </p>
        </div>
      </section>

      {/* BOOKING CONTENT */}
      <section className="booking-section">
        <div className="container booking-layout">

          {/* ROOM SUMMARY */}
          <div className="booking-room">

            <div className="booking-room-image">
              <img
                src={
                  room.images?.[0] ||
                  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=90"
                }
                alt={room.title}
              />

              <span className="booking-room-badge">
                {room.roomType}
              </span>
            </div>

            <div className="booking-room-info">
              <span className="eyebrow">
                YOUR SELECTED ROOM
              </span>

              <h2>{room.title}</h2>

              <p>
                {room.description ||
                  "A comfortable room for a peaceful stay in Kalam."}
              </p>

              <div className="booking-room-meta">
                <span>
                  Up to {room.capacity} guests
                </span>

                <span>
                  Mountain destination
                </span>
              </div>

              <div className="booking-amenities">
                {(room.amenities || []).map((amenity) => (
                  <span key={amenity}>
                    {amenity}
                  </span>
                ))}
              </div>

              <Link to="/rooms" className="back-rooms-link">
                ← Choose another room
              </Link>
            </div>

          </div>

          {/* FORM */}
          <div className="booking-form-card">

            <div className="booking-form-heading">
              <span className="eyebrow">
                BOOK YOUR STAY
              </span>

              <h2>Guest details</h2>

              <p>
                Complete the information below to
                request your reservation.
              </p>
            </div>

            {error && (
              <div className="booking-alert booking-alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="booking-alert booking-alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="booking-form-grid">

                <div className="booking-input-group">
                  <label>Guest Name</label>

                  <input
                    type="text"
                    name="guestName"
                    value={form.guestName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Check-in</label>

                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Check-out</label>

                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Guests</label>

                  <select
                    name="numberOfGuests"
                    value={form.numberOfGuests}
                    onChange={handleChange}
                  >
                    {Array.from(
                      { length: room.capacity },
                      (_, index) => index + 1
                    ).map((number) => (
                      <option
                        key={number}
                        value={number}
                      >
                        {number}{" "}
                        {number === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="booking-input-group">
                  <label>Payment Method</label>

                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="cash">
                      Cash at Hotel
                    </option>

                    <option value="card">
                      Card
                    </option>

                    <option value="online">
                      Online
                    </option>
                  </select>
                </div>

              </div>

              {/* PRICE SUMMARY */}
              <div className="booking-summary">

                <div>
                  <span>Price per night</span>
                  <strong>
                    Rs.{" "}
                    {Number(
                      room.pricePerNight
                    ).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Number of nights</span>
                  <strong>{nights || 0}</strong>
                </div>

                <div className="booking-total">
                  <span>Total stay</span>

                  <strong>
                    Rs.{" "}
                    {Number(total).toLocaleString()}
                  </strong>
                </div>

              </div>

              <button
                type="submit"
                className="booking-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Confirm Booking Request ↗"}
              </button>

              <p className="booking-note">
                Your reservation will be submitted as
                pending and can be confirmed by the hotel.
              </p>

            </form>

          </div>

        </div>
      </section>
    </div>
  );
};

export default BookingPage;