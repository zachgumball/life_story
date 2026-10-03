"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSelect from "./LanguageSelect";
import { useLanguage } from "./LanguageProvider";
import styles from "@/app/page.module.css";

const navigationCopy = {
  en: {
    aria: "Main navigation",
    links: ["About", "Journey", "Plans", "Journal", "Gallery", "Contact"],
    language: "Language",
    admin: "Private studio",
  },
  id: {
    aria: "Navigasi utama",
    links: ["Tentang", "Perjalanan", "Rencana", "Jurnal", "Galeri", "Kontak"],
    language: "Bahasa",
    admin: "Studio pribadi",
  },
} as const;

export default function PublicNavigation() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = navigationCopy[language];
  const homePrefix = pathname === "/" ? "" : "/";
  const links = [
    `${homePrefix}#about`,
    `${homePrefix}#journey`,
    `${homePrefix}#plans`,
    "/journal",
    `${homePrefix}#gallery`,
    `${homePrefix}#contact`,
  ];

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.nav}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>M</span>
          Nothing in My Way
        </Link>

        <nav className={styles.navLinks} aria-label={t.aria}>
          {t.links.map((label, index) => (
            <Link
              key={label}
              href={links[index]}
              aria-current={index === 3 && pathname.startsWith("/journal") ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.navTools}>
          <LanguageSelect className={styles.languageControl} label={t.language} />
          <Link href="/admin/login" className={styles.adminAccess}>{t.admin}</Link>
        </div>
      </div>
    </header>
  );
}