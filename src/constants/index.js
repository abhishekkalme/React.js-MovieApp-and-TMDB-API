export const APP_CONFIG = {
  NAME: "CineVerse",
  LOGO_TEXT: "CineVerse",
  GITHUB_URL: "https://github.com/abhishekkalme",
};

export const TMDB_CONFIG = {
  BASE_URL: import.meta.env.VITE_TMDB_BASE_URL,
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/original",
  POSTER_BASE_URL: "https://image.tmdb.org/t/p/w500",
  BACKDROP_BASE_URL: "https://image.tmdb.org/t/p/original",
};

export const MESSAGES = {
  LOGIN_REQUIRED: "Please log in to continue.",
  LOGIN_SAVE_REQUIRED: "Please log in to save and like content.",
  WATCHLIST_EMPTY: "Your watchlist is currently empty.",
  AD_TAB_WARNING: "If pressing Play opens an ad tab, simply close it and press Play again. This helps keep the site free ❤️",
  REPORT_SUCCESS: "Issue reported! Our team will look into it. Thank you for your feedback.",
};

export const PRESET_AVATARS = [
  { id: "avatar1", name: "Classic Red", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4" },
  { id: "avatar2", name: "Neon Blue", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Aria&backgroundColor=ffdfbf" },
  { id: "avatar3", name: "Bot Green", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Jack&backgroundColor=c0aede" },
  { id: "avatar4", name: "Cyber Pink", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Luna&backgroundColor=d1d4f9" },
  { id: "avatar5", name: "Orange AI", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Milo&backgroundColor=ffd5dc" },
];
