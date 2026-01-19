const express = require('express');
const cors = require('cors');
const CryptoJS = require('crypto-js');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Izin akses agar Frontend (Vite) bisa mengambil data
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY;

app.get('/api/sk-data', (req, res) => {
    try {
        // 1. Ambil data bersih yang tadi Anda buat
        const rawData = fs.readFileSync('./dataset_clean.json', 'utf8');

        // 2. ENKRIPSI: Data diubah menjadi kode acak AES-256
        const ciphertext = CryptoJS.AES.encrypt(rawData, SECRET_KEY).toString();

        // 3. Kirim hasil acakan ke Client
        res.json({ payload: ciphertext });
        console.log("🔒 Data dikirim dalam kondisi terenkripsi");
    } catch (error) {
        res.status(500).json({ error: "Gagal memuat data" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server Site aktif di http://localhost:${PORT}`);
});