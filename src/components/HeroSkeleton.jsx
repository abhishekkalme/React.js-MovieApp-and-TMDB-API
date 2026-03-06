import React from 'react';

const HeroSkeleton = () => {
    return (
        <div className="relative w-full h-[80vh] sm:h-[90vh] bg-zinc-950 overflow-hidden animate-pulse">
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 sm:px-12 pb-24">
                <div className="max-w-4xl space-y-6">
                    <div className="w-32 h-6 bg-zinc-800 rounded-lg opacity-50"></div>

                    <div className="h-12 sm:h-20 w-3/4 bg-zinc-800 rounded-xl opacity-80"></div>

                    <div className="flex gap-4">
                        <div className="w-20 h-8 bg-zinc-800 rounded-lg opacity-60"></div>
                        <div className="w-16 h-8 bg-zinc-800 rounded-lg opacity-60"></div>
                        <div className="w-24 h-8 bg-zinc-800 rounded-lg opacity-60"></div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 w-full bg-zinc-800 rounded-full opacity-40"></div>
                        <div className="h-4 w-5/6 bg-zinc-800 rounded-full opacity-40"></div>
                        <div className="h-4 w-4/6 bg-zinc-800 rounded-full opacity-40"></div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <div className="h-12 w-40 bg-zinc-800 rounded-xl"></div>
                        <div className="h-12 w-32 bg-zinc-800 rounded-xl"></div>
                        <div className="h-12 w-12 bg-zinc-800 rounded-xl"></div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 left-6 sm:left-12 flex gap-3">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
                <div className="w-8 h-1.5 bg-zinc-800 rounded-full opacity-50"></div>
                <div className="w-8 h-1.5 bg-zinc-800 rounded-full opacity-50"></div>
                <div className="w-8 h-1.5 bg-zinc-800 rounded-full opacity-50"></div>
            </div>
        </div>
    );
};

export default HeroSkeleton;
