import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLink } from "react-icons/fi";
import { FaRedditAlien, FaTwitter, FaTelegramPlane, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, title, url }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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

export default ShareModal;
