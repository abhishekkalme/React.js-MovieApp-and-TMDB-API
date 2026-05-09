import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InstallPrompt = ({ popupManager }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

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
      if (isIOSDevice || !deferredPrompt) {
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
  }, [popupManager, deferredPrompt]);

  useEffect(() => {
    return () => {
      popupManager?.unregister("install");
    };
  }, [popupManager]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setShowPrompt(false);
      setDeferredPrompt(null);
      popupManager?.unregister("install");
    } else if (isIOS) {
      // For iOS, we just show instructions (the UI handles this)
      return;
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    popupManager?.unregister("install");
  };

  if (!showPrompt || isDismissed) return null;

  const titleText = isIOS ? "Add to Home Screen" : "Install the app";
  const descText = isIOS
    ? "Tap the share icon and select 'Add to Home Screen' for a full-screen experience."
    : "Faster loads & a full-screen experience.";

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
        <div
          style={{
            background: "#000000",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 32px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ height: "3px", background: "linear-gradient(90deg, #ef4444, #dc2626, #991b1b)" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="3" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="21" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
              </svg>
              <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#ef4444", textTransform: "uppercase", fontWeight: "500" }}>CineVerse</span>
            </div>
            <button onClick={handleDismiss} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            </button>
          </div>

          <div style={{ padding: "4px 16px 16px" }}>
            <p style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: "0 0 6px", lineHeight: "1.2", letterSpacing: "-0.02em", fontFamily: "'DM Sans', sans-serif" }}>{titleText}</p>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0", lineHeight: "1.5" }}>{descText}</p>
          </div>

          <div style={{ position: "relative", height: "1px", margin: "0 -1px", display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: "-8px", width: "16px", height: "16px", borderRadius: "50%", background: "#000", border: "1px solid rgba(255,255,255,0.08)", zIndex: 2 }} />
            <div style={{ flex: 1, borderTop: "1px dashed rgba(255,255,255,0.12)", margin: "0 12px" }} />
            <div style={{ position: "absolute", right: "-8px", width: "16px", height: "16px", borderRadius: "50%", background: "#000", border: "1px solid rgba(255,255,255,0.08)", zIndex: 2 }} />
          </div>

          <div style={{ padding: "14px 16px 16px" }}>
            {(!isIOS && deferredPrompt) ? (
              <button
                onClick={handleInstall}
                style={{ width: "100%", padding: "12px", background: "#dc2626", border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "'DM Mono', monospace" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                Install Now
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isIOS ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                  )}
                </div>
                <p style={{ fontSize: "11px", color: "#ffffff", margin: 0, fontWeight: "500" }}>
                  {isIOS ? "Tap Share → Add to Home Screen" : "Tap Menu → Install / Add to Home Screen"}
                </p>
              </div>
            )}

            <button onClick={handleDismiss} style={{ width: "100%", background: "none", border: "none", color: "#4b5563", fontSize: "11px", letterSpacing: "0.08em", marginTop: "10px", cursor: "pointer", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;