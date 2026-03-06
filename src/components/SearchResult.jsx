import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMovies, fetchGenres, fetchAdvancedFilters } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeletons";
import { FiChevronDown } from "react-icons/fi";

// Reusable Select Component to match the mockup styling
const CustomSelect = ({ label, options, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-[#1c1c1c] text-white px-4 py-3 rounded-xl appearance-none border border-transparent hover:border-white/10 focus:border-white/20 focus:outline-none transition cursor-pointer text-sm font-medium"
    >
      <option value="">{label}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <FiChevronDown size={18} />
    </div>
  </div>
);

const SearchResults = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  const [type, setType] = useState("movie");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    // Fetch genres based on selected type
    const loadGenres = async () => {
      try {
        const data = await fetchGenres(type);
        setGenres(data.genres || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadGenres();
  }, [type]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (query) {
          const data = await fetchMovies(query, 1);
          setMovies(data.results || []);
        } else {
          // If no query, use advanced filters (Discover)
          const data = await fetchAdvancedFilters({
            type,
            genre,
            language,
            sortBy,
            yearFrom,
            yearTo,
            provider
          });
          setMovies(data.results || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, type, genre, language, sortBy, yearFrom, yearTo, provider]);

  const clearAll = () => {
    setType("movie");
    setGenre("");
    setLanguage("");
    setSortBy("popularity.desc");
    setYearFrom("");
    setYearTo("");
    setProvider("");
    setParams({});
  };

  const handleDecade = (startYear, endYear) => {
    setYearFrom(startYear);
    setYearTo(endYear);
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 bg-black text-white pb-20">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h1 className="text-3xl font-bold">
              {query ? `Search: ${query}` : `Explore ${type === "movie" ? "Movies" : "TV Shows"}`}
            </h1>
            {query && (
              <button
                onClick={() => setParams({})}
                className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <CustomSelect
                label="Movies"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { label: "Movies", value: "movie" },
                  { label: "TV Shows", value: "tv" }
                ]}
              />
              <CustomSelect
                label="All Genres"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                options={genres.map(g => ({ label: g.name, value: g.id }))}
              />
              <CustomSelect
                label="All Languages"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { label: "English", value: "en" },
                  { label: "Hindi", value: "hi" },
                  { label: "Japanese", value: "ja" },
                  { label: "Korean", value: "ko" },
                  { label: "French", value: "fr" },
                ]}
              />
              <CustomSelect
                label="Most Popular"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { label: "Most Popular", value: "popularity.desc" },
                  { label: "Top Rated", value: "vote_average.desc" },
                  { label: "Newest Releases", value: "primary_release_date.desc" },
                ]}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">

              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="text"
                  placeholder="From"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  className="bg-[#1c1c1c] text-white px-4 py-3 rounded-xl w-20 text-center text-sm border border-transparent focus:border-white/20 outline-none transition"
                />
                <span className="text-gray-500 font-bold">-</span>
                <input
                  type="text"
                  placeholder="To"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                  className="bg-[#1c1c1c] text-white px-4 py-3 rounded-xl w-20 text-center text-sm border border-transparent focus:border-white/20 outline-none transition"
                />
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {[
                  { label: '80s', from: '1980', to: '1989' },
                  { label: '90s', from: '1990', to: '1999' },
                  { label: '00s', from: '2000', to: '2009' },
                  { label: '10s', from: '2010', to: '2019' },
                  { label: '20s', from: '2020', to: '2029' }
                ].map(dec => (
                  <button
                    key={dec.label}
                    onClick={() => handleDecade(dec.from, dec.to)}
                    className={`bg-[#1c1c1c] hover:bg-zinc-800 px-4 py-3 rounded-xl text-sm transition border font-medium ${yearFrom === dec.from ? 'border-red-600 text-red-500' : 'border-transparent text-gray-300'}`}
                  >
                    {dec.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 min-w-[200px]">
                <CustomSelect
                  label="All Providers"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  options={[
                    { label: "Netflix", value: "8" },
                    { label: "Amazon Prime", value: "9" },
                    { label: "Disney+", value: "337" },
                    { label: "Hulu", value: "15" },
                  ]}
                />
              </div>

              <button
                onClick={clearAll}
                className="bg-[#1c1c1c] hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium transition border border-transparent flex-shrink-0"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}

        {movies.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-20 bg-[#1c1c1c]/50 p-10 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold mb-2">No results found.</h2>
            <p>Try searching for a different term or adjust your filters.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <MovieCard movie={movie} type={type} />
              </motion.div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default SearchResults;
