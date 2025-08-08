import React, { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/v1/users/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset link sent to your email!");
        setEmail("");
      } else {
        alert(data.message || "Failed to send reset link");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Forgot your password?</h2>
        <form className="form form--login" onSubmit={handleForgotPassword}>
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
          <div className="form__group">
            <button className="btn btn--green" type="submit">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
