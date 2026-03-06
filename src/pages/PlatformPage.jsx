import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchContentByProvider, fetchByCustomPage } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeletons";
import Pagination from "../components/Pagination";
import { motion } from "framer-motion";

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
    const [totalPages, setTotalPages] = useState(1);
    const [type, setType] = useState("movie");

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
                setContent(data.results);
                setTotalPages(data.total_pages || 1);
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
        <div className="min-h-screen px-4 py-18 bg-black text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
                    {providerName}
                </h1>

                <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setType("movie")}
                        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${type === "movie" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Movies
                    </button>
                    <button
                        onClick={() => setType("tv")}
                        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${type === "tv" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        TV Shows
                    </button>
                </div>
            </div>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {loading
                    ? Array.from({ length: 24 }).map((_, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <SkeletonCard />
                        </motion.div>
                    ))
                    : content.map((item) => (
                        <motion.div key={item.id} variants={itemVariants}>
                            <MovieCard movie={item} type={type} />
                        </motion.div>
                    ))}
            </motion.div>

            {content.length === 0 && !loading && (
                <div className="text-center py-20 bg-zinc-900/20 rounded-xl border border-white/5">
                    <p className="text-gray-500 text-lg">No content found for this platform.</p>
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default PlatformPage;
