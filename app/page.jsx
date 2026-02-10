"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./nav/navbar";

function HomeContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [orderItem, setOrderItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "foods";
  const API_URL = "https://safiyabekend.onrender.com";

  const getApi = async () => {
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
      console.error("API olishda xato:", error);
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

  // --- O'CHIRISH (DELETE) ---
  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/delete/${category}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Muvaffaqiyatli o'chirildi");
        getApi();
      } else alert("Xatolik: O'chirib bo'lmadi");
    } catch (err) {
      alert("Aloqa xatosi!");
    }
  };

  // --- TAHRIRLASH (PUT) ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    // Narxni raqam ekanligini tekshiramiz (NaN bo'lmasligi uchun)
    const updatedData = {
      ...editingItem,
      price: Number(editingItem.price) || 0,
    };

    try {
      const res = await fetch(
        `${API_URL}/update/${category}/${editingItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (res.ok) {
        setEditingItem(null);
        getApi();
        alert("Muvaffaqiyatli yangilandi!");
      } else {
        const errorRes = await res.json();
        alert("Xatolik: " + (errorRes.message || "Yangilab bo'lmadi"));
      }
    } catch (err) {
      alert("Server bilan aloqa uzildi!");
    }
  };

  // --- TELEGRAMGA BUYURTMA YUBORISH ---
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Narx NaN bo'lib qolmasligi uchun himoya
    const priceValue = orderItem.price ? Number(orderItem.price) : 0;

    const formData = {
      productName: orderItem.name || "Noma'lum",
      price: priceValue,
      customerName: e.target.customerName.value,
      customerPhone: e.target.customerPhone.value,
    };

    try {
      const res = await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Buyurtmangiz qabul qilindi! Botga xabar yuborildi.");
        setOrderItem(null);
      } else {
        alert("❌ Xato: " + (result.message || "Botga yuborib bo'lmadi"));
      }
    } catch (err) {
      alert(
        "⚠️ Serverda muammo! Render uyg'onayotgan bo'lishi mumkin, 30 soniyadan keyin qayta urinib ko'ring.",
      );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <header className="py-14 text-center">
        <h1 className="text-4xl font-black text-gray-900 italic uppercase">
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
                className="group bg-white rounded-[45px] p-5 shadow-sm hover:shadow-2xl transition-all border relative"
              >
                {isAdmin && (
                  <div className="absolute top-6 right-6 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="bg-white/90 p-2.5 rounded-2xl shadow-xl border hover:scale-110 transition-transform"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-white/90 p-2.5 rounded-2xl shadow-xl border hover:scale-110 transition-transform text-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                )}
                <div className="h-52 w-full rounded-[35px] overflow-hidden mb-5 bg-gray-100">
                  <img
                    src={item.img || "https://via.placeholder.com/300"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    alt={item.name}
                  />
                </div>
                <div className="px-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {item.name}
                  </h2>
                  <p className="text-blue-600 font-black text-lg mb-2">
                    {(Number(item.price) || 0).toLocaleString()} so'm
                  </p>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-6">
                    {item.description || "Tavsif mavjud emas."}
                  </p>
                  <button
                    onClick={() => setOrderItem(item)}
                    className="w-full bg-blue-600 text-white py-4 rounded-[22px] font-bold hover:bg-blue-700 transition-colors"
                  >
                    Sotib olish
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            Mahsulot topilmadi.
          </div>
        )}
      </main>

      {/* --- TAHRIRLASH MODAL --- */}
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
              required
            />
            <input
              className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={editingItem.price}
              onChange={(e) =>
                setEditingItem({ ...editingItem, price: e.target.value })
              }
              placeholder="Narxi"
              required
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
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700"
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

      {/* --- SOTIB OLISH (ORDER) MODAL --- */}
      {orderItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <form
            onSubmit={handleOrderSubmit}
            className="bg-white p-10 rounded-[45px] w-full max-w-md space-y-4 shadow-2xl"
          >
            <h2 className="text-2xl font-black text-gray-900">
              Buyurtma berish
            </h2>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="font-bold text-blue-800 text-lg">
                {orderItem.name}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                Narxi: {(Number(orderItem.price) || 0).toLocaleString()} so'm
              </p>
            </div>
            <input
              name="customerName"
              className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ismingizni kiriting"
              required
            />
            <input
              name="customerPhone"
              type="tel"
              className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Telefon raqamingiz"
              required
            />
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all"
              >
                Tasdiqlash
              </button>
              <button
                type="button"
                onClick={() => setOrderItem(null)}
                className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold"
              >
                Yopish
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
