import { createClient } from "@/utils/supabase/server";
import { defaultHomepageData, type HomepageCopy, type HomepageData, type Plan } from "./homepageData";

const legacyIndonesianCopy: Partial<HomepageCopy> = {
  heroText: "Inilah perasaan yang saya bawa: keyakinan yang tenang bahwa hidup terus berjalan, bahwa luka dan keajaiban dapat hadir bersamaan, dan setiap bab terasa lebih ringan ketika saya berhenti melawan jalan dan mulai menjalaninya.",
  aboutIntro: "Saya digerakkan oleh perasaan bahwa hidup perlu dirasakan dengan jujur — kesunyian, gerak, keraguan, dan harapan. Situs ini menjadi catatan tentang cara saya terus berjalan tanpa kehilangan diri sendiri.",
  aboutOne: "Kisah saya tidak pernah tersusun sempurna. Ia adalah campuran harapan, usaha, ketidakpastian, dan penemuan. Dalam perjalanan, saya belajar bahwa tidak setiap bab harus terdengar keras agar berarti.",
  aboutTwo: "Saya mencatat hidup melalui cerita, foto, dan pencapaian kecil karena saya percaya ingatan adalah cara paling jujur untuk memahami diri. Website ini bukan sekadar profil — ini jurnal hidup yang terus saya tulis dalam perjalanan.",
  contactText: "Saya selalu terbuka untuk percakapan bermakna, kolaborasi, dan petualangan baru. Jika ingin terhubung, berbagi cerita, atau sekadar menyapa, saya akan senang mendengarnya.",
  nextText: "Kisah terbaik adalah kisah yang dijalani dengan niat. Saya masih menulis kisah saya, dan semoga website ini menjadi catatan hidup dari gerak itu — jujur, tidak sempurna, dan terus melangkah.",
  journey: [["2016", "Percikan pertama", "Saya mulai menemukan rasa ingin tahu terhadap belajar, kreativitas, dan gagasan bahwa hidup dibentuk oleh pilihan yang kita ambil setiap hari."], ["2019", "Titik balik", "Saya mulai menganggap serius mimpi-mimpi saya, menerima tantangan, dan belajar bahwa ketangguhan dibangun dari langkah kecil yang konsisten."], ["2022", "Membangun jalan", "Saat itu saya berkomitmen untuk bertumbuh, menjelajahi kesempatan baru, dan membentuk jati diri melalui karya serta pembelajaran."], ["2025", "Menjalani kisah", "Kini saya bepergian, mengumpulkan kenangan, membangun pengalaman, dan mengubah hidup menjadi kisah yang jujur serta menginspirasi."]],
  signature: [["✦", "Rasa ingin tahu", "Saya mengumpulkan ide, tempat, dan sudut pandang seperti oleh-oleh dari hidup yang bermakna."], ["◎", "Refleksi", "Saya cukup sering berhenti untuk memahami pertumbuhan yang sedang membentuk diri saya."], ["↗", "Petualangan", "Kenangan terbaik sering tercipta di luar zona nyaman dan ketika kita terus bergerak."]],
};

const legacyEnglishJourney: HomepageCopy["journey"] = [["2016", "The first spark", "I began discovering my curiosity for learning, creativity, and the idea that life is shaped by the choices we make every single day."], ["2019", "A turning point", "I started taking my dreams seriously, embracing challenges, and learning that resilience is built through small, consistent steps."], ["2022", "Building my path", "This was the moment I committed to growth, explored new opportunities, and shaped my identity through meaningful work and learning."], ["2025", "Living the story", "Now I am traveling, collecting memories, building experiences, and turning my life into a story that is both honest and inspiring."]];

function mergeHomepageCopy(language: "en" | "id", savedCopy: Partial<HomepageCopy>): HomepageCopy {
  const defaults = defaultHomepageData.copy[language];
  const merged = { ...defaults, ...savedCopy };

  if (language === "id") {
    for (const key of Object.keys(legacyIndonesianCopy) as (keyof HomepageCopy)[]) {
      if (JSON.stringify(savedCopy[key]) === JSON.stringify(legacyIndonesianCopy[key])) {
        Object.assign(merged, { [key]: defaults[key] });
      }
    }
  } else if (JSON.stringify(savedCopy.journey) === JSON.stringify(legacyEnglishJourney)) {
    Object.assign(merged, { journey: defaults.journey });
  }

  return merged;
}

export async function getHomepageData(): Promise<HomepageData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return defaultHomepageData;
  }

  try {
    const supabase = await createClient();
    const [{ data: plans }, { data: gallery }] = await Promise.all([
      supabase.from("plans").select("title, date, location, description, image").order("sort_order"),
      supabase.from("gallery_items").select("image_url").order("sort_order"),
    ]);
    const { data: settings } = await supabase
      .from("site_settings")
      .select("content")
      .eq("key", "homepage_copy")
      .maybeSingle();

    return {
      plans: plans?.length ? (plans as Plan[]) : defaultHomepageData.plans,
      gallery: gallery?.length ? gallery.map((item) => item.image_url) : defaultHomepageData.gallery,
      copy: {
        en: mergeHomepageCopy("en", (settings?.content?.en ?? {}) as Partial<HomepageCopy>),
        id: mergeHomepageCopy("id", (settings?.content?.id ?? {}) as Partial<HomepageCopy>),
      },
    };
  } catch {
    return defaultHomepageData;
  }
}
