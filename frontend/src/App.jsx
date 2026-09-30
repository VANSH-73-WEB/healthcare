import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-mist flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/patient"
            element={
              <ProtectedRoute roles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute roles={["doctor", "hospital"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
