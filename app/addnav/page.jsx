"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../nav/navbar";

export default function AddNav() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("product");
  const [product, setProduct] = useState({
    name: "",
    img: "",
    price: "",
    description: "",
    category: "",
  });
  const [newCat, setNewCat] = useState("");

  // Bekend manzili
  const API_URL = "https://safiyabekend.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0)
          setProduct((prev) => ({ ...prev, category: data[0] }));
      })
      .catch((err) => console.log("Xatolik: Kategoriyalar yuklanmadi"));
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/add-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      alert("Mahsulot muvaffaqiyatli qo'shildi!");
      router.push(`/?category=${product.category}`);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/add-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCat }),
    });
    if (res.ok) {
      alert("Yangi kategoriya qo'shildi!");
      window.location.reload();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl">
        <div className="flex gap-4 mb-8 border-b pb-4">
          <button
            onClick={() => setActiveTab("product")}
            className={`flex-1 py-2 font-bold ${activeTab === "product" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
          >
            Mahsulot
          </button>
          <button
            onClick={() => setActiveTab("category")}
            className={`flex-1 py-2 font-bold ${activeTab === "category" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
          >
            Kategoriya
          </button>
        </div>

        {activeTab === "product" ? (
          <form onSubmit={addProduct} className="space-y-4">
            <select
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              className="w-full border p-3 rounded-xl"
              placeholder="Mahsulot nomi"
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
            <input
              className="w-full border p-3 rounded-xl"
              placeholder="Narxi (masalan: 25 000)"
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              required
            />
            <input
              className="w-full border p-3 rounded-xl"
              placeholder="Rasm linki"
              onChange={(e) => setProduct({ ...product, img: e.target.value })}
              required
            />
            <textarea
              className="w-full border p-3 rounded-xl"
              placeholder="Mahsulot haqida..."
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              rows="3"
            ></textarea>
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Saqlash
            </button>
          </form>
        ) : (
          <form onSubmit={addCategory} className="space-y-4">
            <input
              className="w-full border p-3 rounded-xl"
              placeholder="Yangi kategoriya nomi"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              required
            />
            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all">
              Kategoriya qo'shish
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
