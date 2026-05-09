import React, { Suspense, lazy, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import LoginPromptModal from "./components/LoginPromptModal";
import InstallPrompt from "./components/InstallPrompt";
import GithubPrompt from "./components/GithubPrompt";
import ErrorBoundary from "./components/ErrorBoundary";
import { PopupProvider, usePopupManager } from "./context/PopupContext";
import { MESSAGES, APP_CONFIG } from "./constants";
import { FiX, FiGithub } from "react-icons/fi";
import { useNotification } from "./context/NotificationContext";
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
const Terms = lazy(() => import("./pages/Terms"));
const CollectionDetails = lazy(() => import("./pages/CollectionDetails"));
const PersonDetails = lazy(() => import("./pages/PersonDetails"));
const DiscoveryPage = lazy(() => import("./pages/DiscoveryPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingFallback = () => (
  <div className="h-screen bg-black flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);


const AppContent = () => {
  const popupManager = usePopupManager();
  const [showPageLoader, setShowPageLoader] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const hideLoader = () => setShowPageLoader(false);
    const fallbackTimer = setTimeout(hideLoader, 1500);

    if (document.readyState === "complete" || document.readyState === "interactive") {
      const timer = setTimeout(hideLoader, 300);
      return () => {
        clearTimeout(timer);
        clearTimeout(fallbackTimer);
      };
    }

    window.addEventListener("load", hideLoader);
    return () => {
      window.removeEventListener("load", hideLoader);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
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
          <Route path="/collection/:id" element={<CollectionDetails />} />
          <Route path="/person/:id" element={<PersonDetails />} />
          <Route path="/discovery/:type/:id/:name" element={<DiscoveryPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
      <GithubPrompt />
      <FloatingActions />
      <LoginPromptModal popupManager={popupManager} />
      <InstallPrompt popupManager={popupManager} />
      <GithubPrompt popupManager={popupManager} />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <PopupProvider>
        <Router>
          <AppContent />
        </Router>
      </PopupProvider>
    </ErrorBoundary>
  );
};

export default App;