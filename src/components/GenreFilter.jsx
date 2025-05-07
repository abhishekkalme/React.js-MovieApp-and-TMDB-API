import React from "react";

const GenreFilter = ({ genres, selectedGenre, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`px-4 py-1 rounded-full text-sm ${
          selectedGenre === "" ? "bg-red-600 text-white" : "bg-zinc-700 text-gray-300"
        }`}
        onClick={() => onSelect("")}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`px-4 py-1 rounded-full text-sm ${
            selectedGenre === genre.id ? "bg-red-600 text-white" : "bg-zinc-700 text-gray-300"
          }`}
          onClick={() => onSelect((genre.id))}

        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
