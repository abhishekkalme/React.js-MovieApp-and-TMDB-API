import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-zinc-900 text-white px-4 py-3 shadow-md fixed left-0 right-0 z-50">
      <div className="max-w-9xl mx-auto flex justify-between  ">
        <Link to="/" className="text-2xl  font-bold text-red-500">
          🍿CineVerse
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-red-500 font-semibold"
                : " text-blue-500 hover:text-red-400 transition"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive
                ? "text-red-500 font-semibold"
                : " text-blue-500 hover:text-red-400 transition"
            }
          >
            Movies
          </NavLink>
          <NavLink
            to="/tv"
            className={({ isActive }) =>
              isActive
                ? "text-red-500 font-semibold"
                : " text-blue-500 hover:text-red-400 transition"
            }
          >
            TV
          </NavLink>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-sm bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            >
              Go
            </button>
          </form>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-zinc-800 mt-2 rounded shadow-lg overflow-hidden"
            initial={{ height: 2 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-zinc-700 transition"
            >
              Home
            </Link>
            <Link
              to="/movies"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-zinc-700 transition"
            >
              Movies
            </Link>
            <Link
              to="/tv"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-zinc-700 transition"
            >
              TV
            </Link>
            <form
              onSubmit={handleSearch}
              className="px-4 py-2 flex gap-2 items-center"
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-1 rounded bg-zinc-700 text-white border border-zinc-600 focus:outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Go
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
