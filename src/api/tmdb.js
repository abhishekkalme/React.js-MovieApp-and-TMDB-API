import axios from "axios";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

export const fetchMovies = async (query = "", page = 1, type = "all") => {
  const endpoint = query ? `search/multi` : `trending/${type}/day`;

  const response = await tmdb.get(`/${endpoint}`, {
    params: { query, page },
  });

  return response.data;
};

export const fetchMovieDetails = async (movieId) => {
  const response = await tmdb.get(`/movie/${movieId}`);
  return response.data;
};

export const fetchMovieCredits = async (id) => {
  const response = await tmdb.get(`/movie/${id}/credits`);
  return response.data;
};

export const fetchGenres = async (type = "movie") => {
  const res = await fetch(
    `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=en-US`
  );
  return res.json();
};

export const fetchByCategory = async (
  type = "movie",
  genreId = "",
  page = 1
) => {
  const url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}${
    genreId ? `&with_genres=${genreId}` : ""
  }`;
  const res = await fetch(url);
  return res.json();
};

export const fetchMovieVideos = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchMovieReviews = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchSimilarMovies = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?language=en-us&page=1&api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchMovieImages = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchTrendingMovies = async (page = 1) => {
  const response = await tmdb.get("/trending/movie/week", {
    params: { page },
  });
  return response.data;
};

export const fetchTopRatedMovies = async (page = 1) => {
  const response = await tmdb.get("/movie/top_rated", {
    params: { page },
  });
  return response.data;
};

export const fetchLatestMovies = async (page = 1) => {
  const response = await tmdb.get("/movie/now_playing", {
    params: { page },
  });
  return response.data;
};

export const fetchTvDetails = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchTvCredits = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchTvVideos = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchTvReviews = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchSimilarTvShows = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchTvImages = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}`
  );
  return await res.json();
};

export const fetchLatestTVShows = async (page = 1) => {
  const response = await tmdb.get("/tv/on_the_air", {
    params: { page },
  });
  return response.data;
};

export const fetchTrendingTV = async (page = 1) => {
  const response = await tmdb.get("/trending/tv/week", {
    params: { page },
  });
  return response.data;
};

export const fetchTopRatedTV = async (page = 1) => {
  const response = await tmdb.get("/tv/top_rated", {
    params: { page },
  });
  return response.data;
};

// Get TV Show Details (includes seasons info)
export const fetchTVDetails = async (id) => {
  const response = await tmdb.get(`/tv/${id}`);
  return response.data;
};

// Get Episodes for a specific season
export const fetchSeasonEpisodes = async (tvId, seasonNumber) => {
  const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
  return response.data;
};
// Assuming TV show ID is stored in `id`
export const fetchWatchProviders = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${
      import.meta.env.VITE_TMDB_API_KEY
    }`
  );
  const data = await response.json();
  return data.results?.IN || {}; // Change 'IN' to 'US' or your region code
};

export const fetchMovieWatchProviders = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }`
    );
    const data = await response.json();

    const providerData = data.results?.IN || data.results?.US || null;

    return providerData;
  } catch (error) {
    console.error("Failed to fetch watch providers:", error);
    return null;
  }
};

export const getTVDetails = async (id) => {
  const res = await tmdb.get(`/tv/${id}?append_to_response=watch/providers`);
  return res.data;
};

export const getTVCredits = async (id) => {
  const res = await tmdb.get(`/tv/${id}/credits`);
  return res.data;
};

export const getTVRecommendations = async (id) => {
  const res = await tmdb.get(`/tv/${id}/recommendations`);
  return res.data;
};

export const getTVDetailsWithVideos = async (tvId) => {
  const res = await axios.get(`${BASE_URL}/tv/${tvId}`, {
    params: {
      api_key: API_KEY,
      append_to_response: "videos",
    },
  });
  return res.data;
};

export const getMovieDetailsWithVideos = async (movieId) => {
  const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: API_KEY,
      append_to_response: "videos",
    },
  });
  return res.data;
};

export default tmdb;
