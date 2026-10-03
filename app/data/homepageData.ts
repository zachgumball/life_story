import { featuredPlans, galleryImages } from "./storyData";

export type Plan = {
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  titleId?: string;
  dateId?: string;
  descriptionId?: string;
};

export type HomepageData = {
  plans: Plan[];
  gallery: string[];
  copy: {
    en: HomepageCopy;
    id: HomepageCopy;
  };
};

export type HomepageCopy = {
  heroTitle: string;
  heroText: string;
  aboutIntro: string;
  aboutOne: string;
  aboutTwo: string;
  contactText: string;
  nextText: string;
  journey: readonly (readonly [string, string, string])[];
  signature: readonly (readonly [string, string, string])[];
};

export const defaultHomepageCopy = {
  en: {
    heroTitle: "Nothing in my way.",
    heroText: "This is the feeling I carry with me: a quiet certainty that life keeps moving, that pain and wonder can coexist, and that every chapter becomes lighter when I stop fighting the path and start living it.",
    aboutIntro: "I am driven by the feeling that life is meant to be felt honestly — the silence, the movement, the doubts, the hope. This site is a record of the way I keep walking without losing myself.",
    aboutOne: "My story is never perfectly arranged. It is a mix of hope, effort, uncertainty, and discovery. Along the road, I learned that not every chapter needs to be loud to be meaningful. Some of the deepest changes happen in the quiet moments when I finally understand what I am becoming.",
    aboutTwo: "I document my life with stories, photographs, and small milestones because I believe memory is one of the most honest ways to understand a self. This website is not just a profile — it is a living journal of the life I am writing in motion.",
    contactText: "I am always open to meaningful conversations, collaborations, and new adventures. If you want to connect, share a story, or simply say hello, I would love to hear from you.",
    nextText: "The best stories are the ones lived with intention. I am still writing mine, and I hope this website becomes a living record of that motion — honest, imperfect, and still moving forward.",
    journey: [["2017", "One step at a time", "This year became part of the journey that brought me to where I am now."], ["2020", "Still moving forward", "I kept going without knowing how my story would unfold."], ["2024", "Feeling an emptiness", "In 2024, I began to feel an emptiness in my life."], ["2025-present", "Trying to keep going", "Since then, I have been trying to keep going, one day at a time."]],
    signature: [["✦", "Curiosity", "I collect ideas, places, and perspectives like souvenirs from a meaningful life."], ["◎", "Reflection", "I pause often enough to understand what growth is asking me to become."], ["↗", "Adventure", "The best memories are often created outside my comfort zone and in motion."]],
  },
  id: {
    heroTitle: "Tak ada yang menghalangi jalanku.",
    heroText: "Saya percaya hidup akan terus bergerak. Luka dan rasa takjub bisa hadir bersamaan. Setiap bab terasa lebih ringan saat saya berhenti menentang keadaan dan mulai menjalaninya.",
    aboutIntro: "Saya ingin menjalani hidup dengan jujur—menerima jeda, perubahan, keraguan, juga harapan. Situs ini merekam langkah saya untuk terus maju tanpa kehilangan diri sendiri.",
    aboutOne: "Kisah saya tidak selalu tersusun rapi. Ada harapan, usaha, ragu, dan banyak hal yang baru saya pahami setelah menjalaninya. Saya belajar bahwa sebuah bab tak harus ramai untuk terasa berarti. Sering kali, perubahan besar tumbuh dari momen-momen sunyi ketika saya mulai mengerti diri sendiri.",
    aboutTwo: "Saya menyimpan cerita, foto, dan pencapaian kecil sebagai cara untuk memahami perjalanan hidup saya. Situs ini bukan sekadar profil, melainkan jurnal yang terus bertambah seiring langkah saya.",
    contactText: "Saya terbuka untuk obrolan, kolaborasi, dan petualangan baru. Ingin berbagi cerita atau sekadar menyapa? Saya senang mendengarnya.",
    nextText: "Saya masih menulis kisah ini, satu langkah demi satu langkah. Semoga situs ini menjadi catatan yang jujur tentang perjalanan yang terus berjalan.",
    journey: [["2017", "Selangkah demi selangkah", "Tahun ini menjadi bagian dari perjalanan yang membawaku sampai ke hari ini."], ["2020", "Tetap melangkah", "Aku terus menjalani hari tanpa tahu bagaimana ceritaku akan berkembang."], ["2024", "Mulai merasakan kehampaan", "Pada 2024, aku mulai merasakan kekosongan dalam hidup."], ["2025-sekarang", "Terus berusaha menjalani hidup", "Sejak 2025, aku berusaha melewati hari demi hari dan tetap melangkah."]],
    signature: [["✦", "Rasa ingin tahu", "Saya senang menemukan ide, tempat, dan sudut pandang baru."], ["◎", "Refleksi", "Saya meluangkan waktu untuk memahami apa yang sedang saya pelajari."], ["↗", "Petualangan", "Banyak kenangan berharga lahir saat saya berani mencoba hal baru."]],
  },
} as const;

export const defaultHomepageData: HomepageData = {
  plans: featuredPlans,
  gallery: galleryImages,
  copy: defaultHomepageCopy,
};
