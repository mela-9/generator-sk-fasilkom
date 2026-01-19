const fs = require('fs');

// Membaca data dari dataset_raw.json
const rawData = JSON.parse(fs.readFileSync('./dataset_raw.json', 'utf8'));

const cleanData = rawData.map((item, index) => {
    const parts = item.judul ? item.judul.split('\r') : [];
    
    // Logika cerdas untuk mendeteksi apakah ini data mahasiswa lengkap atau potongan data
    const isComplete = parts.length >= 4;

    return {
        id: index + 1,
        nomor_surat: item.nomor_surat === "Surat:" ? "Nomor: .../UN9.FASILKOM/2025" : item.nomor_surat,
        program_studi: item.program_studi,
        // Jika data lengkap ambil dari split, jika tidak ambil dari field utama
        mahasiswa: {
            nama: isComplete ? parts[2] : (item.nama_mahasiswa.includes("WIB") ? "Data Tidak Lengkap" : item.nama_mahasiswa),
            nim: isComplete ? parts[3] : item.nim
        },
        detail_pelaksanaan: {
            ruang: isComplete ? parts[0] : "Menunggu Konfirmasi",
            hari_tanggal: isComplete ? parts[parts.length - 1] : item.tanggal_surat,
            jam: item.nama_mahasiswa.includes("WIB") ? item.nama_mahasiswa : "Terjadwal"
        },
        judul_ta: isComplete ? parts[4] : (item.judul || "Judul Belum Diinput"),
        tim_penguji: isComplete ? parts.slice(5, parts.length - 1) : [],
        kategori_dokumen: item.dosen_pembimbing || "SK_TIM_PENGUJI"
    };
});

// Filter hanya data yang memiliki nama mahasiswa valid (bukan judul tabel)
const finalData = cleanData.filter(d => !d.mahasiswa.nama.includes("TABEL"));

fs.writeFileSync('./dataset_clean.json', JSON.stringify(finalData, null, 2));
console.log(`✅ Sukses! ${finalData.length} data mahasiswa berhasil dirapikan.`);