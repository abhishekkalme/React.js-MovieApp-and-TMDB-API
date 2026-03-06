import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchByCategory, fetchByCustomPage, fetchTrendingMovies, fetchTopRatedMovies, fetchLatestMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeletons";
import CategorySelector from "../components/CategorySelector";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState({ category: "trending", genreId: null, genreName: "" });

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        let fetcher;
        const { category, genreId } = filter;

        if (genreId) {
          fetcher = (p) => fetchByCategory("movie", genreId, p);
        } else {
          switch (category) {
            case "latest":
              fetcher = (p) => fetchLatestMovies(p);
              break;
            case "top_rated":
              fetcher = (p) => fetchTopRatedMovies(p);
              break;
            case "trending":
            default:
              fetcher = (p) => fetchTrendingMovies(p);
              break;
          }
        }

        const data = await fetchByCustomPage(fetcher, page, 24);

        if (data.results && data.results.length > 0) {
          if (page === 1) {
            setMovies(data.results);
          } else {
            setMovies((prev) => [...prev, ...data.results]);
          }
          setHasMore(page < data.total_pages);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, filter]);

  const handleCategoryChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setMovies([]);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 bg-black text-white pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3 text-white">
          <span className="text-red-600">Explore</span> {filter.genreName || "Movies"}
        </h1>

        <CategorySelector type="movie" onCategoryChange={handleCategoryChange} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: (index % 12) * 0.05 }}
            >
              <MovieCard movie={movie} type="movie" />
            </motion.div>
          ))}
          {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
        </div>

        {!loading && movies.length === 0 && (
          <div className="text-center text-gray-500 mt-20 bg-[#1c1c1c]/50 p-10 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold mb-2">No movies found.</h2>
            <p>Try refreshing the page.</p>
          </div>
        )}

        {hasMore && movies.length > 0 && (
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

export default Movie;
