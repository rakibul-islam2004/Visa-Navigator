import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AddVisa from "./components/AddVisa";
import VisaDetails from "./components/VisaDetails"; // Ensure this is imported
import MyAddedVisas from "./components/MyAddedVisas";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AllVisasPage from "./components/AllVisasPage";
import MyApplications from "./components/MyVisaApplications";
import NotFoundPage from "./components/NotFoundPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Route for viewing individual visa details */}
            <Route path="/visa-details/:id" element={<VisaDetails />} />
            <Route
              path="/add-visa"
              element={
                <ProtectedRoute>
                  <AddVisa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-visas"
              element={
                <ProtectedRoute>
                  <AllVisasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-added-visas"
              element={
                <ProtectedRoute>
                  <MyAddedVisas />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
