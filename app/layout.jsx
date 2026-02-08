import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./nav/navbar"; // Navbar-ni shu yerda chaqiramiz

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Safiya Sweets Clone",
  description: "Mazali shirinliklar va ichimliklar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Navbar hamma sahifada chiqishi uchun shu yerga qo'yamiz */}
        <Navbar />

        <main className="min-h-screen">{children}</main>

        <footer className="bg-white border-t py-6 text-center text-gray-400 text-sm mt-10">
          © 2026 Safiya Clone. Barcha huquqlar himoyalangan.
        </footer>
      </body>
    </html>
  );
}
