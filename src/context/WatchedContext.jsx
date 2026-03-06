import { createContext, useState, useEffect } from "react";

export const WatchedContext = createContext();

export const WatchedProvider = ({ children }) => {
    const [watched, setWatched] = useState(() => {
        const saved = localStorage.getItem("watchedContent");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("watchedContent", JSON.stringify(watched));
    }, [watched]);

    const toggleWatched = (item) => {
        setWatched((prev) => {
            const isAlreadyWatched = prev.find((i) => i.id === item.id);
            if (isAlreadyWatched) {
                return prev.filter((i) => i.id !== item.id);
            } else {
                return [...prev, { ...item, watchedAt: new Date().toISOString() }];
            }
        });
    };

    const isWatched = (id) => {
        return watched.some((item) => item.id === id);
    };

    return (
        <WatchedContext.Provider value={{ watched, toggleWatched, isWatched }}>
            {children}
        </WatchedContext.Provider>
    );
};
