import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AllVisasPage = () => {
  const [visas, setVisas] = useState([]);
  const [filteredVisas, setFilteredVisas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visaTypeFilter, setVisaTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const visasPerPage = 8;

  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch all visas on component mount
  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/visas`
      );
      console.log("Fetched all visas:", response.data);
      setVisas(response.data);
      setFilteredVisas(response.data); // Initial filtering
    } catch (error) {
      console.error("Error fetching visas:", error);
      Swal.fire("Error!", "There was an error fetching the visas.", "error");
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterVisas(query, visaTypeFilter);
  };

  // Handle visa type filtering
  const handleVisaTypeFilter = (e) => {
    const filter = e.target.value;
    setVisaTypeFilter(filter);
    filterVisas(searchQuery, filter);
  };

  const filterVisas = (query, type) => {
    let filtered = visas;

    if (query) {
      filtered = filtered.filter((visa) =>
        visa.country.toLowerCase().includes(query)
      );
    }

    if (type) {
      filtered = filtered.filter((visa) => visa.visaType === type);
    }

    setFilteredVisas(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Pagination logic
  const indexOfLastVisa = currentPage * visasPerPage;
  const indexOfFirstVisa = indexOfLastVisa - visasPerPage;
  const currentVisas = filteredVisas.slice(indexOfFirstVisa, indexOfLastVisa);

  const totalPages = Math.ceil(filteredVisas.length / visasPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle redirection to Visa details page
  const handleSeeDetails = (visaId) => {
    navigate(`/visa-details/${visaId}`); // Navigate to the Visa details page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">All Visas</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by country"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/3 border rounded p-2"
        />
        <select
          value={visaTypeFilter}
          onChange={handleVisaTypeFilter}
          className="w-full md:w-1/3 border rounded p-2"
        >
          <option value="">All Visa Types</option>
          <option value="Tourist">Tourist</option>
          <option value="Business">Business</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
        </select>
      </div>

      {/* Visa Cards */}
      {currentVisas.length === 0 ? (
        <p className="text-center">No visas found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVisas.map((visa) => (
            <div key={visa._id} className="bg-white shadow rounded-lg p-4">
              <img
                src={visa.countryImageUrl || "path/to/placeholder-image.jpg"} // Use a placeholder image
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
              <button
                onClick={() => handleSeeDetails(visa._id)} // Navigate to the Visa Details page
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                See Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredVisas.length > visasPerPage && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <li key={num}>
                    <button
                      className={`px-4 py-2 rounded ${
                        currentPage === num
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => paginate(num)}
                    >
                      {num}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AllVisasPage;
