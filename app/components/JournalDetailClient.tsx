"use client";

import Link from "next/link";
import type { StoryEntry } from "@/app/data/storyData";
import PublicNavigation from "./PublicNavigation";
import { useLanguage } from "./LanguageProvider";
import styles from "@/app/page.module.css";

const copy = {
  en: {
    back: "Back to journal",
    route: "The route",
    routeTitle: "A map of the moments",
    routeIntro: "The places and small moments that made this journey worth remembering.",
    checkpoint: "Checkpoint",
    categories: { Travel: "Travel", Reflection: "Reflection", Journey: "Journey" },
    momentLead: "This moment reminded me that small details can stay with us. ",
    momentTail: " became part of how this place shaped that chapter.",
    fallbackLead: "A small detail from ",
    fallbackTail: " that stayed with me. It is a reminder that meaningful journeys are made of quiet moments, too.",
  },
  id: {
    back: "Kembali ke jurnal",
    route: "Rute perjalanan",
    routeTitle: "Jejak momen di sepanjang jalan",
    routeIntro: "Tempat dan momen kecil yang membuat perjalanan ini layak dikenang.",
    checkpoint: "Titik",
    categories: { Travel: "Perjalanan", Reflection: "Refleksi", Journey: "Kisah perjalanan" },
    momentLead: "Momen ini mengingatkan saya bahwa hal kecil pun bisa membekas. ",
    momentTail: " menjadi bagian dari cara tempat ini membentuk perjalanan saya.",
    fallbackLead: "Ada hal kecil dari ",
    fallbackTail: " yang terus saya ingat. Perjalanan yang berarti juga tersusun dari momen-momen sederhana seperti ini.",
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

export default function JournalDetailClient({ entry }: { entry: StoryEntry }) {
  const { language } = useLanguage();
  const t = copy[language];
  const translated = language === "en" ? entry.translations?.en : undefined;
  const highlights = translated?.highlights ?? entry.highlights;
  const checkpoints = (entry.gallery?.length ? entry.gallery : [entry.image]).map((image, index) => {
    const highlight = highlights[index];
    const summary = translated?.description && index === 0
      ? translated.description
      : entry.checkpointSummaries?.[index];
    const story = summary || (index === 0
      ? entry.description
      : highlight
        ? `${t.momentLead}${highlight}${t.momentTail}`
        : `${t.fallbackLead}${entry.location}${t.fallbackTail}`);

    return {
      image,
      number: String(index + 1).padStart(2, "0"),
      title: normalizeStoryText(highlight ?? (language === "id"
        ? `${t.checkpoint} ${index + 1} di ${entry.location}`
        : `${entry.location} ${t.checkpoint.toLowerCase()} ${index + 1}`)),
      story: normalizeStoryText(story),
    };
  });

  return (
    <>
      <PublicNavigation />
      <main className={styles.detailPageShell}>
      <div className={`${styles.container} ${styles.detailHero}`}>
        <div className={styles.detailImageWrap}>
          <div className={styles.detailHeroImage} style={{ backgroundImage: `url(${entry.image})` }} />
        </div>
        <div className={styles.detailIntro}>
          <p className={styles.kicker}>{t.categories[entry.category]}</p>
          <h1>{translated?.title ?? entry.title}</h1>
          <div className={styles.journalMeta}>
            <span>{translated?.date ?? entry.date}</span>
            <span>{entry.location}</span>
          </div>
          <p className={styles.detailBlurb}>{normalizeStoryText(translated?.blurb ?? entry.blurb)}</p>
          <Link href="/journal" className={styles.secondaryButton}>{t.back}</Link>
        </div>
      </div>

      <section className={`${styles.container} ${styles.routeSection}`}>
        <div className={styles.routeHeading}>
          <p className={styles.kicker}>{t.route}</p>
          <h2>{t.routeTitle}</h2>
          <p>{t.routeIntro}</p>
        </div>
        <div className={styles.routeMap}>
          <div className={styles.routeLine} aria-hidden="true">
            <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
              <path d="M50 0 C12 90, 88 145, 50 250 S12 405, 50 500 S88 655, 50 750 S12 910, 50 1000" />
            </svg>
          </div>
          {checkpoints.map((checkpoint) => (
            <article key={checkpoint.number} className={styles.checkpoint}>
              <div className={styles.checkpointMarker} aria-hidden="true"><span>{checkpoint.number}</span></div>
              <div className={styles.checkpointCard}>
                <div className={styles.checkpointImage} style={{ backgroundImage: `url(${checkpoint.image})` }} />
                <div className={styles.checkpointCopy}>
                  <span className={styles.checkpointLabel}>{t.checkpoint} {checkpoint.number}</span>
                  <h3>{checkpoint.title}</h3>
                  <p>{checkpoint.story}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      </main>
    </>
  );
}