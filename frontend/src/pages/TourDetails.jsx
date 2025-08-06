import React from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";
import MapSection from "../components/MapSection";
import AuthContext from "../context/AuthContext";
const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/v1/tours/${id}`);

        const data = await res.json();
        setTour(data.data.doc); // based on how your API response is shaped
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tour:", err);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) return <p>Loading tour...</p>;
  if (!tour) return <p>No tour found.</p>;

  return (
    <main className="main">
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`/img/tours/${tour.imageCover}`} // ✅ Correct path
            alt={tour.name}
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock"></use>
              </svg>
              <span className="heading-box__text">{`${tour.duration} days`}</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
              </svg>
              <span className="heading-box__text">
                {tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {new Date(tour.startDates[0]).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-trending-up"></use>
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">{`${tour.maxGroupSize} people`}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-star"></use>
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">{`${tour.ratingsAverage} / 5`}</span>
              </div>
            </div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides?.map((guide) => (
                <div className="overview-box__detail" key={guide._id}>
                  <img
                    className="overview-box__img"
                    src={`/img/users/${guide.photo}`} // ✅ Correct path
                    alt={guide.name}
                  />
                  <span className="overview-box__label">
                    {guide.role === "lead-guide" ? "Lead guide" : "Tour guide"}
                  </span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">
            {`About ${tour.name} tour`}
          </h2>
          <p className="description__text">{tour.description}</p>
        </div>
      </section>
      <section className="section-pictures">
        {tour.images?.map((img, index) => (
          <div className="picture-box" key={index}>
            <img
              className={`picture-box__img picture-box__img--${index + 1}`}
              src={`/img/tours/${img}`} // ✅ Correct path
              alt={`${tour.name} Tour ${index + 1}`}
            />
          </div>
        ))}
      </section>

      <MapSection locations={tour.locations} />
      <ReviewCard id={tour._id} />
      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img
              src="/img/logo-white.png" // ✅ Remove "api/" — it should start with /
              alt="Natours logo"
            />{" "}
          </div>
          <img
            className="cta__img cta__img--1"
            src={`/img/tours/${tour.images[1]}`} // ✅ Start with /
            alt="Tour picture"
          />
          <img
            className="cta__img cta__img--2"
            src={`/img/tours/${tour.images[2]}`} // ✅ Start with /
            alt="Tour picture"
          />

          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {`${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`}
            </p>
            {user ? (
              <button className="btn btn--green span-all-rows">Book now</button>
            ) : (
              <a className="btn btn--green span-all-rows" href="/login">
                Log in to book tour
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TourDetails;
