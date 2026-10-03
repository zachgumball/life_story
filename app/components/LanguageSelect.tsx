"use client";

import { useLanguage } from "./LanguageProvider";
import styles from "@/app/page.module.css";

export default function LanguageSelect({ className, label }: { className: string; label: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={className}>
      <span>{label}</span>
      <div className={styles.languageOptions} role="group" aria-label={label}>
        <button
          type="button"
          className={styles.languageOption}
          aria-label="English"
          aria-pressed={language === "en"}
          title="English"
          onClick={() => setLanguage("en")}
        >
          EN
        </button>
        <button
          type="button"
          className={styles.languageOption}
          aria-label="Bahasa Indonesia"
          aria-pressed={language === "id"}
          title="Bahasa Indonesia"
          onClick={() => setLanguage("id")}
        >
          ID
        </button>
      </div>
    </div>
  );
}