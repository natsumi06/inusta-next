"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  name: string;
  image: string | null;
};

export default function NavigationMenu() {
  const passName = usePathname();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((me) => setUser(me));
  }, [passName]);
  return (
    <div className="relative inline-flex items-center sm:ms-6">
      <Link
        href="/dashboard"
        className="group inline-flex items-center rounded-md border border-transparent bg-white px-5 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
      >
        {user?.image && (
          <Image
            className="mr-1 block aspect-square size-8 rounded-full border border-pink-500 object-cover transition duration-150 group-hover:brightness-75"
            src={user.image}
            width={90}
            height={90}
            alt="user logo"
          />
        )}
        <div className="transition-colors group-hover:text-gray-700">{user?.name}</div>
      </Link>
    </div>
  );
}
