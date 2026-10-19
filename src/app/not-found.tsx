import NotFoundView from "@/app/components/pages/errors/not-found-view";

/** どの画面にも当てはまらない URL */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-base">
      <NotFoundView />
    </main>
  );
}
