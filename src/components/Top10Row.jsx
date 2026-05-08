import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiPlay, FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { FaFire } from "react-icons/fa6";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";

const Top10Card = ({ movie, rank, type = "movie", index, onHover, isHovered }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    const mediaType = movie.media_type || type;
    navigate(`/${mediaType}/${movie.id}`);
  };

  const handleMouseEnter = () => {
    setIsCardHovered(true);
    onHover(movie);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
  };

  const year = type === "movie"
    ? new Date(movie.release_date).getFullYear()
    : new Date(movie.first_air_date).getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex items-center">
        <div className="relative w-14 md:w-16 flex-shrink-0 z-20">
          <div className="absolute -top-3 -right-1 md:-top-4 md:-right-2 w-10 h-12 md:w-12 md:h-14 bg-gradient-to-b from-red-600 to-red-700 rounded-b-lg shadow-2xl flex items-center justify-center transform rotate-0">
            <span className="text-white font-black text-xl md:text-2xl">{rank}</span>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05, zIndex: 30 }}
          transition={{ duration: 0.2 }}
          className={`relative w-[130px] md:w-[160px] aspect-[2/3] rounded-md overflow-hidden cursor-pointer shadow-xl transition-shadow duration-300 ${
            isCardHovered ? "shadow-2xl ring-2 ring-white/30" : "shadow-lg"
          }`}
          onClick={handleClick}
        >
          <img
            src={
              !imgError && movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Poster"
            }
            onError={() => setImgError(true)}
            alt={movie.title || movie.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold text-yellow-400">
            <FiStar fill="currentColor" size={8} />
            <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-white font-semibold text-xs leading-tight line-clamp-2 drop-shadow-lg">
              {movie.title || movie.name}
            </h3>
            <p className="text-gray-300 text-[10px] mt-0.5">{year}</p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/30">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-2.5 shadow-lg">
              <FiPlay size={18} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Top10Preview = ({ movie, type, onClose }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const mediaType = movie.media_type || type;
  const year = type === "movie"
    ? new Date(movie.release_date).getFullYear()
    : new Date(movie.first_air_date).getFullYear();

  const matchScore = Math.floor(80 + Math.random() * 18);

  const handlePlay = () => {
    if (mediaType === "movie") {
      navigate(`/movie/${movie.id}`);
    } else {
      navigate(`/tv/${movie.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 bottom-full z-50 mb-2 w-[320px] md:w-[380px]"
      style={{ marginLeft: "-40px" }}
    >
      <div className="bg-zinc-900/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <div className="relative h-[160px] md:h-[200px] overflow-hidden">
          <img
            src={
              !imgError && movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : `${IMAGE_BASE_URL}${movie.poster_path}`
            }
            onError={() => setImgError(true)}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="bg-red-600 px-3 py-1 rounded flex items-center gap-1.5">
              <FaFire className="text-white" size={14} />
              <span className="text-white font-black text-sm">TOP 10</span>
            </div>
            <span className="text-white font-black text-2xl">#{movie.rank || 2}</span>
          </div>

          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white/80 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-white font-bold text-lg mb-1 line-clamp-1">
            {movie.title || movie.name}
          </h2>

          <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
            <span className="text-green-400 font-bold">{matchScore}% Match</span>
            <span className="text-gray-500">•</span>
            <span>{year}</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">16+</span>
          </div>

          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-4">
            {movie.overview || "No description available."}
          </p>

          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-bold text-sm py-2.5 px-4 rounded-lg transition-colors"
            >
              <FiPlay size={16} fill="currentColor" />
              Play
            </button>
            <button className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white font-medium text-sm py-2.5 px-4 rounded-lg border border-white/30 transition-colors">
              <FiPlus size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Top10Row = ({ title, items = [], type = "movie", loading = false }) => {
  const rowRef = useRef(null);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.7;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="my-10 relative">
        <div className="px-6 md:px-12 mb-6">
          <div className="h-7 w-48 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-6 overflow-hidden px-6 md:px-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-12 bg-zinc-800 rounded-b animate-pulse" />
              <div className="w-[130px] md:w-[160px] aspect-[2/3] bg-zinc-800 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  const rankedItems = items.slice(0, 10).map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  return (
    <section
      className="my-10 relative group"
    >
      <div className="px-6 md:px-12 mb-6 flex items-center gap-3">
        <FaFire className="text-red-500" size={22} />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          {title}
        </h2>
        <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded">TOP 10</span>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/80 hover:bg-black text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
        >
          <FiChevronLeft size={22} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-4 scroll-smooth no-scrollbar scrollbar-hide"
        >
          {rankedItems.map((item, index) => (
            <div key={item.id} className="relative">
              <Top10Card
                movie={item}
                rank={item.rank}
                type={type}
                index={index}
                onHover={setHoveredMovie}
                isHovered={hoveredMovie?.id === item.id}
              />

              <AnimatePresence>
                {hoveredMovie?.id === item.id && (
                  <Top10Preview
                    movie={item}
                    type={type}
                    onClose={() => setHoveredMovie(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/80 hover:bg-black text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
        >
          <FiChevronRight size={22} />
        </button>

        <div className="absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Top10Row;