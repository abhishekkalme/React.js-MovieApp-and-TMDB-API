import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMovies, fetchGenres, fetchAdvancedFilters, searchCollections } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeletons";
import { FiChevronDown, FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const CustomSelect = ({ label, options, value, onChange, className = "" }) => (
    <div className={`relative ${className}`}>
        <select
            value={value}
            onChange={onChange}
            className="w-full bg-[#1c1c1c] text-white px-4 py-3 rounded-xl appearance-none border border-white/5 hover:border-white/10 focus:border-red-600/50 focus:outline-none transition cursor-pointer text-sm font-medium pr-10"
        >
            <option value="">{label}</option>
            {options.map((opt, i) => (
                <option key={i} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <FiChevronDown size={18} />
        </div>
    </div>
);

const SearchResults = () => {
    const [params, setParams] = useSearchParams();
    const query = params.get("q");

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [genres, setGenres] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const [type, setType] = useState("movie");
    const [genre, setGenre] = useState("");
    const [language, setLanguage] = useState("");
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");
    const [provider, setProvider] = useState("");
    const [minRating, setMinRating] = useState(0);

    useEffect(() => {
        setPage(1);
        setMovies([]);
    }, [query, type, genre, language, sortBy, yearFrom, yearTo, provider]);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await fetchGenres(type);
                setGenres(data.genres || []);
            } catch (err) {
                console.error(err);
            }
        };
        loadGenres();
    }, [type]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
                if (query) {
                    if (type === "collection") {
                        data = await searchCollections(query, page);
                    } else {
                        data = await fetchMovies(query, page);
                    }
                } else {
                    data = await fetchAdvancedFilters({
                        type,
                        genre,
                        language,
                        sortBy,
                        yearFrom,
                        yearTo,
                        provider,
                        page
                    });
                }

                if (data.results && data.results.length > 0) {
                    if (page === 1) {
                        setMovies(data.results);
                    } else {
                        setMovies((prev) => [...prev, ...data.results]);
                    }
                    setHasMore(page < data.total_pages);
                } else {
                    if (page === 1) setMovies([]);
                    setHasMore(false);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query, type, genre, language, sortBy, yearFrom, yearTo, provider, page]);

    const filteredMovies = movies.filter(m => (m.vote_average || 0) >= minRating);

    const clearAll = () => {
        setType("movie");
        setGenre("");
        setLanguage("");
        setSortBy("popularity.desc");
        setYearFrom("");
        setYearTo("");
        setProvider("");
        setMinRating(0);
        setPage(1);
        setParams({});
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 bg-black text-white pb-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px]">Discovery</p>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                            {query ? `Results for "${query}"` : "Advanced Explorer"}
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all text-xs font-black uppercase tracking-widest"
                    >
                        {isFilterOpen ? <FiX /> : <FiFilter />}
                        {isFilterOpen ? "Hide Filters" : "Show Filters"}
                    </button>
                </header>

                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 shadow-2xl">
                                <CustomSelect
                                    label="Category"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    options={[
                                        { label: "Movies", value: "movie" },
                                        { label: "TV Shows", value: "tv" },
                                        { label: "Collections", value: "collection" }
                                    ]}
                                />
                                <CustomSelect
                                    label="All Genres"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    options={genres.map(g => ({ label: g.name, value: g.id }))}
                                />
                                <CustomSelect
                                    label="All Languages"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    options={[
                                        { label: "English", value: "en" },
                                        { label: "Hindi", value: "hi" },
                                        { label: "Japanese", value: "ja" },
                                        { label: "Korean", value: "ko" },
                                    ]}
                                />
                                <CustomSelect
                                    label="Sort By"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    options={[
                                        { label: "Most Popular", value: "popularity.desc" },
                                        { label: "Top Rated", value: "vote_average.desc" },
                                        { label: "Newest", value: "primary_release_date.desc" },
                                    ]}
                                />
                                <CustomSelect
                                    label="Platform"
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    options={[
                                        { label: "Netflix", value: "8" },
                                        { label: "Amazon Prime", value: "9" },
                                        { label: "Disney+", value: "337" },
                                        { label: "HBO Max", value: "1899" },
                                    ]}
                                />
                                <CustomSelect
                                    label="Minimum Rating"
                                    value={minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    options={[
                                        { label: "8+ Stars", value: "8" },
                                        { label: "7+ Stars", value: "7" },
                                        { label: "6+ Stars", value: "6" },
                                    ]}
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="From Year"
                                        value={yearFrom}
                                        onChange={(e) => setYearFrom(e.target.value)}
                                        className="bg-[#1c1c1c] text-white px-4 py-3 rounded-xl w-full text-sm border border-white/5 focus:border-red-600/50 outline-none"
                                    />
                                    <span className="opacity-20">-</span>
                                    <input
                                        type="number"
                                        placeholder="To Year"
                                        value={yearTo}
                                        onChange={(e) => setYearTo(e.target.value)}
                                        className="bg-[#1c1c1c] text-white px-4 py-3 rounded-xl w-full text-sm border border-white/5 focus:border-red-600/50 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={clearAll}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                                >
                                    Clear All
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {movies.length === 0 && !loading && (
                    <div className="text-center py-32 bg-[#0a0a0a] rounded-[3rem] border border-white/5">
                        <h2 className="text-3xl font-black mb-4">No results found</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                    {filteredMovies.map((movie, index) => (
                        <motion.div
                            key={`${movie.id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
                        >
                            <MovieCard movie={movie} type={type === "collection" ? "movie" : (movie.media_type || type)} />
                        </motion.div>
                    ))}
                    {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
                </div>

                {hasMore && filteredMovies.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
