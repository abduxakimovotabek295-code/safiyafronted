"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../nav/navbar";

export default function AddProductPage() {
  const router = useRouter();
  const API_URL = "http://localhost:5000";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    img: "",
    price: "",
    description: "",
    category: "",
  });

  // Kategoriyalarni olish
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) setProduct((p) => ({ ...p, category: data[0] }));
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    if (!product.category) return alert("Avval kategoriya yarating!");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...product,
          price: Number(product.price), // Narxni raqamga aylantirish shart!
        }),
      });

      if (res.ok) {
        alert("Mahsulot qo'shildi!");
        router.push(`/?category=${product.category}`);
      } else {
        const data = await res.json();
        alert(`Xato: ${data.message}`);
      }
    } catch (err) {
      alert("Server xatosi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-[30px] shadow-xl border">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
          Yangi Mahsulot
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-sm font-bold text-gray-500 ml-1">
            Kategoriya tanlang:
          </label>
          <select
            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500 bg-gray-50"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500"
            placeholder="Mahsulot nomi"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <input
            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500"
            type="number"
            placeholder="Narxi (masalan: 25000)"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
          <input
            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500"
            placeholder="Rasm linki (URL)"
            value={product.img}
            onChange={(e) => setProduct({ ...product, img: e.target.value })}
            required
          />
          <textarea
            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500"
            placeholder="Tavsif (ixtiyoriy)"
            rows="3"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          ></textarea>

          <button
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Yuklanmoqda..." : "Mahsulotni Saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
}
