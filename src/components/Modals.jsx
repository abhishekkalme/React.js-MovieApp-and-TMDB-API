import React, { useEffect, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLink, FiLock, FiUser } from "react-icons/fi";
import { FaRedditAlien, FaTwitter, FaTelegramPlane, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export const ShareModal = ({ isOpen, onClose, title, url }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const shareLinks = [
        {
            name: "Reddit",
            icon: <FaRedditAlien size={24} className="text-orange-500" />,
            href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            color: "hover:bg-orange-500/20 hover:border-orange-500"
        },
        {
            name: "Twitter",
            icon: <FaTwitter size={24} className="text-blue-400" />,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Check out " + title)}`,
            color: "hover:bg-blue-400/20 hover:border-blue-400"
        },
        {
            name: "Telegram",
            icon: <FaTelegramPlane size={24} className="text-blue-500" />,
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            color: "hover:bg-blue-500/20 hover:border-blue-500"
        },
        {
            name: "Facebook",
            icon: <FaFacebookF size={24} className="text-blue-600" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: "hover:bg-blue-600/20 hover:border-blue-600"
        },
        {
            name: "WhatsApp",
            icon: <FaWhatsapp size={24} className="text-green-500" />,
            href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
            color: "hover:bg-green-500/20 hover:border-green-500"
        },
        {
            name: "Copy Link",
            icon: <FiLink size={24} className="text-purple-400" />,
            action: () => {
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
            },
            color: "hover:bg-purple-400/20 hover:border-purple-400"
        },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-md relative shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    >
                        <FiX size={24} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                            <FiLink size={28} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Sharing is Caring! 💖</h2>
                        <p className="text-gray-400 text-sm">
                            Streaming shouldn't cost a fortune. Help us stick it to the big corps - share the freedom!
                        </p>
                        <div className="mt-4 inline-block bg-white/5 px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 border border-white/10">
                            Shares: <span className="text-white font-bold ml-1">51.8k</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target={link.href ? "_blank" : undefined}
                                rel={link.href ? "noreferrer" : undefined}
                                onClick={(e) => {
                                    if (link.action) {
                                        e.preventDefault();
                                        link.action();
                                    }
                                }}
                                className={`flex flex-col items-center justify-center p-4 bg-zinc-800/50 rounded-xl border border-white/5 transition cursor-pointer group ${link.color}`}
                            >
                                <div className="mb-2 transition-transform group-hover:scale-110">
                                    {link.icon}
                                </div>
                                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition">
                                    {link.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition border border-white/5"
                    >
                        Maybe Later
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export const LoginPromptModal = () => {
    const {
        isLoginPromptOpen,
        loginPromptMessage,
        dismissLoginPrompt,
        loginAndContinue
    } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoginPromptOpen) return;
        setUsername("");
        setPassword("");
        setError("");
    }, [isLoginPromptOpen]);

    if (!isLoginPromptOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            setError("Enter username and password.");
            return;
        }

        setError("");
        loginAndContinue(trimmedUsername, trimmedPassword);
        setUsername("");
        setPassword("");
    };

    return (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                <button
                    onClick={dismissLoginPrompt}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    aria-label="Close login popup"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-white text-xl font-semibold mb-2">Login Required</h2>
                <p className="text-gray-400 text-sm mb-5">{loginPromptMessage}</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <label className="block">
                        <span className="text-xs text-gray-400 mb-1 block">Username</span>
                        <div className="flex items-center gap-2 bg-zinc-800 border border-white/10 rounded-lg px-3">
                            <FiUser className="text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-transparent text-white py-2.5 outline-none"
                                placeholder="Enter username"
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="text-xs text-gray-400 mb-1 block">Password</span>
                        <div className="flex items-center gap-2 bg-zinc-800 border border-white/10 rounded-lg px-3">
                            <FiLock className="text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent text-white py-2.5 outline-none"
                                placeholder="Enter password"
                            />
                        </div>
                    </label>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-semibold transition"
                    >
                        Login & Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export const TrailerModal = ({ isOpen, onClose, videoKey }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen || !videoKey) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-all group bubble-shadow"
                    >
                        <FiX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    <iframe
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                        title="YouTube trailer player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
