import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSearch, FiUser, FiBell, FiHome, FiFilm, FiTv, FiFilter, FiPlay, FiLogOut, FiLogIn } from "react-icons/fi";
import { FaCat } from "react-icons/fa";
import { RiMovie2AiLine } from "react-icons/ri";

import { AuthContext } from "../context/AuthContext";
import { APP_CONFIG } from "../constants";

const Navbar = () => {
  const { user, login, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-lg py-3"
        : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group relative z-50 transition-transform duration-300 hover:scale-105 active:scale-95">
          <div className="">
            <div className=""></div>
            <RiMovie2AiLine className="text-white ml-0.5 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 " fill="currentColor" />
          </div>
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white transition-all drop-shadow-md">
              Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">Verse</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {[
            { name: "Home", path: "/", icon: <FiHome className="mr-1.5 inline" /> },
            { name: "Movies", path: "/movies", icon: <FiFilm className="mr-1.5 inline" /> },
            { name: "TV Shows", path: "/tv", icon: <FiTv className="mr-1.5 inline" /> },
            { name: "Filter", path: "/search", icon: <FiFilter className="mr-1.5 inline" /> },
            { name: "Anime", path: "/anime", icon: <FaCat className="mr-1.5 inline" /> },
            { name: "Platforms", path: "/platform", icon: <FiPlay className="mr-1.5 inline" /> },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative text-sm font-medium tracking-wide transition-all duration-300 flex items-center px-4 py-2 rounded-xl overflow-hidden ${isActive
                  ? "text-white bg-white/10 shadow-inner border border-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Movies, TV shows..."
                    className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-5 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 shadow-inner placeholder-gray-500"
                    autoFocus
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onBlur={() => !searchText && setSearchOpen(false)}
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-300 hover:text-white transition">
              <FiSearch size={22} />
            </button>
          </div>

          <button className="text-gray-300 hover:text-white transition">
            <FiBell size={22} />
          </button>

          {user ? (
            <button onClick={logout} className="text-gray-300 hover:text-white transition bg-zinc-800/80 hover:bg-red-500/20 hover:text-red-400 px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10 hover:border-red-500/30 backdrop-blur-sm">
              <FiLogOut size={14} /> Logout
            </button>
          ) : (
            <button onClick={() => login("Explorer")} className="text-white transition-all bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-5 py-1.5 rounded-full font-medium shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5">
              Login
            </button>
          )}

          {user && (
            <Link to="/profile" className="text-gray-300 hover:text-white transition relative group">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-red-500 transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-sm border-2 border-transparent group-hover:border-white transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  {user.username ? user.username.charAt(0).toUpperCase() : <FiUser size={16} />}
                </div>
              )}
            </Link>
          )}
        </div>

        <button
          className="md:hidden relative z-50 p-2 text-gray-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-6 h-screen w-screen overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Ambient Background Glow for Mobile Menu */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/20 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/20 blur-[120px] rounded-full"></div>
            </div>

            <motion.div
              className="relative z-10 flex flex-col items-center w-full max-w-sm mt-8"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 }
                },
                exit: { opacity: 0, transition: { staggerChildren: 0.04, staggerDirection: -1 } }
              }}
            >
              <motion.form
                onSubmit={handleSearch}
                className="w-full relative mb-10"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
                }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                  <input
                    type="text"
                    placeholder="Search movies, shows..."
                    className="relative w-full bg-zinc-900/80 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl text-white focus:outline-none focus:border-red-500 placeholder-gray-500 shadow-xl"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    <FiSearch size={22} />
                  </button>
                </div>
              </motion.form>

              <div className="flex flex-col space-y-3 w-full">
                {[
                  { name: "Home", path: "/", icon: <FiHome className="mr-4 inline" /> },
                  { name: "Movies", path: "/movies", icon: <FiFilm className="mr-4 inline" /> },
                  { name: "TV Shows", path: "/tv", icon: <FiTv className="mr-4 inline" /> },
                  { name: "Anime", path: "/anime", icon: <FaCat className="mr-4 inline" /> },
                  { name: "Platforms", path: "/platform", icon: <FiPlay className="mr-4 inline" /> },
                ].map((item) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                      exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center text-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 py-3.5 px-6 rounded-2xl transition-all border border-transparent hover:border-white/10 w-full backdrop-blur-sm"
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="w-full mt-8 pt-8 border-t border-white/10 flex justify-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
                }}
              >
                {user ? (
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex justify-center items-center gap-2 text-lg font-medium text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 w-full py-3.5 rounded-2xl transition-all border border-red-500/20 hover:border-red-500/40"
                  >
                    <FiLogOut size={20} />
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => { login("Explorer"); setMenuOpen(false); }}
                    className="flex justify-center items-center gap-2 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 w-full py-3.5 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5 transition-all"
                  >
                    <FiLogIn size={20} />
                    Login
                  </button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
