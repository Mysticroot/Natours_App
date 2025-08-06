import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const Myself = () => {
  const { user, setUser, token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Update profile info (name/email/photo)
  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      if (photo) form.append("photo", photo);

      const res = await fetch("/api/v1/users/updateMe", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (data.status === "success") {
        setUser((prev) => ({
          ...prev,
          ...data.data.user,
        }));
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating user data:", err);
      alert("Something went wrong. Try again.");
    }
  };

  // Update password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/users/updateMyPassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passwordCurrent,
          password,
          passwordConfirm,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        // New token is returned after password change
        setUser({
          ...data.data.user,
          token: data.token,
        });
        alert("Password updated successfully!");
        setPassword("");
        setPasswordCurrent("");
        setPasswordConfirm("");
      } else {
        alert(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className="side-nav--active">
              <a href="#">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-settings"></use>
                </svg>
                Settings
              </a>
            </li>
            <li>
              <a href="/">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-briefcase"></use>
                </svg>
                My bookings
              </a>
            </li>
            <li>
              <a href="#">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-star"></use>
                </svg>
                My reviews
              </a>
            </li>
            <li>
              <a href="#">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-credit-card"></use>
                </svg>
                Billing
              </a>
            </li>
          </ul>
        </nav>

        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <form
              className="form form-user-data"
              onSubmit={handleUserDataSubmit}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  className="form__input"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  name="name"
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  className="form__input"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  name="email"
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={
                    user?.photo
                      ? `/img/users/${user.photo}`
                      : "/img/users/default.jpg"
                  }
                  alt="User photo"
                />
                <input
                  className="form__upload"
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green">
                  Save settings
                </button>
              </div>
            </form>
          </div>

          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form
              className="form form-user-password"
              onSubmit={handlePasswordChange}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  className="form__input"
                  id="password-current"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={passwordCurrent}
                  onChange={(e) => setPasswordCurrent(e.target.value)}
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  className="form__input"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  className="form__input"
                  id="password-confirm"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green btn--save-password">
                  Save password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Myself;
