import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

const fallbackImage =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=90";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/rooms");

        console.log("ROOM API RESPONSE:", response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.rooms || [];

        setRooms(data);
      } catch (err) {
        console.error("ROOM API ERROR:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load rooms."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const filteredRooms =
    filter === "All"
      ? rooms
      : rooms.filter((room) => room.roomType === filter);

  return (
    <div className="rooms-page">
      <Header />

      {/* HERO */}
      <section className="rooms-hero">
        <div className="rooms-hero-bg"></div>

        <div className="rooms-hero-content container">
          <span className="eyebrow light">
            STAY IN KALAM · KHAN RESTAURANT
          </span>

          <h1>
            Rooms designed for
            <br />
            <em>peaceful escapes.</em>
          </h1>

          <p>
            Wake up to mountain air, warm hospitality and beautifully
            comfortable spaces in the heart of Kalam.
          </p>

          <div className="rooms-hero-stats">
            <div className="rooms-hero-stat">
              <strong>30</strong>
              <span>Guest Rooms</span>
            </div>

            <div className="rooms-hero-stat">
              <strong>Mountain</strong>
              <span>Views</span>
            </div>

            <div className="rooms-hero-stat">
              <strong>Premium</strong>
              <span>Hospitality</span>
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="rooms-section">
        <div className="container">

          <div className="section-heading rooms-heading">
            <div>
              <span className="eyebrow">
                OUR ACCOMMODATION
              </span>

              <h2>
                Find your perfect room.
              </h2>

              <p>
                Choose from comfortable rooms for couples,
                groups and families visiting Kalam.
              </p>
            </div>

            <div className="room-filters">
              {["All", "Standard", "Deluxe", "Family"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`filter-btn ${
                    filter === type ? "selected" : ""
                  }`}
                  onClick={() => setFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS */}
          {loading && (
            <div className="rooms-loading">
              <div className="loading-spinner"></div>
              <p>Loading your rooms...</p>
            </div>
          )}

          {error && !loading && (
            <div className="rooms-error">
              <strong>Unable to load rooms</strong>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* ROOM COUNT */}
          {!loading && !error && (
            <>
              <div className="rooms-topline">
                <span>
                  Showing{" "}
                  <strong>{filteredRooms.length}</strong>{" "}
                  {filteredRooms.length === 1 ? "room" : "rooms"}
                </span>

                <span>
                  Kalam · Swat
                </span>
              </div>

              {/* ROOM GRID */}
              {filteredRooms.length > 0 ? (
                <div className="rooms-grid">
                  {filteredRooms.map((room, index) => (
                    <article
                      className="luxury-room-card"
                      key={room._id}
                    >
                      <div className="room-image-wrap">
                        <img
                          className="room-image"
                          src={room.images?.[0] || fallbackImage}
                          alt={room.title}
                        />

                        <div className="room-image-shade"></div>

                        <span className="room-type">
                          {room.roomType}
                        </span>

                        <span className="room-view">
                          VIEW ROOM ↗
                        </span>
                      </div>

                      <div className="room-card-body">

                        <span className="room-number">
                          ROOM {String(index + 1).padStart(2, "0")}
                        </span>

                        <h3>{room.title}</h3>

                        <p className="room-description">
                          {room.description ||
                            "A comfortable stay designed for guests exploring the beauty of Kalam."}
                        </p>

                        <div className="room-details">
                          <span>
                            Up to {room.capacity} guests
                          </span>

                          {(room.amenities || [])
                            .slice(0, 3)
                            .map((amenity) => (
                              <span key={amenity}>
                                {amenity}
                              </span>
                            ))}
                        </div>

                        <div className="room-card-footer">
                          <div className="room-price">
                            <strong>
                              Rs.{" "}
                              {Number(
                                room.pricePerNight
                              ).toLocaleString()}
                            </strong>

                            <small>
                              per night
                            </small>
                          </div>

                          <Link
                            to={`/booking/${room._id}`}
                            className="room-book-btn"
                          >
                            Book Now ↗
                          </Link>
                        </div>

                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rooms-empty">
                  <h3>No rooms found</h3>
                  <p>
                    Try selecting another room category.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
};

export default RoomsPage;