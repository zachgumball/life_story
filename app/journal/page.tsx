import { getStoryEntries } from "../data/getStoryEntries";
import JournalListClient from "../components/JournalListClient";

export default async function JournalPage() {
  const storyEntries = await getStoryEntries();
  return <JournalListClient entries={storyEntries} />;
}
