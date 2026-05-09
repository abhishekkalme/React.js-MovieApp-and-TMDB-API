import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from "react";

const PopupContext = createContext(null);

export const usePopupManager = () => {
  const context = useContext(PopupContext);
  if (!context) {
    return {
      register: () => {},
      unregister: () => {},
      canShow: () => true,
      getHighestZIndex: () => 95,
      activePopups: [],
    };
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [activePopups, setActivePopups] = useState([]);
  const popupOrder = useRef([]);
  const activePopupsRef = useRef(activePopups);
  activePopupsRef.current = activePopups;

  const getZIndex = (position) => {
    const baseZ = {
      bottom: 90,
      center: 100,
      top: 110,
    };
    return baseZ[position] || 95;
  };

  const register = useCallback((id, position = "bottom") => {
    setActivePopups((prev) => {
      if (prev.find((p) => p.id === id)) return prev;
      return [...prev, { id, position, zIndex: getZIndex(position) }];
    });
    if (!popupOrder.current.includes(id)) {
      popupOrder.current.push(id);
    }
  }, []);

  const unregister = useCallback((id) => {
    setActivePopups((prev) => prev.filter((p) => p.id !== id));
    popupOrder.current = popupOrder.current.filter((o) => o !== id);
  }, []);

  const canShow = useCallback((id) => {
    const hasOtherPopups = popupOrder.current.some((p) => p !== id);
    return !hasOtherPopups;
  }, []);

  const getHighestZIndex = useCallback(() => {
    if (activePopupsRef.current.length === 0) return 95;
    return Math.max(...activePopupsRef.current.map((p) => p.zIndex)) + 1;
  }, []);

  const value = useMemo(() => ({
    register,
    unregister,
    canShow,
    getHighestZIndex,
  }), [register, unregister, canShow, getHighestZIndex]);

  return (
    <PopupContext.Provider value={value}>
      {children}
    </PopupContext.Provider>
  );
};

export default PopupContext;