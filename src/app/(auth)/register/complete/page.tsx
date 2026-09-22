import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
      <div>
        <Image src="/logo.png" width="80" height="30" alt="logo" />
      </div>
      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-8 text-center shadow-md sm:max-w-md sm:rounded-lg">
        <h1 className="text-xl font-semibold text-gray-800">登録完了</h1>
        <p className="mt-4 text-sm text-gray-600">
          アカウントの登録が完了しました。
        </p>
        <Link
          href="/posts"
          className="mt-8 inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}