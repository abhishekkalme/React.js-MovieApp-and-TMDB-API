import React, { useEffect, useState } from "react";
import { fetchMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch movies based on query and page
  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies(query, page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, [query, page]);

  // Variant for movie cards stagger direction
  const cardVariants = {
    hidden: (i) => ({
      opacity: 0,
      x: ((i % 6) - 3) * 40, // offset based on position in row
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Slider settings
  const NextArrow = ({ onClick }) => (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full cursor-pointer hover:bg-white/80 transition"
      onClick={onClick}
    >
      <span className="text-white">&#9654;</span>
    </motion.div>
  );

  const PrevArrow = ({ onClick }) => (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full cursor-pointer hover:bg-white/80 transition"
      onClick={onClick}
    >
      <span className="text-white">&#9664;</span>
    </motion.div>
  );

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <motion.div
      className="min-h-screen bg-zinc-900 text-white px- md:px-2 py-15  "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {!loading && movies.length > 0 && (
        <div className="mb-10 relative h-[60vh] rounded-xl overflow-hidden m-1">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            pauseOnHover={false}
            arrows={true}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
          >
            {movies.slice(0, 5).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div
                  className="relative h-[60vh] bg-top rounded-2xl overflow-hidden "
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6 flex flex-col justify-end">
                    <motion.h2
                      className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {item.title || item.name}{" "}
                      {/* ✅ Handle TV and Movie titles */}
                    </motion.h2>
                    <motion.p
                      className="text-sm md:text-base max-w-2xl text-gray-200 line-clamp-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {item.overview}
                    </motion.p>
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Link
                        to={`/${
                          item.media_type || (item.title ? "movie" : "tv")
                        }/${item.id}`}
                        className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Watch Now
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>
      )}

      {/* Movie Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 my-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-full"
                variants={cardVariants}
                custom={i}
              >
                <SkeletonCard />
              </motion.div>
            ))
          : movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                className="w-full"
                variants={cardVariants}
                custom={index}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
      </motion.div>

      {!loading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </motion.div>
  );
};

export default Home;
