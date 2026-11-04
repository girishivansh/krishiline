"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type Language, DICTIONARY } from "./marathi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("krishiline_lang") as Language;
      if (stored === "en" || stored === "mr") {
        queueMicrotask(() => {
          setLanguageState(stored);
        });
      }
    } catch {
      // Local storage unavailable in some sandboxes
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("krishiline_lang", lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "mr" : "en");
  };

  const t = (key: string, fallback?: string): string => {
    const dict = DICTIONARY[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = DICTIONARY.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
