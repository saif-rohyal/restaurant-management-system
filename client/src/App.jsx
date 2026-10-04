import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";

import FoodMenuPage from "./pages/FoodMenuPage";
import CartPage from "./pages/CartPage";
import FoodCheckoutPage from "./pages/FoodCheckoutPage";
import MyFoodOrdersPage from "./pages/MyFoodOrdersPage";
import AdminFoodOrdersPage from "./pages/AdminFoodOrdersPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/AdminDashboard";
import RoomManagementPage from "./pages/RoomManagementPage";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>

            {/* Main Website */}
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route
              path="/booking/:roomId"
              element={<BookingPage />}
            />
            <Route
              path="/my-bookings"
              element={<MyBookingsPage />}
            />

            {/* Food Ordering */}
            <Route
              path="/menu"
              element={<FoodMenuPage />}
            />
            <Route
              path="/cart"
              element={<CartPage />}
            />
            <Route
              path="/food-checkout"
              element={<FoodCheckoutPage />}
            />
            <Route
              path="/my-food-orders"
              element={<MyFoodOrdersPage />}
            />

            {/* Authentication */}
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/register"
              element={<RegisterPage />}
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />
            <Route
              path="/admin/rooms"
              element={<RoomManagementPage />}
            />
            <Route
              path="/admin/food-orders"
              element={<AdminFoodOrdersPage />}
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;