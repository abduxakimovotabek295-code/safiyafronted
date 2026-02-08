"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../nav/navbar";

function AddNavContent() {
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

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0)
            setProduct((prev) => ({ ...prev, category: data[0] }));
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
        alert("Qo'shildi!");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl">
        <div className="flex gap-4 mb-6 border-b pb-2">
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
              className="w-full border p-3 rounded-xl bg-gray-50"
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
              placeholder="Nomi"
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
            <input
              className="w-full border p-3 rounded-xl"
              type="number"
              placeholder="Narxi"
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
              placeholder="Tavsif"
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-400 py-10">
            Kategoriya qo'shish funksiyasi tez orada...
          </p>
        )}
      </div>
    </div>
  );
}

export default function AddNavPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-bold">
          Yuklanmoqda...
        </div>
      }
    >
      <AddNavContent />
    </Suspense>
  );
}
