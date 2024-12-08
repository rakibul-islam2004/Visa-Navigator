import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext"; // Assuming you have an Auth context

const VisaDetails = () => {
  const { id } = useParams(); // Extract visa ID from URL params
  const navigate = useNavigate();
  const { user } = useAuth(); // Get logged-in user from context
  const [visa, setVisa] = useState(null); // Visa details
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    fee: "",
    appliedDate: new Date().toISOString().split("T")[0], // Default to today's date
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login if not logged in
      navigate("/login");
      return;
    }

    // Fetch the visa details
    const fetchVisa = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/visas/${id}`
        );
        setVisa(response.data);
        setFormData((prev) => ({
          ...prev,
          fee: response.data.fee, // Auto-fill fee based on visa details
        }));
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch visa details.", "error");
      }
    };

    fetchVisa();
  }, [id, user, navigate]);

  const handleApply = async () => {
    // Validate input fields
    if (!formData.firstName || !formData.lastName) {
      Swal.fire("Error!", "First Name and Last Name are required.", "error");
      return;
    }

    try {
      // Send application data to the server
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/applications`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire("Success!", "Your application has been submitted!", "success");
      setIsModalOpen(false); // Close the modal after successful submission
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit application.";
      Swal.fire("Error!", errorMessage, "error");
    }
  };

  if (!visa) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:w-[60%] lg:w-[40%]">
      <h1 className="text-2xl font-bold mb-6">
        Visa Details for {visa.country}
      </h1>
      <div className="bg-white shadow rounded-lg p-6">
        <img
          src={visa.countryImageUrl}
          alt={visa.country}
          className="w-full h-48 object-cover rounded-lg"
        />
        <p className="mt-4">Visa Type: {visa.visaType}</p>
        <p>Processing Time: {visa.processingTime}</p>
        <p>Fee: {visa.fee}</p>
        <p>Description: {visa.description}</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Apply for the visa
        </button>
      </div>

      {/* Modal for applying */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Apply for {visa.country}</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Fee</label>
                <input
                  type="text"
                  value={visa.fee}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Applied Date
                </label>
                <input
                  type="text"
                  value={formData.appliedDate}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Apply
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full text-center px-4 py-2 bg-red-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaDetails;
