import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 visibility toggle state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.data.user);
        alert("Logged in successfully!");
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form className="form form--login" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              className="form__input"
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input with Toggle */}
          <div
            className="form__group ma-bt-md"
            style={{ position: "relative" }}
          >
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className="form__input"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "35px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#007bff",
                fontSize: "1.1rem", // bigger
                fontWeight: "bold", // thicker text
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Login Button */}
          <div className="form__group">
            <button className="btn btn--green" type="submit">
              Login
            </button>
          </div>
        </form>

        {/* Forgot Password Button */}
        <div className="form__group">
          <button
            type="button"
            className="btn btn--small btn--red"
            onClick={() => navigate("/Forgetpass")}
            style={{ marginTop: "1rem" }}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
