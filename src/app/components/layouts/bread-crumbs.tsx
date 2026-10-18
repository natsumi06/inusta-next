export default function BreadCrumbs({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <h2 className="type-section-title font-heading font-medium text-ink">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-sub">{description}</p>}
      </div>
    </header>
  );
}
