"use client";

import NavigationLogo from "@/app/components/layouts/navigation-logo";
import NavigationLinks from "@/app/components/layouts/navigation-links";
import NavigationMenu from "@/app/components/layouts/navigation-menu";

export default function Navigation() {
  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavigationLogo />
          <NavigationLinks />
          <NavigationMenu />
        </div>
      </div>
    </nav>
  );
}
