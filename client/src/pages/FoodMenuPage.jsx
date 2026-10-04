import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import "./FoodMenuPage.css";

const FoodMenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addedItemId, setAddedItemId] = useState(null);
  const [toast, setToast] = useState("");

  const { items, addToCart } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const [foodsRes, categoriesRes] = await Promise.all([
          api.get("/foods"),
          api.get("/categories"),
        ]);

        setFoods(
          Array.isArray(foodsRes.data)
            ? foodsRes.data
            : []
        );

        setCategories(
          Array.isArray(categoriesRes.data)
            ? categoriesRes.data
            : []
        );
      } catch (err) {
        console.error("Menu loading error:", err);

        setError(
          "Unable to load the menu. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food);

    setAddedItemId(food._id);
    setToast(food.name);

    setTimeout(() => {
      setAddedItemId(null);
    }, 1200);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const filteredFoods =
    selectedCategory === "all"
      ? foods
      : foods.filter((food) => {
          const categoryId =
            typeof food.category === "object"
              ? food.category?._id
              : food.category;

          return categoryId === selectedCategory;
        });

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="food-page">
      <Header />

      {/* HERO */}
      <section className="food-hero">
        <div className="food-container food-hero-inner">
          <div className="food-hero-content">
            <span className="food-eyebrow">
              KHAN RESTAURANT · KALAM
            </span>

            <h1>
              Taste the
              <br />
              <em>heart of Kalam.</em>
            </h1>

            <p>
              Explore our menu and enjoy familiar flavours
              after a day surrounded by the mountains.
            </p>
          </div>

          <Link
            to="/cart"
            className="food-cart-button"
          >
            <span className="food-cart-label">
              CART
            </span>

            <span className="food-cart-count">
              {cartCount}
            </span>

            <b>↗</b>
          </Link>
        </div>
      </section>

      {/* MENU */}
      <main className="food-main food-container">

        {/* CATEGORIES */}
        <div className="food-categories">
          <button
            className={
              selectedCategory === "all"
                ? "food-category active"
                : "food-category"
            }
            onClick={() =>
              setSelectedCategory("all")
            }
          >
            ALL
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              className={
                selectedCategory === category._id
                  ? "food-category active"
                  : "food-category"
              }
              onClick={() =>
                setSelectedCategory(category._id)
              }
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="food-message">
            <span>LOADING MENU...</span>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="food-error">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredFoods.length === 0 && (
            <div className="food-message">
              <h2>No menu items found.</h2>

              <p>
                Food items will appear here once they
                are added to the restaurant menu.
              </p>
            </div>
          )}

        {/* FOOD GRID */}
        {!loading &&
          !error &&
          filteredFoods.length > 0 && (
            <div className="food-grid">
              {filteredFoods.map((food) => (
                <article
                  className="food-card"
                  key={food._id}
                >
                  {/* IMAGE */}
                  <div className="food-image">
                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.name}
                      />
                    ) : (
                      <div className="food-image-placeholder">
                        KHAN RESTAURANT
                      </div>
                    )}

                    {food.category?.name && (
                      <span className="food-card-category">
                        {food.category.name}
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="food-card-content">

                    <div className="food-card-top">
                      <h2>{food.name}</h2>

                      <strong>
                        Rs.{" "}
                        {Number(
                          food.price
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <p>
                      {food.description ||
                        "Prepared fresh at Khan Restaurant."}
                    </p>

                    {/* ADD TO CART */}
                    <button
                      className={
                        addedItemId === food._id
                          ? "food-add-button added"
                          : "food-add-button"
                      }
                      onClick={() =>
                        handleAddToCart(food)
                      }
                    >
                      <span className="food-button-text">
                        {addedItemId === food._id
                          ? "ADDED TO CART"
                          : "ADD TO CART"}
                      </span>

                      <span className="food-button-icon">
                        {addedItemId === food._id
                          ? "✓"
                          : "+"}
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
      </main>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="food-toast">
          <span className="food-toast-icon">
            ✓
          </span>

          <div className="food-toast-content">
            <strong>Added to cart</strong>

            <small>{toast}</small>
          </div>

          <Link
            to="/cart"
            className="food-toast-cart"
          >
            VIEW CART
          </Link>
        </div>
      )}
    </div>
  );
};

export default FoodMenuPage;