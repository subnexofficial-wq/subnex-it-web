
"use client"


import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";



export default function PublicLayout({ children }) {
  return (
    <>
      {/* 🌐 Public Navbar */}
      <Navbar />

      {/* 📄 Page Content */}
      <main className="min-h-[calc(100vh-120px)]">
        {children}
      </main>

      {/* 🔻 Public Footer */}
      <Footer />
    </>
  );
}
