import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../api/tmdb";
import { getTVDetails, getTVRecommendations, getTVCredits } from "../api/tmdb";
import HorizontalScroll from "../components/HorizontalScroll";

import {
  fetchTvDetails,
  fetchTvCredits,
  fetchTvVideos,
  fetchTvImages,
  fetchTvReviews,
  fetchSimilarTvShows,
  fetchSeasonEpisodes,
  getTVDetailsWithVideos
} from "../api/tmdb";

import SkeletonCard from "../components/SkeletonCard";

const TVDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [tv, setTV] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState({});
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(null);

  // Scroll to top on path change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Load TV details, cast, videos, images, reviews, and similar
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [detail, creditsData, video, image, review, similarItems] =
          await Promise.all([
            fetchTvDetails(id),
            fetchTvCredits(id),
            fetchTvVideos(id),
            fetchTvImages(id),
            fetchTvReviews(id),
            fetchSimilarTvShows(id),
            getTVCredits(id),
            
          ]);
          
        setDetails(detail);
        setCast(creditsData.cast?.slice(0, 10) || []);
        setVideos(video.results?.filter((v) => v.type === "Trailer") || []);
        setImages(image.backdrops?.slice(0, 5) || []);
        setReviews(review.results?.slice(0, 3) || []);
        setSimilar(similarItems.results?.slice(0, 6) || []);
      } catch (err) {
        console.error("Error fetching TV data:", err);
      }
    };

    fetchAllData();
  }, [id]);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getTVDetailsWithVideos(id);
      setDetails(data);

      // Trailer
      const trailer = data.videos?.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) setTrailerKey(trailer.key);

        };

    fetchDetails();
  }, [id]);
  
  // Load selected TV and default season
  useEffect(() => {
    const loadTV = async () => {
      setLoading(true);
      try {
        const data = await fetchTvDetails(id);
        setTV(data);
        setSelectedSeason(data?.seasons?.[0]?.season_number || 1);
      } catch (err) {
        console.error("Failed to load TV details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTV();
  }, [id]);

  // Load episodes for selected season
  useEffect(() => {
    const loadSeasonEpisodes = async () => {
      if (!id || !selectedSeason) return;
      try {
        const data = await fetchSeasonEpisodes(id, selectedSeason);
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error("Failed to fetch season episodes:", err);
      }
    };
    loadSeasonEpisodes();
  }, [id, selectedSeason]);

  // Expand season and load its episodes
  const toggleSeason = async (seasonNumber) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null); // Collapse
      return;
    }

    if (!seasonEpisodes[seasonNumber]) {
      try {
        const response = await axios.get(`/tv/${id}/season/${seasonNumber}`);
        setSeasonEpisodes((prev) => ({
          ...prev,
          [seasonNumber]: response.data.episodes,
        }));
      } catch (err) {
        console.error("Failed to fetch season details:", err);
      }
    }
    setExpandedSeason(seasonNumber); // Expand
  };

  // Load watch providers
  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        const res = await axios.get(`/tv/${id}/watch/providers`);
        const region = res.data.results.IN || res.data.results.US || null;
        setWatchProviders(region);
      } catch (err) {
        console.error("Failed to fetch watch providers:", err);
      }
    };

    if (id) fetchWatchProviders();
  }, [id]);

  useEffect(() => {
    const fetchTVDetails = async () => {
      setLoading(true);
      try {
        const [tvRes, recs, creds] = await Promise.all([
          getTVDetails(id),
          getTVRecommendations(id),
          getTVCredits(id),
        ]);
        setTV(tvRes);
        setRecommendations(recs.results);
        setCredits(creds);
      } catch (error) {
        console.error("Error fetching TV details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVDetails();
  }, [id]);

  if (!details) return <SkeletonCard />;

  return (
    <motion.div
      className="p-4 max-w-12xl mx-auto text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Layout */}
      <motion.div
        className="flex flex-col md:flex-row gap-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative mt-16 w-full overflow-hidden rounded-xl shadow-xl mb-6">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-cover bg-top filter blur-sm brightness-50 z-0"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
            }}
          ></div>

          {/* Poster & Info */}
          <div className="relative z-10 flex flex-col md:flex-row gap-6 p-6">
            <img
              src={`https://image.tmdb.org/t/p/original${details.poster_path}`}
              alt={details.name}
              className="w-full h-full md:w-64 mt-7 rounded-xl shadow-lg animate-fadeInUp"
            />
            <div className="text-white">
              <h1 className="text-3xl mt-5 font-bold">{details.name}</h1>
              <p className="text-sm text-gray-300 mt-4 mb-2">
                📅 {details.first_air_date} | 📺 {details.seasons?.length}{" "}
                {details.seasons?.length === 1 ? "season" : "seasons"}, 🎞️{" "}
                {details.number_of_episodes}{" "}
                {details.number_of_episodes === 1 ? "episode" : "episodes"} | 🎭{" "}
                {details.genres?.map((g) => g.name).join(", ")}
              </p>
                
            {/* ✅ Creator Info */}
            {details.created_by?.length > 0 && (
              <p className="mt-4 text-sm text-gray-300">
                <strong>Created by :</strong>{" "}
                {details.created_by.map((c) => c.name).join(", ")}
              </p>
            )}
             {/* ✅ Writers Info */}
             {credits?.crew && (
                <p className="mt-2 text-sm text-gray-300">
                  <strong>Writers:</strong>{" "}
                  {credits.crew
                    .filter(
                      (member) =>
                        member.job === "Writer" ||
                        member.job === "Screenplay" ||
                        member.job === "Author"
                    )
                    .map((w) => w.name)
                    .slice(0, 5) // limit to 3
                    .join(", ") || "N/A"}
                </p>
              )}

            
              <p className="mt-2 text-gray-200">{details.overview}</p>
              <p className="mt-4">
                <strong>IMDB Rating:</strong> ⭐{" "}
                {details.vote_average?.toFixed(1)} / 10
              </p>

              {/* ✅ Play Trailer */}
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
                >
                ▶ Play Trailer
              </a>
            )}

              {/* Watch Providers */}
              {watchProviders &&
                (watchProviders.flatrate ||
                  watchProviders.buy ||
                  watchProviders.rent) && (
                  <div className="mt-3">
                    {["flatrate", "rent", "buy"].map((type) => {
                      const list = watchProviders[type];
                      return (
                        list && (
                          <div className="mb-4" key={type}>
                            <h3 className="text-lg font-medium mb-2 text-gray-300 capitalize">
                              {type === "flatrate" ? "now Streaming" : type}
                            </h3>
                            <div className="flex flex-wrap gap-4">
                              {list.map((provider) => (
                                <div
                                  key={`${type}-${provider.provider_id}`}
                                  className="flex flex-col items-center"
                                >
                                  <img
                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                    alt={provider.provider_name}
                                    className="w-12 h-12 object-center rounded-full border border-gray-700"
                                  />
                                  <span className="text-sm text-gray-400 mt-1 text-center">
                                    {provider.provider_name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Screenshots */}
      {images?.length > 0 && (
        <div>
          <h2 className="text-xl mx-4 font-semibold mb-3 text-white">
            Screenshots
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`https://image.tmdb.org/t/p/w400${img.file_path}`}
                alt="screenshot"
                className="rounded-lg w-100 shadow-md transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
        </div>
      )}

      {/* Seasons & Episodes */}
      {details?.seasons?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl mx-4 font-semibold mb-4 text-white">
            Seasons & Episodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.seasons.map((season, index) => (
              <div
                key={season.id}
                className="bg-gray-800 bg-opacity-50 rounded-xl p-4 shadow-md flex flex-col gap-4 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  <img
                    src={
                      season.poster_path
                        ? `https://image.tmdb.org/t/p/original${season.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={season.name}
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {season.name}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1 mb-1">
                        Air Date: {season.air_date || "N/A"}
                      </p>
                      <p className="text-sm text-gray-300 mb-2">
                        Episodes: {season.episode_count}
                      </p>
                      <p className="text-sm text-gray-200 line-clamp-4">
                        {season.overview || "No overview available."}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => toggleSeason(season.season_number)}
                      whileTap={{ scale: 0.95 }}
                      className=" mt-5 px-3 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium flex items-center gap-1 hover:brightness-110 transition-all w-fit"
                    >
                      <span>
                        {expandedSeason === season.season_number
                          ? "Hide Episodes"
                          : "View Episodes"}
                      </span>
                      <motion.span
                        initial={false}
                        animate={{
                          rotate:
                            expandedSeason === season.season_number ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="inline-block"
                      >
                        ⬇️
                      </motion.span>
                    </motion.button>
                  </div>
                </div>

                {/* Episodes (if expanded) */}
                <AnimatePresence initial={false}>
                  {expandedSeason === season.season_number && (
                    <motion.div
                      className="mt-4 space-y-4"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {seasonEpisodes[season.season_number].map((ep) => (
                        <motion.div
                          key={ep.id}
                          className="relative p-[1px] rounded-xl bg-gradient-to-br from-blue-500 to-purple-700"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: ep.episode_number * 0.05,
                          }}
                        >
                          <div className="flex gap-4 bg-gray-800 bg-opacity-80 rounded-xl p-3 backdrop-blur">
                            <img
                              src={
                                ep.still_path
                                  ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                                  : "https://via.placeholder.com/150x85?text=No+Image"
                              }
                              alt={ep.name}
                              className="w-36 h-20 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-base">
                                {ep.episode_number}. {ep.name}
                              </h4>
                              <div className="flex items-center text-sm text-gray-300 mt-1 gap-4">
                                <span>🕒 {ep.runtime || "N/A"} mins</span>
                                <span>
                                  ⭐ {ep.vote_average?.toFixed(1) || "N/A"}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm mt-1 line-clamp-3">
                                {ep.overview || "No overview available."}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      

      {/* Cast */}
      {credits?.cast?.length > 0 && (
        <div className="mb-6 mx-3">
          <h2 className="text-xl font-semibold mb-4 mt-5 mx-4">Top Cast</h2>
          <HorizontalScroll>
            {credits.cast.slice(0, 30).map((actor, index) => (
              <div
                key={actor.cast_id || actor.credit_id}
                className="text-center w-32"
              >
                <div
                  key={actor.id}
                  className="bg-gray-800 w-24  bg-opacity-5 rounded-xl p-3 text-center shadow-md transform transition-transform duration-300 hover:scale-105 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={actor.name}
                    className="w-24 h-24 rounded-lg object-cover shadow-md"
                  />
                  <p className="text-sm mt-2 font-medium">{actor.name}</p>
                  <p className="text-xs text-gray-400">{actor.character}</p>
                </div>
              </div>
            ))}
          </HorizontalScroll>
        </div>
      )}

      

      {/* Reviews */}
      {reviews?.length > 0 && (
        <div className="mt-10">
          <h2 className=" mx-4 text-xl font-semibold mb-4 text-white">
            Reviews
          </h2>
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="bg-gray-800 bg-opacity-60 rounded-xl p-4 shadow-md animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold mr-3">
                    {review.author[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {review.author}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-200 line-clamp-5">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Shows */}
      {similar?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl mx-4 font-semibold mb-4 text-white">
            Similar TV Shows
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar.map((item) => (
              <Link key={item.id} to={`/tv/${item.id}`}>
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-3 text-center shadow-md hover:scale-105 transition-transform">
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={item.name}
                    className="w-full h-64 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-medium text-white">{item.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TVDetails;
