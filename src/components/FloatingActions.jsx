import React, { useEffect, useMemo, useState } from "react";
import { FiArrowUp, FiShare2, FiCheck } from "react-icons/fi";

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shareUrl = window.location.href;
  const shareText = "Check out this movie site";

  const shareTargets = useMemo(
    () => [
      {
        label: "X",
        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`
      },
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`
      },
      {
        label: "Reddit",
        href: `https://reddit.com/submit?url=${encodeURIComponent(
          shareUrl
        )}&title=${encodeURIComponent(shareText)}`
      }
    ],
    [shareUrl]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return false;
    try {
      await navigator.share({ title: document.title, text: shareText, url: shareUrl });
      return true;
    } catch {
      return false;
    }
  };

  const handleShareClick = async () => {
    const shared = await handleNativeShare();
    if (!shared) setShowShareMenu((prev) => !prev);
  };

  if (!showScrollTop) return null;

  return (
    <div className="fixed right-4 md:right-6 bottom-6 z-[90] flex flex-col gap-2">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl flex items-center justify-center transition"
        aria-label="Scroll to top"
      >
        <FiArrowUp size={18} />
      </button>

      <div className="relative">
        <button
          onClick={handleShareClick}
          className="w-11 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow-xl border border-white/10 flex items-center justify-center transition"
          aria-label="Share page"
        >
          <FiShare2 size={18} />
        </button>

        {showShareMenu && (
          <div className="absolute bottom-14 right-0 w-48 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl">
            {shareTargets.map((target) => (
              <a
                key={target.label}
                href={target.href}
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-zinc-800 transition"
              >
                Share on {target.label}
              </a>
            ))}
            <button
              onClick={handleCopy}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-zinc-800 transition flex items-center gap-2"
            >
              {copied ? <FiCheck size={14} className="text-green-400" /> : null}
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingActions;
