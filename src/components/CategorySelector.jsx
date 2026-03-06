import React, { useState, useEffect } from "react";
import { fetchGenres } from "../api/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiTrendingUp, FiStar, FiClock, FiGrid } from "react-icons/fi";

const CategorySelector = ({ type = "movie", onCategoryChange }) => {
    const [activeCategory, setActiveCategory] = useState("trending");
    const [genres, setGenres] = useState([]);
    const [showGenres, setShowGenres] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const categories = [
        { id: "trending", label: "Trending", icon: <FiTrendingUp /> },
        { id: "latest", label: "Latest", icon: <FiClock /> },
        { id: "top_rated", label: "Top Rated", icon: <FiStar /> },
        { id: "genre", label: "Genre", icon: <FiGrid /> },
    ];

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await fetchGenres(type);
                setGenres(data.genres || []);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
        loadGenres();
    }, [type]);

    const handleCategoryClick = (id) => {
        if (id === "genre") {
            setShowGenres(!showGenres);
        } else {
            setActiveCategory(id);
            setSelectedGenre(null);
            setShowGenres(false);
            onCategoryChange({ category: id, genreId: null });
        }
    };

    const handleGenreClick = (genre) => {
        setActiveCategory("genre");
        setSelectedGenre(genre);
        setShowGenres(false);
        onCategoryChange({ category: "genre", genreId: genre.id, genreName: genre.name });
    };

    return (
        <div className="mb-10">
            <div className="flex flex-wrap gap-3 mb-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all border ${activeCategory === cat.id && (cat.id !== "genre" || selectedGenre)
                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                            : "bg-[#1c1c1c] border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                            }`}
                    >
                        {cat.icon}
                        <span>{cat.id === "genre" && selectedGenre ? selectedGenre.name : cat.label}</span>
                        {cat.id === "genre" && (
                            <FiChevronDown
                                className={`transition-transform duration-300 ${showGenres ? "rotate-180" : ""}`}
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {showGenres && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-[#1c1c1c] rounded-2xl border border-white/5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
                    >
                        {genres.map((genre) => (
                            <button
                                key={genre.id}
                                onClick={() => handleGenreClick(genre)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors text-left ${selectedGenre?.id === genre.id
                                    ? "bg-red-600/20 text-red-500 font-bold"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategorySelector;
