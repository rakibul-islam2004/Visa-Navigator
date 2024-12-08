import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Website Name and Copyright */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Visa Navigator</h2>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Visa Navigator. All Rights
            Reserved.
          </p>
        </div>

        {/* Contact Information */}
        <div className="text-center md:text-right mb-4 md:mb-0">
          <p className="text-sm">
            <strong>Contact us:</strong> info@visanavigator.com
          </p>
          <p className="text-sm">Phone: +1-234-567-8900</p>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center md:justify-end space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-300"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
