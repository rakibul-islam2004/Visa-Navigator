import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const MyAddedVisas = () => {
  const { user } = useAuth(); // Get logged-in user
  const [visas, setVisas] = useState([]);
  const [editingVisa, setEditingVisa] = useState(null);
  const [updatedVisa, setUpdatedVisa] = useState({
    country: "",
    visaType: "",
    processingTime: "",
    fee: "",
    description: "",
  });
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    if (user) {
      fetchMyVisas();
    }
  }, [user]);

  // Fetch visas added by the logged-in user
  const fetchMyVisas = async () => {
    try {
      setLoading(true); // Start loader
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/visas?addedBy=${user.email}` // Send user email as query param
      );
      console.log("Fetched visas:", response.data); // Log the response to check if visas are fetched
      if (response.data) {
        setVisas(response.data); // Update state with fetched visas
      }
    } catch (error) {
      console.error("Error fetching visas:", error);
      Swal.fire("Error!", "There was an error fetching your visas.", "error");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  // Handle delete visa
  const handleDelete = async (visaId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/visas/${visaId}`
        );

        // Remove the deleted visa from the state
        setVisas((prevVisas) =>
          prevVisas.filter((visa) => visa._id !== visaId)
        );

        Swal.fire("Deleted!", "The visa has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting visa:", error);
        Swal.fire("Error!", "There was an error deleting the visa.", "error");
      }
    }
  };

  // Handle update modal open
  const handleUpdate = (visa) => {
    setEditingVisa(visa);
    setUpdatedVisa({
      ...visa,
      fee: visa.fee || "",
      country: visa.country || "",
      visaType: visa.visaType || "",
      processingTime: visa.processingTime || "",
      description: visa.description || "",
    });
  };

  // Handle update visa submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/visas/${editingVisa._id}`,
        updatedVisa
      );

      // Update the state with the updated visa
      setVisas((prevVisas) =>
        prevVisas.map((visa) =>
          visa._id === editingVisa._id ? { ...visa, ...response.data } : visa
        )
      );

      setEditingVisa(null); // Close the update modal
      Swal.fire(
        "Updated!",
        "The visa has been updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error updating visa:", error);
      Swal.fire("Error!", "There was an error updating the visa.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-dotted rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">My Added Visas</h1>

      {visas.length === 0 ? (
        <p className="text-center">No visas found. Add some visas!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map((visa) => (
            <div key={visa._id} className="bg-white shadow rounded-lg p-4">
              <img
                src={visa.countryImageUrl || "path/to/placeholder-image.jpg"}
                alt={visa.country}
                className="w-full h-32 object-cover rounded"
              />
              <h2 className="text-xl font-bold mt-4">{visa.country}</h2>
              <p className="text-sm text-gray-600">{visa.visaType}</p>
              <p className="text-sm text-gray-600">Fee: ${visa.fee}</p>
              <p className="text-sm text-gray-600">
                Validity: {visa.validity} days
              </p>
              <p className="text-sm text-gray-600">
                Processing Time: {visa.processingTime}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleUpdate(visa)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(visa._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Visa Modal */}
      {editingVisa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Visa</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Country Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={updatedVisa.country || ""}
                  onChange={(e) =>
                    setUpdatedVisa({ ...updatedVisa, country: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Visa Type
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={updatedVisa.visaType || ""}
                  onChange={(e) =>
                    setUpdatedVisa({ ...updatedVisa, visaType: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Fee</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={updatedVisa.fee || ""}
                  onChange={(e) =>
                    setUpdatedVisa({ ...updatedVisa, fee: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Processing Time
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={updatedVisa.processingTime || ""}
                  onChange={(e) =>
                    setUpdatedVisa({
                      ...updatedVisa,
                      processingTime: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border rounded p-2"
                  value={updatedVisa.description || ""}
                  onChange={(e) =>
                    setUpdatedVisa({
                      ...updatedVisa,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setEditingVisa(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedVisas;
