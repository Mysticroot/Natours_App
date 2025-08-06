import React from "react";
import { Link } from "react-router-dom";

const TourCard = ({tour} ) => {
  const {
    name,
    duration,
    summary,
    imageCover,
    difficulty,
    ratingsAverage,
    price,
    _id,
    startDates,
    locations,
    maxGroupSize,
    ratingsQuantity,
    startLocation,
  } = tour;

  return (
    <div class="card">
      <div class="card__header">
        <div class="card__picture">
          <div class="card__picture-overlay">&nbsp;</div>
          <img
            src={`/img/tours/${imageCover}`}
            alt={name}
            className="card__picture-img"
          />
        </div>

        <h3 class="heading-tertirary">
          <span>{name}</span>
        </h3>
      </div>

      <div class="card__details">
        <h4 class="card__sub-heading">{`${difficulty} ${duration}-DAY TOUR`}</h4>
        <p class="card__text">{summary}</p>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="img/icons.svg#icon-map-pin"></use>
          </svg>
          <span>{startLocation.description}</span>
        </div>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="img/icons.svg#icon-calendar"></use>
          </svg>
          <span>
            {new Date(startDates[0]).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="img/icons.svg#icon-flag"></use>
          </svg>
          <span>{`${locations.length} stops`}</span>
        </div>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="img/icons.svg#icon-user"></use>
          </svg>
          <span>{`${maxGroupSize} people`}</span>
        </div>
      </div>

      <div class="card__footer">
        <p>
          <span class="card__footer-value">{`$${price} `}</span>
          <span class="card__footer-text">per person</span>
        </p>
        <p class="card__ratings">
          <span class="card__footer-value">{ratingsAverage}</span>
          <span class="card__footer-text">{` rating ${ratingsQuantity}`}</span>
        </p>
        <Link to={`/tour/${_id}`} className="btn btn--green btn--small">
          Details
        </Link>
      </div>
    </div>
  );


  
};

export default TourCard;
