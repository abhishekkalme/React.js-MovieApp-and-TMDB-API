import axios from "axios";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
import { TMDB_CONFIG } from "../constants";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY || !ACCESS_TOKEN) {
  console.warn("TMDB API Key or Access Token is missing in environment variables.");
}

const tmdb = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

export const fetchMovies = async (query = "", page = 1, type = "all") => {
  try {
    const endpoint = query ? `search/multi` : `trending/${type}/day`;
    const response = await tmdb.get(`/${endpoint}`, {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchMovies error:", error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
};

export const searchCollections = async (query, page = 1) => {
  try {
    const response = await tmdb.get(`/search/collection`, {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error("searchCollections error:", error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
};

export const fetchCollectionDetails = async (collectionId) => {
  try {
    const response = await tmdb.get(`/collection/${collectionId}`);
    return response.data;
  } catch (error) {
    console.error("fetchCollectionDetails error:", error);
    return null;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits,videos,recommendations,release_dates,reviews,images,watch/providers",
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchMovieDetails error:", error);
    return null;
  }
};

export const fetchReleaseDates = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/release_dates`);
    return response.data;
  } catch (error) {
    console.error("fetchReleaseDates error:", error);
    return { results: [] };
  }
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
  try {
    const response = await tmdb.get(`/genre/${type}/list`);
    return response.data;
  } catch (error) {
    console.error("fetchGenres error:", error);
    return { genres: [] };
  }
};

export const fetchByCategory = async (
  type = "movie",
  genreId = "",
  page = 1
) => {
  try {
    const response = await tmdb.get(`/discover/${type}`, {
      params: {
        with_genres: genreId,
        page,
        sort_by: "popularity.desc"
      }
    });
    return response.data;
  } catch (error) {
    console.error("fetchByCategory error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdb.get("/trending/movie/week", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchTrendingMovies error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdb.get("/movie/top_rated", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchTopRatedMovies error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchLatestMovies = async (page = 1) => {
  try {
    const response = await tmdb.get("/movie/now_playing", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchLatestMovies error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchTvDetails = async (id) => {
  try {
    const response = await tmdb.get(`/tv/${id}`, {
      params: {
        append_to_response: "credits,videos,recommendations,content_ratings",
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchTvDetails error:", error);
    return null;
  }
};

export const fetchLatestTVShows = async (page = 1) => {
  try {
    const response = await tmdb.get("/tv/on_the_air", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchLatestTVShows error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchTrendingTV = async (page = 1) => {
  try {
    const response = await tmdb.get("/trending/tv/week", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchTrendingTV error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchTopRatedTV = async (page = 1) => {
  try {
    const response = await tmdb.get("/tv/top_rated", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchTopRatedTV error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchSeasonEpisodes = async (tvId, seasonNumber) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    console.error("fetchSeasonEpisodes error:", error);
    return { episodes: [] };
  }
};

export const fetchMovieWatchProviders = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/watch/providers`);
    const providerData = response.data.results?.IN || response.data.results?.US || null;
    return providerData;
  } catch (error) {
    console.error("Failed to fetch watch providers:", error);
    return null;
  }
};

export const fetchExternalIds = async (id, type = "movie") => {
  try {
    const response = await tmdb.get(`/${type}/${id}/external_ids`);
    return response.data;
  } catch (error) {
    console.error("fetchExternalIds error:", error);
    return null;
  }
};

export const fetchPersonDetails = async (id) => {
  try {
    const response = await tmdb.get(`/person/${id}?append_to_response=combined_credits,external_ids,images`);
    return response.data;
  } catch (error) {
    console.error("fetchPersonDetails error:", error);
    return null;
  }
};

export const fetchKeywords = async (movieId, type = "movie") => {
  try {
    const response = await tmdb.get(`/${type}/${movieId}/keywords`);
    return response.data;
  } catch (error) {
    console.error("fetchKeywords error:", error);
    return { keywords: [] };
  }
};

export const fetchCompanyDetails = async (id) => {
  try {
    const response = await tmdb.get(`/company/${id}`);
    return response.data;
  } catch (error) {
    console.error("fetchCompanyDetails error:", error);
    return null;
  }
};

export const fetchContentByDiscovery = async (discoveryType, id, page = 1, mediaType = "movie") => {
  try {
    const params = {
      page,
      sort_by: "popularity.desc",
    };
    
    if (discoveryType === "keyword") params.with_keywords = id;
    if (discoveryType === "company") params.with_companies = id;
    if (discoveryType === "genre") params.with_genres = id;

    const response = await tmdb.get(`/discover/${mediaType}`, { params });
    return response.data;
  } catch (error) {
    console.error("fetchContentByDiscovery error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const getTVDetails = async (id) => {
  try {
    const res = await tmdb.get(
      `/tv/${id}?append_to_response=videos,credits,images,reviews,recommendations,watch/providers`
    );
    return res.data;
  } catch (error) {
    console.error("getTVDetails error:", error);
    return null;
  }
};

export const fetchUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdb.get("/movie/upcoming", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("fetchUpcomingMovies error:", error);
    return { results: [], total_pages: 0 };
  }
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
  try {
    const response = await tmdb.get("/discover/movie", {
      params: {
        with_genres: genre,
        sort_by: sortBy === "trending" ? "popularity.desc" : sortBy,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchAnimeMovies error:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchAnimeTV = async (page = 1, sortBy = "popularity.desc", genre = "16") => {
  try {
    const response = await tmdb.get("/discover/tv", {
      params: {
        with_genres: genre,
        sort_by: sortBy === "trending" ? "popularity.desc" : sortBy,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchAnimeTV error:", error);
    return { results: [], total_pages: 0 };
  }
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
  page = 1,
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
    page,
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
