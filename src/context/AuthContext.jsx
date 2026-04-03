import React, { createContext, useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNotification } from "./NotificationContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState(
    "Please log in to continue."
  );
  const { showNotification } = useNotification();
  const pendingActionRef = useRef(null);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      showNotification("Error signing out", "error");
    } else {
      showNotification("Successfully logged out", "info");
    }
  };

  const updateProfile = async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    if (error) throw error;
    return data;
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

  const loginAndContinue = async (email, password) => {
    try {
      await signIn(email, password);
      setIsLoginPromptOpen(false);
      showNotification("Welcome back!", "success");

      const pendingAction = pendingActionRef.current;
      pendingActionRef.current = null;
      if (typeof pendingAction === "function") {
        pendingAction();
      }
    } catch (error) {
      showNotification(error.message || "Login failed", "error");
      throw error;
    }
  };

  const [isLimitReached, setIsLimitReached] = useState(false);
  const [limitType, setLimitType] = useState(null); // 'movie' or 'tv'

  const checkLimit = (type) => {
    if (user) return false;
    // NOTE: Client-side enforcement using localStorage is primarily for UX
    // and can be easily bypassed. For strict enforcement, use server-side tracking.
    const count = parseInt(localStorage.getItem(`guest_${type}_watched`) || "0");
    return count >= 2;
  };

  const recordGuestView = (type, viewId) => {
    if (user) return;
    const storageKey = `guest_${type}_watched_ids`;
    const watchedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // For movies, viewId is just tmdbId. For TV, it's seriesId_season_episode
    if (!watchedIds.includes(viewId)) {
      if (watchedIds.length >= 2) {
        setLimitType(type);
        setIsLimitReached(true);
        showNotification("Guest limit reached! Login to unlock unlimited streaming.", "info");
        return true;
      }
      watchedIds.push(viewId);
      localStorage.setItem(storageKey, JSON.stringify(watchedIds));
      localStorage.setItem(`guest_${type}_watched`, watchedIds.length.toString());
    }
    return false;
  };

  const login = (message) => {
    setIsLimitReached(false);
    requireLogin(null, message || "Please log in to continue.");
  };

  const dismissLoginPrompt = () => {
    setIsLoginPromptOpen(false);
    setIsLimitReached(false);
    pendingActionRef.current = null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        login,
        signInWithGoogle,
        logout,
        updateProfile,
        requireLogin,
        loginAndContinue,
        isLoginPromptOpen,
        loginPromptMessage,
        dismissLoginPrompt,
        isLimitReached,
        setIsLimitReached,
        limitType,
        checkLimit,
        recordGuestView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
