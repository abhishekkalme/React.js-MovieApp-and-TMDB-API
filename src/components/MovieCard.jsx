import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiX } from "react-icons/fi";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";

const MovieCard = ({ movie, type = "movie", onRemove }) => {
  const getWatchLink = () => {
    const mediaType = movie.media_type || type;
    // For TV shows with progress
    if (movie.lastSeason && movie.lastEpisode) {
      return `/watch/${mediaType}/${movie.id}/${movie.lastSeason}/${movie.lastEpisode}`;
    }
    // For movies in history (Continue Watching/Profile history) navigate directly to player
    if (onRemove && mediaType === "movie") {
      return `/watch/movie/${movie.id}`;
    }
    // Default to details page
    return `/${mediaType}/${movie.id}`;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group cursor-pointer"
    >
      <Link to={getWatchLink()}>
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 shadow-lg">
          <img
            src={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title || movie.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-yellow-500">
            <FiStar fill="currentColor" />
            <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
          </div>

          {onRemove && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(movie.id);
              }}
              className="absolute top-2 left-2 bg-black/60 hover:bg-red-600 backdrop-blur-md p-1.5 rounded-full text-white transition-colors z-10"
              title="Remove from history"
            >
              <FiX size={16} />
            </button>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-sm leading-tight mb-1">{movie.title || movie.name}</h3>
            <p className="text-gray-300 text-xs text-shadow-sm">
              {new Date(movie.release_date || movie.first_air_date).getFullYear() || "Unknown"}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
