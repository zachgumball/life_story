"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type Language = "en" | "id";

const languageStorageKey = "nothing-in-my-way-language";
const languageChangeEvent = "nothing-in-my-way-language-change";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getLanguage(): Language {
  return window.localStorage.getItem(languageStorageKey) === "id" ? "id" : "en";
}

function getServerLanguage(): Language {
  return "en";
}

function subscribeToLanguageChanges(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(languageChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(languageChangeEvent, onChange);
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribeToLanguageChanges, getLanguage, getServerLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(nextLanguage: Language) {
    window.localStorage.setItem(languageStorageKey, nextLanguage);
    document.documentElement.lang = nextLanguage;
    window.dispatchEvent(new Event(languageChangeEvent));
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}