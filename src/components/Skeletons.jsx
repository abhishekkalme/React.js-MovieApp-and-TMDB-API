import React from "react";

export const RowSkeleton = () => (
    <div className="my-10 px-6 md:px-12 space-y-6">
        <div className="h-8 w-48 bg-zinc-900 rounded-lg animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="min-w-[140px] md:min-w-[180px] aspect-[2/3] bg-zinc-900 rounded-2xl animate-pulse"></div>
            ))}
        </div>
    </div>
);

export const HeroSkeleton = () => (
    <div className="relative w-full h-[550px] sm:h-[650px] md:h-screen bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-zinc-900 animate-pulse"></div>
        <div className="absolute bottom-20 left-6 md:left-12 space-y-4 z-20 w-full max-w-2xl">
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-12 md:h-20 w-3/4 bg-zinc-800 rounded-lg animate-pulse"></div>
            <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
            <div className="flex gap-4 pt-4">
                <div className="h-12 w-32 bg-zinc-800 rounded-xl animate-pulse"></div>
                <div className="h-12 w-32 bg-zinc-800 rounded-xl animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const DetailsSkeleton = () => (
    <div className="min-h-screen bg-black">
        <div className="h-[70vh] w-full bg-zinc-900 animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-64 h-96 bg-zinc-800 rounded-2xl animate-pulse shrink-0 shadow-2xl"></div>
                <div className="flex-1 space-y-6 pt-8">
                    <div className="h-12 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="flex gap-4">
                        <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonCard = () => (
    <div className="min-w-[160px] md:min-w-[200px] aspect-[2/3] bg-zinc-900 rounded-2xl animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
);
