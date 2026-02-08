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

  // Kategoriya tahrirlash uchun statelar (saqlab qolindi)
  const [editingCat, setEditingCat] = useState(null);
  const [newCatName, setNewCatName] = useState("");

  const currentCategory = searchParams.get("category");
  const API_URL = "http://localhost:5000";

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

  const handleDeleteCategory = async (catName) => {
    if (!confirm(`"${catName}" o'chirilsinmi? Barcha mahsulotlar ham o'chadi!`))
      return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/delete-category/${catName}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) {
        alert("O'chirildi!");
        await fetchCategories();
        router.push("/");
      }
    } catch (err) {
      alert("Xato yuz berdi");
    }
  };

  const handleUpdateCategory = async (oldName) => {
    if (!newCatName.trim()) return alert("Nom yozing");
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/update-category`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ oldName, newName: newCatName.trim() }),
      });
      if (res.ok) {
        alert("Kategoriya yangilandi!");
        setEditingCat(null);
        await fetchCategories();
        router.push(`/?category=${newCatName.trim()}`);
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } catch (err) {
      alert("Server xatosi");
    }
  };

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
    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
      {/* KATEGORIYALAR RO'YXATI - Mobil va Desktop uchun optimallashgan */}
      <div className="flex bg-gray-100 p-1 rounded-2xl gap-1 overflow-x-auto w-full max-w-[92vw] md:max-w-none no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <div key={cat} className="relative flex items-center flex-shrink-0">
            <Link
              href={`/?category=${cat}`}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-sm font-bold transition-all whitespace-nowrap ${
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
      <div className="flex items-center gap-2 ml-auto md:ml-0 self-end md:self-center">
        {isAdmin && (
          <div className="flex gap-2">
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
          className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all ${
            isAdmin
              ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          {isAdmin ? "🔓" : "🔒"}
        </button>
      </div>

      {/* TAHRIRLASH MODALI (SAQLAB QOLINDI) */}
      {editingCat && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-white p-6 rounded-[32px] shadow-2xl w-full max-w-sm animate-in zoom-in duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 mx-auto text-xl">
              ✏️
            </div>
            <h3 className="font-bold text-xl mb-4 text-center text-gray-800">
              Kategoriyani tahrirlash
            </h3>
            <input
              className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-5 outline-none focus:border-blue-500 transition-all text-center font-semibold"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              autoFocus
              placeholder="Yangi nom..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateCategory(editingCat)}
                className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Saqlash
              </button>
              <button
                onClick={() => setEditingCat(null)}
                className="flex-1 bg-gray-100 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL (SAQLAB QOLINDI) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-white p-8 rounded-[35px] shadow-2xl w-full max-w-xs text-center">
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
    <nav className="sticky top-0 z-[1000] bg-white/90 backdrop-blur-md border-b px-4 sm:px-8 py-3 md:py-4 flex flex-col md:flex-row justify-between items-center shadow-sm gap-2 md:gap-0">
      <Link
        href="/"
        className="text-xl sm:text-2xl font-black text-blue-600 italic tracking-tighter self-start md:self-auto"
      >
        SAFIYA
      </Link>
      <Suspense
        fallback={
          <div className="text-xs font-bold text-gray-400">Yuklanmoqda...</div>
        }
      >
        <NavbarLinks />
      </Suspense>
    </nav>
  );
}
