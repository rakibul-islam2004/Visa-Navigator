import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth(); // Assuming isLoading is part of your context

  // Show a loading indicator while user data is being fetched
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other component
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
