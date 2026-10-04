import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register(
        form.name,
        form.email,
        form.password
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT VISUAL */}
      <div className="auth-visual">
        <div className="auth-visual-image"></div>
        <div className="auth-visual-overlay"></div>

        <div className="auth-visual-content">

          <Link to="/" className="auth-brand">
            <span>KR</span>

            <div>
              <strong>Khan Restaurant</strong>
              <small>KALAM · SWAT</small>
            </div>
          </Link>

          <div className="auth-quote">
            <span className="eyebrow light">
              BEGIN YOUR JOURNEY
            </span>

            <h1>
              Your mountain
              <br />
              <em>escape starts here.</em>
            </h1>

            <p>
              Create your guest account and make your next
              stay in Kalam simple, comfortable and memorable.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="auth-panel">
        <div className="auth-panel-inner">

          <Link to="/" className="auth-mobile-brand">
            KHAN RESTAURANT
          </Link>

          <div className="auth-heading">
            <span className="eyebrow">
              GUEST ACCOUNT
            </span>

            <h2>Create your account.</h2>

            <p>
              Join Khan Restaurant and manage your
              reservations with ease.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* NAME */}
            <div className="auth-input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>

            {/* EMAIL */}
            <div className="auth-input-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}
            <div className="auth-input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="auth-input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account ↗"}
            </button>

          </form>

          <div className="auth-divider">
            <span>ALREADY HAVE AN ACCOUNT?</span>
          </div>

          <Link
            to="/login"
            className="auth-secondary-btn"
          >
            Sign In
          </Link>

          <Link
            to="/rooms"
            className="auth-back-link"
          >
            ← Continue browsing rooms
          </Link>

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
