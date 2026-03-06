import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";


const Pagination = ({ page, totalPages, onPageChange }) => {

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {

      if (page <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis-end", totalPages);
      } else if (page > totalPages - 3) {
        pages.push(1, "ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis-start", page - 1, page, page + 1, "ellipsis-end", totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      className="flex flex-wrap justify-center items-center mt-12 mb-8 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-md shadow-inner">
        {pageNumbers.map((p, index) => {
          if (p === "ellipsis-start" || p === "ellipsis-end") {
            return (
              <span key={`${p}-${index}`} className="flex items-center justify-center w-8 h-10 text-zinc-600">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const isActive = page === p;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`relative flex items-center justify-center min-w-[36px] h-9 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                  ? "text-white"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePage"
                  className="absolute inset-0 bg-red-600 rounded-xl -z-10 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {p}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        className="group flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600/50 hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg backdrop-blur-sm"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
};

export default Pagination;
