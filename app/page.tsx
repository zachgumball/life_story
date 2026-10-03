import StoryClient from "./components/StoryClient";
import { getStoryEntries } from "./data/getStoryEntries";
import { getHomepageData } from "./data/getHomepageData";

export default async function Home() {
  const [entries, homepageData] = await Promise.all([getStoryEntries(), getHomepageData()]);
  return <StoryClient entries={entries} homepageData={homepageData} />;
}
