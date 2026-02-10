"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function EditCategoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catName = searchParams.get("name");
  const [newName, setNewName] = useState(catName || "");
  const [loading, setLoading] = useState(false);
  const API_URL = "https://safiyabekend.onrender.com";

  // Faqat admin kira olishini tekshirish
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token !== "safiya_admin_2026_token") {
      router.push("/");
    }
  }, [router]);

  // Tahrirlash (Nomni o'zgartirish)
  const handleUpdate = async () => {
    if (!newName.trim()) return alert("Nom yozing!");
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/update-category`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ oldName: catName, newName: newName.trim() }),
      });
      if (res.ok) {
        alert("Muvaffaqiyatli yangilandi!");
        router.push(`/?category=${newName.trim()}`);
      }
    } catch (err) {
      alert("Xato yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  // O'chirish
  const handleDelete = async () => {
    if (!confirm(`"${catName}" kategoriyasini butunlay o'chirmoqchimisiz?`))
      return;
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/delete-category/${catName}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) {
        alert("Kategoriya o'chirildi!");
        router.push("/");
      }
    } catch (err) {
      alert("Xato!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-[40px] shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-black text-center text-blue-600 mb-8 uppercase italic">
          Kategoriyani Boshqarish
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 ml-4 uppercase">
              Kategoriya Nomi
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 border-none p-5 rounded-3xl outline-none focus:ring-2 ring-blue-500 font-bold text-lg shadow-inner transition-all"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          {/* SIZ SO'RAGAN IKKITA TUGMA */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-blue-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
              {loading ? "..." : "Tahrirlash"}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 active:scale-95 transition-all"
            >
              {loading ? "..." : "O'chirish"}
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="w-full text-gray-400 font-bold text-xs uppercase mt-4 hover:text-gray-600 transition-colors"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-bold">Yuklanmoqda...</div>
      }
    >
      <EditCategoryContent />
    </Suspense>
  );
}
