import React from 'react';

const CertificationBadge = ({ data, type = "movie", className = "" }) => {
    const getRating = () => {
        // For Movies
        if (type === "movie") {
            const releaseDates = data.release_dates?.results || [];
            const inCert = releaseDates.find(r => r.iso_3166_1 === "IN")?.release_dates?.[0]?.certification;
            if (inCert) return inCert;

            const usCert = releaseDates.find(r => r.iso_3166_1 === "US")?.release_dates?.[0]?.certification;
            if (usCert) {
                if (usCert === "G" || usCert === "TV-G") return "U";
                if (usCert === "PG" || usCert === "TV-PG") return "UA";
                if (usCert === "PG-13" || usCert === "TV-14") return "UA 13+";
                if (usCert === "R" || usCert === "NC-17" || usCert === "TV-MA") return "A";
                return usCert;
            }
        }
        // For TV Shows
        else {
            const contentRatings = data.content_ratings?.results || [];
            const inCert = contentRatings.find(r => r.iso_3166_1 === "IN")?.rating;
            if (inCert) return inCert;

            const usCert = contentRatings.find(r => r.iso_3166_1 === "US")?.rating;
            if (usCert) {
                if (usCert === "G" || usCert === "TV-G" || usCert === "TV-Y") return "U";
                if (usCert === "PG" || usCert === "TV-PG" || usCert === "TV-Y7") return "UA";
                if (usCert === "PG-13" || usCert === "TV-14") return "UA 13+";
                if (usCert === "R" || usCert === "NC-17" || usCert === "TV-MA") return "A";
                return usCert;
            }
        }

        return data.adult ? "A" : "U";
    };

    const rating = getRating();

    const getColorClass = (r) => {
        if (r === "U") return "border-green-500 text-green-400";
        if (r.includes("UA")) return "border-yellow-500 text-yellow-400";
        if (r === "A") return "border-red-600 text-red-500";
        return "border-gray-400 text-white";
    };

    if (!rating || rating === "N/A") return null;

    return (
        <div className={`inline-block border-l-4 bg-zinc-900/40 backdrop-blur-md py-1 px-3 sm:px-4 font-bold rounded-r transition-all duration-500 shadow-xl ${getColorClass(rating)} ${className}`}>
            {rating}
        </div>
    );
};

export default CertificationBadge;
