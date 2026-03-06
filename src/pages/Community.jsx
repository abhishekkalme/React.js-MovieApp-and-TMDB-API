import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiMessageSquare, FiHeart, FiShare2, FiStar, FiPlus } from "react-icons/fi";

const Community = () => {
    const discussions = [
        {
            id: 1,
            user: "CinemaLover",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
            time: "2h ago",
            title: "What did everyone think of the Dune: Part Two cinematography?",
            tags: ["Discussion", "Cinematography"],
            likes: 124,
            replies: 45
        },
        {
            id: 2,
            user: "SeriesBinge",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Luna",
            time: "5h ago",
            title: "The Bear Season 3 theories - what's next for Carmy?",
            tags: ["The Bear", "Theories"],
            likes: 89,
            replies: 23
        },
        {
            id: 3,
            user: "AnimeExplorer",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Jack",
            time: "1d ago",
            title: "Weekly Recommendation: Why Pluto is a masterpiece.",
            tags: ["Anime", "Review"],
            likes: 210,
            replies: 67
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-12 pb-20">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 flex items-center gap-3">
                            <FiUsers className="text-red-600" /> Community
                        </h1>
                        <p className="text-gray-400 text-lg">Discuss your favorite movies and shows with the world.</p>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/30">
                        <FiPlus size={20} /> New Discussion
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-500">
                            <span className="w-8 h-[2px] bg-red-600"></span> Trending Discussions
                        </h2>

                        {discussions.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:border-red-600/20 transition-all group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border border-white/10" />
                                    <div>
                                        <h4 className="font-bold text-sm">{post.user}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{post.time}</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-4 group-hover:text-red-500 transition-colors cursor-pointer">
                                    {post.title}
                                </h3>

                                <div className="flex gap-2 mb-6 flex-wrap">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-black tracking-widest bg-white/5 px-3 py-1.5 rounded-lg text-gray-400 border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition text-sm font-bold">
                                            <FiHeart /> {post.likes}
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition text-sm font-bold">
                                            <FiMessageSquare /> {post.replies}
                                        </button>
                                    </div>
                                    <button className="text-gray-400 hover:text-white transition">
                                        <FiShare2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>


                    <div className="space-y-8">
                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
                            <h3 className="text-lg font-black mb-6 uppercase tracking-tight">Popular Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Cinematography", "Season Finale", "Reviews", "Marvel", "Teche", "New Releases", "Theories", "Casting"].map(tag => (
                                    <button key={tag} className="text-[11px] font-bold bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 transition">
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-600/20 to-transparent border border-red-600/10 rounded-3xl p-8">
                            <FiStar className="text-red-500 mb-4" size={32} />
                            <h3 className="text-lg font-black mb-3">Join the Club</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                Premium members get early access to discussions and exclusive badges.
                            </p>
                            <button className="w-full py-3.5 bg-red-600 text-white rounded-2xl font-black text-sm transition-all hover:bg-red-700 active:scale-95 shadow-lg shadow-red-600/20">
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
