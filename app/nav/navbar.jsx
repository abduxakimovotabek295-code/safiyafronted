"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NavbarLinks() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "sweets";

  return (
    <div className="flex gap-6">
      <Link
        href="/?category=sweets"
        className={`${currentCategory === "sweets" ? "text-blue-600 font-black border-b-2 border-blue-600" : "text-gray-500 font-bold"}`}
      >
        Shirinliklar
      </Link>
      <Link
        href="/?category=drinks"
        className={`${currentCategory === "drinks" ? "text-blue-600 font-black border-b-2 border-blue-600" : "text-gray-500 font-bold"}`}
      >
        Ichimliklar
      </Link>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
      <Link
        href="/"
        className="text-xl font-black text-blue-600 tracking-tighter"
      >
        SAFIYA<span className="text-gray-400">.clone</span>
      </Link>

      <Suspense fallback={<div className="text-gray-300">...</div>}>
        <NavbarLinks />
      </Suspense>

      <Link href="/addnav" className="text-2xl">
        ⚙️
      </Link>
    </nav>
  );
}
