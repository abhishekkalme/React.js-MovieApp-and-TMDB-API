// src/components/SkeletonCard.jsx
import React from "react";
import { motion } from "framer-motion";

const SkeletonCard = () => {
  return (
    <motion.div
      className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg animate-pulse"
      whileHover={{ scale: 1.02 }}
    >
      {/* Poster Placeholder */}
      <div className="h-[300px] bg-zinc-700 w-full"></div>

      <div className="p-6 text-white">
        {/* Title & Overview */}
        <div className="h-8 bg-zinc-700 rounded w-2/5 mb-4"></div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-zinc-700 rounded w-full"></div>
          <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
          <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
        </div>

        {/* Cast */}
        <div className="mb-10">
          <div className="h-6 bg-zinc-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index}>
                  <div className="h-32 bg-zinc-800 rounded-lg mb-2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Screenshots */}
        <div className="mb-10">
          <div className="h-6 bg-zinc-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="h-36 bg-zinc-800 rounded-lg"></div>
              ))}
          </div>
        </div>

        {/* Trailer */}
        <div className="mb-10">
          <div className="h-6 bg-zinc-700 rounded w-1/4 mb-4"></div>
          <div className="h-[300px] bg-zinc-800 rounded-lg"></div>
        </div>

        {/* Reviews */}
        <div className="mb-10">
          <div className="h-6 bg-zinc-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-zinc-800 p-4 rounded-lg space-y-2">
                  <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                  <div className="h-3 bg-zinc-700 rounded w-full"></div>
                  <div className="h-3 bg-zinc-700 rounded w-5/6"></div>
                  <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Similar Movies */}
        <div className="mb-4">
          <div className="h-6 bg-zinc-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="h-48 bg-zinc-800 rounded-lg"></div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
