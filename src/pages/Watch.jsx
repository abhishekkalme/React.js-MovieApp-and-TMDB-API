import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiLoader, FiMonitor, FiRefreshCw, FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchMovieDetails, fetchTvDetails, fetchSeasonEpisodes } from "../api/tmdb";
import { FiStar, FiChevronDown } from "react-icons/fi";


const STREAMING_SERVERS = [
    { id: "multiembed", name: "MultiEmbed" },
    { id: "smashy", name: "Smashy" },
    { id: "autoembed", name: "AutoEmbed" },
    { id: "primesrc", name: "PrimeSrc" },
    { id: "vidplus", name: "VidPlus (Hindi)" },
    { id: "vidcore", name: "VidCore" },
    { id: "vidsrcembed", name: "VidSrc Embed (RU)" },
    { id: "videasy", name: "VidEasy" },
];

const buildSource = ({
    server,
    mediaType,
    tmdbId,
    imdbId,
    anilistId,
    season = 1,
    episode = 1,
    isEpisode,
    isAnime,
    dub = false,
}) => {
    if (!tmdbId && !imdbId && !anilistId) return "";

    const s = isEpisode ? season : 1;
    const e = isEpisode ? episode : 1;

    const sources = {
        multiembed: {
            movie: tmdbId ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1` : "",
            tv: tmdbId
                ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
                : "",
        },
        smashy: {
            movie: tmdbId ? `https://player.smashystream.com/movie/${tmdbId}` : "",
            tv: tmdbId
                ? `https://player.smashy.stream/tv/${tmdbId}?s=${s}&e=${e}`
                : "",
            anime: anilistId
                ? `https://player.smashy.stream/anime?anilist=${anilistId}&e=${e}`
                : "",
        },
        autoembed: {
            movie: `https://test.autoembed.cc/embed/movie/${tmdbId}`,
            tv: `https://test.autoembed.cc/embed/tv/${tmdbId}/${s}/${e}`,
        },
        primesrc: {
            movie: `https://primesrc.me/embed/movie?tmdb=${tmdbId}&fallback=true`,
            tv: `https://primesrc.me/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}&fallback=true`,
        },
        vidplus: {
            movie: `https://player.vidplus.to/embed/movie/${tmdbId}`,
            tv: `https://player.vidplus.to/embed/tv/${tmdbId}/${s}/${e}`,
            anime: anilistId
                ? `https://player.vidplus.to/embed/anime/${anilistId}/${e}?dub=${dub}`
                : "",
        },
        vidcore: {
            movie: `https://vidcore.net/movie/${tmdbId}`,
            tv: `https://vidcore.net/tv/${tmdbId}/${s}/${e}`,
        },
        vidsrcembed: {
            movie: `https://vidsrc-embed.ru/embed/movie/${tmdbId}`,
            tv: `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}&autoplay=1&autonext=1`,
        },
        videasy: {
            movie: `https://player.videasy.net/movie/${tmdbId}`,
            tv: `https://player.videasy.net/tv/${tmdbId}/${s}/${e}`,
            anime: anilistId
                ? `https://player.videasy.net/anime/${anilistId}/${e}?dub=${dub}`
                : "",
        },
    };

    if (isAnime && sources[server]?.anime) {
        return sources[server].anime;
    }

    return sources[server]?.[mediaType] || "";
};

const Watch = () => {
    const { type, id, season: seasonParam, episode: episodeParam } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [details, setDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [selectedServer, setSelectedServer] = useState("vidcore");
    const [isLoading, setIsLoading] = useState(true);
    const [hasTimedOut, setHasTimedOut] = useState(false);

    const [episodes, setEpisodes] = useState([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);
    const [activeSeason, setActiveSeason] = useState(parseInt(seasonParam) || 1);
    const [isEpisodesExpanded, setIsEpisodesExpanded] = useState(false);

    const timeoutRef = useRef(null);

    const isEpisode = type === "tv" || (type === "anime" && seasonParam);
    const season = parseInt(seasonParam) || 1;
    const episode = parseInt(episodeParam) || 1;
    const isAnime = type === "anime";
    const dub = new URLSearchParams(location.search).get("dub") === "true";

    useEffect(() => {
        const getDetails = async () => {
            setLoadingDetails(true);
            try {
                let data;
                if (type === "movie") {
                    data = await fetchMovieDetails(id);
                } else if (type === "tv" || type === "anime") {
                    data = await fetchTvDetails(id);
                }
                setDetails(data);
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoadingDetails(false);
            }
        };
        getDetails();
    }, [id, type]);

    useEffect(() => {
        if ((type === "tv" || type === "anime") && id) {
            const getEpisodes = async () => {
                setLoadingEpisodes(true);
                try {
                    const data = await fetchSeasonEpisodes(id, activeSeason);
                    setEpisodes(data.episodes || []);
                } catch (error) {
                    console.error("Error fetching episodes:", error);
                } finally {
                    setLoadingEpisodes(false);
                }
            };
            getEpisodes();
        }
    }, [id, type, activeSeason]);

    const handleEpisodeClick = (epNum) => {
        navigate(`/watch/${type}/${id}/${activeSeason}/${epNum}`);
    };

    const handlePrevEpisode = () => {
        if (episode > 1) {
            handleEpisodeClick(episode - 1);
        }
    };

    const handleNextEpisode = () => {
        const nextEp = episodes.find(ep => ep.episode_number === episode + 1);
        if (nextEp) {
            handleEpisodeClick(episode + 1);
        } else {
            alert("This is the last episode of the season.");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };



    const playerSrc = useMemo(() => {
        if (!details) return "";
        return buildSource({
            server: selectedServer,
            mediaType: type === "movie" ? "movie" : "tv",
            tmdbId: details.id,
            imdbId: details.imdb_id || details.external_ids?.imdb_id,
            anilistId: null, // Anilist ID not immediately available from TMDB
            season,
            episode,
            isEpisode,
            isAnime,
            dub,
        });
    }, [
        selectedServer,
        details,
        type,
        season,
        episode,
        isEpisode,
        isAnime,
        dub,
    ]);

    const startTimeout = useCallback(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setHasTimedOut(true);
        }, 20000);
    }, []);

    useEffect(() => {
        if (!playerSrc || selectedServer === "multiembed") return;

        setIsLoading(true);
        setHasTimedOut(false);
        startTimeout();

        return () => clearTimeout(timeoutRef.current);
    }, [playerSrc, startTimeout, selectedServer]);

    const retry = () => {
        setIsLoading(true);
        setHasTimedOut(false);
        startTimeout();
    };

    if (loadingDetails) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <FiLoader className="animate-spin text-red-600" size={40} />
            </div>
        );
    }

    const title = details?.title || details?.name || "Streaming";
    const isExternalOnly = selectedServer === "multiembed";

    return (
        <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-30"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${details?.backdrop_path || details?.poster_path})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
            </div>

            <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 pt-20 pb-12 flex flex-col gap-8">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition group"
                            >
                                <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div className="space-y-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-[10px] font-bold uppercase tracking-widest text-red-500">
                                    {type === "tv" ? `Streaming S${season} E${episode}` : "Now Streaming"}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white line-clamp-2">
                                    {title}
                                </h1>
                            </div>
                        </div>


                        <div className="hidden lg:flex flex-col gap-2 items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Select Server</span>
                            <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                                {STREAMING_SERVERS.slice(0, 9).map((server, idx) => (
                                    <button
                                        key={server.id}
                                        onClick={() => setSelectedServer(server.id)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedServer === server.id
                                            ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                                            : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        Server {idx + 1}
                                    </button>
                                ))}

                            </div>
                        </div>
                    </div>


                    <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {STREAMING_SERVERS.map((server, idx) => (
                            <button
                                key={server.id}
                                onClick={() => setSelectedServer(server.id)}
                                className={`rounded-full border px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${selectedServer === server.id
                                    ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/20"
                                    : "border-white/10 bg-white/5 backdrop-blur-md text-gray-400"
                                    }`}
                            >
                                Server {idx + 1}
                            </button>
                        ))}
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                    <div className="xl:col-span-3 flex flex-col gap-6">

                        <motion.section
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
                        >
                            {playerSrc ? (
                                isExternalOnly ? (
                                    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
                                        <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 mb-2">
                                            <FiMonitor size={40} />
                                        </div>
                                        <div className="space-y-2 max-w-md">
                                            <h3 className="text-xl font-bold">External Playback Only</h3>
                                            <p className="text-gray-400 text-sm">
                                                This server does not support in-app streaming. Please open the link in a new tab to enjoy your content.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => window.open(playerSrc, "_blank")}
                                            className="group flex items-center gap-3 rounded-full bg-red-600 px-8 py-3.5 font-black text-white hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/40"
                                        >
                                            Open in New Tab
                                            <FiArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                ) : (
                                    <iframe
                                        key={playerSrc}
                                        src={playerSrc}
                                        className="absolute inset-0 h-full w-full"
                                        frameBorder="0"
                                        loading="lazy"
                                        allowFullScreen
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        referrerPolicy="origin"
                                        onLoad={() => {
                                            clearTimeout(timeoutRef.current);
                                            setIsLoading(false);
                                        }}
                                        title={`${title} player`}
                                    />
                                )
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <FiLoader className="animate-spin text-red-600" size={32} />
                                        <p className="font-bold text-sm tracking-widest uppercase">Resolving source...</p>
                                    </div>
                                </div>
                            )}


                            {!isExternalOnly && isEpisode && !isLoading && (
                                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <button
                                        onClick={handlePrevEpisode}
                                        disabled={episode <= 1}
                                        className={`pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-xs font-bold transition-all ${episode <= 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-red-600 hover:border-red-500"}`}
                                    >
                                        <FiChevronLeft /> Previous
                                    </button>
                                    <button
                                        onClick={handleNextEpisode}
                                        className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-xs font-bold transition-all hover:bg-red-600 hover:border-red-500"
                                    >
                                        Next <FiChevronRight />
                                    </button>
                                </div>
                            )}

                            {!isExternalOnly && isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-red-600 animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center font-black text-xs">CINE</div>
                                    </div>
                                    <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-gray-400">Loading experience</p>
                                </div>
                            )}

                            {!isExternalOnly && hasTimedOut && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-8 text-center">
                                    <div className="w-20 h-20 rounded-full bg-red-600/10 flex items-center justify-center text-red-500 mb-6">
                                        <FiRefreshCw className="animate-pulse" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">Patience is a Virtue</h3>
                                    <p className="text-gray-400 mb-8 max-w-sm">
                                        The player is taking longer than usual to respond. Switch to another server or try again.
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={retry}
                                            className="flex items-center gap-2 rounded-full bg-white text-black px-8 py-3 font-bold transition hover:bg-gray-200"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4"
                        >
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {details?.release_date && (
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {details.release_date.split("-")[0]}</span>
                                )}
                                {details?.first_air_date && (
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {details.first_air_date.split("-")[0]}</span>
                                )}
                                {details?.vote_average > 0 && (
                                    <span className="flex items-center gap-1.5 text-yellow-500">
                                        <FiStar fill="currentColor" /> {details.vote_average.toFixed(1)} Rating
                                    </span>
                                )}
                                {details?.runtime > 0 && (
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {details.runtime} Min</span>
                                )}
                                {details?.number_of_seasons && (
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {details.number_of_seasons} Seasons</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {details?.genres?.map(genre => (
                                    <span key={genre.id} className="text-[10px] border border-white/20 px-3 py-1 rounded-full text-gray-300 bg-white/5">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                {details?.videos?.results?.find(v => v.type === "Trailer") && (
                                    <button
                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${details.videos.results.find(v => v.type === "Trailer").key}`, "_blank")}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-black hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Watch Trailer
                                    </button>
                                )}
                                <button
                                    onClick={() => alert("Issue reported! Our team will look into it. Thank you for your feedback.")}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-black hover:bg-white/20 transition-all"
                                >
                                    Report Issue
                                </button>
                            </div>

                            <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-4xl pt-2">
                                {details?.overview}
                            </p>

                        </motion.div>
                    </div>

                    <div className="xl:col-span-1">
                        {(type === "tv" || type === "anime") && details?.seasons && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col max-h-[80vh] xl:max-h-full overflow-hidden"
                            >
                                <div className="p-6 border-b border-white/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-black uppercase tracking-tight">Episode Guide</h3>
                                    </div>

                                    <div className="relative group">
                                        <select
                                            value={activeSeason}
                                            onChange={(e) => setActiveSeason(parseInt(e.target.value))}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-500 transition-all appearance-none cursor-pointer"
                                        >
                                            {details.seasons
                                                .filter(s => s.season_number > 0)
                                                .map(s => (
                                                    <option key={s.id} value={s.season_number}>
                                                        {s.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {loadingEpisodes ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <FiLoader className="animate-spin text-red-600" size={30} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Retrieving Episodes</span>
                                        </div>
                                    ) : (
                                        <>
                                            <AnimatePresence mode="popLayout">
                                                {(isEpisodesExpanded ? episodes : episodes.slice(0, 3)).map((ep, idx) => (
                                                    <motion.button
                                                        key={ep.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        onClick={() => handleEpisodeClick(ep.episode_number)}
                                                        className={`flex gap-4 p-3 rounded-xl border transition-all duration-300 group text-left w-full ${activeSeason === season && ep.episode_number === episode
                                                            ? "bg-red-600 border-red-500 shadow-lg shadow-red-600/20"
                                                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                                                            }`}
                                                    >
                                                        <div className="relative w-24 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                                                            <img
                                                                src={ep.still_path ? `https://image.tmdb.org/t/p/w200${ep.still_path}` : "https://via.placeholder.com/200x112?text=No+Img"}
                                                                alt={ep.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                                            <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black tracking-tighter">
                                                                E{ep.episode_number}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                            <h4 className={`text-xs font-black line-clamp-1 transition-colors ${activeSeason === season && ep.episode_number === episode ? "text-white" : "text-gray-200 group-hover:text-white"
                                                                }`}>
                                                                {ep.name}
                                                            </h4>
                                                            <p className={`text-[10px] mt-1 font-bold ${activeSeason === season && ep.episode_number === episode ? "text-red-100" : "text-gray-500"}`}>
                                                                {ep.air_date ? new Date(ep.air_date).toLocaleDateString() : "TBA"}
                                                            </p>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </AnimatePresence>

                                            {episodes.length > 3 && (
                                                <button
                                                    onClick={() => setIsEpisodesExpanded(!isEpisodesExpanded)}
                                                    className="w-full py-3 mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-dashed border-white/10 transition-all"
                                                >
                                                    {isEpisodesExpanded ? "Show Less" : `+${episodes.length - 3} More Episodes`}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>

                            </motion.div>
                        )}

                        <div className="bg-red-600/10 border border-red-500/20 rounded-2xl p-6">
                            <h4 className="text-sm font-black uppercase tracking-tight mb-2 text-red-500">Watching Tips</h4>
                            <ul className="space-y-3">
                                <li className="text-[11px] text-yellow-300 leading-relaxed font-black flex gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1 shrink-0"></span>
                                    Some servers may open a new ad tab when you press Play. Simply close the ad tab and return to this page.
                                </li>
                                {(type === "anime" || details?.genres?.some(g => g.name === "Animation" || g.name === "Anime")) && (
                                    <li className="text-[11px] text-red-400 leading-relaxed font-black flex gap-2 italic">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1 shrink-0"></span>
                                        For Anime series, Server 2, 5, and 8 usually work best!
                                    </li>
                                )}
                                <li className="text-[11px] text-red-200/70 leading-relaxed font-bold flex gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1 shrink-0"></span>
                                    If playback buffers, try switching servers.
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-6">

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h4 className="text-sm font-black uppercase tracking-tight mb-4">Player Actions</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition text-xs font-bold"
                                    >
                                        Copy Link
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=Watching ${title} on CineVerse!&url=${encodeURIComponent(window.location.href)}`, "_blank")}
                                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition text-xs font-bold"
                                    >
                                        Share on X
                                    </button>
                                </div>
                            </div>


                            {details?.credits?.cast && (
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h4 className="text-sm font-black uppercase tracking-tight mb-4">Top Cast</h4>
                                    <div className="flex flex-col gap-4">
                                        {details.credits.cast.slice(0, 4).map(actor => (
                                            <div key={actor.id} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-white/10">
                                                    <img
                                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/100x100?text=?"}
                                                        alt={actor.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold truncate">{actor.name}</p>
                                                    <p className="text-[10px] text-gray-500 truncate">{actor.character}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {details?.recommendations?.results?.length > 0 && (
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h4 className="text-sm font-black uppercase tracking-tight mb-4">You May Also Like</h4>
                                    <div className="flex flex-col gap-4">
                                        {details.recommendations.results.slice(0, 4).map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => navigate(`/watch/${item.media_type || (type === "tv" ? "tv" : "movie")}/${item.id}`)}
                                                className="flex items-center gap-3 group text-left"
                                            >
                                                <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-800 border border-white/10 flex-shrink-0">
                                                    <img
                                                        src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : "https://via.placeholder.com/200x300?text=No+Img"}
                                                        alt={item.title || item.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold truncate group-hover:text-red-500 transition-colors">{item.title || item.name}</p>
                                                    <p className="text-[10px] text-gray-500">
                                                        {new Date(item.release_date || item.first_air_date).getFullYear() || "N/A"} • ⭐ {item.vote_average?.toFixed(1)}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};



export default Watch;
