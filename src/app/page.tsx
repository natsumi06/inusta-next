import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "inusta｜みんなの愛犬写真",
  description:
    "愛犬の写真をシェアするアプリ。フォローはいりません。みんなの新着投稿がゆるく流れてきます。",
};

const FEATURES = [
  {
    icon: "eye",
    label: "1　見る",
    title: "みんなの写真が流れてくる",
    text: "フォローはいりません。ホームを開けば、みんなの新着投稿が新しい順に並びます。",
  },
  {
    icon: "image",
    label: "2　のせる",
    title: "愛犬の写真をのせよう",
    text: "写真を1枚選んで、キャプションを書くだけ。うちの子のかわいい瞬間をシェアしよう。",
  },
  {
    icon: "chat",
    label: "3　話す",
    title: "コメントで話そう",
    text: "「かわいい！」のひとことから、わんとも同士のゆるい交流がはじまります。",
  },
] as const;

const MOCK_POSTS = [
  { photo: "/dogs/dog_1.jpg", user: "mocha", time: "5分前" },
  { photo: "/dogs/dog_2.jpg", user: "koro", time: "1時間前" },
  { photo: "/dogs/dog_3.jpg", user: "hana", time: "3時間前" },
  { photo: "/dogs/dog_4.jpg", user: "sora", time: "昨日" },
  { photo: "/dogs/dog_5.jpg", user: "kuro", time: "2日前" },
  { photo: "/dogs/dog_6.jpg", user: "momo", time: "3日前" },
] as const;

function FeatureIcon({ name }: { name: (typeof FEATURES)[number]["icon"] }) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  return (
    <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-soft">
      <svg className="size-[26px]" {...common}>
        {name === "eye" && (
          <>
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
        {name === "image" && (
          <>
            <rect x="3" y="5" width="18" height="15" rx="3" />
            <circle cx="9" cy="11" r="2" />
            <path d="m21 16-5-5-9 9" />
          </>
        )}
        {name === "chat" && (
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.4A8 8 0 1 1 21 12z" />
        )}
      </svg>
    </span>
  );
}

/** 今のナビとホームを小さく再現したイメージ（スクリーンショットの代わり） */
function HomeMock() {
  return (
    <div
      role="img"
      aria-label="ホーム画面のイメージ"
      className="w-full overflow-hidden rounded-[26px] border-2 border-ink bg-base shadow-cheek md:w-[540px] md:rounded-[14px]"
    >
      <div className="hidden h-10 items-center gap-4 border-b border-line bg-white px-4 md:flex">
        <Image src="/logo.png" alt="" width={80} height={30} className="h-3.5 w-auto" />
        <span className="ml-6 border-b-2 border-ink py-2 text-[10px] font-bold">
          ホーム
        </span>
        <span className="text-[10px] text-sub">ユーザー一覧</span>
        <span className="ml-auto rounded-full bg-ink px-2.5 py-1 text-[9px] font-bold text-white shadow-cheek">
          ＋ 投稿する
        </span>
      </div>
      <div className="flex justify-center border-b border-line bg-white py-2.5 md:hidden">
        <Image src="/logo.png" alt="" width={80} height={30} className="h-3.5 w-auto" />
      </div>
      <div className="px-2.5 py-2 md:px-4 md:py-3.5">
        <p className="mb-1.5 font-heading text-xs md:mb-2.5 md:text-[15px]">
          ホーム{" "}
          <span className="font-sans text-[9px] text-sub">わんともの新着投稿</span>
        </p>
        <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-2.5">
          {MOCK_POSTS.map((post, index) => (
            <div
              key={post.user}
              className={
                index >= 4
                  ? "hidden overflow-hidden rounded-[10px] border border-line bg-white md:block"
                  : "overflow-hidden rounded-[10px] border border-line bg-white"
              }
            >
              <div className="relative h-[92px] md:h-[120px]">
                <Image
                  src={post.photo}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <span className="size-3.5 rounded-full border border-ink bg-soft" />
                <span className="text-[10px] font-bold">{post.user}</span>
                <span className="ml-auto text-[9px] text-sub">{post.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-10 items-center justify-around border-t border-line bg-white text-[8px] font-bold md:hidden">
        <span className="rounded-full bg-soft px-2 py-0.5">ホーム</span>
        <span className="text-sub">ユーザー</span>
        <span className="-mt-2.5 size-[26px] rounded-full bg-ink shadow-cheek" />
        <span className="text-sub">マイページ</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-dvh bg-base font-sans text-ink">
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <Image
          src="/logo.png"
          alt="inusta"
          width={80}
          height={30}
          className="h-[26px] w-auto md:h-[30px]"
        />
        <div className="flex items-center gap-2.5 md:gap-3">
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-full border-2 border-ink bg-white px-4 text-[13px] font-bold transition hover:bg-soft md:h-10 md:px-5 md:text-sm"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none md:h-10 md:px-7 md:text-[15px]"
          >
            新規登録
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-[1120px] flex-col gap-8 px-6 pb-14 pt-6 md:flex-row md:items-center md:gap-14 md:px-10 md:pb-18 md:pt-12">
        <div className="flex flex-col gap-5 md:flex-1">
          <h1 className="font-heading text-[30px] font-medium leading-[1.5] md:text-[44px]">
            みんなの愛犬が、
            <br />
            ゆるく流れてくる。
          </h1>
          <p className="text-[15px] leading-[1.85] md:text-[16px] md:leading-[1.9]">
            愛犬の写真をシェアするアプリです。
            <br />
            会員みんながフォロワー（わんとも）です。
          </p>
          <div className="flex flex-col gap-3 md:mt-2 md:items-start">
            <Link
              href="/register"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-ink px-10 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none md:w-auto"
            >
              無料ではじめる
            </Link>
            <p className="text-center text-sm text-sub md:text-left">
              アカウントをお持ちの方は{" "}
              <Link
                href="/login"
                className="font-bold text-ink underline underline-offset-[3px]"
              >
                ログイン
              </Link>
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <HomeMock />
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-[1120px] px-6 py-14 md:px-10 md:py-16">
          <h2 className="text-center font-heading text-2xl font-medium md:text-[30px]">
            inusta でできること
          </h2>
          <p className="mb-8 mt-2 text-center text-sm text-sub md:mb-9 md:text-[15px]">
            見る・のせる・話す。たったこれだけ。
          </p>
          <ul className="flex flex-col gap-3 rounded-3xl bg-base p-3 md:flex-row md:gap-5 md:p-5">
            {FEATURES.map((feature) => (
              <li
                key={feature.label}
                className="flex flex-1 items-start gap-3.5 rounded-[18px] border border-line bg-white p-5 md:flex-col md:gap-2.5 md:rounded-[20px] md:p-7"
              >
                <FeatureIcon name={feature.icon} />
                <div className="flex flex-col gap-1 md:gap-2.5">
                  <p className="text-xs font-bold text-sub md:mt-1.5 md:text-[13px]">
                    {feature.label}
                  </p>
                  <h3 className="font-heading text-[17px] font-medium leading-normal md:text-xl md:leading-[1.5]">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] leading-[1.75] text-sub md:text-sm md:leading-[1.8]">
                    {feature.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1120px] flex-col items-center gap-3 px-6 pb-14 pt-14 text-center md:px-10 md:pb-14 md:pt-16">
        <Image
          src="/illustrations/dog-walk.png"
          alt=""
          aria-hidden="true"
          width={335}
          height={180}
          className="mb-1 h-auto w-[200px] mix-blend-multiply md:w-60"
        />
        <h2 className="font-heading text-[22px] font-medium md:text-[28px]">
          さっそく、わんともになろう
        </h2>
        <p className="text-sm text-sub md:text-[15px]">わんわんわん</p>
        <Link
          href="/register"
          className="mt-3 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-ink px-10 text-[16px] font-bold text-white shadow-cheek transition hover:translate-y-px hover:shadow-none md:w-auto"
        >
          無料ではじめる
        </Link>
      </section>

      <footer className="border-t border-line px-6 py-6 text-center text-xs text-sub">
        © inusta
      </footer>
    </main>
  );
}
