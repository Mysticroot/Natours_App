import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext"; // adjust path if different

const backend_url = `http://127.0.0.1:3000/api/v1/tours`;

const ReviewsSection = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!id || !token) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${backend_url}/${id}/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === "success") {
          setReviews(data.data.docs);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [id, token]);

  return (
    <section className="section-reviews">
      <div className="reviews">
        {reviews.map((review) => (
          <div className="reviews__card" key={review._id}>
            <div className="reviews__avatar">
              <img
                className="reviews__avatar-img"
                src={
                  review.user?.photo
                    ? `/img/users/${review.user.photo}`
                    : "/img/users/default.jpg"
                }
                alt={review.user?.name || "User"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/users/default.jpg";
                }}
              />
              <h6 className="reviews__user">
                {review.user?.name || "Anonymous"}
              </h6>
            </div>
            <p className="reviews__text">{review.review}</p>
            <div className="reviews__rating">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`reviews__star ${
                    i < review.rating ? "reviews__star--active" : ""
                  }`}
                >
                  <use xlinkHref="/img/icons.svg#icon-star" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
