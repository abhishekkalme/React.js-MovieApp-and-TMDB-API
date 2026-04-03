import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSearch, FiUser, FiBell, FiHome, FiFilm, FiTv, FiFilter, FiPlay, FiLogOut, FiLogIn } from "react-icons/fi";
import { FaCat } from "react-icons/fa";
import { RiMovie2AiLine } from "react-icons/ri";

import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { APP_CONFIG } from "../constants";
import SearchOverlay from "./SearchOverlay";

const Navbar = () => {
  const { user, login, logout } = useContext(AuthContext);
  const { history, clearHistory } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  // Global keyboard shortcuts for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K, Cmd+K or /
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOverlayOpen(true);
      }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOverlayOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close notification dropdown on click outside
  useEffect(() => {
    if (!isNotificationOpen) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-container')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${scrolled
        ? "bg-black/80 backdrop-blur-lg shadow-lg py-3"
        : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
        }`}
    >
      <div className="w-full justify-between flex items-center px-6 md:px-12">
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
            <span className="text-2xl  sm:text-3xl font-extrabold tracking-tight text-white transition-all drop-shadow-md">
              Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">Verse</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-6 ml-10">
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

        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <button
            onClick={() => setIsSearchOverlayOpen(true)}
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300"
            title="Search (Ctrl + K)"
          >
            <FiSearch size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">Search...</span>
            <div className="hidden lg:flex items-center gap-1 ml-2">
              <span className="text-[10px] bg-zinc-800 text-gray-500 px-1.5 py-0.5 rounded border border-white/5">Ctrl</span>
              <span className="text-[10px] bg-zinc-800 text-gray-500 px-1.5 py-0.5 rounded border border-white/5">K</span>
            </div>
          </button>

          <div className="relative notification-container">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-gray-300 hover:text-white transition relative p-2"
            >
              <FiBell size={22} />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black animate-pulse"></span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Activity</h3>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-[10px] text-gray-500 hover:text-red-500 uppercase font-black transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {history.length === 0 ? (
                      <div className="p-10 text-center">
                        <FiBell className="mx-auto text-gray-700 mb-3" size={32} />
                        <p className="text-xs text-gray-500">No recent notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {history.map((item) => (
                          <div key={item.id} className="p-4 hover:bg-white/5 transition-colors group">
                            <div className="flex gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.type === 'success' ? 'bg-green-500' :
                                item.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                }`}></div>
                              <div>
                                <p className="text-xs text-gray-300 leading-relaxed">{item.message}</p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {history.length > 0 && (
                    <div className="p-3 bg-white/5 text-center">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest italic animate-pulse">Syncing Activities...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <button onClick={logout} className="text-gray-300 hover:text-white transition bg-zinc-800/80 hover:bg-red-500/20 hover:text-red-400 px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10 hover:border-red-500/30 backdrop-blur-sm">
              <FiLogOut size={14} /> Logout
            </button>
          ) : (
            <button onClick={() => login()} className="text-white transition-all bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-5 py-1.5 rounded-full font-medium shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5">
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
          className="md:hidden relative z-50 p-2  text-gray-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
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

            <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
              {user && (
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white transition relative group">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-red-500 transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-sm border-2 border-transparent group-hover:border-white transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      {user.username ? user.username.charAt(0).toUpperCase() : <FiUser size={18} />}
                    </div>
                  )}
                </Link>
              )}
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white backdrop-blur-md transition-all border border-white/10"
              >
                <FiX size={24} />
              </button>
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
              <motion.button
                onClick={() => {
                  setMenuOpen(false);
                  setIsSearchOverlayOpen(true);
                }}
                className="w-full relative mb-10 group"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
                }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                  <div className="relative w-full bg-zinc-900/80 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl text-gray-500 flex items-center justify-between shadow-xl">
                    <span>Search movies, shows...</span>
                    <FiSearch size={22} />
                  </div>
                </div>
              </motion.button>

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
                    onClick={() => { login(); setMenuOpen(false); }}
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

      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
