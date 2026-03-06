import axios from "axios";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
import { TMDB_CONFIG } from "../constants";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
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
  const response = await tmdb.get(`/movie/${movieId}`, {
    params: {
      append_to_response: "credits,videos,recommendations,release_dates,reviews,images,watch/providers",
    },
  });
  return response.data;
};

export const fetchMovieCertifications = async (id) => {
  try {
    const response = await tmdb.get(`/movie/${id}/release_dates`);
    const results = response.data.results;
    const cert = results.find((r) => r.iso_3166_1 === "IN") || results.find((r) => r.iso_3166_1 === "US");
    return cert?.release_dates?.[0]?.certification || "N/A";
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return "N/A";
  }
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
  const response = await tmdb.get(`/tv/${id}`, {
    params: {
      append_to_response: "credits,videos,recommendations,content_ratings",
    },
  });
  return response.data;
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

export const fetchSeasonEpisodes = async (tvId, seasonNumber) => {
  const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
  return response.data;
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
  const res = await tmdb.get(
    `/tv/${id}?append_to_response=videos,credits,images,reviews,recommendations,watch/providers`
  );
  return res.data;
};

export const fetchUpcomingMovies = async (page = 1) => {
  const response = await tmdb.get("/movie/upcoming", {
    params: { page },
  });
  return response.data;
};

export const fetchContentByProvider = async (
  providerId,
  type = "movie",
  page = 1
) => {
  try {
    const resIN = await tmdb.get(`/discover/${type}`, {
      params: {
        with_watch_providers: providerId,
        watch_region: "IN",
        page,
      },
    });

    if (resIN.data.results.length > 0) return resIN.data;

    const resUS = await tmdb.get(`/discover/${type}`, {
      params: {
        with_watch_providers: providerId,
        watch_region: "US",
        page,
      },
    });

    return resUS.data;
  } catch (error) {
    console.error("Provider fetch error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchAnimeMovies = async (page = 1, sortBy = "popularity.desc", genre = "16") => {
  const response = await tmdb.get("/discover/movie", {
    params: {
      with_genres: genre,
      sort_by: sortBy === "trending" ? "popularity.desc" : sortBy,
      page,
    },
  });
  return response.data;
};

export const fetchAnimeTV = async (page = 1, sortBy = "popularity.desc", genre = "16") => {
  const response = await tmdb.get("/discover/tv", {
    params: {
      with_genres: genre,
      sort_by: sortBy === "trending" ? "popularity.desc" : sortBy,
      page,
    },
  });
  return response.data;
};

/**
 * Utility to fetch results across TMDB pages to support a custom page size (e.g., 24 instead of 20).
 */
export const fetchByCustomPage = async (fetcher, customPage, customPageSize = 24) => {
  const TPS = 20;
  const start = (customPage - 1) * customPageSize;
  const end = customPage * customPageSize;

  const tpStart = Math.floor(start / TPS) + 1;
  const tpEnd = Math.floor((end - 1) / TPS) + 1;

  try {
    const pagesToFetch = [];
    for (let p = tpStart; p <= tpEnd; p++) {
      pagesToFetch.push(fetcher(p));
    }

    const responses = await Promise.all(pagesToFetch);

    // Combine results from all fetched TMDB pages
    let allResults = [];
    responses.forEach((res) => {
      if (res && res.results) {
        allResults = [...allResults, ...res.results];
      }
    });

    // Calculate the slice window within the combined results
    const offset = start - (tpStart - 1) * TPS;
    const slicedResults = allResults.slice(offset, offset + customPageSize);

    // Get total results from the first response to calculate total custom pages
    const totalResults = responses[0]?.total_results || 0;
    const totalPages = Math.ceil(totalResults / customPageSize);

    return {
      results: slicedResults,
      total_pages: totalPages,
      total_results: totalResults,
    };
  } catch (error) {
    console.error("fetchByCustomPage error:", error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
};

export const fetchAdvancedFilters = async ({
  type = "movie",
  genre = "",
  language = "",
  sortBy = "popularity.desc",
  yearFrom = "",
  yearTo = "",
  provider = "",
}) => {
  const dateGteKey = type === "movie" ? "primary_release_date.gte" : "first_air_date.gte";
  const dateLteKey = type === "movie" ? "primary_release_date.lte" : "first_air_date.lte";

  const params = {
    sort_by: sortBy,
    with_genres: genre,
    with_original_language: language,
    [dateGteKey]: yearFrom ? `${yearFrom}-01-01` : "",
    [dateLteKey]: yearTo ? `${yearTo}-12-31` : "",
    with_watch_providers: provider,
    watch_region: "IN",
  };

  try {
    const response = await tmdb.get(`/discover/${type}`, { params });
    return response.data;
  } catch (error) {
    console.error("fetchAdvancedFilters error:", error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
};

export default tmdb;
