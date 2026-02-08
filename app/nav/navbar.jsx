"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function NavbarLinks() {
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const currentCategory = searchParams.get("category") || "sweets";

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(token === "safiya_admin_2026_token");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "@Safiyauz_2026@") {
      // Parol shu yerda
      localStorage.setItem("adminToken", "safiya_admin_2026_token");
      setIsAdmin(true);
      setIsModalOpen(false);
      setPasswordInput("");
      window.location.reload();
    } else {
      alert("Parol noto'g'ri!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
        <Link
          href="/?category=sweets"
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentCategory === "sweets" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
        >
          Shirinliklar
        </Link>
        <Link
          href="/?category=drinks"
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentCategory === "drinks" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
        >
          Ichimliklar
        </Link>
      </div>

      {isAdmin && (
        <Link
          href="/addnav"
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
        >
          Qo'shish
        </Link>
      )}

      <button
        onClick={isAdmin ? handleLogout : () => setIsModalOpen(true)}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${isAdmin ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-100 border-gray-200"}`}
      >
        {isAdmin ? "🔓" : "🔒"}
      </button>

      {/* PAROL KIRITISH MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div className="bg-white p-8 rounded-[30px] shadow-2xl w-full max-w-xs animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-center">Admin Kirish</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                autoFocus
                className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-center text-lg tracking-widest"
                placeholder="••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
                >
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-gray-500"
                >
                  Yopish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center shadow-sm">
      <Link href="/" className="text-2xl font-black text-blue-600 italic">
        SAFIYA
      </Link>
      <Suspense fallback={<div>...</div>}>
        <NavbarLinks />
      </Suspense>
    </nav>
  );
}
