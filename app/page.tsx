
import FloatingChatbot from "@/components/FloatingChatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">My Website</h1>
      </div>

      <FloatingChatbot />
    </main>
  );
}