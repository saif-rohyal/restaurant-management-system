import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="site-header">
      <div className="container header-inner">

        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <span className="brand-mark">KR</span>

          <span className="brand-copy">
            <strong>Khan Restaurant</strong>
            <small>KALAM · SWAT</small>
          </span>
        </Link>

        <nav
          className={`main-nav ${
            menuOpen ? "mobile-open" : ""
          }`}
        >
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/rooms" onClick={closeMenu}>
            Rooms
          </Link>

          <Link to="/menu" onClick={closeMenu}>
            Restaurant
          </Link>

          <a href="/#experience" onClick={closeMenu}>
            Experience
          </a>

          <a href="/#destinations" onClick={closeMenu}>
            Destinations
          </a>

          <a href="/#contact" onClick={closeMenu}>
            Contact
          </a>
        </nav>

        <div className="header-actions">

          {!user ? (
            <>
              <Link
                to="/login"
                className="header-login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/rooms"
                className="header-book"
                onClick={closeMenu}
              >
                Book Your Stay
                <span>↗</span>
              </Link>
            </>
          ) : (
            <>
              {user.role !== "admin" && (
                <>
                  <span
                    className="header-login"
                    style={{
                      color: "#e3bd7b",
                      cursor: "default",
                    }}
                  >
                    Hi, {user.name}
                  </span>

                  <Link
                    to="/my-bookings"
                    className="header-login"
                    onClick={closeMenu}
                  >
                    My Rooms
                  </Link>

                  <Link
                    to="/my-food-orders"
                    className="header-login"
                    onClick={closeMenu}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/cart"
                    className="header-book"
                    onClick={closeMenu}
                  >
                    Cart
                    <span>↗</span>
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="header-book"
                  onClick={closeMenu}
                >
                  Admin Dashboard
                  <span>↗</span>
                </Link>
              )}

              <button
                type="button"
                className="header-login"
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className={`mobile-menu-btn ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
};

export default Header;