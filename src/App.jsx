import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingActions from "./components/FloatingActions";
import { LoginPromptModal } from "./components/Modals";
import ErrorBoundary from "./components/ErrorBoundary";
import { MESSAGES, APP_CONFIG } from "./constants";
import { FiX, FiGithub } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const SearchResult = lazy(() => import("./components/SearchResult"));
const Movies = lazy(() => import("./pages/Movie"));
const WebSeries = lazy(() => import("./pages/TV"));
const TVDetails = lazy(() => import("./pages/TVDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const Anime = lazy(() => import("./pages/Anime"));
const Watch = lazy(() => import("./pages/Watch"));
const Platforms = lazy(() => import("./pages/Platforms"));
const PlatformPage = lazy(() => import("./pages/PlatformPage"));
const Community = lazy(() => import("./pages/Community"));
const NotFound = lazy(() => import("./pages/NotFound"));


const LoadingFallback = () => (
  <div className="h-screen bg-black flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const [showGithubPrompt, setShowGithubPrompt] = React.useState(false);
  const [isGithubVisible, setIsGithubVisible] = React.useState(false);
  const [showPageLoader, setShowPageLoader] = React.useState(true);

  React.useEffect(() => {
    const hideLoader = () => {
      window.setTimeout(() => setShowPageLoader(false), 280);
    };

    if (document.readyState === "complete") {
      hideLoader();
      return;
    }

    window.addEventListener("load", hideLoader);
    return () => window.removeEventListener("load", hideLoader);
  }, []);

  React.useEffect(() => {
    let hideTimer;
    let unmountTimer;

    const showTimer = setTimeout(() => {
      setShowGithubPrompt(true);
      setTimeout(() => setIsGithubVisible(true), 50);

      hideTimer = setTimeout(() => {
        setIsGithubVisible(false);
        unmountTimer = setTimeout(() => {
          setShowGithubPrompt(false);
        }, 300);
      }, 5000);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  const handleCloseGithub = () => {
    setIsGithubVisible(false);
    setTimeout(() => {
      setShowGithubPrompt(false);
    }, 300);
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="w-full relative overflow-x-hidden min-h-screen">
          {showPageLoader && (
            <div className="fixed inset-0 z-[130] bg-black flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-red-600/80 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <Navbar />

          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/search" element={<SearchResult />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv" element={<WebSeries />} />
              <Route path="/tv/:id" element={<TVDetails />} />
              <Route path="/platform" element={<Platforms />} />
              <Route path="/platform/:providerId" element={<PlatformPage />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/watch/:type/:id" element={<Watch />} />
              <Route path="/watch/:type/:id/:season/:episode" element={<Watch />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          {showGithubPrompt && (
            <div
              className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-[95] w-[92%] max-w-md
            transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
            ${isGithubVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
            `}
            >
              <div className="relative bg-black/60 border border-white/10 rounded-2xl px-6 py-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <button
                  onClick={handleCloseGithub}
                  className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  aria-label="Close popup"
                >
                  <FiX size={16} />
                </button>

                <div className="pr-2">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-shrink-0 text-2xl h-10 w-10 flex items-center justify-center bg-white/10 rounded-full border border-white/5 shadow-inner">
                      🎬
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg tracking-wide">Enjoying the stream?</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mt-1">
                        {MESSAGES.AD_TAB_WARNING}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-5 flex-wrap">
                    <button
                      onClick={() =>
                        window.alert("Press Ctrl + D (or Cmd + D on Mac) to bookmark this page.")
                      }
                      className="flex-1 min-w-[120px] text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/15 hover:text-white border border-white/10 rounded-xl px-4 py-2.5 transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      ⭐ Bookmark
                    </button>

                    <a
                      href="/community"
                      className="flex-1 min-w-[120px] text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/15 hover:text-white border border-white/10 rounded-xl px-4 py-2.5 transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      💬 Community
                    </a>

                    <a
                      href="https://github.com/abhishekkalme"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[120px] text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/15 hover:text-white border border-white/10 rounded-xl px-4 py-2.5 transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      <FiGithub size={14} className="mb-0.5" />
                      GitHub
                    </a>

                    <button
                      onClick={handleCloseGithub}
                      className="w-full text-xs text-black bg-gradient-to-r from-white to-gray-300 hover:from-white hover:to-white rounded-xl px-4 py-2.5 transition-all duration-300 font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <FloatingActions />
          <LoginPromptModal />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;