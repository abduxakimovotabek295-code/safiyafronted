"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    category: "sweets", // Default kategoriya
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Onlayn bekend manzili
  const API_URL = "https://safiyabekend.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Yuborilayotgan ma'lumot:", formData);

      // Localhost o'rniga Render manzili ishlatildi
      const res = await fetch(`${API_URL}/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Mahsulot muvaffaqiyatli qo'shildi! ✅");
        // Qo'shilgandan so'ng asosiy sahifaga o'sha kategoriya bilan qaytamiz
        router.push(`/?category=${formData.category}`);
        // Ma'lumotlar yangilanishi uchun birozdan so'ng refresh qilamiz
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert("Xato: " + result.message);
      }
    } catch (error) {
      console.error("Server bilan bog'lanishda xatolik:", error);
      alert("Server onlayn emas yoki internetda uzilish bor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Yangi Mahsulot Qo'shish
        </h1>

        <div className="space-y-4">
          {/* Kategoriya tanlash */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Kategoriya
            </label>
            <select
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="sweets">Shirinliklar</option>
              <option value="foods">Taomlar</option>
              <option value="drinks">Ichimliklar</option>
              <option value="snack">Gazaklar</option>
            </select>
          </div>

          {/* Nomi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Mahsulot nomi
            </label>
            <input
              type="text"
              placeholder="Masalan: Shokoladli tort"
              required
              value={formData.name}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Rasm Linki */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Rasm URL manzili
            </label>
            <input
              type="url"
              placeholder="https://images.uz/tort.jpg"
              required
              value={formData.img}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) =>
                setFormData({ ...formData, img: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg mt-4 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            }`}
          >
            {loading ? "Qo'shilmoqda..." : "Ro'yxatga qo'shish 🚀"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full text-gray-400 font-medium py-2 hover:text-blue-600 transition-all text-sm"
          >
            ← Orqaga qaytish
          </button>
        </div>
      </form>
    </div>
  );
}
