import Navigation from "@/app/components/layouts/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="pb-16 sm:pb-0">{children}</main>
    </div>
  );
}
