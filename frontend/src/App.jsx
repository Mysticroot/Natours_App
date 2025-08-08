import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TourDetails from "./pages/TourDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Myself from "./pages/Myself";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Myself" element={<Myself />} />
      <Route path="/Forgetpass" element={<ForgetPassword />} />
      <Route path="/ResetPass/:token" element={<ResetPassword />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
    <Footer />
  </>
);

export default App;
