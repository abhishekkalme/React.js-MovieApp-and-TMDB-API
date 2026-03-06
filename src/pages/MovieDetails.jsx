import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
   FiPlay, FiShare2, FiStar,
   FiCalendar, FiClock, FiMaximize2, FiInfo, FiPlus, FiCheck
} from "react-icons/fi";
import { FaImdb } from "react-icons/fa";
import { fetchMovieDetails, fetchMovieCertifications } from "../api/tmdb";
import { SavedContext } from "../context/SavedContext";
import { WatchedContext } from "../context/WatchedContext";
import HorizontalScroll from "../components/HorizontalScroll";
import { DetailsSkeleton } from "../components/Skeletons";
import { ShareModal, TrailerModal } from "../components/Modals";
import CertificationBadge from "../components/CertificationBadge";
import ActionButton from "../components/ActionButton";

const MovieDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [movie, setMovie] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isShareOpen, setIsShareOpen] = useState(false);
   const [isTrailerOpen, setIsTrailerOpen] = useState(false);
   const { toggleSave, isSaved } = useContext(SavedContext);
   const { toggleWatched, isWatched } = useContext(WatchedContext);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const [data] = await Promise.all([
               fetchMovieDetails(id),
               fetchMovieCertifications(id)
            ]);
            setMovie(data);
         } catch (error) {
            console.error("Error fetching movie details:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
      window.scrollTo(0, 0);
   }, [id]);

   if (loading) return <DetailsSkeleton />;
   if (!movie) return <div className="h-screen flex items-center justify-center text-white">Movie not found</div>;

   const rating = movie.vote_average?.toFixed(1);
   const year = movie.release_date?.split("-")[0];
   const providers = movie["watch/providers"]?.results?.IN || movie["watch/providers"]?.results?.US;
   const trailer = movie.videos?.results?.find(v => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube");

   const formatCurrency = (amount) => {
      if (!amount) return "N/A";
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
   };

   return (
      <div className="min-h-screen bg-black text-white pb-20">
         <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
            <div
               className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
               style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl"
               >
                  <h1 className="text-4xl md:text-7xl font-bold tracking-tight drop-shadow-2xl mb-4">
                     {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-200 mb-6 font-semibold">
                     <CertificationBadge data={movie} type="movie" className="text-xs md:text-sm border-l-2" />
                     <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                        <FaImdb className="text-[#f5c51d]" />
                        <span>{rating}</span>
                     </div>
                     <span className="flex items-center gap-1.5">
                        <FiCalendar className="text-red-500" /> {year}
                     </span>
                     <span className="flex items-center gap-1.5">
                        <FiClock className="text-red-500" /> {movie.runtime} min
                     </span>
                     <div className="flex gap-2">
                        {movie.genres?.slice(0, 3).map(g => (
                           <span key={g.id} className="text-xs border border-white/20 px-2 py-0.5 rounded-full bg-white/5">
                              {g.name}
                           </span>
                        ))}
                     </div>
                  </div>

                  <p className="text-gray-200 text-lg md:text-xl mb-8 line-clamp-3 drop-shadow-md leading-relaxed max-w-3xl">
                     {movie.overview}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                     <ActionButton
                        onClick={() => navigate(`/watch/movie/${movie.id}`)}
                        icon={FiPlay}
                        label="Watch Movie"
                        variant="primary"
                     />

                     {trailer && (
                        <ActionButton
                           onClick={() => setIsTrailerOpen(true)}
                           icon={FiPlay}
                           label="Watch Trailer"
                        />
                     )}

                     <ActionButton
                        onClick={() => toggleSave({ ...movie, media_type: "movie" })}
                        icon={isSaved(movie.id) ? FiCheck : FiPlus}
                        label={isSaved(movie.id) ? "Saved" : "Save"}
                        active={isSaved(movie.id)}
                     />

                     <ActionButton
                        onClick={() => toggleWatched({ ...movie, media_type: "movie" })}
                        icon={isWatched(movie.id) ? FiCheck : FiPlus}
                        label="Watched"
                        active={isWatched(movie.id)}
                        title={isWatched(movie.id) ? "Mark as Unwatched" : "Mark as Watched"}
                     />

                     <ActionButton
                        onClick={() => setIsShareOpen(true)}
                        icon={FiShare2}
                        title="Share"
                     />
                  </div>

                  <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400">
                     <p>Status: <span className="text-white font-medium">{movie.status}</span></p>
                     <p>Budget: <span className="text-white font-medium">{formatCurrency(movie.budget)}</span></p>
                     <p>Revenue: <span className="text-white font-medium">{formatCurrency(movie.revenue)}</span></p>
                  </div>
               </motion.div>
            </div>
         </section>

         <div className="max-w-8xl mx-auto px-6 md:px-12 mt-12 space-y-16">
            {/* Watch Providers */}
            {providers && (providers.flatrate || providers.buy || providers.rent) && (
               <motion.section
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
               >
                  <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                     <FiInfo className="text-red-600" /> Where to watch
                  </h3>
                  <div className="flex flex-wrap gap-6">
                     {[...(providers.flatrate || []), ...(providers.buy || []), ...(providers.rent || [])].slice(0, 4).map((provider, i) => (
                        <div key={`${provider.provider_id}-${i}`} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                           <img
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="w-8 h-8 rounded-lg"
                           />
                           <span className="text-sm font-bold">{provider.provider_name}</span>
                        </div>
                     ))}
                  </div>
               </motion.section>
            )}

            {/* Top Cast */}
            {movie.credits?.cast?.length > 0 && (
               <section>
                  <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8">Top Cast</h3>
                  <HorizontalScroll>
                     {movie.credits.cast.slice(0, 15).map((actor) => (
                        <div key={actor.id} className="flex-shrink-0 w-32 group cursor-pointer text-center">
                           <div className="relative aspect-square rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-red-500 transition-all duration-500 shadow-xl mx-auto">
                              <img
                                 src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/200x200?text=No+Image"}
                                 alt={actor.name}
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                           </div>
                           <p className="text-sm font-bold text-white truncate group-hover:text-red-500 transition-colors px-2">{actor.name}</p>
                           <p className="text-[10px] text-gray-500 truncate px-2">{actor.character}</p>
                        </div>
                     ))}
                  </HorizontalScroll>
               </section>
            )}

            {/* Media Gallery */}
            {movie.images?.backdrops?.length > 0 && (
               <section>
                  <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
                     <FiMaximize2 /> Gallery
                  </h3>
                  <HorizontalScroll>
                     {movie.images.backdrops.slice(0, 8).map((img, i) => (
                        <div key={i} className="flex-shrink-0 w-80 aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all cursor-zoom-in group">
                           <img
                              src={`https://image.tmdb.org/t/p/original${img.file_path}`}
                              alt="Movie Backdrop"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                           />
                        </div>
                     ))}
                  </HorizontalScroll>
               </section>
            )}

            {/* Reviews Section */}
            {movie.reviews?.results?.length > 0 && (
               <section>
                  <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
                     <FiStar className="text-yellow-500" /> Reviews
                  </h3>
                  <div className="space-y-6">
                     {movie.reviews.results.slice(0, 3).map((review) => (
                        <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                           <div className="flex items-center gap-4 mb-4">
                              <img
                                 src={review.author_details?.avatar_path
                                    ? (review.author_details.avatar_path.startsWith('/http')
                                       ? review.author_details.avatar_path.substring(1)
                                       : `https://image.tmdb.org/t/p/w150_and_h150_face${review.author_details.avatar_path}`)
                                    : `https://ui-avatars.com/api/?name=${review.author}&background=random`}
                                 alt={review.author}
                                 className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shadow-lg"
                              />
                              <div>
                                 <p className="font-bold text-white">{review.author}</p>
                                 <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 italic">
                              "{review.content}"
                           </p>
                        </div>
                     ))}
                  </div>
               </section>
            )}

            {/* Similar Movies */}
            {movie.recommendations?.results?.length > 0 && (
               <section className="pb-20">
                  <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8">More Like This</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                     {movie.recommendations.results.slice(0, 6).map((item) => (
                        <div key={item.id} className="group" onClick={() => navigate(`/movie/${item.id}`)}>
                           <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/10 group-hover:border-red-500/50 transition-all group-hover:scale-[1.02] shadow-xl cursor-pointer">
                              <img
                                 src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                                 alt={item.title}
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute bottom-0 left-0 p-4 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">CineVerse Recommended</p>
                                 <h4 className="text-sm font-bold text-white leading-tight truncate">{item.title}</h4>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            )}
         </div>

         <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title={movie.title}
            url={window.location.href}
         />

         <TrailerModal
            isOpen={isTrailerOpen}
            onClose={() => setIsTrailerOpen(false)}
            videoKey={trailer?.key}
         />
      </div>
   );
};

export default MovieDetails;
