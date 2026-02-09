"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./nav/navbar";

function HomeContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const searchParams = useSearchParams();

  // URL'dan kategoriya olish, agar bo'lmasa standart "foods" ni yuklash
  const category = searchParams.get("category") || "foods";

  const API_URL = "http://localhost:5000";

  const getApi = async () => {
    // Endi "if (!category)" sharti kerak emas, chunki u doim kamida "foods" bo'ladi
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products/${category}`);
      if (res.ok) {
        const malumot = await res.json();
        setData(Array.isArray(malumot) ? malumot : []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Yuklashda xato:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(token === "safiya_admin_2026_token");
    getApi();
  }, [category]);

  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/delete/${category}/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) {
        alert("Muvaffaqiyatli o'chirildi");
        getApi();
      } else alert("Ruxsat yo'q yoki xatolik!");
    } catch (err) {
      alert("Xatolik!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(
        `${API_URL}/update/${category}/${editingItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({
            ...editingItem,
            price: Number(editingItem.price),
          }),
        },
      );
      if (res.ok) {
        setEditingItem(null);
        getApi();
        alert("Yangilandi!");
      } else alert("Xatolik!");
    } catch (err) {
      alert("Server xatosi!");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <header className="py-14 text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">
          Safiya <span className="text-blue-600">{category}</span>
        </h1>
      </header>

      <main className="container mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {data.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[45px] p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 relative"
              >
                {isAdmin && (
                  <div className="absolute top-6 right-6 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="bg-white/90 p-2.5 rounded-2xl shadow-xl text-sm border hover:scale-110 transition-transform"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-white/90 p-2.5 rounded-2xl shadow-xl text-sm border hover:scale-110 transition-transform text-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                )}

                <div className="h-52 w-full rounded-[35px] overflow-hidden mb-5 bg-gray-100">
                  <img
                    src={item.img || "https://via.placeholder.com/300"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                </div>

                <div className="px-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {item.name}
                  </h2>
                  <p className="text-blue-600 font-black text-lg mb-2">
                    {Number(item.price).toLocaleString()} so'm
                  </p>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-6 min-h-[32px]">
                    {item.description || "Tavsif mavjud emas."}
                  </p>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-[22px] font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all uppercase text-xs tracking-wider">
                    Sotib olish
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            {category
              ? `"${category}" kategoriyasida mahsulot topilmadi.`
              : "Iltimos, kategoriya tanlang."}
          </div>
        )}
      </main>

      {/* TAHRIRLASH MODALI */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-10 rounded-[45px] w-full max-w-md space-y-4 shadow-2xl"
          >
            <h2 className="text-2xl font-black mb-4">Tahrirlash</h2>
            <input
              className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              placeholder="Nomi"
            />
            <input
              className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={editingItem.price}
              onChange={(e) =>
                setEditingItem({ ...editingItem, price: e.target.value })
              }
              placeholder="Narxi"
            />
            <input
              className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={editingItem.img}
              onChange={(e) =>
                setEditingItem({ ...editingItem, img: e.target.value })
              }
              placeholder="Rasm URL"
            />
            <textarea
              className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({ ...editingItem, description: e.target.value })
              }
              placeholder="Tavsif"
              rows="3"
            />
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold"
              >
                Saqlash
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-bold">Yuklanmoqda...</div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
