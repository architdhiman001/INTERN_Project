import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#222831] text-[#DFD0B8] py-4 ">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Campus Lost&Found. All rights reserved.
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-white transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
