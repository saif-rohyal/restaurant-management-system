import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  pricePerNight: "",
  capacity: "",
  roomType: "Standard",
  amenities: "",
  images: "",
};

const RoomManagementPage = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const { data } = await api.get("/rooms");

      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.pricePerNight ||
      !form.capacity ||
      !form.roomType
    ) {
      alert(
        "Please fill in title, price, capacity and room type."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        roomType: form.roomType,

        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        images: form.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingId) {
        const { data } = await api.put(
          `/rooms/${editingId}`,
          payload
        );

        setRooms((current) =>
          current.map((room) =>
            room._id === editingId ? data : room
          )
        );

        alert("Room updated successfully.");
      } else {
        const { data } = await api.post(
          "/rooms",
          payload
        );

        setRooms((current) => [
          data,
          ...current,
        ]);

        alert("Room created successfully.");
      }

      resetForm();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      alert(
        err.response?.data?.message ||
          "Unable to save room."
      );
    } finally {
      setSaving(false);
    }
  };

  const editRoom = (room) => {
    setEditingId(room._id);

    setForm({
      title: room.title || "",
      description: room.description || "",
      pricePerNight: room.pricePerNight || "",
      capacity: room.capacity || "",
      roomType: room.roomType || "Standard",

      amenities: Array.isArray(room.amenities)
        ? room.amenities.join(", ")
        : "",

      images: Array.isArray(room.images)
        ? room.images.join(", ")
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteRoom = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/rooms/${roomId}`);

      setRooms((current) =>
        current.filter(
          (room) => room._id !== roomId
        )
      );

      if (editingId === roomId) {
        resetForm();
      }

      alert("Room deleted successfully.");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      alert(
        err.response?.data?.message ||
          "Unable to delete room."
      );
    }
  };

  return (
    <div className="room-management-page">

      <Header />

      {/* HERO */}
      <section className="room-management-hero">
        <div className="room-management-overlay"></div>

        <div className="room-management-hero-content">
          <span className="eyebrow light">
            ADMINISTRATION
          </span>

          <h1>
            Room
            <br />
            <em>Management.</em>
          </h1>

          <p>
            Create, update and manage rooms at
            Khan Restaurant Kalam.
          </p>
        </div>
      </section>

      <main className="room-management-section">

        {/* TOP BAR */}
        <div className="room-management-topbar">

          <div>
            <span className="eyebrow">
              ROOMS
            </span>

            <h2>
              {editingId
                ? "Edit room"
                : "Add a new room"}
            </h2>
          </div>

          <Link
            to="/admin"
            className="admin-back-btn"
          >
            ← Dashboard
          </Link>

        </div>

        {/* FORM */}
        <div className="room-management-form-card">

          <form onSubmit={handleSubmit}>

            <div className="room-form-grid">

              {/* TITLE */}
              <div className="room-form-field">
                <label>
                  Room Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Deluxe Mountain View"
                />
              </div>

              {/* ROOM TYPE */}
              <div className="room-form-field">
                <label>
                  Room Type *
                </label>

                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                >
                  <option value="Standard">
                    Standard
                  </option>

                  <option value="Deluxe">
                    Deluxe
                  </option>

                  <option value="Family">
                    Family
                  </option>

                  <option value="Mountain View">
                    Mountain View
                  </option>
                </select>
              </div>

              {/* PRICE */}
              <div className="room-form-field">
                <label>
                  Price Per Night *
                </label>

                <input
                  type="number"
                  name="pricePerNight"
                  min="0"
                  value={form.pricePerNight}
                  onChange={handleChange}
                  placeholder="5000"
                />
              </div>

              {/* CAPACITY */}
              <div className="room-form-field">
                <label>
                  Guest Capacity *
                </label>

                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="2"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="room-form-field full">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the room, mountain view and guest experience..."
                />
              </div>

              {/* AMENITIES */}
              <div className="room-form-field full">

                <label>
                  Amenities

                  <small>
                    Separate each with a comma
                  </small>
                </label>

                <input
                  type="text"
                  name="amenities"
                  value={form.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, TV, Heating, Breakfast"
                />

              </div>

              {/* IMAGES */}
              <div className="room-form-field full">

                <label>
                  Image URLs

                  <small>
                    Separate multiple URLs with commas
                  </small>
                </label>

                <input
                  type="text"
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  placeholder="https://example.com/room.jpg"
                />

              </div>

            </div>

            {/* FORM ACTIONS */}
            <div className="room-form-actions">

              <button
                type="submit"
                className="gold-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Room →"
                  : "Create Room →"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="room-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </div>

        {/* ROOM LIST HEADER */}
        <div className="room-management-list-header">

          <div>
            <span className="eyebrow">
              INVENTORY
            </span>

            <h2>
              All Rooms
            </h2>
          </div>

          <span>
            {rooms.length} rooms
          </span>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="admin-loading">
            <div className="loading-spinner"></div>

            <p>
              Loading rooms...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          rooms.length === 0 && (
            <div className="admin-empty">

              <div className="admin-empty-icon">
                KR
              </div>

              <h3>
                No rooms found
              </h3>

              <p>
                Create your first room using
                the form above.
              </p>

            </div>
          )}

        {/* ROOMS */}
        {!loading &&
          !error &&
          rooms.length > 0 && (

            <div className="room-management-grid">

              {rooms.map((room) => (

                <article
                  className="managed-room-card"
                  key={room._id}
                >

                  {/* IMAGE */}
                  <div className="managed-room-image">

                    {room.images?.[0] ? (
                      <img
                        src={room.images[0]}
                        alt={room.title}
                      />
                    ) : (
                      <div className="managed-room-placeholder">
                        KR
                      </div>
                    )}

                    <span>
                      {room.roomType}
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="managed-room-content">

                    <div className="managed-room-heading">

                      <h3>
                        {room.title}
                      </h3>

                      <strong>
                        Rs.{" "}
                        {Number(
                          room.pricePerNight || 0
                        ).toLocaleString()}

                        <small>
                          /night
                        </small>
                      </strong>

                    </div>

                    <p>
                      {room.description ||
                        "No description added."}
                    </p>

                    {/* META */}
                    <div className="managed-room-meta">

                      <span>
                        Guests:{" "}
                        {room.capacity}
                      </span>

                      <span>
                        {room.amenities?.length || 0}{" "}
                        amenities
                      </span>

                    </div>

                    {/* ACTIONS */}
                    <div className="managed-room-actions">

                      <button
                        type="button"
                        className="room-edit-btn"
                        onClick={() =>
                          editRoom(room)
                        }
                      >
                        Edit Room
                      </button>

                      <button
                        type="button"
                        className="room-delete-btn"
                        onClick={() =>
                          deleteRoom(room._id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

      </main>

    </div>
  );
};

export default RoomManagementPage;