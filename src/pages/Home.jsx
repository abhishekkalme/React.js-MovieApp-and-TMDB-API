import React, { useEffect, useState, useContext, useRef } from "react";
import { fetchTrendingMovies, fetchTopRatedMovies, fetchLatestMovies, fetchTrendingTV, fetchTopRatedTV, fetchUpcomingMovies, fetchMovieDetails } from "../api/tmdb";
import Row from "../components/Row";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiPlay, FiX, FiAlertTriangle, FiChevronLeft, FiChevronRight, FiShare2, FiPlus, FiCheck } from "react-icons/fi";
import { FaImdb } from "react-icons/fa";
import PlatformSelector from "../components/PlatformSelector";
import { SavedContext } from "../context/SavedContext";
import { WatchedContext } from "../context/WatchedContext";
import { HeroSkeleton, RowSkeleton } from "../components/Skeletons";
import { ShareModal } from "../components/Modals";
import CertificationBadge from "../components/CertificationBadge";
import ActionButton from "../components/ActionButton";
import AnimatedButton from "../components/AnimatedButton";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareData, setShareData] = useState({ title: "", id: "" });
  const { toggleSave, isSaved } = useContext(SavedContext);
  const { watched, clearWatched, removeFromWatched } = useContext(WatchedContext);
  const sliderRef = useRef(null);

  useEffect(() => {
    const isEdge = navigator.userAgent.includes("Edg/");
    const isBrave = (navigator.brave !== undefined);

    if (isEdge || isBrave) {
      setShowWarning(true);
    }

    const fetchAllData = async () => {
      try {
        const [trending, topRated, latest, tvTrending, tvTop, upcoming] = await Promise.all([
          fetchTrendingMovies(),
          fetchTopRatedMovies(),
          fetchLatestMovies(),
          fetchTrendingTV(),
          fetchTopRatedTV(),
          fetchUpcomingMovies(),
        ]);

        const trendingList = trending.results;
        setTrendingMovies(trendingList);
        setTopRatedMovies(topRated.results);
        setNowPlaying(latest.results);
        setTrendingTV(tvTrending.results);
        setTopRatedTV(tvTop.results);
        setUpcomingMovies(upcoming.results);

        const heroDetails = await Promise.all(
          trendingList.slice(0, 5).map(async (movie) => {
            const details = await fetchMovieDetails(movie.id);
            return { ...movie, ...details };
          })
        );
        setHeroMovies(heroDetails);

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const CustomArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className={`absolute bottom-24 ${direction === 'left' ? 'left-6 md:left-12' : 'right-6 md:right-12'} z-50 bg-white/5 hover:bg-white/20 p-3 rounded-md backdrop-blur-md border border-white/10 transition-all group overflow-hidden hidden md:block`}
    >
      {direction === 'left' ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
      <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
    </button>
  );

  const heroSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    pauseOnHover: false,
    pauseOnFocus: false,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    beforeChange: (current, next) => setActiveSlide(next),
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="relative w-full h-[550px] sm:h-[650px] md:h-screen mb-4 sm:mb-12 overflow-hidden">
        {loading ? (
          <HeroSkeleton />
        ) : (
          <div className="relative h-full w-full">
            <Slider ref={sliderRef} {...heroSettings}>
              {heroMovies.map((movie, index) => (
                <div key={movie.id} className="relative w-full h-[550px] sm:h-[650px] md:h-screen">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black to-transparent"></div>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
                    <div className="">
                      <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={activeSlide === index ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-wider leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-cinzel"
                      >
                        {movie.title || movie.name}
                      </motion.h1>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={activeSlide === index ? { opacity: 1 } : {}}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-200 mb-4 sm:mb-6 font-semibold text-sm sm:text-base"
                      >
                        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                          <FaImdb className="text-[#f5c51d]" />
                          <span>{movie.vote_average?.toFixed(1)}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                        <span>•</span>
                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                        <div className="ml-0 sm:ml-2 text-green-400 font-bold">
                          {Math.floor(80 + Math.random() * 20)}% match
                        </div>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={activeSlide === index ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 }}
                        className="text-gray-200 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 max-w-2xl drop-shadow-md leading-relaxed"
                      >
                        {movie.overview}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={activeSlide === index ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.7 }}
                        className="flex flex-wrap items-center gap-3 sm:gap-4"
                      >
                        <ActionButton
                          onClick={() => navigate(`/movie/${movie.id}`)}
                          icon={FiPlay}
                          label="Watch Now"
                          variant="primary"
                        />

                        <ActionButton
                          onClick={() => toggleSave({ ...movie, media_type: "movie" })}
                          icon={isSaved(movie.id) ? FiCheck : FiPlus}
                          label={isSaved(movie.id) ? "Saved" : "Save"}
                          active={isSaved(movie.id)}
                        />

                        <ActionButton
                          onClick={() => {
                            setShareData({ title: movie.title || movie.name, id: movie.id });
                            setIsShareOpen(true);
                          }}
                          icon={FiShare2}
                          label="Share"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={activeSlide === index ? { opacity: 1 } : {}}
                        transition={{ delay: 0.9 }}
                        className="mt-10 flex flex-wrap gap-2 text-sm text-gray-400 font-medium"
                      >
                        {movie.genres?.map((g, i) => (
                          <span key={g.id}>
                            {g.name} {i < movie.genres.length - 1 && <span className="mx-2 text-gray-600">•</span>}
                          </span>
                        ))}
                      </motion.div>
                    </div>

                    {/* Certification Badge */}
                    <div className={`absolute right-0 bottom-32 sm:bottom-40 bg-zinc-900/80 backdrop-blur-md border-l-4 py-1 sm:py-2 px-4 sm:px-6 text-base sm:text-xl font-bold hidden sm:block shadow-2xl transition-all duration-500
                      ${(() => {
                        const rating = (() => {
                          const releaseDates = movie.release_dates?.results || [];
                          const inCert = releaseDates.find(r => r.iso_3166_1 === "IN")?.release_dates?.[0]?.certification;
                          if (inCert) return inCert;

                          const usCert = releaseDates.find(r => r.iso_3166_1 === "US")?.release_dates?.[0]?.certification;
                          if (usCert) {
                            if (usCert === "G" || usCert === "TV-G") return "U";
                            if (usCert === "PG" || usCert === "TV-PG") return "UA";
                            if (usCert === "PG-13" || usCert === "TV-14") return "UA 13+";
                            if (usCert === "R" || usCert === "NC-17" || usCert === "TV-MA") return "A";
                            return usCert;
                          }
                          return movie.adult ? "A" : "U";
                        })();

                        if (rating === "U") return "border-green-500 text-green-400";
                        if (rating.includes("UA")) return "border-yellow-500 text-yellow-400";
                        if (rating === "A") return "border-red-600 text-red-500";
                        return "border-gray-400 text-white";
                      })()}`}
                    >
                      {(() => {
                        const releaseDates = movie.release_dates?.results || [];
                        const inCert = releaseDates.find(r => r.iso_3166_1 === "IN")?.release_dates?.[0]?.certification;
                        if (inCert) return inCert;

                        const usCert = releaseDates.find(r => r.iso_3166_1 === "US")?.release_dates?.[0]?.certification;
                        if (usCert) {
                          if (usCert === "G" || usCert === "TV-G") return "U";
                          if (usCert === "PG" || usCert === "TV-PG") return "UA";
                          if (usCert === "PG-13" || usCert === "TV-14") return "UA 13+";
                          if (usCert === "R" || usCert === "NC-17" || usCert === "TV-MA") return "A";
                          return usCert;
                        }
                        return movie.adult ? "A" : "U";
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>


            <div className="absolute bottom-10 sm:bottom-14 left-6 sm:left-12 flex items-end z-50">

              <div className="flex gap-2">
                {heroMovies.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => sliderRef.current?.slickGoTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 overflow-hidden cursor-pointer relative group ${activeSlide === i ? 'w-12 sm:w-20 bg-white/20' : 'w-6 sm:w-10 bg-white/10'}`}
                  >

                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>


                    {activeSlide === i && (
                      <motion.div
                        key={i}
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="h-full bg-red-600 w-full"
                      />
                    )}

                    {i < activeSlide && <div className="absolute inset-0 bg-white/40"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>


      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-yellow-700/50 rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(234,179,8,0.2)]"
            >
              <button
                onClick={() => {
                  setShowWarning(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <FiX size={25} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                  <FiAlertTriangle className="text-yellow-500 text-3xl" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Browser Setup Needed
                </h3>

                <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
                  We noticed you're using <strong className="text-yellow-500">Brave</strong> or{" "}
                  <strong className="text-yellow-500">Edge</strong>.
                  <br /><br />
                  To ensure the video player works correctly, please{" "}
                  <strong className="text-white">
                    turn off your browser's "Shields" or "Tracking Prevention"
                  </strong>{" "}
                  specifically for this site—otherwise the stream will stay blank!
                  <br /><br />
                  If you continue experiencing issues, we strongly recommend{" "}
                  <strong className="text-green-400">switching to Google Chrome</strong> for the best experience.
                </p>

                <div className="flex flex-col gap-3 w-full mt-2">
                  <button
                    onClick={() => {
                      setShowWarning(false);
                    }}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-full transition shadow-lg shadow-yellow-600/20"
                  >
                    Got It, I'll turn Shields off
                  </button>
                  <a
                    href="https://www.google.com/chrome/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-green-400 border border-green-500/30 font-bold py-3 rounded-full transition flex items-center justify-center gap-2"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png" alt="Chrome Logo" className="w-5 h-5" /> Get Google Chrome
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={shareData.title}
        url={`${window.location.origin}/movie/${shareData.id}`}
      />

      <PlatformSelector />

      <div className="flex flex-col gap-8 pb-10">
        {watched.length > 0 && (
          <Row
            title="Continue Watching"
            items={watched.slice(0, 15)}
            loading={loading}
            onRemoveItem={removeFromWatched}
            onClearAll={clearWatched}
          />
        )}
        <Row title="Trending Now" items={trendingMovies} loading={loading} />
        <Row title="Top Rated Movies" items={topRatedMovies} loading={loading} />
        <Row title="Upcoming Movies" items={upcomingMovies} loading={loading} />
        <Row title="New Releases" items={nowPlaying} loading={loading} />
        <Row title="Trending TV Shows" items={trendingTV} type="tv" loading={loading} />
        <Row title="Top Rated TV" items={topRatedTV} type="tv" loading={loading} />
      </div>
    </div>
  );
};

export default Home;
