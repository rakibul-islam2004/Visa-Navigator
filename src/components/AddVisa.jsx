import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"; // Import your Auth context

const AddVisa = () => {
  const { user } = useAuth(); // Get the logged-in user's information
  const [visa, setVisa] = useState({
    country: "",
    visaType: "",
    processingTime: "",
    fee: "",
    description: "",
    countryImageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisa((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if the user is logged in
      if (!user) {
        toast.error("You must be logged in to add a visa.");
        return;
      }

      // Include the user's email in the visa data
      const visaData = { ...visa, addedBy: user.email };

      // Send POST request to the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/add-visa`, // Ensure this URL is correct
        visaData
      );
      toast.success("Visa added successfully!");

      setVisa({
        country: "",
        visaType: "",
        processingTime: "",
        fee: "",
        description: "",
        countryImageUrl: "", // Reset country image URL field
      });
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Error adding visa"}`
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Add Visa
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="country"
            value={visa.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="url"
            name="countryImageUrl"
            value={visa.countryImageUrl}
            onChange={handleChange}
            placeholder="Country Image URL"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="visaType"
            value={visa.visaType}
            onChange={handleChange}
            placeholder="Visa Type"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="processingTime"
            value={visa.processingTime}
            onChange={handleChange}
            placeholder="Processing Time"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="fee"
            value={visa.fee}
            onChange={handleChange}
            placeholder="Fee"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="description"
            value={visa.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Add Visa
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVisa;
