import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); // ✅ Token comes from the URL

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/v1/users/resetPassword/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, passwordConfirm }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successful! Please log in.");
        navigate("/login");
      } else {
        alert(data.message || "Password reset failed");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Reset Your Password</h2>
        <form className="form form--login" onSubmit={handleResetPassword}>
          <div className="form__group">
            <label className="form__label" htmlFor="password">
              New Password
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

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="passwordConfirm">
              Confirm New Password
            </label>
            <input
              className="form__input"
              id="passwordConfirm"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <div className="form__group">
            <button className="btn btn--green" type="submit">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
