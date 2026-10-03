"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { StoryEntry } from "@/app/data/storyData";
import type { HomepageData } from "@/app/data/homepageData";
import PublicNavigation from "./PublicNavigation";
import { useLanguage } from "./LanguageProvider";
import styles from "@/app/page.module.css";

const timelineFlowDuration = 2.8;

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

const translations = {
  en: {
    english: "English",
    indonesian: "Indonesia",
    kicker: "A song for the road",
    photoCollection: "A collection of moments",
    photosSaved: "photographs",
    categoryTravel: "Travel",
    categoryReflection: "Reflection",
    categoryJourney: "Journey",
    basedIn: "Based in Indonesia",
    openGalleryPhoto: "Open gallery photo",
    readEntry: "Read",
    closePhoto: "Close photo",
    previousPhoto: "Prev",
    nextPhoto: "Next",
    dragHint: "Photos change automatically. Swipe to browse.",
    photoPosition: (index: number, total: number) => `${index} of ${total}`,
    heroTitle: "Nothing in my way.",
    heroText: "This is the feeling I carry with me: a quiet certainty that life keeps moving, that pain and wonder can coexist, and that every chapter becomes lighter when I stop fighting the path and start living it.",
    readStory: "Read my story",
    shareMoment: "Explore the journal",
    years: "Years of learning",
    moments: "Moments remembered",
    turns: "Big turning points",
    aboutTitle: "About me",
    aboutIntro: "I am driven by the feeling that life is meant to be felt honestly — the silence, the movement, the doubts, the hope. This site is a record of the way I keep walking without losing myself.",
    aboutOne: "My story is never perfectly arranged. It is a mix of hope, effort, uncertainty, and discovery. Along the road, I learned that not every chapter needs to be loud to be meaningful. Some of the deepest changes happen in the quiet moments when I finally understand what I am becoming.",
    aboutTwo: "I document my life with stories, photographs, and small milestones because I believe memory is one of the most honest ways to understand a self. This website is not just a profile — it is a living journal of the life I am writing in motion.",
    values: "What I value",
    curiosity: "Curiosity",
    curiosityText: "I am always learning and seeking new experiences.",
    authenticity: "Authenticity",
    authenticityText: "I want my story to be honest and true to who I am.",
    growth: "Growth",
    growthText: "Every challenge becomes a lesson that shapes my path.",
    journeyTitle: "My life, in chapters",
    journeyIntro: "Years that changed my direction, and the effort to keep going.",
    rhythmKicker: "What guides me",
    rhythmTitle: "The rhythm of my life",
    plansTitle: "Plans in motion",
    plansIntro: "My future is not only about goals — it is about the kind of life I want to live, the places I want to feel, and the stories I want to carry with me.",
    upcoming: "Upcoming",
    saveMoment: "Save the moment",
    journalTitle: "Journal",
    journalIntro: "Here I leave traces of the thoughts, detours, and quiet truths that shape each new chapter of my life.",
    readMore: "Read more",
    galleryTitle: "Life in pictures",
    galleryIntro: "Some moments feel too alive to keep only in memory. These images are fragments of the road, the silence, and the beauty I could not ignore.",
    addStory: "Add a story",
    shareLatest: "Share the latest turn",
    title: "Title",
    date: "Date",
    location: "Location",
    photo: "Photo",
    story: "Story",
    publish: "Publish story",
    contactTitle: "Let's keep moving together.",
    contactText: "I am always open to meaningful conversations, collaborations, and new adventures. If you want to connect, share a story, or simply say hello, I would love to hear from you.",
    nextChapter: "My next chapter",
    nextText: "The best stories are the ones lived with intention. I am still writing mine, and I hope this website becomes a living record of that motion — honest, imperfect, and still moving forward.",
    email: "Email me",
    footer: "© 2026 Nothing in My Way — built with memories, lessons, and the courage to keep going.",
  },
  id: {
    english: "English",
    indonesian: "Bahasa Indonesia",
    kicker: "Catatan perjalanan",
    photoCollection: "Fragmen perjalanan",
    photosSaved: "foto",
    categoryTravel: "Perjalanan",
    categoryReflection: "Refleksi",
    categoryJourney: "Kisah perjalanan",
    basedIn: "Berkegiatan di Indonesia",
    openGalleryPhoto: "Buka foto galeri",
    readEntry: "Baca",
    closePhoto: "Tutup foto",
    previousPhoto: "Sebelumnya",
    nextPhoto: "Berikutnya",
    dragHint: "Foto berganti otomatis. Geser untuk melihat lainnya.",
    photoPosition: (index: number, total: number) => `${index} dari ${total}`,
    heroTitle: "Tak ada yang menghalangi jalanku.",
    heroText: "Saya percaya hidup akan terus bergerak. Luka dan rasa takjub bisa hadir bersamaan. Setiap bab terasa lebih ringan saat saya berhenti menentang keadaan dan mulai menjalaninya.",
    readStory: "Baca kisah saya",
    shareMoment: "Jelajahi jurnal",
    years: "Tahun bertumbuh",
    moments: "Momen berkesan",
    turns: "Titik balik",
    aboutTitle: "Tentang saya",
    aboutIntro: "Saya ingin menjalani hidup dengan jujur—menerima jeda, perubahan, keraguan, juga harapan. Situs ini merekam langkah saya untuk terus maju tanpa kehilangan diri sendiri.",
    aboutOne: "Kisah saya tidak selalu tersusun rapi. Ada harapan, usaha, ragu, dan banyak hal yang baru saya pahami setelah menjalaninya. Saya belajar bahwa sebuah bab tak harus ramai untuk terasa berarti. Sering kali, perubahan besar tumbuh dari momen-momen sunyi ketika saya mulai mengerti diri sendiri.",
    aboutTwo: "Saya menyimpan cerita, foto, dan pencapaian kecil sebagai cara untuk memahami perjalanan hidup saya. Situs ini bukan sekadar profil, melainkan jurnal yang terus bertambah seiring langkah saya.",
    values: "Yang saya hargai",
    curiosity: "Rasa ingin tahu",
    curiosityText: "Saya senang belajar dan mencoba hal-hal baru.",
    authenticity: "Kejujuran",
    authenticityText: "Saya ingin bercerita apa adanya, tanpa kehilangan diri sendiri.",
    growth: "Proses bertumbuh",
    growthText: "Setiap tantangan memberi pelajaran untuk langkah berikutnya.",
    journeyTitle: "Babak-babak hidupku",
    journeyIntro: "Tahun-tahun yang mengubah arah hidupku, dan usaha untuk terus melangkah.",
    rhythmKicker: "Pegangan saya",
    rhythmTitle: "Hal-hal yang menemani langkah saya",
    plansTitle: "Rencana berikutnya",
    plansIntro: "Bagi saya, masa depan bukan cuma soal tujuan. Ini tentang cara hidup yang ingin saya jalani, tempat yang ingin saya kunjungi, dan cerita yang ingin saya bawa pulang.",
    upcoming: "Rencana",
    saveMoment: "Hubungi saya",
    journalTitle: "Jurnal",
    journalIntro: "Catatan tentang pikiran, persimpangan, dan hal-hal kecil yang ikut membentuk hidup saya.",
    readMore: "Baca selengkapnya",
    galleryTitle: "Cerita dalam foto",
    galleryIntro: "Ada momen yang ingin saya kenang lebih lama. Foto-foto ini menyimpan potongan perjalanan, suasana, dan hal-hal indah yang saya temui.",
    addStory: "Tambahkan cerita",
    shareLatest: "Bagikan cerita terbaru",
    title: "Judul",
    date: "Tanggal",
    location: "Lokasi",
    photo: "Foto",
    story: "Cerita",
    publish: "Terbitkan cerita",
    contactTitle: "Mari bertukar cerita.",
    contactText: "Saya terbuka untuk obrolan, kolaborasi, dan petualangan baru. Ingin berbagi cerita atau sekadar menyapa? Saya senang mendengarnya.",
    nextChapter: "Langkah berikutnya",
    nextText: "Saya masih menulis kisah ini, satu langkah demi satu langkah. Semoga situs ini menjadi catatan yang jujur tentang perjalanan yang terus berjalan.",
    email: "Kirim email",
    footer: "© 2026 Nothing in My Way — kumpulan kenangan, pelajaran, dan langkah yang terus berlanjut.",
  },
} as const;

export default function StoryClient({ entries, homepageData }: { entries: StoryEntry[]; homepageData: HomepageData }) {
  const { language } = useLanguage();
  const gallery = homepageData.gallery;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [frontImageIndex, setFrontImageIndex] = useState(0);
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [isDeckFocused, setIsDeckFocused] = useState(false);
  const [isDeckDragging, setIsDeckDragging] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [timelinePulseDelays, setTimelinePulseDelays] = useState<number[]>([]);
  const deckDragStartX = useRef<number | null>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const t = translations[language];
  const managedCopy = homepageData.copy[language];

  const totalGallery = gallery.length;

  useEffect(() => {
    if (totalGallery < 2 || isDeckHovered || isDeckFocused || isDeckDragging || selectedImage) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setFrontImageIndex((current) => (current + 1) % totalGallery);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [isDeckDragging, isDeckFocused, isDeckHovered, selectedImage, totalGallery]);

  useEffect(() => {
    const galleryGrid = galleryGridRef.current;
    if (!galleryGrid || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsGalleryVisible(true);
      observer.disconnect();
    }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

    observer.observe(galleryGrid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const updateMarkerDelays = () => {
      const timelineRect = timeline.getBoundingClientRect();
      if (!timelineRect.height) return;

      const markers = Array.from(timeline.querySelectorAll<HTMLElement>("[data-timeline-marker]"));
      setTimelinePulseDelays(markers.map((marker) => {
        const markerRect = marker.getBoundingClientRect();
        const progress = (markerRect.top + markerRect.height / 2 - timelineRect.top) / timelineRect.height;
        return Math.max(0, Math.min(1, progress)) * timelineFlowDuration;
      }));
    };

    updateMarkerDelays();
    window.addEventListener("resize", updateMarkerDelays);

    if (typeof ResizeObserver === "undefined") {
      return () => window.removeEventListener("resize", updateMarkerDelays);
    }

    const observer = new ResizeObserver(updateMarkerDelays);
    observer.observe(timeline);
    timeline.querySelectorAll<HTMLElement>("[data-timeline-marker]").forEach((marker) => {
      if (marker.parentElement) observer.observe(marker.parentElement);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMarkerDelays);
    };
  }, [managedCopy.journey]);

  const openGallery = (image: string, index: number) => {
    setSelectedImage(image);
    setActiveIndex(index);
  };

  const moveGallery = (direction: number) => {
    if (!selectedImage) return;
    const nextIndex = (activeIndex + direction + totalGallery) % totalGallery;
    setActiveIndex(nextIndex);
    setSelectedImage(gallery[nextIndex]);
  };

  const moveDeck = (direction: number) => {
    if (totalGallery < 2) return;
    setFrontImageIndex((current) => (current + direction + totalGallery) % totalGallery);
  };

  const handleDeckPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    deckDragStartX.current = event.clientX;
    setIsDeckDragging(true);
    if (event.isTrusted) event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDeckPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (deckDragStartX.current === null) return;
    const distance = event.clientX - deckDragStartX.current;
    deckDragStartX.current = null;
    setIsDeckDragging(false);
    if (Math.abs(distance) < 44) return;
    event.preventDefault();
    moveDeck(distance < 0 ? 1 : -1);
  };

  const handleDeckKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveDeck(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveDeck(1);
    }
  };

  const journalCards = entries.slice(0, 3);

  return (
    <div className={styles.publicPage}>
      <PublicNavigation />

      <main id="home">
        <section className={styles.hero}>
          <div className={`${styles.container} ${styles.heroInner}`}>
            <div>
              <span className={styles.kicker}>
                <span className={styles.kickerDot} />
                {t.kicker}
              </span>

              <div className={styles.heroText}>
                <h1>{managedCopy.heroTitle}</h1>
                <p>{managedCopy.heroText}</p>
              </div>

              <div className={styles.heroActions}>
                <a href="#journey" className={styles.primaryButton}>
                  {t.readStory}
                </a>
                <Link href="/journal" className={styles.secondaryButton}>
                  {t.shareMoment}
                </Link>
              </div>

              <div className={styles.heroMeta}>
                <div className={styles.metaItem}>
                  <strong>8+</strong>
                  <span>{t.years}</span>
                </div>
                <div className={styles.metaItem}>
                  <strong>12</strong>
                  <span>{t.moments}</span>
                </div>
                <div className={styles.metaItem}>
                  <strong>4</strong>
                  <span>{t.turns}</span>
                </div>
              </div>
            </div>

            <div
              className={styles.heroVisual}
              role="region"
              aria-roledescription="carousel"
              aria-label={t.photoCollection}
              tabIndex={0}
              onPointerEnter={() => setIsDeckHovered(true)}
              onPointerLeave={() => setIsDeckHovered(false)}
              onFocus={() => setIsDeckFocused(true)}
              onBlur={() => setIsDeckFocused(false)}
              onKeyDown={handleDeckKeyDown}
              onPointerDown={handleDeckPointerDown}
              onPointerUp={handleDeckPointerUp}
              onPointerCancel={() => {
                deckDragStartX.current = null;
                setIsDeckDragging(false);
              }}
            >
              {gallery.map((image, index) => {
                const deckPosition = (index - frontImageIndex + gallery.length) % gallery.length;
                const depth = Math.min(deckPosition, 8);
                const direction = deckPosition % 2 === 0 ? -1 : 1;
                const isFront = deckPosition === 0;
                const spreadX = isFront ? 0 : direction * (16 + depth * 4);
                const spreadY = isFront ? 0 : depth * 3;
                const rotation = isFront ? 0 : direction * depth * 1.15;
                const scale = 1 - depth * 0.012;

                return (
                  <div
                    key={`${image}-${index}`}
                    className={`${styles.imageCard} ${styles.deckCard} ${isFront ? styles.deckCardFront : ""}`}
                    style={{
                      backgroundImage: `url(${image})`,
                      zIndex: gallery.length - deckPosition,
                      "--deck-x": `${spreadX}px`,
                      "--deck-y": `${spreadY}px`,
                      "--deck-rotation": `${rotation}deg`,
                      "--deck-scale": scale,
                      "--deck-hover-x": `${spreadX * 1.9}px`,
                      "--deck-hover-y": `${spreadY + depth * 2}px`,
                      "--deck-hover-rotation": `${rotation * 1.45}deg`,
                    } as React.CSSProperties}
                    aria-hidden="true"
                  />
                );
              })}
              <div className={styles.imageBadge}>
                <div className={styles.badgeTitle}>{t.photoCollection}</div>
                <div className={styles.badgeValue}>{gallery.length} {t.photosSaved}</div>
                <div className={styles.badgeHint} aria-live="polite">
                  {t.photoPosition(frontImageIndex + 1, gallery.length)} · {t.dragHint}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={styles.section}>
          <div className={`${styles.container} ${styles.sectionHeader}`}>
            <h2>{t.aboutTitle}</h2>
            <p>{managedCopy.aboutIntro}</p>
          </div>

          <div className={`${styles.container} ${styles.aboutGrid}`}>
            <div className={styles.storyCard}>
              <p>
                {managedCopy.aboutOne}
              </p>
              <p>
                {managedCopy.aboutTwo}
              </p>
            </div>

            <div className={styles.valueCard}>
              <h3>{t.values}</h3>
              <div className={styles.valueList}>
                <div className={styles.valueItem}>
                  <div className={styles.valueIcon}>1</div>
                  <div>
                    <strong>{t.curiosity}</strong>
                    <span>{t.curiosityText}</span>
                  </div>
                </div>
                <div className={styles.valueItem}>
                  <div className={styles.valueIcon}>2</div>
                  <div>
                    <strong>{t.authenticity}</strong>
                    <span>{t.authenticityText}</span>
                  </div>
                </div>
                <div className={styles.valueItem}>
                  <div className={styles.valueIcon}>3</div>
                  <div>
                    <strong>{t.growth}</strong>
                    <span>{t.growthText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className={styles.section}>
          <div className={`${styles.container} ${styles.sectionHeader}`}>
            <h2>{t.journeyTitle}</h2>
            <p>{t.journeyIntro}</p>
          </div>

          <div ref={timelineRef} className={`${styles.container} ${styles.timeline}`}>
            <div className={styles.timelineArrow} aria-hidden="true" />
            {managedCopy.journey.map(([year, title, text], index) => (
              <article
                key={year}
                className={styles.timelineItem}
                style={{ "--timeline-pulse-delay": `${timelinePulseDelays[index] ?? 0}s` } as React.CSSProperties}
              >
                <span className={styles.timelineMarker} data-timeline-marker aria-hidden="true" />
                <span className={styles.timelineYear}>{year}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={`${styles.container} ${styles.signatureSection}`}>
            <div className={styles.formHeader}>
              <p className={styles.kicker}>{t.rhythmKicker}</p>
              <h2>{t.rhythmTitle}</h2>
            </div>

            <div className={styles.momentGrid}>
              {managedCopy.signature.map(([icon, title, text]) => (
                <article key={title} className={styles.momentCard}>
                  <div className={styles.momentIcon}>{icon}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="plans" className={styles.section}>
          <div className={`${styles.container} ${styles.sectionHeader}`}>
            <h2>{t.plansTitle}</h2>
            <p>{t.plansIntro}</p>
          </div>

          <div className={`${styles.container} ${styles.planGrid}`}>
            {homepageData.plans.map((plan) => (
              <article key={plan.title} className={styles.planCard}>
                <div
                  className={styles.planCover}
                  style={{ backgroundImage: `url(${plan.image})` }}
                />

                <div className={styles.planMeta}>
                  <span>{language === "id" ? plan.dateId ?? plan.date : plan.date}</span>
                  <span className={styles.badge}>{t.upcoming}</span>
                </div>

                <h3>{language === "id" ? plan.titleId ?? plan.title : plan.title}</h3>
                <p>{language === "id" ? plan.descriptionId ?? plan.description : plan.description}</p>

                <div className={styles.planFooter}>
                  <span>{plan.location}</span>
                  <a href="#contact">{t.saveMoment}</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="journal" className={styles.section}>
          <div className={`${styles.container} ${styles.sectionHeader}`}>
            <h2>{t.journalTitle}</h2>
            <p>{t.journalIntro}</p>
          </div>

          <div className={`${styles.container} ${styles.journalGrid}`}>
            {journalCards.map((entry) => {
              const translated = language === "en" ? entry.translations?.en : undefined;
              const category = language === "id"
                ? entry.category === "Travel" ? t.categoryTravel : entry.category === "Reflection" ? t.categoryReflection : t.categoryJourney
                : entry.category;
              return (
                <article key={entry.slug} className={styles.journalCard}>
                <div className={styles.journalMeta}>
                  <span>{translated?.date ?? entry.date}</span>
                  <span>{category}</span>
                </div>
                <h3>{translated?.title ?? entry.title}</h3>
                <p>{normalizeStoryText(translated?.blurb ?? entry.blurb)}</p>
                <div className={styles.journalFooter}>
                  <Link href={`/journal/${entry.slug}`}>{t.readMore}</Link>
                  <Link href={`/journal/${entry.slug}`} aria-label={`${t.readEntry} ${entry.title}`}>
                    →
                  </Link>
                </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="gallery" className={styles.section}>
          <div className={`${styles.container} ${styles.sectionHeader}`}>
            <h2>{t.galleryTitle}</h2>
            <p>{t.galleryIntro}</p>
          </div>

          <div ref={galleryGridRef} className={`${styles.container} ${styles.galleryGrid}`}>
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`${styles.photoCard} ${isGalleryVisible ? styles.galleryCardVisible : ""}`}
                style={{ "--photo-image": `url(${image})`, "--gallery-delay": `${index * 75}ms` } as React.CSSProperties}
                aria-label={`${t.openGalleryPhoto} ${index + 1}`}
                onClick={() => openGallery(image, index)}
              />
            ))}
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <div className={`${styles.container} ${styles.contactWrap}`}>
            <div className={styles.contactCard}>
              <h3>{t.contactTitle}</h3>
              <p>{managedCopy.contactText}</p>

              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <span className={styles.contactDot} />
                  <span>hello@mylifestory.com</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactDot} />
                  <span>Instagram / LinkedIn / GitHub</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactDot} />
                  <span>{t.basedIn}</span>
                </div>
              </div>
            </div>

            <div className={styles.contactCard}>
              <h3>{t.nextChapter}</h3>
              <p>{managedCopy.nextText}</p>
              <div className={styles.heroActions}>
                <a href="mailto:hello@mylifestory.com" className={styles.primaryButton}>
                  {t.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={`${styles.container} ${styles.footer}`}>
        {t.footer}
      </footer>

      {selectedImage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalPanel} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setSelectedImage(null)}
              aria-label={t.closePhoto}
            >
              ×
            </button>
            <div
              className={styles.modalImage}
              style={{ backgroundImage: `url(${selectedImage})` }}
            />
            <div className={styles.modalControls}>
              <button type="button" onClick={() => moveGallery(-1)}>
                {t.previousPhoto}
              </button>
              <button type="button" onClick={() => moveGallery(1)}>
                {t.nextPhoto}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
