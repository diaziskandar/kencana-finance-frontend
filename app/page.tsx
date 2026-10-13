'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// SVG Logo Daun kecil untuk card di sebelah kiri
const LeftLeafIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21V11M12 11C9 11 6 8 6 5C9 5 12 8 12 11ZM12 11C15 11 18 8 18 5C15 5 12 8 12 11Z" stroke="url(#paintL_linear)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="paintL_linear" x1="6" y1="5" x2="18" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D4AF37"/>
        <stop offset="1" stopColor="#4A154B"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi hardcode sesuai permintaan
    if (email === 'aditian@gmail.com' && password === '12345678') {
      router.push('/dashboard');
    } else {
      setErrorMsg('Email atau kata sandi salah! Gunakan aditian@gmail.com / 12345678');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      
      {/* ================= KOLOM KIRI ================= */}
      <div className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-[#2D1155] via-[#4A154B] to-[#C99130]">
        {/* Garis Grid Latar Belakang */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', 
            backgroundSize: '48px 48px' 
          }}
        ></div>

        {/* Card Lilac / Ungu Muda dengan Font Diperbesar */}
        <div className="relative z-10 bg-[#DED5EB] rounded-3xl p-12 w-full max-w-[460px] shadow-2xl">
          <div className="mb-6">
            <LeftLeafIcon />
          </div>
          
          <h1 className="text-[3.25rem] font-extrabold leading-[1.1] text-[#2B104A] mb-5 tracking-tight">
            Tumbuh<br />
            Bersama<br />
            <span className="text-[#CA9B22]">Kencana</span>
          </h1>
          
          <p className="text-[#3A1F5D] text-base leading-relaxed mt-6 font-medium">
            Mencatat hari ini, mengamankan<br />
            masa depan keluarga kecil Anda.
          </p>
        </div>
      </div>

      {/* ================= KOLOM KANAN ================= */}
      <div className="flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="w-full max-w-[400px]">
          
          {/* Logo Utama di Sisi Kanan (Diperbesar ukurannya) */}
          <div className="flex items-center gap-3.5 mb-8">
            <img src="/logo-kencana.png" alt="Logo Kencana" className="h-16 w-auto object-contain" />
          </div>

          <h2 className="text-[1.85rem] font-bold text-slate-900 mb-2 tracking-tight">
            Selamat Datang, Keluarga! 👋
          </h2>
          <p className="text-[14px] text-slate-500 mb-6 leading-relaxed pr-4">
            Silakan masuk untuk mengelola keuangan<br/>keluarga Anda hari ini.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Email */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@emailkeluarga.com"
                className="w-full px-4 py-3.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#4A154B] focus:ring-1 focus:ring-[#4A154B] text-sm text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#4A154B] focus:ring-1 focus:ring-[#4A154B] text-sm text-slate-900 placeholder:text-slate-400"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#4A154B] focus:ring-0" />
                <span className="text-slate-600 font-medium">Ingat Saya</span>
              </label>
              <a href="#" className="text-[#4A154B] hover:underline font-semibold">Lupa Kata Sandi?</a>
            </div>

            {/* Button Gradient */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#2D1155] via-[#4A154B] to-[#C99130] text-white font-medium text-[15px] hover:opacity-90 transition shadow-md"
            >
              Masuk Sekarang
            </button>
          </form>

          {/* Social Icons & Footer */}
          <div className="mt-8 text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">G</div>
              <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">git</div>
              <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">f</div>
              <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer pb-1">...</div>
            </div>

            <p className="text-[13px] text-slate-500">
              Belum punya akun keluarga? <a href="#" className="text-[#4A154B] font-semibold hover:underline">Daftar Sekarang</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}