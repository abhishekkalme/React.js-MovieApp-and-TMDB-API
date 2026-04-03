import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiTrendingUp, FiArrowRight, FiClock } from "react-icons/fi";
import { createPortal } from "react-dom";
import { fetchMovies, fetchTrendingMovies } from "../api/tmdb";
import { useNotification } from "../context/NotificationContext";
import { TMDB_CONFIG } from "../constants";

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [trending, setTrending] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    // Load recent searches on mount
    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse recent searches", e);
            }
        }
    }, []);

    // Fetch trending movies on mount
    useEffect(() => {
        const getTrending = async () => {
            try {
                const data = await fetchTrendingMovies();
                setTrending(data.results?.slice(0, 8) || []);
            } catch (err) {
                console.error("Error fetching trending in search:", err);
            }
        };
        getTrending();
    }, []);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await fetchMovies(query.trim());
                setResults(data.results?.slice(0, 12) || []);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle Scroll Lock & ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            // Thoroughly lock background scroll
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.style.paddingRight = "0px"; // Prevent layout shift if scrollbar disappears
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            // Thoroughly restore scroll on cleanup
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const addToRecent = (term) => {
        if (!term || term.trim() === "") return;
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    const handleResultClick = (type, id, title) => {
        if (title) addToRecent(title);
        navigate(`/${type}/${id}`);
        onClose();
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            addToRecent(query.trim());
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            onClose();
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col pt-20 px-4 sm:px-6 md:px-12 overflow-y-auto"
                >
                    <div className="max-w-6xl mx-auto w-full">
                        {/* ... rest of the component content ... */}
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 sm:mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                                    <FiSearch className="text-white text-xl" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Quick Search</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-all border border-white/10"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative mb-8 sm:mb-12 group">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search movies, series, anime..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-b-2 border-white/10 focus:border-red-600 py-4 sm:py-6 text-xl sm:text-3xl md:text-4xl font-medium text-white placeholder-gray-600 outline-none transition-all"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white"
                                >
                                    <FiX size={32} />
                                </button>
                            )}
                            <div className="mt-2 hidden sm:flex items-center gap-2 text-gray-500 text-sm">
                                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">ESC</span> to close
                                <span className="ml-4 bg-white/5 px-2 py-0.5 rounded border border-white/10">ENTER</span> to see all results
                            </div>
                        </form>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
                            {/* Main Content Area */}
                            <div className="lg:col-span-2">
                                {loading ? (
                                    <div className="flex flex-col gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />
                                        ))}
                                    </div>
                                ) : query.trim() ? (
                                    <div>
                                        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-6 flex items-center gap-2">
                                            Search Results <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            {results.length > 0 ? results.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleResultClick(item.media_type || 'movie', item.id, item.title || item.name)}
                                                    className="group flex items-center gap-4 p-3 bg-white/0 hover:bg-white/5 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/10"
                                                >
                                                    <div className="w-14 h-20 sm:w-16 sm:h-24 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden relative">
                                                        {item.poster_path ? (
                                                            <img
                                                                src={`${TMDB_CONFIG.POSTER_BASE_URL}${item.poster_path}`}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://via.placeholder.com/500x750?text=No+Poster";
                                                                }}
                                                                alt={item.title || item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                                <FiSearch size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-semibold truncate group-hover:text-red-500 transition-colors">
                                                            {item.title || item.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                                                            <span className="capitalize">{item.media_type || 'Movie'}</span>
                                                            <span>•</span>
                                                            <span>{(item.release_date || item.first_air_date || '').split('-')[0] || "N/A"}</span>
                                                            <span>•</span>
                                                            <span className="text-yellow-500">★ {item.vote_average?.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                    <FiArrowRight className="text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                                                </div>
                                            )) : (
                                                <p className="text-gray-500 italic text-center py-12">No results found for "{query}"</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-12">
                                        {/* Recent Searches */}
                                        {recentSearches.length > 0 && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                                                        Recent Searches <FiClock className="text-gray-500" />
                                                    </h3>
                                                    <button
                                                        onClick={() => {
                                                            setRecentSearches([]);
                                                            localStorage.removeItem("recentSearches");
                                                            showNotification("Search history cleared", "success");
                                                        }}
                                                        className="text-[10px] text-red-500 hover:text-red-400 transition-colors font-medium uppercase tracking-widest"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {recentSearches.map((term) => (
                                                        <button
                                                            key={term}
                                                            onClick={() => setQuery(term)}
                                                            className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-full border border-white/5 transition-all flex items-center gap-2 text-sm"
                                                        >
                                                            <FiSearch size={14} className="text-gray-500" />
                                                            {term}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Trending Now */}
                                        <div>
                                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-6 flex items-center gap-2">
                                                Trending Now <FiTrendingUp className="text-red-600" />
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                {trending.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleResultClick('movie', item.id, item.title || item.name)}
                                                        className="group relative h-32 sm:h-40 bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-red-500/50 transition-all shadow-lg"
                                                    >
                                                        <img
                                                            src={`${TMDB_CONFIG.BACKDROP_BASE_URL}${item.backdrop_path}`}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/800x450?text=No+Image";
                                                            }}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 sm:p-4 flex flex-col justify-end">
                                                            <h4 className="text-white text-xs sm:text-sm font-bold truncate group-hover:text-red-400 transition-colors">
                                                                {item.title || item.name}
                                                            </h4>
                                                            <p className="text-[10px] text-gray-500 mt-0.5">{(item.release_date || item.first_air_date || '').split('-')[0]}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar / Tips */}
                            <div className="hidden lg:block">
                                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 sticky top-24">
                                    <h3 className="text-white font-bold text-lg mb-4">Search Tips</h3>
                                    <ul className="space-y-4 text-sm text-gray-400">
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
                                            Search for specific movies, TV shows, or genres.
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
                                            Press <strong className="text-white font-semibold">Enter</strong> to see the full exploration page with advanced filters.
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
                                            Clicking a result will take you directly to the player.
                                        </li>
                                    </ul>

                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-[0.2em] font-bold">Try searching for</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Marvel', 'Stranger Things', 'Anime', 'Christopher Nolan'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setQuery(tag)}
                                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 border border-white/5 transition-all hover:text-white"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default SearchOverlay;
