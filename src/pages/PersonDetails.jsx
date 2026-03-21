import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiInstagram, FiTwitter, FiFacebook, FiExternalLink } from "react-icons/fi";
import { fetchPersonDetails } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { DetailsSkeleton } from "../components/Skeletons";

const PersonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchPersonDetails(id);
                setPerson(data);
            } catch (error) {
                console.error("Error fetching person details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <DetailsSkeleton />;
    if (!person) return <div className="h-screen flex items-center justify-center text-white">Person not found</div>;

    const credits = person.combined_credits?.cast?.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))?.slice(0, 24) || [];
    const socials = person.external_ids || {};

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

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar: Profile Photo & Info */}
                    <div className="w-full md:w-80 shrink-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-6"
                        >
                            <img
                                src={person.profile_path ? `https://image.tmdb.org/t/p/h632${person.profile_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                                alt={person.name}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                {socials.instagram_id && (
                                    <a href={`https://instagram.com/${socials.instagram_id}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                                        <FiInstagram size={20} />
                                    </a>
                                )}
                                {socials.twitter_id && (
                                    <a href={`https://twitter.com/${socials.twitter_id}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                                        <FiTwitter size={20} />
                                    </a>
                                )}
                                {socials.facebook_id && (
                                    <a href={`https://facebook.com/${socials.facebook_id}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                                        <FiFacebook size={20} />
                                    </a>
                                )}
                                {person.homepage && (
                                    <a href={person.homepage} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                                        <FiExternalLink size={20} />
                                    </a>
                                )}
                            </div>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-1">Known For</p>
                                    <p className="font-bold">{person.known_for_department}</p>
                                </div>
                                {person.birthday && (
                                    <div>
                                        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-1">Birthday</p>
                                        <p className="font-bold">{new Date(person.birthday).toLocaleDateString()} ({Math.floor((new Date() - new Date(person.birthday)) / 31557600000)} years old)</p>
                                    </div>
                                )}
                                {person.place_of_birth && (
                                    <div>
                                        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-1">Place of Birth</p>
                                        <p className="font-bold">{person.place_of_birth}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Bio & Known For */}
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold mb-8"
                        >
                            {person.name}
                        </motion.h1>

                        {person.biography && (
                            <section className="mb-12">
                                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-4">Biography</h3>
                                <p className="text-gray-300 leading-relaxed text-lg italic whitespace-pre-wrap">
                                    {person.biography}
                                </p>
                            </section>
                        )}

                        <section>
                            <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-8">Known For</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {credits.map((item) => (
                                    <MovieCard key={`${item.id}-${item.credit_id}`} movie={item} type={item.media_type} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonDetails;
