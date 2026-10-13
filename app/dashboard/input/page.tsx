'use client';

import React, { useState, useEffect } from 'react';

export default function InputTransaksiPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  
  const [form, setForm] = useState({
    tanggal: '',
    hari: '',
    mingguKe: 'Minggu I',
    kategori: 'Mingguan',
    klasifikasi: '',
    keterangan: '',
    nominal: '',
  });

  // Ambil data dari backend Spring Boot saat halaman pertama kali dimuat
  useEffect(() => {
    fetchDataPengeluaran();
  }, []);

  const fetchDataPengeluaran = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/kencana/pengeluaran');
      if (response.ok) {
        const data = await response.json();
        setTransaksiList(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data dari server:', error);
    }
  };

  // Handler otomatis untuk mengisi nama hari berdasarkan tanggal yang dipilih
  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      // Mengambil nama hari dalam bahasa Indonesia
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const namaHari = new Intl.DateTimeFormat('id-ID', options).format(dateObj);
      
      setForm({
        ...form,
        tanggal: selectedDate,
        hari: namaHari
      });
    } else {
      setForm({ ...form, tanggal: '', hari: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tanggal || !form.keterangan || !form.nominal) return;

    try {
      const response = await fetch('http://localhost:8080/api/kencana/pengeluaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          nominal: Number(form.nominal)
        }),
      });

      if (response.ok) {
        // Ambil ulang data terbaru dari database setelah berhasil simpan
        fetchDataPengeluaran();
        // Reset form
        setForm({ tanggal: '', hari: '', mingguKe: 'Minggu I', kategori: 'Mingguan', klasifikasi: '', keterangan: '', nominal: '' });
      }
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar Lengkap dengan Menu Input Pemasukan */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
            <img src="/logo-kencana.png" alt="Kencana" className="h-8 w-auto object-contain" />
            <span className="font-extrabold text-lg text-[#240D46]">KENCANA</span>
          </div>
          <div className="p-4 space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">📊 Dashboard Output</a>
            <a href="/dashboard/input" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm shadow-md">📝 Input Transaksi</a>
            <a href="/dashboard/pemasukan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">💰 Input Pemasukan</a>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <h1 className="font-bold text-slate-800 text-lg">Formulir Rincian Pengeluaran Harian</h1>
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-800 text-sm">NK</div>
        </header>

        <main className="p-8 space-y-6 overflow-y-auto">
          {/* Form Input */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-4">Tambah Catatan Pengeluaran Baru</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tanggal</label>
                <input 
                  type="date" 
                  value={form.tanggal} 
                  onChange={handleTanggalChange}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Hari</label>
                <input 
                  type="text" 
                  placeholder="Otomatis terisi" 
                  value={form.hari} 
                  readOnly
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Minggu Ke-</label>
                <select 
                  value={form.mingguKe} onChange={(e) => setForm({...form, mingguKe: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option>Minggu I</option><option>Minggu II</option><option>Minggu III</option><option>Minggu IV</option><option>Minggu V</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Kategori</label>
                <select 
                  value={form.kategori} onChange={(e) => setForm({...form, kategori: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option>Mingguan</option><option>Bulanan</option><option>Hiburan</option><option>Bensin Mobil</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Klasifikasi</label>
                <input 
                  type="text" placeholder="Sub-kategori" value={form.klasifikasi} 
                  onChange={(e) => setForm({...form, klasifikasi: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Keterangan Barang / Keperluan</label>
                <input 
                  type="text" placeholder="Contoh: Amidis, Beras, dll" value={form.keterangan} 
                  onChange={(e) => setForm({...form, keterangan: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm" required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nominal (Rp)</label>
                <input 
                  type="number" placeholder="0" value={form.nominal} 
                  onChange={(e) => setForm({...form, nominal: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm" required 
                />
              </div>
              <div className="md:col-span-4 flex justify-end mt-2">
                <button type="submit" className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-sm shadow-md transition">
                  Simpan Transaksi +
                </button>
              </div>
            </form>
          </div>

          {/* Tabel Rincian Data */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Tabel Rincian Pengeluaran Harian (Database PostgreSQL)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs">
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Hari</th>
                    <th className="p-4">Minggu Ke-</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Klasifikasi</th>
                    <th className="p-4">Keterangan</th>
                    <th className="p-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {transaksiList.length > 0 ? (
                    transaksiList.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">{item.tanggal}</td>
                        <td className="p-4">{item.hari}</td>
                        <td className="p-4"><span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold">{item.mingguKe}</span></td>
                        <td className="p-4">{item.kategori}</td>
                        <td className="p-4">{item.klasifikasi || '-'}</td>
                        <td className="p-4 font-semibold text-slate-900">{item.keterangan}</td>
                        <td className="p-4 text-right font-bold text-purple-700">
                          Rp {Number(item.nominal).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">Belum ada data transaksi tersimpan.</td>
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