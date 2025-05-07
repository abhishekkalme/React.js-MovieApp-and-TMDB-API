import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchMovieImages,
  fetchMovieReviews,
  fetchSimilarMovies,
  fetchMovieWatchProviders,
  getMovieDetailsWithVideos,
} from "../api/tmdb";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";
import HorizontalScroll from "../components/HorizontalScroll";

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [trailerKey, setTrailerKey] = useState(null);

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [ratingRT, setRatingRT] = useState(null);
  const [credits, setCredits] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getMovieDetailsWithVideos(id);
      setDetails(data);

      // Trailer
      const trailer = data.videos?.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) setTrailerKey(trailer.key);
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );
        const data = await res.json();
        setCredits(data);
      } catch (err) {
        console.error("Error fetching credits:", err);
      }
    };

    fetchCredits();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const detail = await fetchMovieDetails(id);
      const credit = await fetchMovieCredits(id);
      const video = await fetchMovieVideos(id);
      const image = await fetchMovieImages(id);
      const review = await fetchMovieReviews(id);
      const similarItems = await fetchSimilarMovies(id);
      const providerData = await fetchMovieWatchProviders(id);
      setWatchProviders(providerData);
      setDetails(detail);
      setCast(credit.cast?.slice(0, 6));
      setVideos(video.results?.filter((v) => v.type === "Trailer"));
      setImages(image.backdrops?.slice(0, 5));
      setReviews(review.results?.slice(0, 3));
      setSimilar(similarItems.results?.slice(0, 6));
    };
    fetchData();
  }, [id]);

  if (!details) return <SkeletonCard />;

  return (
    <motion.div
      className="p-4 max-w-12xl mx-auto text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title & Poster */}
      <motion.div
        className="flex flex-col md:flex-row gap-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative mt-16 w-full overflow-hidden rounded-xl shadow-xl mb-6">
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
              alt={details.title}
              className="w-full md:w-64 mt-5 mb-5 rounded-xl shadow-lg animate-fadeInUp"
            />
            <div className="text-white">
              <h1 className="text-3xl mt-4 font-bold">{details.title}</h1>
              <p className="text-sm text-gray-300 mt-4 mb-2">
                📅 {details.release_date} | 🕛{details.runtime} min | 🎭
                {details.genres?.map((g) => g.name).join(", ")}
              </p>

              {/* ✅ Director Info for Movies */}
              {credits?.crew && (
                <p className="mt-4 text-sm text-gray-300">
                  <strong>Director:</strong>{" "}
                  {credits.crew
                    .filter((member) => member.job === "Director")
                    .map((d) => d.name)
                    .join(", ") || "N/A"}
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
                    .slice(0, 3) // limit to 3
                    .join(", ") || "N/A"}
                </p>
              )}
              {/* ✅ movie Info */}
              <p className="mt-7 text-gray-200">{details.overview}</p>
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

              {/* WHERE TO WATCH Section */}
              <div className="mt-3">
                {watchProviders && watchProviders.flatrate ? (
                  <div>
                    <h3 className="  text-white mb-2">
                     <strong> Now Streaming</strong>
                    </h3>
                    <div className="flex gap-4 flex-wrap">
                      {watchProviders.flatrate.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex mx-1 flex-col items-center"
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
                ) : (
                  <p className="text-gray-400">
                    Not available on streaming platforms yet — likely in
                    theaters only.
                  </p>
                )}
              </div>
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
                src={`https://image.tmdb.org/t/p/original${img.file_path}`}
                alt="screenshot"
                className="rounded-lg w-100 shadow-md transition-transform duration-300 hover:scale-105"
              />
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
      {/* Similar Movies */}
      {similar?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl mx-4 font-semibold mb-4 text-white">
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="group bg-gray-900 bg-opacity-40 rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-transform transform hover:scale-105"
              >
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-white line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {movie.release_date?.split("-")[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieDetails;
