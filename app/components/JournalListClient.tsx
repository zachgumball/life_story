"use client";

import Link from "next/link";
import type { StoryEntry } from "@/app/data/storyData";
import PublicNavigation from "./PublicNavigation";
import { useLanguage } from "./LanguageProvider";
import styles from "@/app/page.module.css";

const copy = {
  en: {
    kicker: "My journal",
    title: "Stories from my life",
    intro: "Moments, reflections, and journeys that have shaped the person I am becoming.",
    read: "Read this story →",
    categories: { Travel: "Travel", Reflection: "Reflection", Journey: "Journey" },
    empty: "There are no journal entries to show yet.",
  },
  id: {
    kicker: "Jurnal saya",
    title: "Cerita dalam perjalanan hidup",
    intro: "Kumpulan momen, renungan, dan perjalanan yang ikut membentuk diri saya.",
    read: "Baca kisah ini →",
    categories: { Travel: "Perjalanan", Reflection: "Refleksi", Journey: "Kisah perjalanan" },
    empty: "Belum ada cerita yang bisa ditampilkan.",
  },
} as const;

function normalizeStoryText(value: string) {
  return value
    .replace(/\\n/g, " ")
    .replace(/\\r/g, " ")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/#([A-Za-z0-9_]+)/g, " $1")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function JournalListClient({ entries }: { entries: StoryEntry[] }) {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <>
      <PublicNavigation />
      <main className={styles.detailPageShell}>
      <div className={`${styles.container} ${styles.detailHeader}`}>
        <p className={styles.kicker}>{t.kicker}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </div>

      <div className={`${styles.container} ${styles.journalList}`}>
        {entries.length === 0 ? <p>{t.empty}</p> : entries.map((entry) => {
          const translated = language === "en" ? entry.translations?.en : undefined;
          return (
            <article key={entry.slug} className={styles.listCard}>
              <div className={styles.listImage} style={{ backgroundImage: `url(${entry.image})` }} />
              <div className={styles.listContent}>
                <div className={styles.journalMeta}>
                  <span>{translated?.date ?? entry.date}</span>
                  <span>{t.categories[entry.category]}</span>
                </div>
                <h2>{translated?.title ?? entry.title}</h2>
                <p>{normalizeStoryText(translated?.blurb ?? entry.blurb)}</p>
                <Link href={`/journal/${entry.slug}`} className={styles.readLink}>{t.read}</Link>
              </div>
            </article>
          );
        })}
      </div>
      </main>
    </>
  );
}