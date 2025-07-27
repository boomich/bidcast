import Header from "@/components/archived/Header";
import NoteDetails from "@/components/archived/notes/NoteDetails";
import { Id } from "@packages/backend/convex/_generated/dataModel";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="bg-[#F5F7FE] h-screen">
      <Header />
      <NoteDetails noteId={slug as Id<"notes">} />
    </main>
  );
}
