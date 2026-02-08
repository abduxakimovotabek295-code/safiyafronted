import "./globals.css";

export const metadata = {
  title: "Safiya Clone",
  description: "Mazali shirinliklar va ichimliklar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className="antialiased bg-slate-50">{children}</body>
    </html>
  );
}
