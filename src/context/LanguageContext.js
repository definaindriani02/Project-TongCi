"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "./translations";

const LanguageContext = createContext({
  language: "id",
  lang: "id",
  setLanguage: () => {},
  setLang: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("id");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("tongci_lang");
      if (savedLang && (savedLang === "id" || savedLang === "en")) {
        setLanguageState(savedLang);
      }
    } catch (e) {
      console.error("Failed to read language preference from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((newLang) => {
    if (newLang === "id" || newLang === "en") {
      setLanguageState(newLang);
      try {
        localStorage.setItem("tongci_lang", newLang);
      } catch (e) {
        console.error("Failed to save language preference to localStorage", e);
      }
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "id" ? "en" : "id"));
  }, [setLanguage]);

  const t = useCallback(
    (key, params = {}) => {
      if (!key) return "";

      const currentDict = translations[language] || translations["id"];
      const idDict = translations["id"];

      const getNestedValue = (obj, pathStr) => {
        if (!obj || typeof obj !== "object") return undefined;
        const parts = pathStr.split(".");
        let curr = obj;
        for (const part of parts) {
          if (curr && typeof curr === "object" && part in curr) {
            curr = curr[part];
          } else {
            return undefined;
          }
        }
        return curr;
      };

      let result = getNestedValue(currentDict, key);

      if (result === undefined && language !== "id") {
        result = getNestedValue(idDict, key);
      }

      if (result === undefined) {
        return key;
      }

      if (typeof result === "string") {
        if (params && typeof params === "object") {
          let str = result;
          Object.keys(params).forEach((paramKey) => {
            str = str.replace(new RegExp(`{\\s*${paramKey}\\s*}`, "g"), params[paramKey]);
          });
          return str;
        }
        return result;
      }

      return result;
    },
    [language]
  );

  const value = {
    language,
    lang: language,
    setLanguage,
    setLang: setLanguage,
    toggleLanguage,
    t,
    isHydrated,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;
