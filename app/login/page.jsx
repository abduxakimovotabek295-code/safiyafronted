"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Onlayn bekend manzili
  const API_URL = "https://safiyabekend.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Localhost o'rniga Render manzili qo'yildi
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Tokenni saqlash
        localStorage.setItem("adminToken", data.token);

        // Muvaffaqiyatli xabar
        console.log("Kirish muvaffaqiyatli!");

        // Asosiy sahifaga yuborish
        router.push("/");

        // Navbar yangilanishi uchun kichik kechikish bilan sahifani qayta yuklash
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setError("Login yoki parol noto'g'ri!");
      }
    } catch (err) {
      setError(
        "Server bilan bog'lanib bo'lmadi! Bekend ishlayotganini tekshiring.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-blue-100 p-10 border border-gray-100">
        <div className="text-center mb-10">
          <Link
            href="/"
            className="text-3xl font-black text-blue-600 tracking-tighter"
          >
            SAFIYA<span className="text-gray-400">.admin</span>
          </Link>
          <p className="text-gray-400 mt-2 font-medium">
            Boshqaruv paneliga kirish
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Login
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="Admin nomini kiriting"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Parol
            </label>
            <input
              type="password"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-2xl text-center border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] mt-4"
          >
            Kirish
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-blue-600 font-bold text-sm transition-all"
          >
            ← Saytga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
