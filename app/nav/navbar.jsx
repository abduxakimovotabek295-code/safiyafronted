"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // localhost:5000 o'rniga Render'dagi yangi link qo'yildi
    fetch("https://safiyabekend.onrender.com/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log("Kategoriyalar yuklanmadi"));

    const token = localStorage.getItem("adminToken");
    if (token === "safiya_admin_2026_token") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    router.push("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm py-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          href="/"
          className="text-2xl font-black text-blue-600 tracking-tighter"
        >
          SAFIYA<span className="text-gray-400">.clone</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${cat}`}
              className="text-gray-600 hover:text-blue-600 font-medium transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAdmin ? (
            <>
              <Link
                href="/addnav"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
              >
                + Qo'shish
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100"
              >
                Chiqish 🚪
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-gray-300 hover:text-blue-500 transition-all text-xl"
            >
              🔒
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
