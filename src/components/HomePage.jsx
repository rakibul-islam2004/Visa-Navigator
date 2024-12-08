import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle redirection to Visa details page
  const handleSeeDetails = (visaId) => {
    navigate(`/visa-details/${visaId}`); // Navigate to the Visa details page
  };

  const [visas, setVisas] = useState([]); // Latest visas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching the latest visas
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/visas?limit=6`) // Fetching 6 latest visas
      .then((response) => {
        if (Array.isArray(response.data)) {
          setVisas(response.data);
        } else {
          setError("Received data is not in the expected format.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load visas. Please try again later.");
        setLoading(false);
        console.error(error);
      });
  }, []);

  // Banner sliding effect with manual control
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Visa Services Made Easy",
      description: "Get the best visa options for your travel needs.",
      bgClass: "bg-gradient-to-r from-indigo-500 to-purple-600",
    },
    {
      title: "Fast Processing Times",
      description: "Apply and get your visa quickly and efficiently.",
      bgClass: "bg-gradient-to-r from-green-500 to-teal-500",
    },
    {
      title: "Step-by-Step Guides",
      description: "Easily navigate through the visa application process.",
      bgClass: "bg-gradient-to-r from-pink-500 to-yellow-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Auto slide change every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length); // Go to next slide
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); // Go to previous slide
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-dotted rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* Banner Section */}
      <div
        className={`py-8 text-white ${slides[currentSlide].bgClass} relative`}
      >
        <div className="flex justify-center items-center h-64 rounded-lg overflow-hidden relative">
          <div className="text-center z-10">
            <h3 className="text-4xl font-bold">{slides[currentSlide].title}</h3>
            <p className="mt-2">{slides[currentSlide].description}</p>
          </div>

          {/* Manual Navigation Controls with Unique Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:scale-110 transition duration-300 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:scale-110 transition duration-300 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Latest Visas Section */}
      <div className="py-16 px-4 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Latest Visas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visas.length === 0 ? (
            <p className="text-center text-xl col-span-full">
              No visas available at the moment.
            </p>
          ) : (
            visas.map((visa) => (
              <div
                key={visa._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <img
                    src={
                      visa.countryImageUrl || "path/to/placeholder-image.jpg"
                    } // Use a placeholder image
                    alt={visa.country}
                    className="w-full h-32 object-cover rounded"
                  />
                  <h3 className="text-xl font-semibold">{visa.country}</h3>
                  <p className="mt-2">Visa Type: {visa.visaType}</p>
                  <p>Processing Time: {visa.processingTime}</p>
                  <p>Fee: {visa.fee}</p>
                  <p>Validity: {visa.validity}</p>
                  <p>Application Method: {visa.applicationMethod}</p>
                  <button
                    onClick={() => handleSeeDetails(visa._id)} // Navigate to the Visa Details page
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/all-visas"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            See All Visas
          </Link>
        </div>
      </div>

      {/* Extra Section 1 */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Why Choose Our Visa Services?
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          We offer a variety of visa types with easy-to-understand guides and
          fast approval times. Discover the best visa options tailored to your
          needs.
        </p>
      </div>

      {/* Extra Section 2 */}
      <div className="py-16 px-4 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold mb-4">How to Apply for a Visa</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Our platform provides a step-by-step guide to help you through the
          visa application process. Learn how to apply for your visa with
          confidence and ease.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
