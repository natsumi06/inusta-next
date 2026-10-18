import { Kiwi_Maru, Zen_Kaku_Gothic_New } from "next/font/google";

// 日本語フォントは文字の範囲ごとに細かいファイルに分かれていて、ページで使った文字の分だけ読み込まれる。
// 先読み（preload）すると全部を読みにいってしまうので切っておく。
// 太さを1つ足すとファイルが100個以上増えるので、docs/design.md の「文字」にある太さだけにする。
export const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const kiwiMaru = Kiwi_Maru({
  variable: "--font-kiwi-maru",
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
