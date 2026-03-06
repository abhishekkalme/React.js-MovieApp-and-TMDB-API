import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HorizontalScroll = ({ children }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const amount = 500;

    if (direction === "left") {
      container.scrollBy({ left: -amount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">

      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10" />

      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10" />

      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20
        opacity-0 group-hover:opacity-100 transition
        bg-black/60 hover:bg-black text-white p-2 rounded-full"
      >
        <ChevronLeft size={22} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar py-2"
      >
        {children}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20
        opacity-0 group-hover:opacity-100 transition
        bg-black/60 hover:bg-black text-white p-2 rounded-full"
      >
        <ChevronRight size={22} />
      </button>

    </div>
  );
};

export default HorizontalScroll;