"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "./nav/navbar";

// Next.js da useSearchParams ishlatilganda Suspense kerak bo'lishi mumkin
function HomeContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "sweets";

  // Bekend manzili
  const API_URL = "https://safiyabekend.onrender.com";

  const getApi = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products/${category}`);
      const malumot = await res.json();
      setData(Array.isArray(malumot) ? malumot : []);
    } catch (error) {
      console.error("Ma'lumot olishda xatolik:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Adminlikni tekshirish
    const token = localStorage.getItem("adminToken");
    setIsAdmin(token === "safiya_admin_2026_token");
    getApi();
  }, [category]);

  const handleDelete = async (id) => {
    if (confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await fetch(`${API_URL}/delete/${category}/${id}`, {
          method: "DELETE",
          headers: { Authorization: token },
        });
        if (res.ok) {
          getApi();
        } else {
          alert("Sizda o'chirish uchun ruxsat yo'q!");
        }
      } catch (error) {
        alert("Serverda xatolik yuz berdi!");
      }
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
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(editingItem),
        },
      );
      if (res.ok) {
        setEditingItem(null);
        getApi();
      } else {
        alert("Xatolik yuz berdi yoki ruxsat yo'q");
      }
    } catch (error) {
      alert("Server bilan bog'lanishda xatolik!");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Navbar />

      <header className="bg-white border-b py-12 mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 capitalize italic">
          Safiya <span className="text-blue-600">{category}</span>
        </h1>
      </header>

      <main className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Yuklanmoqda...</p>
          </div>
        ) : data.length > 0 ? (
          <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border relative"
              >
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="bg-white/90 backdrop-blur p-2 rounded-xl shadow-lg text-yellow-600 hover:scale-110 transition-transform"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-white/90 backdrop-blur p-2 rounded-xl shadow-lg text-red-600 hover:scale-110 transition-transform"
                    >
                      🗑️
                    </button>
                  </div>
                )}

                <div className="h-56 overflow-hidden">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={item.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300?text=Rasm+yoq";
                    }}
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {item.name}
                  </h2>
                  <p className="text-blue-600 font-black text-lg mb-2">
                    {item.price ? `${item.price} so'm` : "Narxi ko'rsatilmadi"}
                  </p>
                  <p className="text-gray-500 text-sm mb-5 line-clamp-2 min-h-[40px]">
                    {item.description ||
                      "Mazali mahsulot, tatib ko'rishni tavsiya qilamiz!"}
                  </p>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all">
                    Sotib olish
                  </button>
                </div>
              </div>
            ))}
          </article>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-[40px] bg-white/50 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-400 mb-6">
              Hozircha mahsulotlar mavjud emas
            </h3>
            {isAdmin && (
              <button
                onClick={() => router.push("/addnav")}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                + Birinchi mahsulotni qo'shish
              </button>
            )}
          </div>
        )}
      </main>

      {/* Tahrirlash Modali */}
      {isAdmin && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-black mb-4">Tahrirlash</h2>
            <div className="space-y-3">
              <input
                className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
                placeholder="Nomi"
              />
              <input
                className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, price: e.target.value })
                }
                placeholder="Narxi"
              />
              <input
                className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={editingItem.img}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, img: e.target.value })
                }
                placeholder="Rasm Linki"
              />
              <textarea
                className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={editingItem.description || ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    description: e.target.value,
                  })
                }
                placeholder="Tavsif"
                rows="3"
              ></textarea>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                Saqlash
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex-1 bg-gray-100 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
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

// Next.js SearchParams uchun Suspense o'rash kerak
export default function Home() {
  return (
    <Suspense fallback={<div>Yuklanmoqda...</div>}>
      <HomeContent />
    </Suspense>
  );
}
