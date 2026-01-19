import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, ArrowLeft, Send, GraduationCap, Eye, X, ZoomIn } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewFullSample, setViewFullSample] = useState(null); // State untuk lihat template penuh
  const [formData, setFormData] = useState({});

  // DEFINISI TEMPLATE BERDASARKAN DATASET ASLI
  const templates = [
    { 
        id: 'SK_PENGUJI', 
        title: 'SK TIM PENGUJI UJIAN KOMPREHENSIF', 
        desc: 'Format Tabel 1-3. Menampilkan daftar 4 Dosen Penguji (Ketua, Sekretaris, Anggota 1 & 2).',
        fields: ['nama', 'nim', 'judul', 'p1', 'p2', 'p3', 'p4', 'ruang', 'hari_tanggal', 'jam'],
        sampleData: {
            nomor: '0123/UN9.FASILKOM/2025',
            nama: 'Talitha Zafirah', nim: '09010582226036', 
            judul: 'APLIKASI BOOKING LAPANGAN BULUTANGKIS PLAJU DARAT',
            p1: 'Dosen Penguji 1, M.T.', p2: 'Dosen Penguji 2, M.Cs.', p3: 'Dosen Penguji 3, M.Kom.', p4: 'Dosen Penguji 4, M.IT.',
            ruang: 'LAB SISTEM INFORMASI', hari_tanggal: 'Senin, 10 November 2025', jam: '08:00 - 10:00'
        }
    },
    { 
        id: 'IZIN_KP', 
        title: 'SURAT IZIN KERJA PRAKTIK', 
        desc: 'Format Tabel 6. Permohonan izin magang ke instansi luar dengan detail Periode & Pembimbing.',
        fields: ['nama', 'nim', 'judul', 'pembimbing1', 'pembimbing2', 'tujuan', 'periode'],
        sampleData: {
            nomor: '0456/UN9.FASILKOM/2025',
            nama: 'M. Ali Royan', nim: '09010582226042', 
            tujuan: 'SMA AL-AMALUL KHAIR PALEMBANG',
            judul: 'SISTEM INFORMASI MANAJEMEN AKADEMIK SEKOLAH',
            pembimbing1: 'Dosen Pembimbing Utama, M.T.', pembimbing2: 'Dosen Pembimbing Lapangan, M.Kom.',
            periode: '1 April 2025 s.d 30 Juni 2025'
        }
    },
    { 
        id: 'AMBIL_DATA', 
        title: 'SURAT IZIN PENGAMBILAN DATA', 
        desc: 'Format Tabel 5. Permohonan resmi untuk pengambilan data riset di instansi pemerintah/swasta.',
        fields: ['nama', 'nim', 'judul', 'tujuan'],
        sampleData: {
            nomor: '0789/UN9.FASILKOM/2025',
            nama: 'Fakhri Sepriansyah', nim: '09010582226043', 
            tujuan: 'DINAS LINGKUNGAN HIDUP (DLH) KOTA PALEMBANG',
            judul: 'ANALISIS TINGKAT KEPUASAN MASYARAKAT TERHADAP LAYANAN KEBERSIHAN'
        }
    },
  ];

  const handleSelectTemplate = (temp) => {
    setSelectedTemplate(temp);
    setStep(2);
    const emptyFields = { nomor_surat: '.../UN9.FASILKOM/2025' };
    temp.fields.forEach(f => emptyFields[f] = '');
    setFormData(emptyFields);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('surat-final');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`${selectedTemplate.id}_${formData.nama || 'Surat'}.pdf`);
    });
  };

  // KOMPONEN RENDER ISI SURAT (Digunakan di Sample View & Preview Final)
  const RenderLetterContent = ({ tempId, data }) => (
    <div className="text-[14px] leading-relaxed text-justify space-y-6">
      {tempId === 'SK_PENGUJI' && (
        <>
          <p>Dekan Fakultas Ilmu Komputer menetapkan pelaksanaan ujian bagi mahasiswa:</p>
          <div className="ml-4 space-y-1">
            <p>Nama : <strong>{data.nama}</strong></p>
            <p>NIM : <strong>{data.nim}</strong></p>
            <p>Judul : <strong>"{data.judul}"</strong></p>
            <p>Jadwal : <strong>{data.hari_tanggal}, {data.jam} (Ruang {data.ruang})</strong></p>
          </div>
          <p className="font-bold underline">Susunan Tim Penguji:</p>
          <table className="w-full border-collapse border border-black text-[12px]">
            <thead className="bg-gray-100">
                <tr><th className="border border-black p-1">Jabatan</th><th className="border border-black p-1">Nama Dosen Penguji</th></tr>
            </thead>
            <tbody>
                <tr><td className="border border-black p-1">Ketua Penguji</td><td className="border border-black p-1 font-bold">{data.p1}</td></tr>
                <tr><td className="border border-black p-1">Sekretaris</td><td className="border border-black p-1 font-bold">{data.p2}</td></tr>
                <tr><td className="border border-black p-1">Anggota 1</td><td className="border border-black p-1 font-bold">{data.p3}</td></tr>
                <tr><td className="border border-black p-1">Anggota 2</td><td className="border border-black p-1 font-bold">{data.p4}</td></tr>
            </tbody>
          </table>
        </>
      )}
      {tempId === 'IZIN_KP' && (
        <>
          <p>Yth. Pimpinan <strong>{data.tujuan}</strong></p>
          <p>Kami mengajukan permohonan izin Kerja Praktik bagi mahasiswa kami:</p>
          <div className="ml-4">
            <p>Nama/NIM : <strong>{data.nama} ({data.nim})</strong></p>
            <p>Judul KP : <strong>"{data.judul}"</strong></p>
            <p>Periode : <strong>{data.periode}</strong></p>
          </div>
          <p>Atas kerjasamanya diucapkan terima kasih.</p>
        </>
      )}
      {tempId === 'AMBIL_DATA' && (
        <>
          <p>Sehubungan dengan riset Tugas Akhir mahasiswa <strong>{data.nama} ({data.nim})</strong>.</p>
          <p>Kami memohon izin kepada Bapak/Ibu pimpinan <strong>{data.tujuan}</strong> untuk memberikan akses data riset mahasiswa tersebut.</p>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans pb-20">
      <nav className="bg-[#1e293b] p-5 text-white shadow-xl mb-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3"><GraduationCap className="text-blue-400" size={30} /><h1 className="text-xl font-black tracking-widest uppercase">SIA - Generator</h1></div>
          <div className="text-[10px] bg-slate-800 px-4 py-2 rounded-full border border-slate-700 font-bold tracking-[0.2em] text-green-400 flex items-center gap-2"><ShieldCheck size={14}/> SECURITY SYSTEM</div>
        </div>
      </nav>

      <main className="container mx-auto px-4 max-w-6xl">
        {/* STEP 1: PILIH TEMPLATE DENGAN CLIKABLE PREVIEW */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="text-center mb-16"><h2 className="text-5xl font-black text-[#1e293b] mb-4">Pilih Jenis Surat</h2><p className="text-slate-500">Klik pada pratinjau surat untuk melihat layout penuh.</p></div>
            <div className="grid lg:grid-cols-3 gap-10">
              {templates.map((temp) => (
                <div key={temp.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                  {/* KLIK UNTUK LIHAT FULL */}
                  <div 
                    onClick={() => setViewFullSample(temp)}
                    className="bg-slate-100 p-8 h-64 flex justify-center items-start border-b cursor-zoom-in relative group"
                  >
                    <div className="bg-white w-full h-full shadow-lg p-4 font-serif text-[5px] origin-top group-hover:scale-105 transition-transform overflow-hidden pointer-events-none">
                        <div className="text-center border-b-[0.2px] border-black pb-1 mb-2 font-bold uppercase">Fakultas Ilmu Komputer</div>
                        <p className="text-center font-bold underline mb-2 uppercase text-[6px]">{temp.title}</p>
                        <p>Nama: {temp.sampleData.nama}</p>
                        <p>NIM: {temp.sampleData.nim}</p>
                        <div className="mt-4 border-[0.1px] border-black p-1">Contoh Layout Surat</div>
                    </div>
                    <div className="absolute inset-0 bg-[#1e293b]/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="bg-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl"><ZoomIn size={14}/> Lihat Template</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-lg font-black text-[#1e293b] mb-3 leading-tight uppercase">{temp.title}</h3>
                    <p className="text-slate-500 text-xs mb-8 flex-grow leading-relaxed">{temp.desc}</p>
                    <button onClick={() => handleSelectTemplate(temp)} className="w-full py-4 bg-[#1e293b] text-white rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2">PILIH TEMPLATE <ArrowLeft className="rotate-180" size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: FORM INPUT (Blank) */}
        {step === 2 && (
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500 max-w-4xl mx-auto">
                <div className="bg-slate-50 p-6 border-b flex items-center justify-between">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-black font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/> Kembali</button>
                    <h2 className="text-[#1e293b] font-black uppercase text-xs tracking-widest">Pengisian Data</h2>
                    <div className="w-10"></div>
                </div>
                <div className="p-10 grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Informasi Mahasiswa</label>
                        <input type="text" placeholder="Nomor Surat" className="w-full p-4 bg-slate-50 border rounded-2xl focus:border-blue-500 outline-none" value={formData.nomor_surat} onChange={(e) => setFormData({...formData, nomor_surat: e.target.value})} />
                        <input type="text" placeholder="Nama Mahasiswa" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                        <input type="text" placeholder="NIM" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({...formData, nim: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Detail Surat</label>
                        <textarea placeholder="Judul Tugas Akhir / Skripsi" className="w-full p-4 bg-slate-50 border rounded-2xl h-24" onChange={(e) => setFormData({...formData, judul: e.target.value})} />
                        {selectedTemplate.id === 'SK_PENGUJI' && (
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="Penguji 1" className="p-3 bg-slate-50 border rounded-xl" onChange={(e) => setFormData({...formData, p1: e.target.value})} />
                                <input type="text" placeholder="Penguji 2" className="p-3 bg-slate-50 border rounded-xl" onChange={(e) => setFormData({...formData, p2: e.target.value})} />
                            </div>
                        )}
                        {selectedTemplate.id === 'IZIN_KP' && (
                            <input type="text" placeholder="Instansi Tujuan" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({...formData, tujuan: e.target.value})} />
                        )}
                    </div>
                </div>
                <div className="p-10 pt-0"><button onClick={() => setStep(3)} className="w-full py-5 bg-[#1e293b] text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"><Send size={18}/> Generate Preview</button></div>
            </div>
        )}

        {/* STEP 3: PREVIEW & DOWNLOAD */}
        {step === 3 && (
            <div className="flex flex-col items-center animate-in fade-in duration-500">
                <div className="flex gap-4 mb-10"><button onClick={() => setStep(2)} className="bg-white border-2 border-[#1e293b] px-8 py-3 rounded-2xl font-black text-xs uppercase hover:bg-slate-100 transition-all">Edit Data</button><button onClick={handleDownloadPDF} className="bg-green-600 text-white px-10 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-green-700 transition-all uppercase text-xs shadow-xl shadow-green-200"><Download size={20}/> Download PDF</button></div>
                <div id="surat-final" className="bg-white p-20 w-[210mm] min-h-[297mm] shadow-2xl font-serif text-black border border-slate-200">
                    <div className="text-center border-b-4 border-double border-black pb-4 mb-10">
                        <h2 className="font-bold text-xl uppercase">Universitas Sriwijaya</h2>
                        <h3 className="font-bold text-lg uppercase">Fakultas Ilmu Komputer</h3>
                        <p className="text-[10px] italic">Indralaya, Ogan Ilir, Sumatera Selatan</p>
                    </div>
                    <div className="text-center mb-10"><h3 className="font-bold underline uppercase text-lg">{selectedTemplate.title}</h3><p className="text-sm">Nomor: {formData.nomor_surat}</p></div>
                    <RenderLetterContent tempId={selectedTemplate.id} data={formData} />
                    <div className="mt-32 text-right pr-10 text-sm">
                        <p>Indralaya, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="mt-1">Dekan,</p><div className="h-24"></div>
                        <p className="font-bold underline uppercase">Prof. Dr. Erwin, S.Si., M.T.</p>
                        <p className="text-xs">NIP. 197409222002121002</p>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL FULL VIEW UNTUK SAMPLE TEMPLATE */}
        {viewFullSample && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden flex flex-col h-[90vh] shadow-2xl">
                    <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[#1e293b] font-black uppercase text-xs tracking-widest"><FileText size={18}/> Full Preview Template</div>
                        <button onClick={() => setViewFullSample(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24}/></button>
                    </div>
                    <div className="overflow-y-auto p-12 bg-slate-200 flex-grow">
                        <div className="bg-white p-16 shadow-2xl mx-auto w-full font-serif text-black min-h-[1000px]">
                            <div className="text-center border-b-2 border-black pb-4 mb-6"><h2 className="font-bold text-lg uppercase">Fakultas Ilmu Komputer</h2><p className="text-xs italic">Contoh Kop Surat Resmi</p></div>
                            <div className="text-center mb-8 font-bold underline uppercase text-md">{viewFullSample.title}</div>
                            <RenderLetterContent tempId={viewFullSample.id} data={viewFullSample.sampleData} />
                            <div className="mt-20 text-right italic text-sm"><p>Contoh Tanda Tangan Dekan...</p></div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t flex justify-center">
                        <button onClick={() => { handleSelectTemplate(viewFullSample); setViewFullSample(null); }} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl transition-all">Gunakan Template Ini</button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;