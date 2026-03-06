import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import netflix from "../assets/netflix.png";
import prime from "../assets/prime.png";
import max from "../assets/max.png";
import crunchyroll from "../assets/crunchyroll.png";
import youtube from "../assets/youtube.svg";
import sony from "../assets/sonyliv.png";
import zee5 from "../assets/zee5.png";
import paramount from "../assets/paramount.png";
import hulu from "../assets/hulu.png";

const platforms = [
    { id: 8, name: "Netflix", logo: netflix, glow: "bg-red-600" },
    { id: 119, name: "Amazon Prime Video", logo: prime, glow: "bg-sky-500" },
    { id: 1899, name: "Max", logo: max, glow: "bg-purple-500" },
    { id: 283, name: "Crunchyroll", logo: crunchyroll, glow: "bg-orange-500" },
    { id: 1112, name: "YouTube Premium", logo: youtube, glow: "bg-red-500" },
    { id: 237, name: "Sony LIV", logo: sony, glow: "bg-pink-500" },
    { id: 232, name: "ZEE5", logo: zee5, glow: "bg-yellow-400" },
    { id: 531, name: "Paramount+", logo: paramount, glow: "bg-blue-500" },
    { id: 15, name: "Hulu", logo: hulu, glow: "bg-green-500" }
];

const Platforms = () => {
    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 bg-black text-white pb-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-3">
                    <span className="text-red-600">All</span> Platforms
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
                    {platforms.map((platform, index) => (
                        <Link
                            key={platform.id}
                            to={`/platform/${platform.id}?name=${encodeURIComponent(platform.name)}`}
                            className="flex flex-col items-center group"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative flex items-center justify-center p-6 bg-[#1c1c1c] rounded-2xl border border-white/5 group-hover:border-white/20 transition-all w-full aspect-square"
                            >
                                <div
                                    className={`absolute inset-0 rounded-2xl ${platform.glow} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                                />

                                <img
                                    src={platform.logo}
                                    alt={platform.name}
                                    className="relative w-24 h-24 object-contain"
                                    loading="lazy"
                                />
                            </motion.div>

                            <p className="text-center text-zinc-400 mt-4 font-medium group-hover:text-white transition-colors">
                                {platform.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Platforms;
