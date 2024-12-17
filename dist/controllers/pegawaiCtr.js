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
exports.profil = exports.login = exports.semuaPegawai = exports.tambahPegawai = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pegawai_1 = __importDefault(require("../models/pegawai"));
const ruteWs_1 = require("../routes/ruteWs");
const tambahData = (nama, email, password, peran) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const passwordTerenkripsi = yield bcrypt_1.default.hash(password, salt);
    // Membuat pegawai baru
    const pegawaiBaru = new pegawai_1.default({ nama, email, password: passwordTerenkripsi, peran });
    // Menyimpan pegawai baru ke database
    yield pegawaiBaru.save();
    return pegawaiBaru;
});
const tambahPegawai = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nama, email, password, peran } = req.body;
    // Validasi data yang diterima dari request
    if (!nama || !email || !password) {
        return res.status(400).json({ message: "Nama, email dan password harus disertakan" });
    }
    try {
        // Mengecek apakah email sudah ada dalam database
        const cekEmail = yield pegawai_1.default.findOne({ email });
        if (cekEmail) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }
        // Membuat pegawai baru
        const pegawaiBaru = yield tambahData(nama, email, password, peran);
        (0, ruteWs_1.broadcast)("Pegawai");
        // Mengirimkan response dengan pegawai yang baru dibuat
        res.status(201).json(pegawaiBaru);
    }
    catch (error) {
        console.error("Gagal menambahkan pegawai:", error);
        res.status(500).json({ message: "Gagal menambahkan pegawai" });
    }
});
exports.tambahPegawai = tambahPegawai;
const semuaPegawai = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil halaman dari query parameter atau gunakan 1 sebagai default
        const halaman = parseInt(req.query.halaman) || 1;
        const dataPerHalaman = 10;
        // Menghitung jumlah total dokumen untuk menghitung jumlah halaman
        const totalDocuments = yield pegawai_1.default.countDocuments();
        const totalHalaman = Math.ceil(totalDocuments / dataPerHalaman);
        const skip = (halaman - 1) * dataPerHalaman;
        // Mengambil pegawai dari database menggunakan pagination dan mengurutkan berdasarkan tanggal secara descending
        const data = yield pegawai_1.default.find({}, { _id: 0, password: 0, __v: 0 })
            .sort({ nama: 1 })
            .skip(skip)
            .limit(dataPerHalaman);
        // Mengirimkan response dengan daftar pegawai, halaman saat ini, dan jumlah halaman
        res.status(200).json({ data, halaman, totalHalaman });
    }
    catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
        res.status(500).json({ message: "Gagal mengambil data pegawai" });
    }
});
exports.semuaPegawai = semuaPegawai;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let pegawai = yield pegawai_1.default.findOne({ email });
        if (!pegawai) {
            if (email === process.env.ADMINEMAIL && password === process.env.ADMINPASS) {
                pegawai = yield tambahData(email, email, password, 'admin');
            }
            else {
                return res.status(400).json({ message: "Email atau password salah" });
            }
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, pegawai.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email atau password salah" });
        }
        const token = jsonwebtoken_1.default.sign({ id: pegawai._id, peran: pegawai.peran }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1w",
        });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mencoba login" });
    }
});
exports.login = login;
const profil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mencari pegawai berdasarkan ID
        const pegawai = yield pegawai_1.default.findById(req.user.id, { _id: 0, password: 0, __v: 0 });
        if (!pegawai) {
            // Jika pegawai tidak ditemukan, kirimkan pesan error
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }
        return res.status(200).json({ data: pegawai });
    }
    catch (error) {
        console.error("Gagal mengambil data profil:", error);
        res.status(500).json({ message: "Gagal mengambil data profil" });
    }
});
exports.profil = profil;
//# sourceMappingURL=pegawaiCtr.js.map