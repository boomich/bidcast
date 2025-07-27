import Header from "@/components/archived/Header";
import Notes from "@/components/archived/notes/Notes";

export default function Home() {
  return (
    <main className="bg-[#EDEDED] h-screen">
      <Header />
      <Notes />
    </main>
  );
}
