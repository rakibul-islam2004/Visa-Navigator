import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay for user data loading (replace with actual auth check logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Name */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:underline">
            Visa Navigator
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/all-visas" className="hover:underline">
              All Visas
            </Link>
          </li>

          {/* Show Loading Indicator */}
          {loading ? (
            <li className="text-yellow-300">Loading...</li>
          ) : user ? (
            <>
              <li>
                <Link to="/add-visa" className="hover:underline">
                  Add Visa
                </Link>
              </li>
              <li>
                <Link to="/my-added-visas" className="hover:underline">
                  My Added Visas
                </Link>
              </li>
              <li>
                <Link to="/my-applications" className="hover:underline">
                  My Applications
                </Link>
              </li>

              {/* User Profile Image */}
              <li className="flex items-center gap-2">
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <span className="font-medium text-yellow-300">
                  {user.displayName}
                </span>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
