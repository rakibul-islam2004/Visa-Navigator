import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext"; // Assuming you have an Auth context

const MyVisaApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    // Redirect to login if not logged in
    if (!user) {
      navigate("/login");
    }

    // Fetch user visa applications
    const fetchApplications = async () => {
      try {
        setLoading(true); // Start loader
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/my-applications`,
          {
            params: { addedBy: user?.email },
          }
        );
        setApplications(response.data);
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch applications.", "error");
      } finally {
        setLoading(false); // Stop loader
      }
    };
    fetchApplications();
  }, [user, navigate]);

  const handleCancel = async (appId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/applications/${appId}`
      );
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== appId)
      );
      Swal.fire("Success!", "Application cancelled successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to cancel application.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-dotted rounded-full animate-spin"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return <div>No applications found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Visa Applications</h1>
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow rounded-lg p-4 flex items-center"
          >
            <img
              src={app.countryImageUrl}
              alt={app.country}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="ml-4">
              <p className="text-xl font-bold">{app.country}</p>
              <p>Visa Type: {app.visaType}</p>
              <p>Fee: {app.fee}</p>
              <p>Applied Date: {app.appliedDate}</p>
              <p>
                Name: {app.firstName} {app.lastName}
              </p>
              <p>Email: {app.email}</p>
              <button
                onClick={() => handleCancel(app._id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyVisaApplications;
