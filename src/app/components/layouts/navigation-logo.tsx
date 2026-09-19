import Image from "next/image";
import Link from "next/link";

export default function NavigationLogo() {
  return (
    <div className="flex shrink-0 items-center">
      <Link href="/dashboard">
        <Image src="/logo.png" width={80} height={30} alt="logo" />
      </Link>
    </div>
  );
}
