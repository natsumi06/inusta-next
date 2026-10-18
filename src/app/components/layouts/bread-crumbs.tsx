export default function BreadCrumbs({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  /** 画面タイトルの右に置くボタン（マイページの「設定」など） */
  action?: React.ReactNode;
}) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h2 className="type-section-title font-heading font-medium text-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-sub">{description}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
