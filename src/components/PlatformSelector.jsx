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

const PlatformSelector = () => {
    return (
        <section className=" md:px-12 mt-8 mb-16">

            <h2 className="text-2xl font-semibold text-white mb-10 flex items-center gap-3">
                <span className="w-1.5 h-7 bg-red-600 rounded-full"></span>
                Browse by Platform
            </h2>

            <div className="flex gap-14 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar">

                {platforms.map((platform) => (
                    <Link
                        key={platform.id}
                        to={`/platform/${platform.id}?name=${encodeURIComponent(platform.name)}`}
                        className="snap-start flex flex-col items-center min-w-[110px] group"
                    >
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative flex items-center mt-6 px-4 mr-4 justify-center"
                        >
                            <div
                                className={`absolute w-20 h-20 md:w-24 md:h-24 rounded-full blur-xl opacity-30 ${platform.glow} group-hover:opacity-60 transition-opacity`}
                            />

                            <img
                                src={platform.logo}
                                alt={platform.name}
                                className="relative w-20 h-20 md:w-24 md:h-24 object-contain transition-transform group-hover:scale-110"
                                loading="lazy"
                            />
                        </motion.div>

                        <p className="text-center text-sm mr-4 text-zinc-400 mt-4 group-hover:text-white transition-colors">
                            {platform.name}
                        </p>
                    </Link>
                ))}

            </div>
        </section>
    );
};

export default PlatformSelector;
