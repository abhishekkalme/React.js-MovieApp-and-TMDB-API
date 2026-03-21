import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft } from "react-icons/fi";
import { fetchContentByDiscovery, fetchCompanyDetails } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeletons";

const DiscoveryPage = () => {
    const { type, id, name } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch details only on the first page
                if (page === 1 && !details) {
                    const info = type === "company"
                        ? await fetchCompanyDetails(id)
                        : { name: name?.replace(/-/g, ' ') };
                    setDetails(info);
                }

                const data = await fetchContentByDiscovery(type, id, page);

                if (data.results && data.results.length > 0) {
                    if (page === 1) {
                        setResults(data.results);
                    } else {
                        setResults((prev) => [...prev, ...data.results]);
                    }
                    setHasMore(page < data.total_pages);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Discovery fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type, id, name, page]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20 pt-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <FiChevronLeft /> Back
                </motion.button>

                <div className="mb-12">
                    <p className="text-red-500 font-black uppercase tracking-[0.3em] text-xs mb-2">Discovery</p>
                    <h1 className="text-4xl md:text-6xl font-bold capitalize">
                        {type === "company" ? details?.name : details?.name || "Results"}
                    </h1>
                    {details?.description && (
                        <p className="text-gray-400 mt-4 max-w-2xl">{details.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {results.map((item, index) => (
                        <motion.div
                            key={`${item.id}-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: (index % 12) * 0.05 }}
                        >
                            <MovieCard movie={item} type={item.media_type || "movie"} />
                        </motion.div>
                    ))}
                    {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
                </div>

                {hasMore && results.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={loadMore}
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

export default DiscoveryPage;
