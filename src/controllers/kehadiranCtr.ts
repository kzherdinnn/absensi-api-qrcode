import { Request, Response } from "express";
import crypto from 'crypto';
import Kehadiran, { IKehadiran } from "../models/kehadiran";
import KodeQR from "../models/kodeqr";
import Pegawai from "../models/pegawai";
import { broadcast } from "../routes/ruteWs";

function membuatKode(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export const tampilkanKode = async (req: Request, res: Response) => {
  const kode = membuatKode(10);
  try {
    const kodeBaru = new KodeQR({ kode });

    // Menyimpan kode baru ke database
    await kodeBaru.save();

    // Mengirimkan response dengan kehadiran yang baru dibuat
    res.status(201).json({ data: kodeBaru });
  } catch (error) {
    console.error("Gagal mengambil kode:", error);
    res.status(500).json({ message: "Gagal mengambil kode" });
  }
}

export const absen = async (req: Request, res: Response) => {
  try {
    const { kode, jenis } = req.body;

    // Mencari kode 
    const dataKode = await KodeQR.findOne({ kode });

    if (!dataKode) {
      // Jika pegawai tidak ditemukan, kirimkan pesan error
      return res.status(404).json({ message: "Kode QR tidak ditemukan" });
    }
    await KodeQR.findOneAndDelete({ kode })
    // Mencari pegawai berdasarkan ID
    const pegawai = await Pegawai.findById(req.user.id);

    if (!pegawai) {
      // Jika pegawai tidak ditemukan, kirimkan pesan error
      return res.status(404).json({ message: "Pegawai tidak ditemukan" });
    }

    let dataKehadiran: IKehadiran

    if (jenis === 'pulang') {
      // Membuat variabel tanggal untuk awal dan akhir hari ini
      const jamMulai = new Date();
      jamMulai.setHours(0, 0, 0, 0);

      const jamAkhir = new Date();
      jamAkhir.setHours(23, 59, 59, 999);

      dataKehadiran = await Kehadiran.findOneAndUpdate({ pegawai: pegawai._id, datang: { $gte: jamMulai, $lt: jamAkhir }, pulang: { $exists: false } }, { $set: { pulang: Date.now() } }, { new: true })

    } else {
      // Membuat kehadiran baru
      const kehadiranBaru = new Kehadiran({
        pegawai: pegawai._id,
      });
      // Menyimpan kehadiran baru ke database
      dataKehadiran = await kehadiranBaru.save();
    }

    broadcast("Kehadiran")

    // Mengirimkan response dengan kehadiran yang baru dibuat
    res.status(201).json({ message: "Berhasil", data: dataKehadiran });
  } catch (error) {
    console.error("Gagal menambahkan kehadiran:", error);
    res.status(500).json({ message: "Gagal menambahkan kehadiran" });
  }
};

export const semuaKehadiran = async (req: Request, res: Response) => {
  try {
    // Mengambil halaman dari query params, jika tidak ada, gunakan 1 sebagai default
    const halaman = parseInt(req.query.halaman as string) || 1;

    // Menentukan jumlah data per halaman
    const dataPerHalaman = 10;

    // Menghitung jumlah data yang akan dilewati berdasarkan halaman saat ini
    const skip = (halaman - 1) * dataPerHalaman;
    // Mencari semua kehadiran dengan urutan tanggal descending dan paginasi
    const dataKehadiran = await Kehadiran.find({}, { __v: 0 })
      .sort({ datang: -1 })
      .skip(skip)
      .limit(dataPerHalaman)
      .populate("pegawai", { password: 0, __v: 0, peran: 0 });

    // Menghitung jumlah total kehadiran
    const totalData = await Kehadiran.countDocuments();
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
  } catch (error) {
    console.error("Gagal mengambil data kehadiran:", error);
    res.status(500).json({ message: "Gagal mengambil data kehadiran" });
  }
};