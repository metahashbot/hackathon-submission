"use client";

import { cn } from "~/lib/utils";
import { ConnectBtn } from "~/components/connect-btn";
import { usePathname } from "next/navigation";

export function Header() {
  const path = usePathname();

  return (
    <header
      className={cn(
        "fixed z-10 flex w-screen items-center justify-between overflow-x-hidden py-6 px-8",
        path === "/" ? "bg-transparent" : "bg-white shadow-sm filter",
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
          H
        </div>
        <span className="text-xl font-bold">HCSC</span>
      </div>
      <ConnectBtn />
    </header>
  );
}
