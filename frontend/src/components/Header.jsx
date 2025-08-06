import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect after logout
  };

  // Safe name extraction
  const getFirstName = () => {
    if (!user || !user.name) return "User";
    const name = user.name.trim();
    return name.includes(" ")
      ? name.split(" ")[0]
      : name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          All tours
        </Link>
      </nav>

      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>

      <nav className="nav nav--user">
        {!user ? (
          <>
            <Link className="nav__el" to="/login">
              Log in
            </Link>
            <Link className="nav__el nav__el--cta" to="/signup">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <button className="nav__el" onClick={handleLogout}>
              Log out
            </button>
            <Link
              className="nav__el"
              to="/Myself"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src={`/img/users/${user?.photo || "default.jpg"}`}
                alt={user?.name || "User photo"}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "90%",
                }}
              />
              <span>{getFirstName()}</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
