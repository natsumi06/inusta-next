"use client";

import NavigationLogo from "@/app/components/layouts/navigation-logo";
import NavigationLinks from "@/app/components/layouts/navigation-links";
import NavigationMenu from "@/app/components/layouts/navigation-menu";
import NavigationTabBar from "@/app/components/layouts/navigation-tab-bar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavigationUser = {
  name: string;
  image: string | null;
};

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<NavigationUser | null>(null);
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((me) => setUser(me));
  }, [pathname]);

  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-stretch justify-between gap-8 px-4 sm:justify-normal sm:px-6 lg:px-8">
          <NavigationLogo />
          <nav aria-label="メインメニュー" className="hidden grow sm:flex">
            <NavigationLinks />
          </nav>
          <NavigationMenu user={user} />
        </div>
      </header>
      <NavigationTabBar user={user} />
    </>
  );
}
