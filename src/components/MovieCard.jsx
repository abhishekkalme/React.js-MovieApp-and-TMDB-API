import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";

const MovieCard = ({ movie, type = "movie" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="cursor-pointer"
    >
      <Link to={`/${movie.media_type || type}/${movie.id}`}>
        <div className="rounded-xl overflow-hidden shadow-lg bg-zinc-800 hover:shadow-xl transition-shadow duration-300">
          <img
            src={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
          <div className="p-2 text-center">
            <h3 className="text-sm font-semibold text-white truncate">
              {movie.title || movie.name}
            </h3>
            <p className="text-xs text-gray-400">{movie.release_date || movie.first_air_date}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
