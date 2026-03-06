import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);
  const { requireLogin } = useContext(AuthContext);

  useEffect(() => {
    const storedItems = localStorage.getItem("movieExplorerSaved");
    if (storedItems) {
      try {
        setSavedItems(JSON.parse(storedItems));
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
  }, []);

  const toggleSaveInStore = (item) => {
    setSavedItems((prevItems) => {
      const isSaved = prevItems.some((saved) => saved.id === item.id);
      let newItems;
      if (isSaved) {
        newItems = prevItems.filter((saved) => saved.id !== item.id);
      } else {
        newItems = [...prevItems, item];
      }
      localStorage.setItem("movieExplorerSaved", JSON.stringify(newItems));
      return newItems;
    });
  };

  const toggleSave = (item) => {
    requireLogin(
      () => toggleSaveInStore(item),
      "Please log in to save or like this title."
    );
  };

  const isSaved = (id) => {
    return savedItems.some((item) => item.id === id);
  };

  return (
    <SavedContext.Provider value={{ savedItems, toggleSave, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
};
