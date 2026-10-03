import { storyEntries, type StoryEntry } from "./storyData";
import { createClient } from "@/utils/supabase/server";

export async function getStoryEntries(): Promise<StoryEntry[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return storyEntries;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("journal_entries")
      .select("slug, title, date, location, category, blurb, description, image, highlights, gallery, checkpoint_summaries")
      .order("created_at", { ascending: false });

    if (error || !data?.length) return storyEntries;
    return data.map((entry) => ({
      ...entry,
      checkpointSummaries: entry.checkpoint_summaries ?? [],
    })) as StoryEntry[];
  } catch {
    return storyEntries;
  }
}
