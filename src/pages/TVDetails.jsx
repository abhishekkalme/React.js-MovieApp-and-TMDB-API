import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay, FiPlus, FiCheck, FiShare2, FiStar,
  FiCalendar, FiTv, FiLayers, FiChevronDown, FiInfo
} from "react-icons/fi";
import { FaImdb } from "react-icons/fa";
import { getTVDetails, fetchSeasonEpisodes } from "../api/tmdb";
import { SavedContext } from "../context/SavedContext";
import { WatchedContext } from "../context/WatchedContext";
import HorizontalScroll from "../components/HorizontalScroll";
import { DetailsSkeleton } from "../components/Skeletons";
import { ShareModal, TrailerModal } from "../components/Modals";
import CertificationBadge from "../components/CertificationBadge";
import ActionButton from "../components/ActionButton";

const TVDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tv, setTv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState({});
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { toggleSave, isSaved } = useContext(SavedContext);
  const { toggleWatched, isWatched } = useContext(WatchedContext);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getTVDetails(id);
        setTv(data);
      } catch (error) {
        console.error("Error fetching TV details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleSeason = async (seasonNumber) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
      return;
    }

    if (!seasonEpisodes[seasonNumber]) {
      setLoadingEpisodes(true);
      try {
        const data = await fetchSeasonEpisodes(id, seasonNumber);
        setSeasonEpisodes((prev) => ({
          ...prev,
          [seasonNumber]: data.episodes,
        }));
      } catch (err) {
        console.error("Failed to fetch season episodes:", err);
      } finally {
        setLoadingEpisodes(false);
      }
    }
    setExpandedSeason(seasonNumber);
  };

  if (loading) return <DetailsSkeleton />;
  if (!tv) return <div className="h-screen flex items-center justify-center text-white">TV Show not found</div>;

  const creators = tv.created_by?.map(c => c.name).join(", ");
  const rating = tv.vote_average?.toFixed(1);
  const year = tv.first_air_date?.split("-")[0];
  const providers = tv["watch/providers"]?.results?.IN || tv["watch/providers"]?.results?.US;
  const trailer = tv.videos?.results?.find(v => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube");

  return (
    <div className="min-h-screen bg-black text-white pb-20">

      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})` }}
        >

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>


        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mt-auto"
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl">
              {tv.name}
            </h1>


            <div className="flex flex-wrap items-center gap-4 text-gray-200 mb-6 font-semibold">
              <CertificationBadge data={tv} type="tv" className="text-xs md:text-sm border-l-2" />
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                <FaImdb className="text-[#f5c51d]" />
                <span>{rating}</span>
              </div>
              <span className="flex items-center gap-1.5">
                <FiCalendar className="text-red-500" /> {year}
              </span>
              <span className="flex items-center gap-1.5">
                <FiTv className="text-red-500" /> {tv.number_of_seasons} {tv.number_of_seasons === 1 ? 'Season' : 'Seasons'}
              </span>
              <div className="flex gap-2">
                {tv.genres?.slice(0, 3).map(g => (
                  <span key={g.id} className="text-xs border border-white/20 px-2 py-0.5 rounded-full bg-white/5">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>


            <p className="text-gray-200 text-lg md:text-xl mb-8 line-clamp-3 drop-shadow-md leading-relaxed max-w-3xl">
              {tv.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <ActionButton
                onClick={() => navigate(`/watch/tv/${tv.id}/1/1`)}
                icon={FiPlay}
                label="Watch Now"
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
                onClick={() => toggleSave({ ...tv, media_type: "tv" })}
                icon={isSaved(tv.id) ? FiCheck : FiPlus}
                label={isSaved(tv.id) ? "Saved" : "Save"}
                active={isSaved(tv.id)}
              />

              <ActionButton
                onClick={() => toggleWatched({ ...tv, media_type: "tv" })}
                icon={isWatched(tv.id) ? FiCheck : FiPlus}
                label="Watched"
                active={isWatched(tv.id)}
                title={isWatched(tv.id) ? "Mark as Unwatched" : "Mark as Watched"}
              />

              <ActionButton
                onClick={() => setIsShareOpen(true)}
                icon={FiShare2}
                title="Share"
              />
            </div>


            <div className="mt-8 flex flex-col gap-1 text-sm text-gray-400">
              {creators && <p>Created by: <span className="text-white font-medium">{creators}</span></p>}
              <p>Status: <span className="text-green-400 font-bold uppercase tracking-wider">{tv.status}</span></p>
            </div>
          </motion.div>
        </div>
      </section>


      <div className="max-w-8xl mx-auto px-6 md:px-12 mt-12 space-y-16">


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


        {tv.credits?.cast?.length > 0 && (
          <section>
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8">Top Cast</h3>
            <HorizontalScroll>
              {tv.credits.cast.slice(0, 15).map((actor) => (
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


        <section>
          <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
            <FiLayers /> Season Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tv.seasons?.filter(s => s.season_number > 0).map((season) => (
              <div key={season.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl transition-all hover:bg-white/10 flex flex-col">
                <div className="flex gap-5 p-5">
                  <div className="relative group">
                    <img
                      src={season.poster_path ? `https://image.tmdb.org/t/p/w200${season.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                      alt={season.name}
                      className="w-24 h-36 rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h4 className="text-lg font-black text-white mb-1 tracking-tight">{season.name}</h4>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-sm uppercase tracking-widest">
                          {season.episode_count} Episodes
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed italic">
                        {season.overview || "No overview available for this season."}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSeason(season.season_number)}
                      className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-white transition-colors"
                    >
                      {expandedSeason === season.season_number ? "Close List" : "Explore Episodes"}
                      <FiChevronDown className={`transition-transform duration-500 ${expandedSeason === season.season_number ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>


                <AnimatePresence>
                  {expandedSeason === season.season_number && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-black/60 border-t border-white/5"
                    >
                      {loadingEpisodes ? (
                        <div className="py-12 flex flex-col items-center gap-3">
                          <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Syncing Episodes</span>
                        </div>
                      ) : (
                        <div className="max-h-[400px] overflow-y-auto p-5 space-y-5 custom-scrollbar">
                          {seasonEpisodes[season.season_number]?.map((ep) => (
                            <div
                              key={ep.id}
                              className="group cursor-pointer flex gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
                              onClick={() => navigate(`/watch/tv/${tv.id}/${season.season_number}/${ep.episode_number}`)}
                            >
                              <div className="relative w-36 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                                <img
                                  src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : "https://via.placeholder.com/300x170?text=No+Image"}
                                  alt={ep.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300">
                                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                                    <FiPlay fill="currentColor" className="ml-1" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h5 className="text-sm font-black truncate group-hover:text-red-500 transition-colors">
                                    {ep.episode_number}. {ep.name}
                                  </h5>
                                  {ep.vote_average > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                                      <FiStar fill="currentColor" size={10} />
                                      {ep.vote_average.toFixed(1)}
                                    </div>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                                  <span>{ep.runtime ? `${ep.runtime} MIN` : "TBA"}</span>
                                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                  <span>{ep.air_date ? ep.air_date : "TBA"}</span>
                                </p>
                                <p className="text-[11px] text-gray-400 line-clamp-2 mt-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                                  {ep.overview || "No episode overview available currently."}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>


        {tv.images?.backdrops?.length > 0 && (
          <section>
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8">Gallery</h3>
            <HorizontalScroll>
              {tv.images.backdrops.slice(0, 8).map((img, i) => (
                <div key={i} className="flex-shrink-0 w-80 aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all cursor-zoom-in group">
                  <img
                    src={`https://image.tmdb.org/t/p/original${img.file_path}`}
                    alt="TV Backdrop"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </HorizontalScroll>
          </section>
        )}


        {tv.reviews?.results?.length > 0 && (
          <section>
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
              <FiStar className="text-yellow-500" /> Reviews
            </h3>
            <div className="space-y-6">
              {tv.reviews.results.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.author_details?.avatar_path
                        ? (review.author_details.avatar_path.startsWith('/http')
                          ? review.author_details.avatar_path.substring(1)
                          : `https://image.tmdb.org/t/p/w150_and_h150_face${review.author_details.avatar_path}`)
                        : `https://ui-avatars.com/api/?name=${review.author}&background=random`}
                      alt={review.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
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


        {tv.recommendations?.results?.length > 0 && (
          <section className="pb-20">
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8">You may also like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {tv.recommendations.results.slice(0, 6).map((show) => (
                <Link
                  key={show.id}
                  to={`/tv/${show.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/10 group-hover:border-red-500/50 transition-all group-hover:scale-[1.02] shadow-xl">
                    <img
                      src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                      alt={show.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">CineVerse Recommended</p>
                      <h4 className="text-sm font-bold text-white leading-tight truncate">{show.name}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={tv.name}
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

export default TVDetails;
