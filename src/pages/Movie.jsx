import React, { useEffect, useState } from "react";
import {
  fetchGenres,
  fetchByCategory,
  fetchLatestMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
} from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import GenreFilter from "../components/GenreFilter";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const MODES = {
  TRENDING: "trending",
  LATEST: "latest",
  TOP_RATED: "top_rated",
  GENRE: "genre",
};

const Movie = () => {
  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState(MODES.TRENDING);

  useEffect(() => {
    if (mode === MODES.GENRE) {
      const loadGenres = async () => {
        const data = await fetchGenres("movie");
        setGenres(data.genres);
      };
      loadGenres();
    }
  }, [mode]);

  useEffect(() => {
    setPage(1); // Reset page on filter/mode change
  }, [selectedGenre, mode]);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        let data;
        switch (mode) {
          case MODES.GENRE:
            data = await fetchByCategory("movie", selectedGenre, page);
            break;
          case MODES.LATEST:
            data = await fetchLatestMovies(page);
            break;
          case MODES.TOP_RATED:
            data = await fetchTopRatedMovies(page);
            break;
          case MODES.TRENDING:
            data = await fetchTrendingMovies(page);
            break;
          default:
            data = { results: [], total_pages: 1 };
        }
        setMovie(data.results);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [selectedGenre, page, mode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);
  

  return (
    <div className="min-h-screen px-4 py-18 bg-zinc-900 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Movies</h1>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MODES).map(([key, value]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                mode === value ? "bg-blue-600" : "bg-zinc-700 hover:bg-zinc-600"
              }`}
            >
              {value
                .replace("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {mode === MODES.GENRE && (
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelect={setSelectedGenre}
        />
      )}

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <SkeletonCard />
              </motion.div>
            ))
          : movie.map((movie) => (
              <motion.div key={movie.id} variants={itemVariants}>
                <MovieCard movie={movie} type="movie" />
              </motion.div>
            ))}
      </motion.div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Movie;
