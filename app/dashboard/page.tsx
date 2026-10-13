'use client';

import React, { useState, useEffect } from 'react';

export default function DashboardOutputPage() {
  const [anggaranList, setAnggaranList] = useState([]);
  const [asetEmasList, setAsetEmasList] = useState([]);
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [pemasukanList, setPemasukanList] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resAnggaran, resAset, resPengeluaran, resPemasukan] = await Promise.all([
        fetch('http://localhost:8080/api/kencana/anggaran'),
        fetch('http://localhost:8080/api/kencana/aset-emas'),
        fetch('http://localhost:8080/api/kencana/pengeluaran'),
        fetch('http://localhost:8080/api/kencana/pemasukan')
      ]);

      if (resAnggaran.ok) setAnggaranList(await resAnggaran.json());
      if (resAset.ok) setAsetEmasList(await resAset.json());
      if (resPengeluaran.ok) setPengeluaranList(await resPengeluaran.json());
      if (resPemasukan.ok) setPemasukanList(await resPemasukan.json());
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // Hitung total saldo awal dari tabel pemasukan database
  const saldoAwal = pemasukanList.reduce((acc, item: any) => acc + Number(item.nominal || 0), 0);

  // Hitung khusus Kas Ibu dari tabel pemasukan (berdasarkan kategori_kas)
  const kasIbuObj: any = pemasukanList.find((item: any) => item.kategoriKas === 'Kas Ibu');
  const kasIbu = kasIbuObj ? Number(kasIbuObj.nominal || 0) : 2095325;

  const totalRealisasi = pengeluaranList.reduce((acc, item: any) => acc + Number(item.nominal || 0), 0);
  const sisaSaldo = (saldoAwal > 0 ? saldoAwal : 10000000) - totalRealisasi;

  const hitungTotalMingguan = (minggu: string) => {
    return pengeluaranList
      .filter((item: any) => item.mingguKe === minggu)
      .reduce((acc, item: any) => acc + Number(item.nominal || 0), 0);
  };

  const belanjaMingguan = anggaranList.filter((item: any) => item.jenisAnggaran === 'Mingguan');
  const belanjaBulanan = anggaranList.filter((item: any) => item.jenisAnggaran === 'Bulanan');

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between print:hidden">
        <div>
          <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
            <img src="/logo-kencana.png" alt="Kencana" className="h-8 w-auto object-contain" />
            <span className="font-extrabold text-lg text-[#240D46]">KENCANA</span>
          </div>
          <div className="p-4 space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm shadow-md">📊 Dashboard Output</a>
            <a href="/dashboard/input" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">📝 Input Transaksi</a>
            <a href="/dashboard/pemasukan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">💰 Input Pemasukan</a>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 print:hidden">
          <h1 className="font-bold text-slate-800 text-lg">Rekapitulasi Anggaran & Aset Keluarga</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-md flex items-center gap-1.5"
            >
              📥 Download Laporan PDF
            </button>
            <a href="/dashboard/input" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition">+ Input Pengeluaran</a>
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-800 text-sm">NK</div>
          </div>
        </header>

        <main className="p-8 space-y-6 overflow-y-auto">
          
          {/* Baris Ringkasan Saldo & Kas (Ditarik dari tabel database) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Awal & Pemasukan</p>
              <h3 className="text-2xl font-extrabold text-slate-900">Rp {(saldoAwal > 0 ? saldoAwal : 10000000).toLocaleString('id-ID')}</h3>
              <p className="text-xs text-slate-500 mt-2">Gaji & Insentif Bulanan</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pengeluaran Realisasi</p>
              <h3 className="text-2xl font-extrabold text-rose-600">Rp {totalRealisasi.toLocaleString('id-ID')}</h3>
              <p className="text-xs text-slate-500 mt-2">Akumulasi Bulan Berjalan</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Sisa Saldo Akhir</p>
              <h3 className="text-2xl font-extrabold text-emerald-600">Rp {sisaSaldo.toLocaleString('id-ID')}</h3>
              <p className="text-xs text-slate-500 mt-2">Kas ATM & Lainnya</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Uang Kas (Kas Ibu)</p>
              <h3 className="text-2xl font-extrabold text-purple-700">Rp {kasIbu.toLocaleString('id-ID')}</h3>
              <p className="text-xs text-slate-500 mt-2">Alokasi Kas Pegangan Ibu</p>
            </div>
          </div>

          {/* Grid Tabel Rekapitulasi Utama */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tabel Belanja Mingguan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">#2 Belanja Mingguan</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs border-b">
                      <th className="p-3">Minggu</th>
                      <th className="p-3">POS (Anggaran)</th>
                      <th className="p-3">Realisasi</th>
                      <th className="p-3 text-right">Sisa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {belanjaMingguan.length > 0 ? (
                      belanjaMingguan.map((item: any) => {
                        const realisasiMinggu = hitungTotalMingguan(item.namaPos);
                        const posNom = Number(item.posNominal || 0);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold">{item.namaPos}</td>
                            <td className="p-3">Rp {posNom.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-rose-600">Rp {realisasiMinggu.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-right font-bold text-slate-800">
                              Rp {(posNom - realisasiMinggu).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      ['Minggu I', 'Minggu II', 'Minggu III', 'Minggu IV', 'Minggu V'].map((m, idx) => {
                        const realisasiMinggu = hitungTotalMingguan(m);
                        const posAnggaran = 250000;
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold">{m}</td>
                            <td className="p-3">Rp {posAnggaran.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-rose-600">Rp {realisasiMinggu.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-right font-bold text-slate-800">
                              Rp {(posAnggaran - realisasiMinggu).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel Belanja Bulanan (Tetap) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">#3 Belanja Bulanan (Tetap)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs border-b">
                      <th className="p-3">Barang</th>
                      <th className="p-3">POS</th>
                      <th className="p-3">Realisasi</th>
                      <th className="p-3 text-right">Sisa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {belanjaBulanan.length > 0 ? (
                      belanjaBulanan.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">{item.namaPos}</td>
                          <td className="p-3">Rp {Number(item.posNominal || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3 text-rose-600">Rp {Number(item.realisasiNominal || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3 text-right font-bold">
                            Rp {(Number(item.posNominal || 0) - Number(item.realisasiNominal || 0)).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400">Memuat data anggaran...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Baris Bawah: Total Mingguan & Aset Emas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tabel Total Mingguan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">TOTAL MINGGUAN</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs border-b">
                      <th className="p-3">TOTAL</th>
                      <th className="p-3 text-right">MINGGUAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {['Minggu I', 'Minggu II', 'Minggu III', 'Minggu IV', 'Minggu V'].map((m, idx) => {
                      const totalMinggu = hitungTotalMingguan(m);
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">{m}</td>
                          <td className="p-3 text-right font-bold text-purple-700">
                            Rp {totalMinggu.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Portofolio Aset Emas & Aruni */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">Aset Emas & Aset Emas Aruni</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-2 text-xs font-bold text-slate-600 border-b">Aset Emas</div>
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-100">
                      {['DINAR', 'EMAS #1', 'EMAS #2', 'EMAS #3', 'EMAS #4'].map((item, idx) => {
                        const found: any = asetEmasList.find((a: any) => a.namaAset?.toLowerCase() === item.toLowerCase());
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-semibold text-slate-700">{item}</td>
                            <td className="p-2.5 text-right font-bold text-amber-700">
                              {found ? found.jumlahOrBerat : 'Rp 0'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-2 text-xs font-bold text-slate-600 border-b">Aset Emas Aruni</div>
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-100">
                      {['#1 Gelang', '#2 Anting', '#3 Cincin', '#4 Anting', '#5 Anting'].map((item, idx) => {
                        const labelKey = `Emas Aruni ${item}`;
                        const found: any = asetEmasList.find((a: any) => a.namaAset?.toLowerCase().includes(item.toLowerCase()));
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-semibold text-slate-700">{labelKey}</td>
                            <td className="p-2.5 text-right font-bold text-purple-700">
                              {found ? found.jumlahOrBerat : 'Rp 0'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}