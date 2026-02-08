"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../nav/navbar";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    if (!name.trim()) return alert("Nomini yozing!");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/add-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        alert("Kategoriya muvaffaqiyatli qo'shildi!");
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Xato: ${data.message || "Qo'shib bo'lmadi"}`);
      }
    } catch (err) {
      alert("Server bilan aloqa yo'q!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-[30px] shadow-xl border">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Yangi Kategoriya
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all"
            placeholder="Kategoriya nomi (masalan: Tortlar)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saqlanmoqda..." : "Kategoriyani Saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
}
