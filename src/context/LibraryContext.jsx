import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { useNotification } from "./NotificationContext";

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
    const [libraryItems, setLibraryItems] = useState([]);
    const { requireLogin, user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    // Load from local storage on mount (or when user changes)
    useEffect(() => {
        const storageKey = user ? `movieExplorer_library_${user.id}` : "movieExplorer_library_guest";
        const storedItems = localStorage.getItem(storageKey);
        if (storedItems) {
            try {
                setLibraryItems(JSON.parse(storedItems));
            } catch (e) {
                console.error("Failed to parse library items", e);
            }
        } else {
            setLibraryItems([]);
        }
    }, [user]);

    // Sync to local storage
    useEffect(() => {
        const storageKey = user ? `movieExplorer_library_${user.id}` : "movieExplorer_library_guest";
        localStorage.setItem(storageKey, JSON.stringify(libraryItems));
    }, [libraryItems, user]);

    const toggleLibrary = useCallback((item) => {
        const action = () => {
            setLibraryItems((prev) => {
                const exists = prev.some((i) => i.id === item.id);
                if (exists) {
                    return prev.filter((i) => i.id !== item.id);
                } else {
                    showNotification(`${item.title || item.name} added to your library!`, "success");
                    return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
                }
            });
        };

        requireLogin(action, "Please log in to add items to your library.");
    }, [requireLogin]);

    const isInLibrary = useCallback((id) => {
        return libraryItems.some((item) => item.id === id);
    }, [libraryItems]);

    const removeFromLibrary = useCallback((id) => {
        setLibraryItems((prev) => {
            return prev.filter((item) => item.id !== id);
        });
    }, []);

    const addToLibrary = useCallback((item) => {
        setLibraryItems((prev) => {
            const filtered = prev.filter((i) => i.id !== item.id);
            return [{ ...item, addedAt: new Date().toISOString() }, ...filtered];
        });
    }, []);

    const value = useMemo(() => ({
        libraryItems,
        toggleLibrary,
        isInLibrary,
        removeFromLibrary,
        addToLibrary
    }), [libraryItems, toggleLibrary, isInLibrary, removeFromLibrary, addToLibrary]);

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
};
