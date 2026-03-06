import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiSearch, FiArrowLeft } from "react-icons/fi";
import { RiMovie2AiLine } from "react-icons/ri";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 blur-[150px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full text-center relative z-10"
            >
                <div className="flex justify-center mb-10">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-full animate-pulse"></div>
                        <RiMovie2AiLine size={100} className="text-red-600 relative z-10" />
                        <div className="absolute -top-4 -right-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl uppercase tracking-tighter transform rotate-12">
                            Error 404
                        </div>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    Lost in Space?
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
                    The movie or page you're searching for seems to have drifted into a black hole.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/30"
                    >
                        <FiHome size={20} />
                        Go Back Home
                    </Link>
                    <Link
                        to="/search"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
                    >
                        <FiSearch size={20} />
                        Search Titles
                    </Link>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="mt-12 text-gray-500 hover:text-white transition flex items-center gap-2 mx-auto text-sm font-bold uppercase tracking-widest"
                >
                    <FiArrowLeft /> Return to Previous Page
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
