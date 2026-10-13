'use client';

import React, { useState, useEffect } from 'react';

export default function InputPemasukanPage() {
  const [pemasukanList, setPemasukanList] = useState([]);
  const [formData, setFormData] = useState({
    sumberDana: '',
    kategoriKas: 'ATM',
    nominal: '',
    tanggalPenerimaan: ''
  });

  useEffect(() => {
    // Mengatur tanggal secara aman di sisi klien untuk menghindari error prerender Docker
    setFormData(prev => ({
      ...prev,
      tanggalPenerimaan: new Date().toISOString().split('T')[0]
    }));
    fetchPemasukan();
  }, []);

  const fetchPemasukan = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/kencana/pemasukan');
      if (res.ok) {
        const data = await res.json();
        setPemasukanList(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data pemasukan:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/kencana/pemasukan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sumberDana: formData.sumberDana,
          kategoriKas: formData.kategoriKas,
          nominal: Number(formData.nominal),
          tanggalPenerimaan: formData.tanggalPenerimaan
        })
      });

      if (res.ok) {
        alert('Pemasukan berhasil disimpan!');
        setFormData({ 
          sumberDana: '', 
          kategoriKas: 'ATM', 
          nominal: '', 
          tanggalPenerimaan: new Date().toISOString().split('T')[0] 
        });
        fetchPemasukan();
      } else {
        alert('Gagal menyimpan pemasukan.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
            <span className="font-extrabold text-lg text-[#240D46]">KENCANA</span>
          </div>
          <div className="p-4 space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">📊 Dashboard Output</a>
            <a href="/dashboard/input" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">📝 Input Pengeluaran</a>
            <a href="/dashboard/pemasukan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm shadow-md">💰 Input Pemasukan</a>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <h1 className="font-bold text-slate-800 text-lg">Formulir Pemasukan & Saldo Awal</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-800 text-sm">NK</div>
          </div>
        </header>

        <main className="p-8 space-y-6 overflow-y-auto">
          {/* Form Input */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Tambah Sumber Pemasukan Baru</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Sumber Dana / Keterangan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gaji Utama, Insentif"
                  value={formData.sumberDana}
                  onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Kategori Kas</label>
                <select
                  value={formData.kategoriKas}
                  onChange={(e) => setFormData({ ...formData, kategoriKas: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ATM">ATM</option>
                  <option value="Kas Ibu">Kas Ibu</option>
                  <option value="Kas Online">Kas Online</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={formData.nominal}
                  onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition shadow-md"
                >
                  Simpan Pemasukan +
                </button>
              </div>
            </form>
          </div>

          {/* Tabel Riwayat Pemasukan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Daftar Pemasukan & Saldo Awal (Database PostgreSQL)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs border-b">
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Sumber Dana</th>
                    <th className="p-3">Kategori Kas</th>
                    <th className="p-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pemasukanList.length > 0 ? (
                    pemasukanList.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-600">{item.tanggalPenerimaan}</td>
                        <td className="p-3 font-semibold text-slate-800">{item.sumberDana}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
                            {item.kategoriKas}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600">
                          Rp {Number(item.nominal || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400">Belum ada data pemasukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}