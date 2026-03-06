import React, { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState(
    "Please log in to continue."
  );
  const pendingActionRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in from local storage
    const storedUser = localStorage.getItem("movieExplorerUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const login = (username) => {
    const newUser = {
      username,
      loggedInAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem("movieExplorerUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("movieExplorerUser");
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem("movieExplorerUser", JSON.stringify(newUser));
      return newUser;
    });
  };

  const requireLogin = (
    action,
    message = "Please log in to save and like content."
  ) => {
    if (user) {
      if (typeof action === "function") action();
      return true;
    }

    pendingActionRef.current = typeof action === "function" ? action : null;
    setLoginPromptMessage(message);
    setIsLoginPromptOpen(true);
    return false;
  };

  const loginAndContinue = (username) => {
    login(username);
    setIsLoginPromptOpen(false);

    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    if (typeof pendingAction === "function") {
      pendingAction();
    }
  };

  const dismissLoginPrompt = () => {
    setIsLoginPromptOpen(false);
    pendingActionRef.current = null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        requireLogin,
        loginAndContinue,
        isLoginPromptOpen,
        loginPromptMessage,
        dismissLoginPrompt
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
