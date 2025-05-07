// src/components/Pagination.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <motion.div
      className="flex justify-center items-center mt-8 space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 bg-zinc-700 text-white rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-white">{page} / {totalPages}</span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 bg-zinc-700 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </motion.div>
  );
};

export default Pagination;
