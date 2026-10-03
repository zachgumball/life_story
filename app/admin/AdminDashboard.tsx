"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { defaultHomepageCopy } from "@/app/data/homepageData";
import { useLanguage } from "@/app/components/LanguageProvider";
import LanguageSelect from "@/app/components/LanguageSelect";

type Panel = "settings" | "journal" | "plan" | "gallery";

type JournalRecord = {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  category: string;
  blurb: string;
  description: string;
  image: string;
  highlights: string[];
  gallery: string[];
  checkpoint_summaries: string[];
};

type PlanRecord = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
};

type GalleryRecord = {
  id: string;
  image_url: string;
  caption: string;
};

type FormState = Record<string, string>;
type CheckpointDraft = { title: string; summary: string; image: string };

const emptyCheckpoint: CheckpointDraft = { title: "", summary: "", image: "" };

function readableDatabaseError(error: { message: string } | null, language: "en" | "id") {
  if (!error) return null;
  if (error.message.includes("schema cache") || error.message.includes("does not exist")) {
    return language === "id"
      ? "Struktur database belum diperbarui. Jalankan supabase-schema.sql di SQL Editor Supabase, lalu coba lagi."
      : "The database schema is out of date. Run supabase-schema.sql in the Supabase SQL Editor, then try again.";
  }
  if (error.message.includes("duplicate key value") || error.message.includes("slug_key") || error.message.includes("slug")) {
    return language === "id"
      ? "Judul ini sudah digunakan. Coba judul lain sebelum menyimpan."
      : "This title is already in use. Try a different title before saving.";
  }
  return error.message;
}

const adminCopy = {
  en: {
    language: "Language",
    privateStudio: "Private studio",
    dashboardTitle: "Shape the story",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    contentStudio: "Content studio",
    connected: "Public site connected",
    overview: ["Story", "Plans", "Gallery", "Status"],
    overviewDetails: ["journal entries", "upcoming plans", "photos", "public site"],
    tabs: ["Settings", "Journal", "Plans", "Gallery"],
    panelCopy: {
      settings: ["Homepage settings", "Shape the homepage voice", "Edit the English and Indonesian copy shown across the public homepage."],
      journal: ["New journal", "Add a journal entry", "Write a new chapter for your public journal."],
      plan: ["Upcoming plan", "Add a plan", "Keep upcoming destinations and intentions visible."],
      gallery: ["Gallery memory", "Add a photograph", "Add another photo to the public homepage."],
    },
    settingsLanguageNames: ["English copy", "Indonesian copy"],
    settingsLabels: ["Hero title", "Hero text", "About introduction", "About story paragraph 1", "About story paragraph 2", "Contact text", "Next chapter text", "Journey JSON", "Signature JSON"],
    fieldTitle: "Title",
    fieldDate: "Date",
    fieldLocation: "Location",
    fieldCategory: "Category",
    fieldCover: "Cover photo URL",
    fieldStory: "Story",
    fieldPlanDescription: "Plan description",
    fieldJournalSummary: "Journal introduction",
    checkpointTitle: "Journey checkpoints",
    checkpointHelp: "Add memorable places or moments in order. Each stop can have its own photo; otherwise the cover photo will be used.",
    checkpointSingular: "stop",
    checkpointPlural: "stops",
    checkpointName: "Place or moment",
    checkpointNamePlaceholder: "For example: Sunrise at the summit",
    checkpointSummary: "Stop summary",
    checkpointSummaryPlaceholder: "Briefly describe what happened or how this moment felt",
    optional: "optional",
    checkpointPhotoPlaceholder: "Leave blank to use the cover photo",
    remove: "Remove",
    addCheckpoint: "Add a stop",
    formInvalid: "The form content is invalid.",
    galleryImage: "Photo URL",
    galleryCaption: "Caption",
    galleryCaptionPlaceholder: "A quiet morning by the sea",
    categoryTravel: "Travel",
    categoryReflection: "Reflection",
    categoryJourney: "Journey",
    save: "Save",
    update: "Update",
    saving: "Saving...",
    preview: "Live preview",
    previewJournal: "Public journal",
    previewPlan: "Upcoming plan",
    previewGallery: "Gallery photo",
    previewUntitled: "Untitled journal",
    previewLocation: "Your location",
    previewDate: "Date",
    previewStory: "Your story preview appears here.",
    previewDestination: "Destination",
    previewPlanDescription: "Your plan preview appears here.",
    previewMemory: "Photo preview",
    previewCaption: "Photo caption",
    previewGalleryDescription: "This is how the photo will appear on the public homepage.",
    categoryPlan: "Plan",
    categoryPhoto: "Photo",
    newEntry: "New entry",
    savedItems: "Saved items",
    loading: "Loading...",
    total: "total",
    emptyList: "Nothing here yet.",
    edit: "Edit",
    delete: "Delete",
    galleryAlt: "Gallery photo",
    untitledPhoto: "Untitled photo",
    databaseLoading: "Could not load saved content.",
    deleteSuccess: "Item deleted.",
    saveSuccess: "Changes saved successfully.",
    newJournalSaved: "Journal entry saved successfully.",
    newPlanSaved: "Plan saved successfully.",
    newGallerySaved: "Photo saved successfully.",
    settingsSaved: "Homepage copy saved successfully.",
  },
  id: {
    language: "Bahasa",
    privateStudio: "Studio admin",
    dashboardTitle: "Kelola cerita",
    signedInAs: "Masuk sebagai",
    signOut: "Keluar",
    contentStudio: "Ruang pengelolaan konten",
    connected: "Terhubung ke situs publik",
    overview: ["Jurnal", "Rencana", "Galeri", "Status"],
    overviewDetails: ["cerita tersimpan", "rencana mendatang", "foto", "situs publik"],
    tabs: ["Pengaturan", "Jurnal", "Rencana", "Galeri"],
    panelCopy: {
      settings: ["Pengaturan beranda", "Atur tampilan beranda", "Ubah teks bahasa Inggris dan Indonesia yang tampil di situs."],
      journal: ["Jurnal baru", "Tulis cerita perjalanan", "Tambahkan bab baru ke jurnal pribadi Anda."],
      plan: ["Rencana mendatang", "Tambahkan rencana", "Tampilkan tujuan dan hal yang ingin Anda lakukan berikutnya."],
      gallery: ["Foto galeri", "Tambahkan foto", "Pilih foto lain untuk ditampilkan di beranda."],
    },
    settingsLanguageNames: ["Konten bahasa Inggris", "Konten bahasa Indonesia"],
    settingsLabels: ["Judul utama", "Teks utama", "Pembuka tentang saya", "Cerita tentang saya, paragraf 1", "Cerita tentang saya, paragraf 2", "Teks kontak", "Teks bab berikutnya", "Data perjalanan (JSON)", "Data momen pilihan (JSON)"],
    fieldTitle: "Judul",
    fieldDate: "Tanggal",
    fieldLocation: "Lokasi",
    fieldCategory: "Kategori",
    fieldCover: "URL foto sampul",
    fieldStory: "Cerita",
    fieldPlanDescription: "Deskripsi rencana",
    fieldJournalSummary: "Pengantar jurnal",
    checkpointTitle: "Titik perjalanan",
    checkpointHelp: "Tambahkan tempat atau momen penting sesuai urutan perjalanan. Foto boleh berbeda untuk tiap titik; jika dikosongkan, foto sampul akan digunakan.",
    checkpointSingular: "titik",
    checkpointPlural: "titik",
    checkpointName: "Nama tempat atau momen",
    checkpointNamePlaceholder: "Contoh: Matahari terbit di puncak",
    checkpointSummary: "Ringkasan titik",
    checkpointSummaryPlaceholder: "Ceritakan singkat apa yang terjadi atau terasa di momen ini",
    optional: "opsional",
    checkpointPhotoPlaceholder: "Kosongkan untuk memakai foto sampul",
    remove: "Hapus",
    addCheckpoint: "Tambah titik perjalanan",
    formInvalid: "Periksa kembali isi formulir, lalu coba lagi.",
    galleryImage: "URL foto",
    galleryCaption: "Keterangan foto",
    galleryCaptionPlaceholder: "Pagi yang tenang di tepi laut",
    categoryTravel: "Perjalanan",
    categoryReflection: "Refleksi",
    categoryJourney: "Kisah perjalanan",
    save: "Simpan",
    update: "Perbarui",
    saving: "Menyimpan...",
    preview: "Pratinjau langsung",
    previewJournal: "Jurnal publik",
    previewPlan: "Rencana mendatang",
    previewGallery: "Foto galeri",
    previewUntitled: "Jurnal tanpa judul",
    previewLocation: "Lokasi Anda",
    previewDate: "Tanggal",
    previewStory: "Pratinjau cerita akan tampil di sini.",
    previewDestination: "Tujuan",
    previewPlanDescription: "Pratinjau rencana akan tampil di sini.",
    previewMemory: "Pratinjau foto",
    previewCaption: "Keterangan foto",
    previewGalleryDescription: "Seperti inilah foto akan tampil di beranda.",
    categoryPlan: "Rencana",
    categoryPhoto: "Foto",
    newEntry: "Konten baru",
    savedItems: "Konten tersimpan",
    loading: "Memuat...",
    total: "item",
    emptyList: "Belum ada konten di sini.",
    edit: "Ubah",
    delete: "Hapus",
    galleryAlt: "Foto galeri",
    untitledPhoto: "Foto tanpa keterangan",
    databaseLoading: "Konten tersimpan tidak dapat dimuat.",
    deleteSuccess: "Konten berhasil dihapus.",
    saveSuccess: "Perubahan berhasil disimpan.",
    newJournalSaved: "Cerita jurnal berhasil disimpan.",
    newPlanSaved: "Rencana berhasil disimpan.",
    newGallerySaved: "Foto berhasil disimpan.",
    settingsSaved: "Teks beranda berhasil disimpan.",
  },
} as const;

const panelCopy = {
  en: adminCopy.en.panelCopy,
  id: adminCopy.id.panelCopy,
};

function buildEmptyForm(panel: Panel): FormState {
  if (panel === "settings") {
    return {
      enHeroTitle: defaultHomepageCopy.en.heroTitle,
      enHeroText: defaultHomepageCopy.en.heroText,
      enAboutIntro: defaultHomepageCopy.en.aboutIntro,
      enAboutOne: defaultHomepageCopy.en.aboutOne,
      enAboutTwo: defaultHomepageCopy.en.aboutTwo,
      enContactText: defaultHomepageCopy.en.contactText,
      enNextText: defaultHomepageCopy.en.nextText,
      enJourney: JSON.stringify(defaultHomepageCopy.en.journey),
      enSignature: JSON.stringify(defaultHomepageCopy.en.signature),
      idHeroTitle: defaultHomepageCopy.id.heroTitle,
      idHeroText: defaultHomepageCopy.id.heroText,
      idAboutIntro: defaultHomepageCopy.id.aboutIntro,
      idAboutOne: defaultHomepageCopy.id.aboutOne,
      idAboutTwo: defaultHomepageCopy.id.aboutTwo,
      idContactText: defaultHomepageCopy.id.contactText,
      idNextText: defaultHomepageCopy.id.nextText,
      idJourney: JSON.stringify(defaultHomepageCopy.id.journey),
      idSignature: JSON.stringify(defaultHomepageCopy.id.signature),
    };
  }

  if (panel === "gallery") {
    return { image: "", caption: "" };
  }

  return {
    title: "",
    date: "",
    location: "",
    category: panel === "journal" ? "Journey" : "Plan",
    image: "",
    description: "",
    blurb: "",
    highlight: "",
  };
}

function createSlug(raw: string) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled-story";
}

async function generateUniqueJournalSlug(supabase: ReturnType<typeof createClient>, rawTitle: string) {
  const baseSlug = createSlug(rawTitle);
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const { data, error } = await supabase.from("journal_entries").select("slug").eq("slug", candidate).limit(1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export default function AdminDashboard({ email }: { email: string }) {
  const { language } = useLanguage();
  const t = adminCopy[language];
  const [panel, setPanel] = useState<Panel>("journal");
  const [formValues, setFormValues] = useState<FormState>(() => buildEmptyForm("journal"));
  const [checkpoints, setCheckpoints] = useState<CheckpointDraft[]>([{ ...emptyCheckpoint }]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [journalItems, setJournalItems] = useState<JournalRecord[]>([]);
  const [planItems, setPlanItems] = useState<PlanRecord[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryRecord[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const overviewCards = useMemo(
    () => [
      { label: t.overview[0], value: String(journalItems.length || 0), detail: t.overviewDetails[0] },
      { label: t.overview[1], value: String(planItems.length || 0), detail: t.overviewDetails[1] },
      { label: t.overview[2], value: String(galleryItems.length || 0), detail: t.overviewDetails[2] },
      { label: t.overview[3], value: language === "id" ? "Aktif" : "Live", detail: t.overviewDetails[3] },
    ],
    [galleryItems.length, journalItems.length, language, planItems.length, t],
  );

  const fetchSavedData = async () => {
    const supabase = createClient();
    setIsLoadingList(true);

    const [journalResult, planResult, galleryResult] = await Promise.all([
      supabase.from("journal_entries").select("id, title, slug, date, location, category, blurb, description, image, highlights, gallery, checkpoint_summaries").order("created_at", { ascending: false }),
      supabase.from("plans").select("id, title, date, location, description, image").order("sort_order", { ascending: true }),
      supabase.from("gallery_items").select("id, image_url, caption").order("sort_order", { ascending: true }),
    ]);

    if (!journalResult.error) setJournalItems((journalResult.data ?? []) as JournalRecord[]);
    if (!planResult.error) setPlanItems((planResult.data ?? []) as PlanRecord[]);
    if (!galleryResult.error) setGalleryItems((galleryResult.data ?? []) as GalleryRecord[]);

    if (journalResult.error || planResult.error || galleryResult.error) {
      setMessage(readableDatabaseError(journalResult.error ?? planResult.error ?? galleryResult.error, language) ?? t.databaseLoading);
    }

    setIsLoadingList(false);
  };

  useEffect(() => {
    void fetchSavedData();
  }, []);

  function setPanelData(nextPanel: Panel) {
    setPanel(nextPanel);
    setSelectedId(null);
    setMessage("");
    setFormValues(buildEmptyForm(nextPanel));
    setCheckpoints(nextPanel === "journal" ? [{ ...emptyCheckpoint }] : []);
  }

  function handleFieldChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function loadItemInEditor(item: JournalRecord | PlanRecord | GalleryRecord, nextPanel: Panel) {
    setPanelData(nextPanel);
    setSelectedId(item.id);

    if (nextPanel === "journal") {
      const journalItem = item as JournalRecord;
      setFormValues({
        title: journalItem.title,
        date: journalItem.date,
        location: journalItem.location,
        category: journalItem.category,
        image: journalItem.image,
        description: journalItem.description,
        blurb: journalItem.blurb,
      });
      const savedTitles = journalItem.highlights ?? [];
      const savedImages = journalItem.gallery ?? [];
      const savedSummaries = journalItem.checkpoint_summaries ?? [];
      const checkpointCount = Math.max(savedTitles.length, savedImages.length, savedSummaries.length, 1);
      setCheckpoints(Array.from({ length: checkpointCount }, (_, index) => ({
        title: savedTitles[index] ?? "",
        summary: savedSummaries[index] ?? "",
        image: savedImages[index] ?? "",
      })));
      return;
    }

    if (nextPanel === "plan") {
      const planItem = item as PlanRecord;
      setFormValues({
        title: planItem.title,
        date: planItem.date,
        location: planItem.location,
        image: planItem.image,
        description: planItem.description,
      });
      return;
    }

    const galleryItem = item as GalleryRecord;
    setFormValues({
      image: galleryItem.image_url,
      caption: galleryItem.caption,
    });
  }

  async function handleDelete(table: "journal_entries" | "plans" | "gallery_items", id: string) {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      setMessage(readableDatabaseError(error, language) ?? t.databaseLoading);
      return;
    }

    setMessage(t.deleteSuccess);
    await fetchSavedData();
    if (selectedId === id) {
      setSelectedId(null);
      setFormValues(buildEmptyForm(panel));
      setCheckpoints(panel === "journal" ? [{ ...emptyCheckpoint }] : []);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);

    const supabase = createClient();
    const getString = (name: string) => String(formValues[name] ?? "").trim();
    const parseJsonField = (name: string) => {
      const value = getString(name);
      if (!value) return [];
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array.");
      return parsed;
    };
    let error: { message: string } | null = null;

    try {
      if (panel === "settings") {
        const result = await supabase.from("site_settings").upsert({
          key: "homepage_copy",
          content: {
            en: {
              heroTitle: getString("enHeroTitle"),
              heroText: getString("enHeroText"),
              aboutIntro: getString("enAboutIntro"),
              aboutOne: getString("enAboutOne"),
              aboutTwo: getString("enAboutTwo"),
              contactText: getString("enContactText"),
              nextText: getString("enNextText"),
              journey: parseJsonField("enJourney"),
              signature: parseJsonField("enSignature"),
            },
            id: {
              heroTitle: getString("idHeroTitle"),
              heroText: getString("idHeroText"),
              aboutIntro: getString("idAboutIntro"),
              aboutOne: getString("idAboutOne"),
              aboutTwo: getString("idAboutTwo"),
              contactText: getString("idContactText"),
              nextText: getString("idNextText"),
              journey: parseJsonField("idJourney"),
              signature: parseJsonField("idSignature"),
            },
          },
        });
        error = result.error;
      }

      if (panel === "journal") {
        const title = getString("title");
        const image = getString("image");
        const enteredCheckpoints = checkpoints.filter((checkpoint) => checkpoint.title.trim() || checkpoint.summary.trim() || checkpoint.image.trim());
        const highlightLines = enteredCheckpoints.map((checkpoint, index) =>
          checkpoint.title.trim() || `${getString("location")} checkpoint ${index + 1}`,
        );
        const checkpointSummaries = enteredCheckpoints.map((checkpoint) => checkpoint.summary.trim());
        const checkpointImages = enteredCheckpoints.length
          ? enteredCheckpoints.map((checkpoint) => checkpoint.image.trim() || image)
          : image ? [image] : [];
        const nextSlug = selectedId ? undefined : await generateUniqueJournalSlug(supabase, title);

        const payload = {
          title,
          slug: nextSlug,
          date: getString("date"),
          location: getString("location"),
          category: getString("category") || "Journey",
          blurb: getString("blurb"),
          description: getString("description"),
          image,
          highlights: highlightLines,
          gallery: checkpointImages,
          checkpoint_summaries: checkpointSummaries,
        };

        const result = selectedId
          ? await supabase.from("journal_entries").update(payload).eq("id", selectedId)
          : await supabase.from("journal_entries").insert({ ...payload, slug: nextSlug });

        error = result.error;
      }

      if (panel === "plan") {
        const payload = {
          title: getString("title"),
          date: getString("date"),
          location: getString("location"),
          description: getString("description"),
          image: getString("image"),
        };

        const result = selectedId
          ? await supabase.from("plans").update(payload).eq("id", selectedId)
          : await supabase.from("plans").insert(payload);
        error = result.error;
      }

      if (panel === "gallery") {
        const payload = {
          image_url: getString("image"),
          caption: getString("caption"),
        };

        const result = selectedId
          ? await supabase.from("gallery_items").update(payload).eq("id", selectedId)
          : await supabase.from("gallery_items").insert(payload);
        error = result.error;
      }
    } catch (caughtError) {
      error = { message: caughtError instanceof Error ? caughtError.message : t.formInvalid };
    }

    const successMessage = selectedId
      ? t.saveSuccess
      : panel === "settings" ? t.settingsSaved
        : panel === "journal" ? t.newJournalSaved
          : panel === "plan" ? t.newPlanSaved : t.newGallerySaved;
    setMessage(readableDatabaseError(error, language) ?? successMessage);
    if (!error) {
      setSelectedId(null);
      setFormValues(buildEmptyForm(panel));
      setCheckpoints(panel === "journal" ? [{ ...emptyCheckpoint }] : []);
      await fetchSavedData();
    }
    setIsSaving(false);
  }

  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign("/admin/login");
  }

  const livePreview: { title: string; subtitle: string; description: string; image: string; location: string; date: string; category: string } =
    panel === "journal"
      ? {
          title: formValues.title || t.previewUntitled,
          subtitle: formValues.location || t.previewLocation,
          description: formValues.description || t.previewStory,
          image: formValues.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
          location: formValues.location || t.fieldLocation,
          date: formValues.date || t.previewDate,
          category: language === "id"
            ? formValues.category === "Travel" ? t.categoryTravel : formValues.category === "Reflection" ? t.categoryReflection : t.categoryJourney
            : formValues.category || t.categoryJourney,
        }
      : panel === "plan"
        ? {
            title: formValues.title || t.previewPlan,
            subtitle: formValues.location || t.previewDestination,
            description: formValues.description || t.previewPlanDescription,
            image: formValues.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
            location: formValues.location || t.fieldLocation,
            date: formValues.date || t.previewDate,
            category: t.categoryPlan,
          }
        : {
            title: t.previewMemory,
            subtitle: formValues.caption || t.previewCaption,
            description: t.previewGalleryDescription,
            image: formValues.image || "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
            location: t.tabs[3],
            date: t.newEntry,
            category: t.categoryPhoto,
          };

  const copy = panelCopy[language][panel];
  const listItems = panel === "journal" ? journalItems : panel === "plan" ? planItems : galleryItems;
  const displayedMessage = message.includes("database schema is out of date") || message.includes("Struktur database belum diperbarui")
    ? language === "id"
      ? "Struktur database belum diperbarui. Jalankan supabase-schema.sql di SQL Editor Supabase, lalu coba lagi."
      : "The database schema is out of date. Run supabase-schema.sql in the Supabase SQL Editor, then try again."
    : message.includes("This title is already in use") || message.includes("Judul ini sudah digunakan")
      ? language === "id"
        ? "Judul ini sudah digunakan. Coba judul lain sebelum menyimpan."
        : "This title is already in use. Try a different title before saving."
      : message;

  function updateCheckpoint(index: number, field: keyof CheckpointDraft, value: string) {
    setCheckpoints((current) => current.map((checkpoint, checkpointIndex) =>
      checkpointIndex === index ? { ...checkpoint, [field]: value } : checkpoint,
    ));
  }

  return (
    <main className="adminShell adminDashboard">
      <header className="adminTopbar">
        <div>
          <p className="adminKicker">{t.privateStudio}</p>
          <h1>{t.dashboardTitle}</h1>
          <p>{t.signedInAs} {email}</p>
        </div>
        <div className="adminTopbarActions">
          <LanguageSelect className="adminLanguageSelect" label={t.language} />
          <button type="button" className="adminGhostButton" onClick={signOut}>{t.signOut}</button>
        </div>
      </header>

      <section className="adminEditor">
        <div className="adminStudioIntro">
          <div>
            <p className="adminKicker">{t.contentStudio}</p>
            <h2>{copy[1]}</h2>
            <p className="adminLead">{copy[2]}</p>
          </div>
          <span className="adminStatus"><i /> {t.connected}</span>
        </div>

        <div className="adminOverview" aria-label={language === "id" ? "Ringkasan studio" : "Studio overview"}>
          {overviewCards.map((card) => (
            <div key={card.label} className="adminStatCard">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.detail}</small>
            </div>
          ))}
        </div>

        <div className="adminTabs" role="tablist" aria-label={language === "id" ? "Bagian konten" : "Content sections"}>
          <button type="button" className={panel === "settings" ? "active" : ""} onClick={() => setPanelData("settings")}>{t.tabs[0]}</button>
          <button type="button" className={panel === "journal" ? "active" : ""} onClick={() => setPanelData("journal")}>{t.tabs[1]}</button>
          <button type="button" className={panel === "plan" ? "active" : ""} onClick={() => setPanelData("plan")}>{t.tabs[2]}</button>
          <button type="button" className={panel === "gallery" ? "active" : ""} onClick={() => setPanelData("gallery")}>{t.tabs[3]}</button>
        </div>

        <div className="adminWorkspace">
          <div className="adminContentCard adminMainCard">
            <div className="adminPanelHeading">
              <div>
                <p className="adminKicker">Studio / {copy[0]}</p>
                <h3>{copy[1]}</h3>
              </div>
              <span className="adminHint">{copy[2]}</span>
            </div>

            <form className="adminForm adminEditorForm" onSubmit={handleSubmit}>
              {panel === "settings" ? (
                <>
                  <div className="adminLanguageBlock"><h3>{t.settingsLanguageNames[0]}</h3>
                    <label><span>{t.settingsLabels[0]}</span><input name="enHeroTitle" value={formValues.enHeroTitle ?? ""} onChange={handleFieldChange} required /></label>
                    <label><span>{t.settingsLabels[1]}</span><textarea name="enHeroText" value={formValues.enHeroText ?? ""} onChange={handleFieldChange} rows={4} required /></label>
                    <label><span>{t.settingsLabels[2]}</span><textarea name="enAboutIntro" value={formValues.enAboutIntro ?? ""} onChange={handleFieldChange} rows={3} required /></label>
                    <label><span>{t.settingsLabels[3]}</span><textarea name="enAboutOne" value={formValues.enAboutOne ?? ""} onChange={handleFieldChange} rows={4} required /></label>
                    <label><span>{t.settingsLabels[4]}</span><textarea name="enAboutTwo" value={formValues.enAboutTwo ?? ""} onChange={handleFieldChange} rows={4} required /></label>
                    <label><span>{t.settingsLabels[5]}</span><textarea name="enContactText" value={formValues.enContactText ?? ""} onChange={handleFieldChange} rows={3} required /></label>
                    <label><span>{t.settingsLabels[6]}</span><textarea name="enNextText" value={formValues.enNextText ?? ""} onChange={handleFieldChange} rows={3} required /></label>
                    <label><span>{t.settingsLabels[7]}</span><textarea name="enJourney" value={formValues.enJourney ?? ""} onChange={handleFieldChange} rows={6} required /></label>
                    <label><span>{t.settingsLabels[8]}</span><textarea name="enSignature" value={formValues.enSignature ?? ""} onChange={handleFieldChange} rows={5} required /></label>
                  </div>
                  <div className="adminLanguageBlock"><h3>{t.settingsLanguageNames[1]}</h3>
                    <label><span>{t.settingsLabels[0]}</span><input name="idHeroTitle" value={formValues.idHeroTitle ?? ""} onChange={handleFieldChange} required /></label>
                    <label><span>{t.settingsLabels[1]}</span><textarea name="idHeroText" value={formValues.idHeroText ?? ""} onChange={handleFieldChange} rows={4} required /></label>
                    <label><span>{t.settingsLabels[2]}</span><textarea name="idAboutIntro" value={formValues.idAboutIntro ?? ""} onChange={handleFieldChange} rows={3} required /></label>
                    <label><span>{t.settingsLabels[3]}</span><textarea name="idAboutOne" value={formValues.idAboutOne ?? ""} onChange={handleFieldChange} rows={4} required /></label>
                    <label><span>{t.settingsLabels[4]}</span><textarea name="idAboutTwo" value={formValues.idAboutTwo ?? ""} onChange={handleFieldChange} rows={4} required /></label>
                    <label><span>{t.settingsLabels[5]}</span><textarea name="idContactText" value={formValues.idContactText ?? ""} onChange={handleFieldChange} rows={3} required /></label>
                    <label><span>{t.settingsLabels[6]}</span><textarea name="idNextText" value={formValues.idNextText ?? ""} onChange={handleFieldChange} rows={3} required /></label>
                    <label><span>{t.settingsLabels[7]}</span><textarea name="idJourney" value={formValues.idJourney ?? ""} onChange={handleFieldChange} rows={6} required /></label>
                    <label><span>{t.settingsLabels[8]}</span><textarea name="idSignature" value={formValues.idSignature ?? ""} onChange={handleFieldChange} rows={5} required /></label>
                  </div>
                </>
              ) : panel === "gallery" ? (
                <>
                  <label><span>{t.galleryImage}</span><input name="image" type="url" value={formValues.image ?? ""} onChange={handleFieldChange} placeholder="https://..." required /></label>
                  <label><span>{t.galleryCaption}</span><input name="caption" value={formValues.caption ?? ""} onChange={handleFieldChange} placeholder={t.galleryCaptionPlaceholder} /></label>
                </>
              ) : (
                <>
                  <div className="adminFormGrid">
                    <label><span>{t.fieldTitle}</span><input name="title" value={formValues.title ?? ""} onChange={handleFieldChange} required /></label>
                    <label><span>{t.fieldDate}</span><input name="date" value={formValues.date ?? ""} onChange={handleFieldChange} required /></label>
                    <label><span>{t.fieldLocation}</span><input name="location" value={formValues.location ?? ""} onChange={handleFieldChange} required /></label>
                    {panel === "journal" && (
                      <label><span>{t.fieldCategory}</span>
                        <select name="category" value={formValues.category ?? "Journey"} onChange={handleFieldChange}>
                          <option value="Travel">{t.categoryTravel}</option>
                          <option value="Reflection">{t.categoryReflection}</option>
                          <option value="Journey">{t.categoryJourney}</option>
                        </select>
                      </label>
                    )}
                  </div>
                  <label><span>{t.fieldCover}</span><input name="image" type="url" value={formValues.image ?? ""} onChange={handleFieldChange} required /></label>
                  <label><span>{panel === "journal" ? t.fieldStory : t.fieldPlanDescription}</span><textarea name="description" value={formValues.description ?? ""} onChange={handleFieldChange} rows={panel === "journal" ? 7 : 5} required /></label>
                  {panel === "journal" && (
                    <>
                      <label><span>{t.fieldJournalSummary}</span><textarea name="blurb" value={formValues.blurb ?? ""} onChange={handleFieldChange} rows={3} required /></label>
                      <section className="adminCheckpoints" aria-labelledby="checkpointHeading">
                        <div className="adminCheckpointHeading">
                          <div>
                            <h4 id="checkpointHeading">{t.checkpointTitle}</h4>
                            <p>{t.checkpointHelp}</p>
                          </div>
                          <span>{checkpoints.length} {checkpoints.length === 1 ? t.checkpointSingular : t.checkpointPlural}</span>
                        </div>
                        <div className="adminCheckpointList">
                          {checkpoints.map((checkpoint, index) => (
                            <div className="adminCheckpointRow" key={index}>
                              <div className="adminCheckpointRowHeader">
                                <strong>{language === "id" ? "Titik" : "Stop"} {String(index + 1).padStart(2, "0")}</strong>
                                <button type="button" className="adminCheckpointRemove" onClick={() => setCheckpoints((current) => current.length > 1 ? current.filter((_, checkpointIndex) => checkpointIndex !== index) : current)} disabled={checkpoints.length === 1} aria-label={`${t.remove} ${index + 1}`}>
                                  {t.remove}
                                </button>
                              </div>
                              <label>
                                <span>{t.checkpointName}</span>
                                <input value={checkpoint.title} onChange={(event) => updateCheckpoint(index, "title", event.target.value)} placeholder={t.checkpointNamePlaceholder} />
                              </label>
                              <label>
                                <span>{t.checkpointSummary}</span>
                                <textarea value={checkpoint.summary} onChange={(event) => updateCheckpoint(index, "summary", event.target.value)} rows={3} placeholder={t.checkpointSummaryPlaceholder} />
                              </label>
                              <label>
                                <span>{t.galleryImage} <small>({t.optional})</small></span>
                                <input type="url" value={checkpoint.image} onChange={(event) => updateCheckpoint(index, "image", event.target.value)} placeholder={t.checkpointPhotoPlaceholder} />
                              </label>
                            </div>
                          ))}
                        </div>
                        <button type="button" className="adminCheckpointAdd" onClick={() => setCheckpoints((current) => [...current, { ...emptyCheckpoint }])}>
                          + {t.addCheckpoint}
                        </button>
                      </section>
                    </>
                  )}
                </>
              )}

              {displayedMessage && <p className={displayedMessage.includes("successfully") || displayedMessage.includes("berhasil") ? "adminMessage" : "adminError"}>{displayedMessage}</p>}
              <div className="adminActions">
                <button type="submit" className="adminButton" disabled={isSaving}>{isSaving ? t.saving : `${selectedId ? t.update : t.save} ${panel === "settings" ? t.tabs[0] : panel === "journal" ? t.tabs[1] : panel === "plan" ? t.tabs[2] : t.tabs[3]}`}</button>
              </div>
            </form>
          </div>

          <aside className="adminPreviewCard">
            <div className="adminPreviewHeader">
              <p className="adminKicker">{t.preview}</p>
              <span>{panel === "journal" ? t.previewJournal : panel === "plan" ? t.previewPlan : t.previewGallery}</span>
            </div>

            <article className="adminPreviewItem">
              <img src={livePreview.image} alt={livePreview.title} />
              <div className="adminPreviewMeta">
                <span>{livePreview.category}</span>
                <strong>{livePreview.date}</strong>
              </div>
              <h4>{livePreview.title}</h4>
              <p className="adminPreviewSubtitle">{livePreview.subtitle}</p>
              <p>{livePreview.description}</p>
            </article>

            <div className="adminListPanel">
              <div className="adminListHeader">
                <h4>{t.savedItems}</h4>
                <span>{isLoadingList ? t.loading : `${listItems.length} ${t.total}`}</span>
              </div>

              <div className="adminList">
                {listItems.length === 0 ? (
                  <p className="adminEmptyState">{t.emptyList}</p>
                ) : (
                  listItems.map((item) => {
                    if (panel === "journal") {
                      const journalItem = item as JournalRecord;
                      return (
                        <div key={journalItem.id} className="adminListItem">
                          <div>
                            <strong>{journalItem.title}</strong>
                            <small>{journalItem.location} • {journalItem.date}</small>
                          </div>
                          <div className="adminListActions">
                            <button type="button" onClick={() => loadItemInEditor(journalItem, "journal")}>{t.edit}</button>
                            <button type="button" className="danger" onClick={() => handleDelete("journal_entries", journalItem.id)}>{t.delete}</button>
                          </div>
                        </div>
                      );
                    }

                    if (panel === "plan") {
                      const planItem = item as PlanRecord;
                      return (
                        <div key={planItem.id} className="adminListItem">
                          <div>
                            <strong>{planItem.title}</strong>
                            <small>{planItem.location} • {planItem.date}</small>
                          </div>
                          <div className="adminListActions">
                            <button type="button" onClick={() => loadItemInEditor(planItem, "plan")}>{t.edit}</button>
                            <button type="button" className="danger" onClick={() => handleDelete("plans", planItem.id)}>{t.delete}</button>
                          </div>
                        </div>
                      );
                    }

                    const galleryItem = item as GalleryRecord;
                    return (
                      <div key={galleryItem.id} className="adminListItem">
                        <div className="adminThumbWrap">
                          {galleryItem.image_url ? <img src={galleryItem.image_url} alt={galleryItem.caption || t.galleryAlt} /> : null}
                        </div>
                        <div className="adminListBody">
                          <strong>{galleryItem.caption || t.untitledPhoto}</strong>
                          <small>{galleryItem.image_url.slice(0, 48)}...</small>
                        </div>
                        <div className="adminListActions">
                          <button type="button" onClick={() => loadItemInEditor(galleryItem, "gallery")}>{t.edit}</button>
                          <button type="button" className="danger" onClick={() => handleDelete("gallery_items", galleryItem.id)}>{t.delete}</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
