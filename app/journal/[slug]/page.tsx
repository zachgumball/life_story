import { notFound } from "next/navigation";
import { getStoryEntries } from "@/app/data/getStoryEntries";
import JournalDetailClient from "@/app/components/JournalDetailClient";

export async function generateStaticParams() {
  const storyEntries = await getStoryEntries();
  return storyEntries.map((entry) => ({ slug: entry.slug }));
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const storyEntries = await getStoryEntries();
  const entry = storyEntries.find((item) => item.slug === slug);

  if (!entry) {
    notFound();
  }

  return <JournalDetailClient entry={entry} />;
}
