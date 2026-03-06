import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchAnimeMovies, fetchAnimeTV, fetchByCustomPage, fetchByCategory } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeletons";
import CategorySelector from "../components/CategorySelector";

const Anime = () => {
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [animeType, setAnimeType] = useState("tv");
    const [filter, setFilter] = useState({ category: "trending", genreId: null, genreName: "" });

    useEffect(() => {
        const loadAnime = async () => {
            setLoading(true);
            try {
                let fetcher;
                const { category, genreId } = filter;

                if (genreId) {
                    // Filter by a specific genre while keeping the anime (16) genre
                    const combinedGenres = `16,${genreId}`;
                    fetcher = (p) => fetchByCategory(animeType, combinedGenres, p);
                } else {
                    const sortByMap = {
                        trending: "popularity.desc",
                        latest: animeType === "tv" ? "first_air_date.desc" : "primary_release_date.desc",
                        top_rated: "vote_average.desc",
                    };
                    const sortBy = sortByMap[category] || "popularity.desc";

                    fetcher = animeType === "tv"
                        ? (p) => fetchAnimeTV(p, sortBy, "16")
                        : (p) => fetchAnimeMovies(p, sortBy, "16");
                }

                const data = await fetchByCustomPage(fetcher, page, 24);

                if (data.results && data.results.length > 0) {
                    if (page === 1) {
                        setAnime(data.results);
                    } else {
                        setAnime((prev) => [...prev, ...data.results]);
                    }
                    setHasMore(page < data.total_pages);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Error fetching anime:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAnime();
    }, [page, animeType, filter]);

    const handleCategoryChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1);
        setAnime([]);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    const handleTypeChange = (type) => {
        if (animeType !== type) {
            setAnimeType(type);
            setPage(1);
            setAnime([]);
            setHasMore(true);
            // Reset filter to trending when switching types to avoid incompatible filters if any
            setFilter({ category: "trending", genreId: null, genreName: "" });
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 bg-black text-white pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        <span className="text-red-600">Explore</span> {filter.genreName ? `Anime - ${filter.genreName}` : "Anime"}
                    </h1>

                    <div className="flex bg-[#1c1c1c] p-1 rounded-xl w-fit border border-white/5">
                        <button
                            onClick={() => handleTypeChange("tv")}
                            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${animeType === "tv" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            TV Series
                        </button>
                        <button
                            onClick={() => handleTypeChange("movie")}
                            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${animeType === "movie" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Movies
                        </button>
                    </div>
                </div>

                <CategorySelector type={animeType} onCategoryChange={handleCategoryChange} />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {anime.map((item, index) => (
                        <motion.div
                            key={`${item.id}-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: (index % 12) * 0.05 }}
                        >
                            <MovieCard movie={item} type={animeType} />
                        </motion.div>
                    ))}
                    {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
                </div>

                {!loading && anime.length === 0 && (
                    <div className="text-center text-gray-500 mt-20 bg-[#1c1c1c]/50 p-10 rounded-2xl border border-white/5">
                        <h2 className="text-2xl font-bold mb-2">No anime found.</h2>
                        <p>Try refreshing the page.</p>
                    </div>
                )}

                {hasMore && anime.length > 0 && (
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

export default Anime;
