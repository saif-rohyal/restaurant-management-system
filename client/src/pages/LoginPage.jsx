import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(form.email, form.password);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

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
              WELCOME BACK
            </span>

            <h1>
              Your mountain
              <br />
              <em>escape awaits.</em>
            </h1>

            <p>
              Sign in to manage your reservations
              and continue planning your stay in Kalam.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-panel">

        <div className="auth-panel-inner">

          <Link to="/" className="auth-mobile-brand">
            KHAN RESTAURANT
          </Link>

          <div className="auth-heading">
            <span className="eyebrow">
              GUEST ACCOUNT
            </span>

            <h2>Welcome back.</h2>

            <p>
              Sign in to access your bookings and stay details.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">

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

            <div className="auth-input-group">
              <div className="auth-label-row">
                <label>Password</label>

                <span>Secure login</span>
              </div>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In ↗"}
            </button>

          </form>

          <div className="auth-divider">
            <span>NEW TO KHAN RESTAURANT?</span>
          </div>

          <Link
            to="/register"
            className="auth-secondary-btn"
          >
            Create Guest Account
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

export default LoginPage;