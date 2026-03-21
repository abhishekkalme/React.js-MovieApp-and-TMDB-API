import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { fetchContentByProvider, fetchByCustomPage } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeletons";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const PlatformPage = () => {
    const { providerId } = useParams();
    const [searchParams] = useSearchParams();
    const providerName = searchParams.get("name") || "Platform";

    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [type, setType] = useState("movie");

    // Platform brands
    const platformBrands = {
        "337": [
            { id: 420, name: "Marvel", logo: "https://image.tmdb.org/t/p/w500/hUzeG7K9ot69u969QKvWSTj9OST.png" },
            { id: 3, name: "Pixar", logo: "https://image.tmdb.org/t/p/w500/1TTrq7fkfeqqLZN6Sgn9Gqojll3.png" },
            { id: 1, name: "Lucasfilm", logo: "https://image.tmdb.org/t/p/w500/890S7OevmS6e68MW6e6M68FcUnp.png" },
            { id: 7521, name: "National Geographic", logo: "https://image.tmdb.org/t/p/w500/v9D68G63vA3D3S8d7Q9uG3K6V1X.png" }
        ],
        "1899": [
            { id: 3268, name: "HBO", logo: "https://image.tmdb.org/t/p/w500/tuomPhY2UtuPTqqJZmRJuZhiZod.png" },
            { id: 174, name: "Warner Bros", logo: "https://image.tmdb.org/t/p/w500/ky0xOc5ni4vo60IKRfx36V97R7W.png" },
            { id: 9993, name: "DC", logo: "https://image.tmdb.org/t/p/w500/77O972X6F9X8Gf6X6X6X6X6X6X6.png" }
        ]
    };

    const currentBrands = platformBrands[providerId] || [];

    useEffect(() => {
        setPage(1);
    }, [providerId, type]);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                const data = await fetchByCustomPage(
                    (p) => fetchContentByProvider(providerId, type, p),
                    page,
                    24
                );

                if (data.results && data.results.length > 0) {
                    if (page === 1) {
                        setContent(data.results);
                    } else {
                        setContent((prev) => [...prev, ...data.results]);
                    }
                    setHasMore(page < data.total_pages);
                } else {
                    if (page === 1) setContent([]);
                    setHasMore(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [providerId, page, type]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (
        <div className="px-6 md:px-12">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16"
                >
                    <div className="flex flex-col gap-2">
                        <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px]">
                            Streaming Catalog
                        </p>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                            {providerName}
                        </h1>
                    </div>

                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl shrink-0">
                        <button
                            onClick={() => {
                                setType("movie");
                                setPage(1);
                                setContent([]);
                            }}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${type === "movie"
                                ? "bg-white text-black shadow-2xl shadow-white/10"
                                : "text-gray-500 hover:text-white"
                                }`}
                        >
                            Movies
                        </button>
                        <button
                            onClick={() => {
                                setType("tv");
                                setPage(1);
                                setContent([]);
                            }}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${type === "tv"
                                ? "bg-white text-black shadow-2xl shadow-white/10"
                                : "text-gray-500 hover:text-white"
                                }`}
                        >
                            Series
                        </button>
                    </div>
                </motion.div>

                {/* BRANDS */}
                <AnimatePresence mode="wait">
                    {currentBrands.length > 0 && (
                        <motion.div
                            key="brands"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                            {currentBrands.map((brand, index) => (
                                <Link
                                    key={brand.id}
                                    to={`/discovery/company/${brand.id}/${brand.name.replace(/\s+/g, '-')}`}
                                    className="relative aspect-[16/9] group"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="absolute inset-0 bg-[#0a0a0a] rounded-2xl border border-white/5 group-hover:border-blue-500/50 group-hover:bg-blue-600/5 transition-all duration-500 flex items-center justify-center p-6 shadow-2xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="w-full h-full object-contain brightness-0 invert opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                        />
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CONTENT GRID */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {content.map((item, index) => (
                        <motion.div key={`${item.id}-${index}`} variants={itemVariants}>
                            <MovieCard movie={item} type={type} />
                        </motion.div>
                    ))}
                    {loading && Array.from({ length: 12 }).map((_, i) => (
                        <motion.div key={`skeleton-${i}`} variants={itemVariants}>
                            <SkeletonCard />
                        </motion.div>
                    ))}
                </motion.div>

                {/* EMPTY STATE */}
                {content.length === 0 && !loading && (
                    <div className="text-center py-20 bg-zinc-900/20 rounded-xl border border-white/5 mt-8">
                        <p className="text-gray-500 text-lg">
                            No content found for this platform.
                        </p>
                    </div>
                )}

                {/* PAGINATION / LOAD MORE */}
                {hasMore && content.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={loading}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PlatformPage;