import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MovieCard from "./MovieCard";
import { RowSkeleton } from "./Skeletons";

const Row = ({ title, items = [], type = "movie", loading = false }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (!rowRef.current) return;

    const scrollAmount =
      direction === "left"
        ? -rowRef.current.clientWidth * 0.8
        : rowRef.current.clientWidth * 0.8;

    rowRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) return <RowSkeleton />;
  if (!items.length) return null;

  return (
    <section className="my-10 relative">

      <div className="px-6 md:px-12 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-red-600 rounded-full inline-block"></span>
          {title}
        </h2>
      </div>

      <div className="relative">

        <button
          onClick={() => scroll("left")}
          className="hidden md:block absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 hover:bg-black text-white rounded-full transition"
        >
          <FiChevronLeft size={24} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden px-6 md:px-12 pb-4 scroll-smooth no-scrollbar"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[140px] md:w-[180px]"
            >
              <MovieCard movie={item} type={type} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:block absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 hover:bg-black text-white rounded-full transition"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default React.memo(Row);
