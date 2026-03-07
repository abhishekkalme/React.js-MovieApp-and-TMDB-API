import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const WatchedContext = createContext();

export const WatchedProvider = ({ children }) => {
    const [watched, setWatched] = useState(() => {
        const saved = localStorage.getItem("watchedContent");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("watchedContent", JSON.stringify(watched));
    }, [watched]);

    const toggleWatched = useCallback((item) => {
        setWatched((prev) => {
            const isAlreadyWatched = prev.find((i) => i.id === item.id);
            if (isAlreadyWatched) {
                return prev.filter((i) => i.id !== item.id);
            } else {
                return [{ ...item, watchedAt: new Date().toISOString() }, ...prev];
            }
        });
    }, []);

    const isWatched = useCallback((id) => {
        return watched.some((item) => item.id === id);
    }, [watched]);

    const removeFromWatched = useCallback((id) => {
        setWatched((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const addToWatched = useCallback((item, season = null, episode = null) => {
        setWatched((prev) => {
            const filtered = prev.filter((i) => i.id !== item.id);
            return [{
                ...item,
                lastSeason: season,
                lastEpisode: episode,
                watchedAt: new Date().toISOString()
            }, ...filtered];
        });
    }, []);

    const clearWatched = useCallback(() => {
        setWatched([]);
    }, []);

    const value = useMemo(() => ({
        watched,
        toggleWatched,
        isWatched,
        removeFromWatched,
        clearWatched,
        addToWatched
    }), [watched, toggleWatched, isWatched, removeFromWatched, clearWatched, addToWatched]);

    return (
        <WatchedContext.Provider value={value}>
            {children}
        </WatchedContext.Provider>
    );
};
