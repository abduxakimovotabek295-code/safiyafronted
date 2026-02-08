"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../nav/navbar";

// 1. Asosiy forma qismini alohida komponentga olamiz
function AddNavForm() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("product");
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    img: "",
    price: "",
    description: "",
    category: "",
  });
  const [newCat, setNewCat] = useState("");

  const API_URL = "https://safiyabekend.onrender.com";

  // Kategoriyalarni yuklash
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error("Serverda xatolik");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0)
            setProduct((prev) => ({ ...prev, category: data[0] }));
        }
      } catch (err) {
        console.error("Kategoriyalar yuklanmadi:", err);
      }
    };
    fetchCats();
  }, []);

  // Mahsulot qo'shish
  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        alert("Mahsulot muvaffaqiyatli qo'shildi!");
        router.push(`/?category=${product.category}`);
      } else {
        alert("Xatolik yuz berdi. Ma'lumotlarni tekshiring.");
      }
    } catch (err) {
      alert("Serverga ulanishda xatolik.");
    } finally {
      setLoading(false);
    }
  };

  // Kategoriya qo'shish
  const addCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/add-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCat }),
      });
      if (res.ok) {
        alert("Yangi kategoriya qo'shildi!");
        setNewCat("");
        window.location.reload();
      }
    } catch (err) {
      alert("Kategoriya qo'shishda xatolik.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="flex gap-4 mb-8 border-b pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("product")}
            className={`flex-1 py-2 font-bold transition-all ${
              activeTab === "product"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
            }`}
          >
            Mahsulot
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("category")}
            className={`flex-1 py-2 font-bold transition-all ${
              activeTab === "category"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
            }`}
          >
            Kategoriya
          </button>
        </div>

        {activeTab === "product" ? (
          <form onSubmit={addProduct} className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
              Kategoriya tanlang
            </label>
            <select
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            >
              {categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              ) : (
                <option disabled>Kategoriyalar yo'q</option>
              )}
            </select>

            <input
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Mahsulot nomi"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
            <input
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Narxi (masalan: 25000)"
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              required
            />
            <input
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Rasm linki (URL)"
              value={product.img}
              onChange={(e) => setProduct({ ...product, img: e.target.value })}
              required
            />
            <textarea
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Mahsulot haqida..."
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              rows="3"
            ></textarea>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 shadow-lg shadow-blue-100"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </form>
        ) : (
          <form onSubmit={addCategory} className="space-y-4">
            <input
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Yangi kategoriya nomi"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all disabled:bg-gray-300 shadow-lg shadow-green-100"
            >
              {loading ? "Qo'shilmoqda..." : "Kategoriya qo'shish"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// 2. Eksport qilinadigan asosiy komponent
export default function AddNav() {
  return (
    // Har qanday "prerendering" xatosini oldini olish uchun Suspense qobig'i
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="ml-3 font-bold text-gray-500">Yuklanmoqda...</p>
        </div>
      }
    >
      <AddNavForm />
    </Suspense>
  );
}
