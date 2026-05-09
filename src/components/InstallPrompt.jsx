import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InstallPrompt = ({ popupManager }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        if (popupManager?.canShow("install")) {
          setShowPrompt(true);
          popupManager.register("install");
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    const timer = setTimeout(() => {
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      if (navigator.standalone === undefined && !deferredPrompt) {
        if (popupManager?.canShow("install")) {
          setShowPrompt(true);
          popupManager.register("install");
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, [popupManager]);

  useEffect(() => {
    return () => {
      popupManager?.unregister("install");
    };
  }, [popupManager]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowPrompt(false);
    setDeferredPrompt(null);
    popupManager?.unregister("install");
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    popupManager?.unregister("install");
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[100] w-[92%] max-w-sm"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {/* Ticket outer shell */}
        <div
          style={{
            background: "#000000",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 32px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Amber accent bar */}
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #ef4444, #dc2626, #991b1b)",
            }}
          />

          {/* Top section — label + close */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Film reel icon — inline SVG */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="3" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="21" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
              </svg>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  color: "#ef4444",
                  textTransform: "uppercase",
                  fontWeight: "500",
                }}
              >
                CineVerse
              </span>
            </div>

            <button
              onClick={handleDismiss}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "none",
                borderRadius: "50%",
                width: "26px",
                height: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#6b7280",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "#6b7280";
              }}
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10" />
                <line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            </button>
          </div>

          {/* Main content */}
          <div style={{ padding: "4px 16px 16px" }}>
            <p
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#ffffff",
                margin: "0 0 6px",
                lineHeight: "1.2",
                letterSpacing: "-0.02em",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Install the app
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#9ca3af",
                margin: "0",
                lineHeight: "1.5",
              }}
            >
              Faster loads &amp; a full-screen experience.
            </p>
          </div>

          {/* Perforated divider */}
          <div
            style={{
              position: "relative",
              height: "1px",
              margin: "0 -1px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Left notch */}
            <div
              style={{
                position: "absolute",
                left: "-8px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#000",
                border: "1px solid rgba(255,255,255,0.08)",
                zIndex: 2,
              }}
            />
            {/* Dashed line */}
            <div
              style={{
                flex: 1,
                borderTop: "1px dashed rgba(255,255,255,0.12)",
                margin: "0 12px",
              }}
            />
            {/* Right notch */}
            <div
              style={{
                position: "absolute",
                right: "-8px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#000",
                border: "1px solid rgba(255,255,255,0.08)",
                zIndex: 2,
              }}
            />
          </div>

          {/* Bottom ticket stub */}
          <div style={{ padding: "14px 16px 16px" }}>

            {/* CTA button */}
            <button
              onClick={handleInstall}
              style={{
                width: "100%",
                padding: "12px",
                background: "#dc2626",
                border: "none",
                borderRadius: "10px",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.15s, transform 0.1s",
                fontFamily: "'DM Mono', monospace",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#dc2626")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              Install Now
            </button>

            {/* Dismiss link */}
            <button
              onClick={handleDismiss}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "#4b5563",
                fontSize: "11px",
                letterSpacing: "0.08em",
                marginTop: "10px",
                cursor: "pointer",
                textTransform: "uppercase",
                fontFamily: "'DM Mono', monospace",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;