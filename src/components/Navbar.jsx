import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const location = useLocation(); // triggers useEffect on route change

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    setUsername(storedName || "");
  }, [location]); // updates whenever route changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    window.location.href = "/"; // redirect to home
  };

  return (
    <nav className="bg-[#222831]/50 backdrop-blur-md text-[#DFD0B8] w-full fixed top-0 flex items-center h-16 shadow-lg z-50 transition-all duration-500">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="text-xl font-bold">Campus Lost&Found</div>
        <div className="flex space-x-8 text-lg items-center">
          <Link
            className="hover:text-[#e8e8e8] transition-colors duration-300"
            to="/"
          >
            Home
          </Link>
          <Link
            className="hover:text-[#e8e8e8] transition-colors duration-300"
            to="/lostitems"
          >
            Lost Items
          </Link>
          <Link
            className="hover:text-[#e8e8e8] transition-colors duration-300"
            to="/founditems"
          >
            Found Items
          </Link>

          {username ? (
            <div className="flex items-center gap-4">
              <Link
                to="/myitems"
                className="text-[#F6C90E] font-semibold hover:underline"
              >
                {username}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#F6C90E] text-[#393E46] px-3 py-1 rounded hover:bg-[#FFD700] transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              className="hover:text-[#e8e8e8] transition-colors duration-300"
              to="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
