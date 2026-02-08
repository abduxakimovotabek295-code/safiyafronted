"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NavbarLinks() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "sweets";

  // Admin rejimini yoqish funksiyasi
  const toggleAdminMode = () => {
    const token = localStorage.getItem("adminToken");

    if (token === "safiya_admin_2026_token") {
      // Agar admin yoqilgan bo'lsa, uni o'chirish (Logout mantiqi)
      localStorage.removeItem("adminToken");
      alert("Admin rejimi o'chirildi.");
      window.location.reload();
    } else {
      // Parol so'rash
      const pass = prompt("Admin parolini kiriting:");
      if (pass === "1234") {
        localStorage.setItem("adminToken", "safiya_admin_2026_token");
        alert("Admin rejimi yoqildi! Endi tahrirlashingiz mumkin.");
        window.location.reload();
      } else {
        alert("Parol noto'g'ri!");
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Kategoriyalar */}
      <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
        <Link
          href="/?category=sweets"
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            currentCategory === "sweets"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Shirinliklar
        </Link>
        <Link
          href="/?category=drinks"
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            currentCategory === "drinks"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Ichimliklar
        </Link>
      </div>

      {/* Qo'shish tugmasi (Doim ko'rinadi) */}
      <Link
        href="/addnav"
        className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
      >
        Qo'shish
      </Link>

      {/* Qulf tugmasi (Adminlikni yoqish uchun) */}
      <button
        onClick={toggleAdminMode}
        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-all border border-gray-200"
        title="Admin rejimini yoqish/o'chirish"
      >
        🔒
      </button>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center shadow-sm">
      <Link
        href="/"
        className="text-2xl font-black text-blue-600 tracking-tighter italic"
      >
        SAFIYA
      </Link>

      <Suspense fallback={<div className="text-gray-300 italic">...</div>}>
        <NavbarLinks />
      </Suspense>
    </nav>
  );
}
