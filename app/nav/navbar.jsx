"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function NavbarLinks() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [categories, setCategories] = useState([]);

  // Kategoriya tahrirlash uchun statelar
  const [editingCat, setEditingCat] = useState(null);
  const [newCatName, setNewCatName] = useState("");

  // Standart holatda "foods"ni tanlangan deb hisoblaymiz
  const currentCategory = searchParams.get("category") || "foods";
  const API_URL = "https://safiyabekend.onrender.com";

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error("Yuklab bo'lmadi");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error("Kategoriyalarni yuklashda xato:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(token === "safiya_admin_2026_token");
    fetchCategories();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "@Safiyauz_2026@") {
      localStorage.setItem("adminToken", "safiya_admin_2026_token");
      setIsAdmin(true);
      setIsModalOpen(false);
      setPasswordInput("");
      window.location.reload();
    } else alert("Parol noto'g'ri!");
  };

  const handleLogout = () => {
    if (confirm("Chiqmoqchimisiz?")) {
      localStorage.removeItem("adminToken");
      setIsAdmin(false);
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
      {/* KATEGORIYALAR RO'YXATI */}
      <div className="flex bg-gray-100 p-1 rounded-2xl gap-1 overflow-x-auto w-full max-w-[calc(100vw-32px)] md:max-w-none no-scrollbar scroll-smooth flex-nowrap">
        {categories.map((cat) => (
          <div key={cat} className="relative flex items-center flex-shrink-0">
            <Link
              href={`/?category=${cat}`}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[12px] md:text-sm font-bold transition-all whitespace-nowrap ${
                currentCategory === cat
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-blue-400"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>

            {isAdmin && (
              <div className="relative flex items-center pr-1">
                <Link
                  href={`/kategoriyatahrirlash?name=${cat}`}
                  className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-blue-600 transition-colors"
                >
                  ⋮
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADMIN TUGMALARI VA QULF */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {isAdmin && (
          <div className="flex gap-1.5 md:gap-2">
            <Link
              href="/addnav"
              className="bg-blue-600 text-white px-3 py-2 rounded-xl font-bold text-[10px] sm:text-xs hover:bg-blue-700 transition-colors shadow-md whitespace-nowrap"
            >
              + Kategoriya
            </Link>
            <Link
              href="/addproduct"
              className="bg-green-600 text-white px-3 py-2 rounded-xl font-bold text-[10px] sm:text-xs hover:bg-green-700 transition-colors shadow-md whitespace-nowrap"
            >
              + Mahsulot
            </Link>
          </div>
        )}

        <button
          onClick={isAdmin ? handleLogout : () => setIsModalOpen(true)}
          className={`w-9 h-9 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all ${
            isAdmin
              ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          {isAdmin ? "🔓" : "🔒"}
        </button>
      </div>

      {/* LOGIN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-white p-8 rounded-[35px] shadow-2xl w-full max-w-xs text-center animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Admin Kirish
            </h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                autoFocus
                className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-blue-500 text-center text-xl tracking-widest"
                placeholder="••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-all"
                >
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-gray-500 active:scale-95 transition-all"
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
    <nav className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b px-4 sm:px-8 py-3 flex flex-col md:flex-row justify-between items-center shadow-sm gap-3 md:gap-0">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-black text-blue-600 italic tracking-tighter"
        >
          SAFIYA
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="text-xs font-bold text-gray-400 italic">
            Yuklanmoqda...
          </div>
        }
      >
        <NavbarLinks />
      </Suspense>
    </nav>
  );
}
