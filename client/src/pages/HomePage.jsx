import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

const fallback =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=90";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/rooms")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.rooms || [];
        setRooms(list.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Header />

      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-content">
          <span className="eyebrow light">
            KHAN RESTAURANT · KALAM · SWAT
          </span>

          <h1>
            Where the mountains
            <br />
            become your <em>escape.</em>
          </h1>

          <p>
            A peaceful stay in the heart of Kalam. Comfortable rooms,
            authentic hospitality, beautiful mountain surroundings and
            memorable food — all in one destination.
          </p>

          <div className="hero-actions">
            <Link to="/rooms" className="gold-btn">
              Explore Rooms ↗
            </Link>

            <a href="#experience" className="hero-outline">
              Discover Kalam
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>30</strong>
              <span>Guest Rooms</span>
            </div>
            <div className="hero-stat">
              <strong>24/7</strong>
              <span>Hospitality</span>
            </div>
            <div className="hero-stat">
              <strong>Kalam</strong>
              <span>Swat Valley</span>
            </div>
          </div>
        </div>
      </section>

      <div className="booking-bar premium-booking-bar">
  <div className="booking-field">
    <span>DESTINATION</span>
    <strong>Kalam, Swat</strong>
  </div>

  <div className="booking-divider"></div>

  <div className="booking-field">
    <span>CHECK-IN</span>
    <strong>Select date</strong>
  </div>

  <div className="booking-divider"></div>

  <div className="booking-field">
    <span>CHECK-OUT</span>
    <strong>Select date</strong>
  </div>

  <div className="booking-divider"></div>

  <div className="booking-field">
    <span>GUESTS</span>
    <strong>2 Guests</strong>
  </div>

  <Link to="/rooms" className="booking-action">
    <span>Check Rooms</span>
    <strong>↗</strong>
  </Link>
</div>

      <section className="home-section">
        <div className="container intro-grid">
          <div className="intro-image">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCaHog0wHuMwyZxlfZCW_pT31ZvoYFpnoZWQTzozygQ&s=10"
              alt="Khan Restaurant Kalam accommodation"
            />
          </div>

          <div className="intro-copy">
            <span className="eyebrow">WELCOME TO KHAN RESTAURANT</span>

            <h2 className="section-title">
              Stay where nature
              <br />
              feels closer.
            </h2>

            <p className="section-text">
              Leave the noise behind and experience Kalam at a slower,
              more beautiful pace. Our rooms are designed around comfort,
              warmth and the natural character of the valley.
            </p>

            <p className="section-text">
              Whether you are travelling as a couple, with friends or
              bringing the whole family, Khan Restaurant gives you a
              comfortable base from which to experience Swat.
            </p>

            <div className="gold-line" />

            <div className="signature">
              Khan Restaurant
              <small>KALAM · SWAT</small>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section dark-section" id="rooms">
        <div className="container">
          <div className="section-head-row">
            <div>
              <span className="eyebrow light">OUR ROOMS</span>
              <h2 className="section-title">
                Comfort with a
                <br />
                mountain view.
              </h2>
            </div>

            <div>
              <p className="section-text">
                From intimate two-seater rooms to spacious family
                accommodation, choose the stay that fits your journey.
              </p>

              <Link to="/rooms" className="section-link">
                VIEW ALL 30 ROOMS ↗
              </Link>
            </div>
          </div>

          <div className="home-room-grid premium-room-grid">
  {rooms.map((room) => (
    <Link
      to={`/booking/${room._id}`}
      className="home-room-card premium-room-card"
      key={room._id}
    >
      <div className="home-room-img premium-room-img">
        <img
          src={
            room.images?.[0] ||
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=90"
          }
          alt={room.title}
        />

        <div className="room-image-overlay">
          <span>VIEW ROOM ↗</span>
        </div>

        <span className="room-type-badge">
          {room.roomType}
        </span>
      </div>

      <div className="home-room-info premium-room-info">
        <div className="room-card-top">
          <span className="eyebrow light">
            {room.roomType}
          </span>

          <span className="room-capacity">
            Up to {room.capacity} guests
          </span>
        </div>

        <h3>{room.title}</h3>

        <p>
          Comfortable accommodation with warm hospitality
          and everything you need for a peaceful stay in Kalam.
        </p>

        <div className="room-amenities">
          <span>WiFi</span>
          <span>Hot Water</span>
          <span>Parking</span>
        </div>

        <div className="room-price-line">
          <strong>
            Rs. {Number(room.pricePerNight).toLocaleString()}
          </strong>

          <span>PER NIGHT ↗</span>
        </div>
      </div>
    </Link>
  ))}
</div>
        </div>
      </section>

      <section className="experience-premium" id="experience">
  <div className="experience-premium-image">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyqml9uP28CY3hS3Oa4gcWFkDo964Djjd32fnR2Rytg&s=10"
      alt="Kalam mountain experience"
    />

    <div className="experience-image-caption">
      <span>KHAN RESTAURANT</span>
      <strong>KALAM · SWAT</strong>
    </div>
  </div>

  <div className="experience-premium-content">
    <span className="eyebrow">THE KALAM EXPERIENCE</span>

    <h2 className="section-title">
      Come for the
      <br />
      <em>mountains.</em>
      <br />
      Stay for the memories.
    </h2>

    <p className="experience-lead">
      Kalam is more than a destination. It is a place to slow down,
      breathe deeper and reconnect with the people and moments that
      matter.
    </p>

    <div className="experience-features">

      <div className="experience-feature">
        <span className="experience-number">01</span>

        <div>
          <h3>Mountain Mornings</h3>
          <p>
            Wake up to fresh mountain air, peaceful surroundings
            and beautiful views of the valley.
          </p>
        </div>
      </div>

      <div className="experience-feature">
        <span className="experience-number">02</span>

        <div>
          <h3>Adventure Outside</h3>
          <p>
            Discover forests, rivers, mountain landscapes and
            the natural beauty surrounding Kalam.
          </p>
        </div>
      </div>

      <div className="experience-feature">
        <span className="experience-number">03</span>

        <div>
          <h3>Evenings Together</h3>
          <p>
            Return after a day of exploring and enjoy good food,
            comfortable rooms and warm hospitality.
          </p>
        </div>
      </div>

      <div className="experience-feature">
        <span className="experience-number">04</span>

        <div>
          <h3>Memories to Keep</h3>
          <p>
            Whether travelling with family, friends or someone
            special, make Kalam part of your story.
          </p>
        </div>
      </div>

    </div>

    <div className="experience-bottom">
      <div className="experience-signature">
        <span>YOUR ESCAPE</span>
        <strong>KALAM · SWAT</strong>
      </div>

      <Link to="/rooms" className="experience-book-btn">
        Plan Your Stay
        <span>↗</span>
      </Link>
    </div>
  </div>
</section>

     <section className="restaurant-section restaurant-premium" id="restaurant">
  <div className="container">

    <div className="restaurant-intro">
      <div>
        <span className="eyebrow">KHAN RESTAURANT · KALAM</span>

        <h2 className="section-title">
          Taste the heart
          <br />
          <em>of Kalam.</em>
        </h2>
      </div>

      <div className="restaurant-intro-text">
        <p>
          After a day among the mountains, come back to the flavours
          that make every journey memorable.
        </p>

        <span className="restaurant-location">
          AUTHENTIC FLAVOURS · WARM HOSPITALITY
        </span>
      </div>
    </div>

    <div className="restaurant-feature">

      <div className="restaurant-main-image">
        <img
          src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=90"
          alt="Khan Restaurant food"
        />

        <div className="restaurant-image-label">
          <span>01</span>
          <strong>LOCAL FLAVOURS</strong>
        </div>
      </div>

      <div className="restaurant-side-content">

        <div className="restaurant-side-image">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=90"
            alt="Restaurant interior"
          />
        </div>

        <div className="restaurant-story">
          <span className="eyebrow">THE DINING EXPERIENCE</span>

          <h3>
            Food, family
            <br />
            <em>&amp; mountain evenings.</em>
          </h3>

          <p>
            Whether it is breakfast before a day of adventure,
            lunch with family or a relaxed dinner after sunset,
            Khan Restaurant brings good food and warm hospitality
            together.
          </p>

          <p>
            Enjoy a relaxed atmosphere inspired by the natural
            beauty and welcoming spirit of Kalam.
          </p>

          <div className="restaurant-cta-group">
  <Link
    to="/menu"
    className="restaurant-cta"
  >
    Explore Menu
    <span>↗</span>
  </Link>

</div>
        </div>

      </div>
    </div>

    <div className="restaurant-highlights">

      <div className="restaurant-highlight">
        <span>01</span>
        <div>
          <strong>Local Flavours</strong>
          <p>Familiar Pakistani flavours for every journey.</p>
        </div>
      </div>

      <div className="restaurant-highlight">
        <span>02</span>
        <div>
          <strong>Family Dining</strong>
          <p>A relaxed place to share meals together.</p>
        </div>
      </div>

      <div className="restaurant-highlight">
        <span>03</span>
        <div>
          <strong>Warm Hospitality</strong>
          <p>Simple service with the spirit of Kalam.</p>
        </div>
      </div>

    </div>

  </div>
</section>

      <section className="destinations-section" id="destinations">
  <div className="container">

    <div className="destinations-header">
      <div>
        <span className="eyebrow light">EXPLORE KALAM</span>

        <h2 className="section-title">
          The valley
          <br />
          <em>is calling.</em>
        </h2>
      </div>

      <p>
        Step outside Khan Restaurant and discover the landscapes,
        forests, rivers and quiet moments that make Kalam special.
      </p>
    </div>

    <div className="destinations-grid">

      <article className="destination-card destination-large">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=90"
          alt="Mountain landscape"
        />

        <div className="destination-overlay">
          <span>01 · NATURE</span>
          <h3>Mountain Views</h3>
          <p>Wake up surrounded by the beauty of the Swat mountains.</p>
        </div>
      </article>

      <article className="destination-card">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwYEsaLUwSzNVeyWZm_fypTH15FgOzCF5lzA-2M_QDTg&s=10"
          alt="Forest landscape"
        />

        <div className="destination-overlay">
          <span>02 · ADVENTURE</span>
          <h3>Forest Trails</h3>
          <p>Find quiet paths and fresh mountain air.</p>
        </div>
      </article>

      <article className="destination-card">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbJL39rlMcYn4Ak_0c_S9RPPLpdeshXS9NZc-aTXAa7A&s=10"
          alt="Valley landscape"
        />

        <div className="destination-overlay">
          <span>03 · DISCOVERY</span>
          <h3>Valley Escape</h3>
          <p>Take in the landscapes that surround Kalam.</p>
        </div>
      </article>

      <article className="destination-card destination-wide">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzIOUT0m7zsNFWPcHwC6YIqbOJ_T5ebJZM_O_XQWHcqQ&s=10"
          alt="Peaceful mountain landscape"
        />

        <div className="destination-overlay">
          <span>04 · RELAX</span>
          <h3>Slow Mornings</h3>
          <p>
            Leave the rush behind and enjoy the simple beauty of
            mountain life.
          </p>
        </div>
      </article>

    </div>

    <div className="destinations-footer">
      <span>DESTINATION · KALAM · SWAT</span>

      <Link to="/rooms" className="destination-cta">
        Stay in Kalam
        <span>↗</span>
      </Link>
    </div>

  </div>
</section>

     <section className="gallery-premium">
  <div className="container">

    <div className="gallery-premium-header">
      <div>
        <span className="eyebrow">A GLIMPSE OF KALAM</span>

        <h2 className="section-title">
          Moments worth
          <br />
          <em>remembering.</em>
        </h2>
      </div>

      <p>
        From quiet mornings to dramatic mountain views, discover
        the atmosphere that makes a stay in Kalam unforgettable.
      </p>
    </div>

    <div className="gallery-premium-grid">

      <div className="gallery-premium-item gallery-featured">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=90"
          alt="Kalam mountain landscape"
        />

        <div className="gallery-caption">
          <span>01 · KALAM</span>
          <strong>Mountain Silence</strong>
        </div>
      </div>

      <div className="gallery-premium-item">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1100&q=90"
          alt="Forest in Kalam"
        />

        <div className="gallery-caption">
          <span>02 · NATURE</span>
          <strong>Forest Trails</strong>
        </div>
      </div>

      <div className="gallery-premium-item">
        <img
          src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=90"
          alt="Kalam valley"
        />

        <div className="gallery-caption">
          <span>03 · VALLEY</span>
          <strong>Open Horizons</strong>
        </div>
      </div>

      <div className="gallery-premium-item gallery-wide">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ6dGj-K40oqChei2S2_pKSolibb1f_dstALq4yaym_w&s=10"
          alt="Peaceful Kalam landscape"
        />

        <div className="gallery-caption">
          <span>04 · ESCAPE</span>
          <strong>Slow Mornings</strong>
        </div>
      </div>

      <div className="gallery-premium-item">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd6h2T190l17yejQRSear0bO-8_AgT9KAQ4drcQ8a-9w&s=10"
          alt="Mountain nature"
        />

        <div className="gallery-caption">
          <span>05 · DISCOVERY</span>
          <strong>Into Nature</strong>
        </div>
      </div>

    </div>

    <div className="gallery-premium-footer">
      <span>KHAN RESTAURANT · KALAM · SWAT</span>

      <Link to="/rooms" className="gallery-book-btn">
        Experience Kalam
        <span>↗</span>
      </Link>
    </div>

  </div>
</section>

      <section className="quote-section">
        <span className="eyebrow">GUEST EXPERIENCE</span>

        <blockquote>
          “The best journeys are the ones where the destination feels
          like home.”
        </blockquote>

        <div className="quote-author">
          KHAN RESTAURANT · KALAM
        </div>
      </section>

      <section className="final-cta-premium" id="contact">
  <div className="final-cta-overlay"></div>

  <div className="final-cta-content">
    <span className="eyebrow light">PLAN YOUR ESCAPE</span>

    <h2>
      Kalam is
      <br />
      <em>waiting.</em>
    </h2>

    <p>
      Come for the mountains, stay for the hospitality,
      and leave with memories worth keeping.
    </p>

    <Link to="/rooms" className="final-book-btn">
      Book Your Stay
      <span>↗</span>
    </Link>
  </div>
</section>

<footer className="premium-footer">
  <div className="container">

    <div className="premium-footer-top">

      <div className="footer-main-brand">
        <div className="brand">
          <span className="brand-mark">KR</span>

          <span className="brand-copy">
            <strong>Khan Restaurant</strong>
            <small>KALAM · SWAT</small>
          </span>
        </div>

        <p>
          Comfortable stays, authentic food and warm hospitality
          in the heart of Kalam, Swat.
        </p>
      </div>

      <div className="premium-footer-column">
        <h4>EXPLORE</h4>

        <Link to="/">Home</Link>
        <Link to="/rooms">Rooms</Link>
        <a href="/#restaurant">Restaurant</a>
        <a href="/#experience">Experience</a>
        <a href="/#destinations">Destinations</a>
      </div>

      <div className="premium-footer-column">
        <h4>STAY</h4>

        <Link to="/rooms">Explore Rooms</Link>
        <Link to="/my-bookings">My Bookings</Link>
        <a href="/#contact">Plan Your Stay</a>
      </div>

      <div className="premium-footer-column">
        <h4>LOCATION</h4>

        <p>Kalam, Swat</p>
        <p>Khyber Pakhtunkhwa</p>
        <p>Pakistan</p>
      </div>

    </div>

    <div className="premium-footer-bottom">
      <span>© 2026 Khan Restaurant Kalam</span>

      <span>
        HOSPITALITY · NATURE · KALAM
      </span>
    </div>

  </div>
</footer>

    </div>
  );
}
export default HomePage;
