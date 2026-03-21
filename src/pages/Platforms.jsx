import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// assets
import netflix from "../assets/netflix.png";
import prime from "../assets/prime.png";
import max from "../assets/max.png";
import crunchyroll from "../assets/crunchyroll.png";
import youtube from "../assets/youtube.svg";
import sony from "../assets/sonyliv.png";
import zee5 from "../assets/zee5.png";
import paramount from "../assets/paramount.png";
import hulu from "../assets/hulu.png";
import disney from "../assets/disney.png";
import appletv from "../assets/appletv.png";
import peacock from "../assets/peacock.jpg";
import discovery from "../assets/discovery.png";
import hidive from "../assets/hidive.webp";
import mxplayer from "../assets/mxplayer.png";
import eros from "../assets/eros.png";
import marvel from "../assets/marvel.png";
import pixar from "../assets/pixar.png";
import warner from "../assets/wb.png";
import universal from "../assets/up.png";
import a24 from "../assets/a24.svg";
import paramount1 from "../assets/paramount.svg";
import columbia from "../assets/columbia.jpg";
import century from "../assets/century.webp";
import lionsgate from "../assets/lionsgate.png";
import twdc from "../assets/twdc.svg";
import sp from "../assets/sp.png";




/* ------------------ DATA ------------------ */

const platforms = [
    { id: 8, name: "Netflix", logo: netflix, glow: "bg-red-600" },
    { id: 119, name: "Amazon Prime Video", logo: prime, glow: "bg-sky-500" },
    { id: 337, name: "Disney+", logo: disney, glow: "bg-blue-500" },
    { id: 350, name: "Apple TV+", logo: appletv, glow: "bg-gray-500" },
    { id: 1899, name: "HBO Max", logo: max, glow: "bg-purple-500" },
    { id: 386, name: "Peacock", logo: peacock, glow: "bg-yellow-400" },
    { id: 435, name: "Discovery+", logo: discovery, glow: "bg-blue-400" },
    { id: 531, name: "Paramount+", logo: paramount, glow: "bg-blue-500" },
    { id: 15, name: "Hulu", logo: hulu, glow: "bg-green-500" },
    { id: 283, name: "Crunchyroll", logo: crunchyroll, glow: "bg-orange-500" },
    { id: 430, name: "HIDIVE", logo: hidive, glow: "bg-indigo-500" },
    { id: 237, name: "Sony LIV", logo: sony, glow: "bg-pink-500" },
    { id: 232, name: "ZEE5", logo: zee5, glow: "bg-yellow-400" },
    { id: 171, name: "MX Player", logo: mxplayer, glow: "bg-blue-500" },
    { id: 188, name: "Eros Now", logo: eros, glow: "bg-red-500" },
    { id: 1112, name: "YouTube Premium", logo: youtube, glow: "bg-red-500" }
];

const studios = [
    { id: 420, name: "Marvel Studios", logo: marvel },
    { id: 3, name: "Pixar", logo: pixar },
    { id: 174, name: "Warner Bros.", logo: warner },
    { id: 33, name: "Universal Pictures", logo: universal },
    { id: 4, name: "Paramount", logo: paramount1 },
    { id: 41077, name: "A24", logo: a24 },
    { id: 2, name: "Walt Disney Pictures", logo: twdc },
    { id: 5, name: "Columbia Pictures", logo: columbia },
    { id: 34, name: "Sony Pictures Entertainment", logo: sp },
    { id: 25, name: "20th Century Studios", logo: century },
    { id: 1632, name: "Lionsgate", logo: lionsgate }
];

/* ------------------ HELPERS ------------------ */

const createSlug = (name) =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

/* ------------------ COMPONENT ------------------ */

const Platforms = () => {
    return (
        <div className="min-h-screen pt-28 px-6 md:px-12 bg-black text-white pb-32">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-16">
                    <p className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px]">
                        Explore
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black">
                        Platforms & Studios
                    </h1>
                </div>

                {/* -------- STUDIOS FIRST -------- */}
                <Section
                    title="Studios"
                    items={studios}
                    isPlatform={false}
                />

                {/* -------- PLATFORMS -------- */}
                <Section
                    title="Platforms"
                    items={platforms}
                    isPlatform={true}
                />

            </div>
        </div>
    );
};

/* ------------------ REUSABLE SECTION ------------------ */

const Section = ({ title, items, isPlatform }) => {
    return (
        <div className="mb-20">
            <h2 className="text-xl font-bold mb-8 uppercase tracking-wider text-zinc-400">
                {title}
            </h2>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.05
                        }
                    }
                }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
            >
                {items.map((item) => {
                    const link = isPlatform
                        ? `/platform/${item.id}?name=${encodeURIComponent(item.name)}`
                        : `/discovery/company/${item.id}/${createSlug(item.name)}`;

                    return (
                        <Link
                            key={item.id}
                            to={link}
                            aria-label={`View ${item.name}`}
                            className="group flex flex-col"
                        >
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    visible: { opacity: 1, scale: 1 }
                                }}
                                whileHover={{ y: -8, scale: 1.03 }}
                                className="relative aspect-square mb-4"
                            >
                                {/* Glow only for platforms */}
                                {isPlatform && (
                                    <div className={`absolute inset-0 rounded-[2rem] ${item.glow} blur-3xl opacity-0 group-hover:opacity-20`} />
                                )}

                                <div className="absolute inset-0 bg-[#0a0a0a] rounded-[2rem] border border-white/5 group-hover:border-white/20 group-hover:shadow-xl flex items-center justify-center p-8">
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        loading="lazy"
                                        className="w-full h-full object-contain group-hover:scale-110 transition-all duration-500"
                                    />
                                </div>

                                {/* TYPE BADGE */}
                                <div className="absolute top-2 right-2 text-[9px] px-2 py-1 rounded-full bg-white/10 backdrop-blur text-gray-300 uppercase tracking-widest">
                                    {isPlatform ? "platform" : "studio"}
                                </div>
                            </motion.div>

                            <p className="text-center text-xs text-zinc-500 font-bold uppercase group-hover:text-white transition">
                                {item.name}
                            </p>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default Platforms;