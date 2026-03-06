import React from "react";
import { motion } from "framer-motion";

const DetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-black text-white pb-20 overflow-hidden">
            {/* Hero Skeleton */}
            <div className="relative w-full h-[70vh] md:h-[85vh] bg-zinc-900 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 space-y-4">
                    <div className="h-10 md:h-16 w-3/4 bg-zinc-800 rounded-lg"></div>
                    <div className="flex gap-4">
                        <div className="h-6 w-20 bg-zinc-800 rounded"></div>
                        <div className="h-6 w-20 bg-zinc-800 rounded"></div>
                        <div className="h-6 w-20 bg-zinc-800 rounded"></div>
                    </div>
                    <div className="h-20 w-full md:w-2/3 bg-zinc-800/50 rounded-lg"></div>
                    <div className="flex gap-4">
                        <div className="h-12 w-40 bg-zinc-800 rounded-md"></div>
                        <div className="h-12 w-40 bg-zinc-800 rounded-md"></div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-8xl mx-auto px-6 md:px-12 mt-12 space-y-16">
                <section className="space-y-4">
                    <div className="h-6 w-32 bg-zinc-900 rounded"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="min-w-[140px] aspect-[2/3] bg-zinc-900 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="h-6 w-32 bg-zinc-900 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-zinc-900 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DetailsSkeleton;
