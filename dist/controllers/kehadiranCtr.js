"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semuaKehadiran = exports.absen = exports.tampilkanKode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const kehadiran_1 = __importDefault(require("../models/kehadiran"));
const kodeqr_1 = __importDefault(require("../models/kodeqr"));
const pegawai_1 = __importDefault(require("../models/pegawai"));
const ruteWs_1 = require("../routes/ruteWs");
function membuatKode(length) {
    return crypto_1.default.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
const tampilkanKode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kode = membuatKode(10);
    try {
        const kodeBaru = new kodeqr_1.default({ kode });
        // Menyimpan kode baru ke database
        yield kodeBaru.save();
        // Mengirimkan response dengan kehadiran yang baru dibuat
        res.status(201).json({ data: kodeBaru });
    }
    catch (error) {
        console.error("Gagal mengambil kode:", error);
        res.status(500).json({ message: "Gagal mengambil kode" });
    }
});
exports.tampilkanKode = tampilkanKode;
const absen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { kode, jenis } = req.body;
        // Mencari kode 
        const dataKode = yield kodeqr_1.default.findOne({ kode });
        if (!dataKode) {
            // Jika pegawai tidak ditemukan, kirimkan pesan error
            return res.status(404).json({ message: "Kode QR tidak ditemukan" });
        }
        yield kodeqr_1.default.findOneAndDelete({ kode });
        // Mencari pegawai berdasarkan ID
        const pegawai = yield pegawai_1.default.findById(req.user.id);
        if (!pegawai) {
            // Jika pegawai tidak ditemukan, kirimkan pesan error
            return res.status(404).json({ message: "Pegawai tidak ditemukan" });
        }
        let dataKehadiran;
        if (jenis === 'pulang') {
            // Membuat variabel tanggal untuk awal dan akhir hari ini
            const jamMulai = new Date();
            jamMulai.setHours(0, 0, 0, 0);
            const jamAkhir = new Date();
            jamAkhir.setHours(23, 59, 59, 999);
            dataKehadiran = yield kehadiran_1.default.findOneAndUpdate({ pegawai: pegawai._id, datang: { $gte: jamMulai, $lt: jamAkhir }, pulang: { $exists: false } }, { $set: { pulang: Date.now() } }, { new: true });
        }
        else {
            // Membuat kehadiran baru
            const kehadiranBaru = new kehadiran_1.default({
                pegawai: pegawai._id,
            });
            // Menyimpan kehadiran baru ke database
            dataKehadiran = yield kehadiranBaru.save();
        }
        (0, ruteWs_1.broadcast)("Kehadiran");
        // Mengirimkan response dengan kehadiran yang baru dibuat
        res.status(201).json({ message: "Berhasil", data: dataKehadiran });
    }
    catch (error) {
        console.error("Gagal menambahkan kehadiran:", error);
        res.status(500).json({ message: "Gagal menambahkan kehadiran" });
    }
});
exports.absen = absen;
const semuaKehadiran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mengambil halaman dari query params, jika tidak ada, gunakan 1 sebagai default
        const halaman = parseInt(req.query.halaman) || 1;
        // Menentukan jumlah data per halaman
        const dataPerHalaman = 10;
        // Menghitung jumlah data yang akan dilewati berdasarkan halaman saat ini
        const skip = (halaman - 1) * dataPerHalaman;
        // Mencari semua kehadiran dengan urutan tanggal descending dan paginasi
        const dataKehadiran = yield kehadiran_1.default.find({}, { __v: 0 })
            .sort({ datang: -1 })
            .skip(skip)
            .limit(dataPerHalaman)
            .populate("pegawai", { password: 0, __v: 0, peran: 0 });
        // Menghitung jumlah total kehadiran
        const totalData = yield kehadiran_1.default.countDocuments();
        const totalHalaman = Math.ceil(totalData / dataPerHalaman);
        // Mengirimkan response dengan data kehadiran dan informasi paginasi
        res.status(200).json({
            kehadiran: dataKehadiran,
            halamanInfo: {
                halaman,
                totalHalaman,
                totalData,
            },
        });
    }
    catch (error) {
        console.error("Gagal mengambil data kehadiran:", error);
        res.status(500).json({ message: "Gagal mengambil data kehadiran" });
    }
});
exports.semuaKehadiran = semuaKehadiran;
//# sourceMappingURL=kehadiranCtr.js.map