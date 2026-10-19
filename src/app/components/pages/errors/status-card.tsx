import Image from "next/image";

/** 404・エラーで使う、イラストつきのまんなかのカード */
export default function StatusCard({
  label,
  title,
  children,
  actions,
}: {
  label?: string;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[560px] flex-col items-center gap-3.5 rounded-[20px] border border-line bg-white px-6 pb-10 pt-8 text-center sm:px-12 sm:pb-11 sm:pt-10">
        <Image
          src="/illustrations/dog-walk.png"
          alt=""
          width={150}
          height={150}
          className="h-auto w-[120px] mix-blend-multiply sm:w-[150px]"
        />
        {label && (
          <p className="text-[13px] font-bold tracking-[0.08em] text-sub">
            {label}
          </p>
        )}
        <h1 className="font-heading text-2xl font-medium sm:text-[28px]">
          {title}
        </h1>
        <p className="text-[15px] leading-[1.8] text-sub">{children}</p>
        <div className="mt-3 flex w-full flex-col items-center gap-2.5">
          {actions}
        </div>
      </div>
    </div>
  );
}

export const primaryButtonClassName =
  "inline-flex h-[52px] w-full max-w-[260px] items-center justify-center rounded-full bg-ink px-8 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none";

export const subButtonClassName =
  "inline-flex h-[52px] w-full max-w-[260px] items-center justify-center rounded-full border-2 border-[#e0dfd8] bg-white px-8 text-[15px] font-bold text-sub";
