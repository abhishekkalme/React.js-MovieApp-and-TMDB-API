import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiInfo } from "react-icons/fi";
import { fetchCollectionDetails } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { DetailsSkeleton } from "../components/Skeletons";

const CollectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchCollectionDetails(id);
                setCollection(data);
            } catch (error) {
                console.error("Error fetching collection details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <DetailsSkeleton />;
    if (!collection) return <div className="h-screen flex items-center justify-center text-white">Collection not found</div>;

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Hero Section */}
            <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${collection.backdrop_path})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
                    >
                        <FiChevronLeft /> Back
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight drop-shadow-2xl mb-4">
                            {collection.name}
                        </h1>
                        <p className="text-gray-200 text-lg md:text-xl mb-4 drop-shadow-md leading-relaxed max-w-3xl">
                            {collection.overview}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <FiInfo /> <span>{collection.parts?.length || 0} Movies in this Collection</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Movies Grid */}
            <div className="max-w-8xl mx-auto px-6 md:px-12 mt-12">
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
                    Movies
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {collection.parts?.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)).map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                        >
                            <MovieCard movie={item} type="movie" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionDetails;
