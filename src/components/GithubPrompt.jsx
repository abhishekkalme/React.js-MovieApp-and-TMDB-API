import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── inline SVG icons ── */
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
  </svg>
);
const IconGithub = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const IconChat = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IconShare = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const AUTO_DISMISS_MS = 12000;

const GithubPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("githubPromptDismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShowPrompt(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showPrompt) return;
    const timer = setTimeout(handleClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [showPrompt]);

  const handleClose = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    sessionStorage.setItem("githubPromptDismissed", "true");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => { setCopied(false); handleClose(); }, 1200);
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="github-prompt"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 95,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              background: "#000",
              border: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "none",
              borderRadius: "16px 16px 0 0",
              overflow: "hidden",
              boxShadow: "0 -16px 48px rgba(0,0,0,0.6)",
            }}
          >
            {/* Red top line */}
            <div style={{ height: "3px", background: "linear-gradient(90deg, #ef4444, #dc2626, #991b1b)" }} />

            {/* Auto-dismiss progress bar */}
            <div style={{ height: "2px", background: "rgba(255,255,255,0.04)", position: "relative", overflow: "hidden" }}>
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
                style={{ height: "100%", background: "rgba(220,38,38,0.4)", position: "absolute", left: 0 }}
              />
            </div>

            <div style={{ padding: "18px 20px 20px" }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Repo badge */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(220,38,38,0.12)",
                      border: "1px solid rgba(220,38,38,0.25)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#dc2626",
                      flexShrink: 0,
                    }}
                  >
                    <IconGithub />
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          color: "#dc2626",
                          textTransform: "uppercase",
                          fontWeight: "500",
                        }}
                      >
                        Open Source
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <IconStar />
                        <IconStar />
                        <IconStar />
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#fff",
                        margin: 0,
                        letterSpacing: "-0.02em",
                        fontFamily: "'DM Sans', sans-serif",
                        lineHeight: "1.2",
                      }}
                    >
                      Support the Project
                    </p>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={handleClose}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#6b7280",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#6b7280"; }}
                  aria-label="Dismiss"
                >
                  <IconX />
                </button>
              </div>

              {/* Perforated divider */}
              <div style={{ position: "relative", height: "1px", margin: "0 -20px 16px", display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: "-8px", width: "16px", height: "16px", borderRadius: "50%", background: "#000", border: "1px solid rgba(255,255,255,0.08)", zIndex: 2 }} />
                <div style={{ flex: 1, borderTop: "1px dashed rgba(255,255,255,0.1)", margin: "0 12px" }} />
                <div style={{ position: "absolute", right: "-8px", width: "16px", height: "16px", borderRadius: "50%", background: "#000", border: "1px solid rgba(255,255,255,0.08)", zIndex: 2 }} />
              </div>

              {/* Subtitle */}
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 16px", lineHeight: "1.5", letterSpacing: "0.01em" }}>
                Star the repo, join the community, or share with a friend.
              </p>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                {/* GitHub */}
                <a
                  href="https://github.com/abhishekkalme"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "11px 8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#e5e7eb",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontFamily: "'DM Mono', monospace",
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <IconGithub />
                  Star
                </a>

                {/* Community */}
                <a
                  href="/community"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "11px 8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#e5e7eb",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontFamily: "'DM Mono', monospace",
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <IconChat />
                  Join
                </a>

                {/* Share — red CTA */}
                <button
                  onClick={handleShare}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "11px 8px",
                    background: copied ? "#16a34a" : "#dc2626",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "'DM Mono', monospace",
                    cursor: "pointer",
                    transition: "background 0.2s, transform 0.1s",
                  }}
                  onMouseEnter={(e) => { if (!copied) e.currentTarget.style.background = "#ef4444"; }}
                  onMouseLeave={(e) => { if (!copied) e.currentTarget.style.background = "#dc2626"; }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <IconShare />
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GithubPrompt;