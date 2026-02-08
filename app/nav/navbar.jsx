"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get("category") || "sweets";
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menyu uchun holat

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(token === "safiya_admin_2026_token");
  }, []);

  const categories = [
    { id: "sweets", name: "Shirinliklar", emoji: "🍰" },
    { id: "drinks", name: "Ichimliklar", emoji: "🥤" },
    { id: "fastfood", name: "Fast Food", emoji: "🍔" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black text-blue-600 flex items-center gap-2"
          >
            <span className="bg-blue-600 text-white p-1 rounded-lg text-sm">
              SAFIYA
            </span>
            <span className="hidden sm:inline">Clone</span>
          </Link>

          {/* Desktop Menyu */}
          <div className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className={`text-sm font-bold transition-colors ${
                  currentCategory === cat.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {cat.emoji} {cat.name}
              </Link>
            ))}
          </div>

          {/* Admin tugmalari */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <Link
                  href="/addnav"
                  className="hidden sm:block bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  + Qo'shish
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 text-xs font-bold border border-red-200 px-3 py-2 rounded-xl"
                >
                  Chiqish
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                🔒 Admin
              </Link>
            )}

            {/* Mobile Menyu Tugmasi (Gamburger) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 focus:outline-none"
            >
              {isOpen ? "✖️" : "🍔"}
            </button>
          </div>
        </div>

        {/* Mobile Menyu (Ochildi-yopildi) */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t pt-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                onClick={() => setIsOpen(false)}
                className={`block p-3 rounded-xl font-bold ${
                  currentCategory === cat.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {cat.emoji} {cat.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/addnav"
                onClick={() => setIsOpen(false)}
                className="block p-3 bg-green-500 text-white rounded-xl font-bold text-center"
              >
                + Yangi Mahsulot Qo'shish
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
