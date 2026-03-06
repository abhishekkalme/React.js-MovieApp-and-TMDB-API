import React from "react";

const RowSkeleton = () => {
    return (
        <div className="my-10 px-6 md:px-12 space-y-6">
            <div className="h-8 w-48 bg-zinc-900 rounded-lg animate-pulse"></div>
            <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="min-w-[140px] md:min-w-[180px] aspect-[2/3] bg-zinc-900 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        </div>
    );
};

export default RowSkeleton;
