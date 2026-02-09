import { Request, Response } from "express";
import mongoose from "mongoose";

import crypto from 'crypto';
import Kehadiran, { IKehadiran } from "../models/kehadiran";
import KodeQR from "../models/kodeqr";
import Siswa from "../models/siswa";
import { broadcast } from "../services/socketService";

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
      // Jika Siswa tidak ditemukan, kirimkan pesan error
      return res.status(404).json({ message: "Kode QR tidak ditemukan" });
    }
    await KodeQR.findOneAndDelete({ kode })
    // Mencari Siswa berdasarkan ID
    const siswaData = await Siswa.findById(req.user.id);

    if (!siswaData) {
      // Jika Siswa tidak ditemukan, kirimkan pesan error
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    let dataKehadiran: IKehadiran

    if (jenis === 'pulang') {
      // Membuat variabel tanggal untuk awal dan akhir hari ini
      const jamMulai = new Date();
      jamMulai.setHours(0, 0, 0, 0);

      const jamAkhir = new Date();
      jamAkhir.setHours(23, 59, 59, 999);

      dataKehadiran = await Kehadiran.findOneAndUpdate({ Siswa: siswaData._id, datang: { $gte: jamMulai, $lt: jamAkhir }, pulang: { $exists: false } }, { $set: { pulang: Date.now() } }, { new: true })

    } else {
      // Membuat kehadiran baru
      const kehadiranBaru = new Kehadiran({
        Siswa: siswaData._id,
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
      .populate("Siswa", { password: 0, __v: 0, peran: 0 });

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

// Aktivitas Terbaru - menampilkan data terpisah untuk datang dan pulang
export const aktivitasTerbaru = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    // Filter berdasarkan peran pengguna (Admin lihat semua, Siswa lihat sendiri)
    const user = (req as any).user;
    let query: any = {};
    if (user && user.peran !== 'admin') {
      query.Siswa = user.id;
    }

    // Ambil kehadiran terbaru dengan data siswa
    const kehadiran = await Kehadiran.find(query, { __v: 0 })
      .sort({ datang: -1 })
      .limit(limit)
      .populate("Siswa", { password: 0, __v: 0, peran: 0 });

    // Pisahkan menjadi array aktivitas terpisah untuk datang dan pulang
    const aktivitas: any[] = [];

    kehadiran.forEach((item: any) => {
      // Tambahkan aktivitas datang
      aktivitas.push({
        _id: `${item._id}_datang`,
        Siswa: item.Siswa,
        waktu: item.datang,
        jenis: 'datang'
      });

      // Jika ada pulang, tambahkan aktivitas pulang
      if (item.pulang) {
        aktivitas.push({
          _id: `${item._id}_pulang`,
          Siswa: item.Siswa,
          waktu: item.pulang,
          jenis: 'pulang'
        });
      }
    });

    // Sort berdasarkan waktu terbaru dan ambil sesuai limit
    aktivitas.sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());
    const result = aktivitas.slice(0, limit);

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Gagal mengambil aktivitas terbaru:", error);
    res.status(500).json({ message: "Gagal mengambil aktivitas terbaru" });
  }
};

export const statistik = async (req: Request, res: Response) => {
  try {
    const periode = (req.query.periode as string) || 'weekly'; // daily, weekly, monthly
    const today = new Date();

    let startDate: Date;
    let endDate: Date;
    let groupFormat: any;
    let labels: string[] = [];
    let dataLength: number;

    if (periode === 'daily') {
      // Statistik harian (24 jam terakhir, per jam)
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);

      groupFormat = { $hour: "$datang" };
      dataLength = 24;
      labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    } else if (periode === 'monthly') {
      // Statistik bulanan (30 hari terakhir)
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);

      groupFormat = { $dayOfMonth: "$datang" };
      dataLength = 30;
      labels = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      });

    } else {
      // Statistik mingguan (default)
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(today.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      groupFormat = { $dayOfWeek: "$datang" };
      dataLength = 7;
      labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    }

    // Filter statistik berdasarkan peran pengguna
    const user = (req as any).user;
    let matchQuery: any = {
      datang: { $gte: startDate, $lte: endDate }
    };

    if (user && user.peran !== 'admin') {
      matchQuery.Siswa = new mongoose.Types.ObjectId(user.id);
    }

    const stats = await Kehadiran.aggregate([
      {
        $match: matchQuery
      },
      {
        $project: {
          timeUnit: groupFormat,
          siswaId: "$Siswa",
          hasPulang: { $cond: [{ $ifNull: ["$pulang", false] }, 1, 0] }
        }
      },
      {
        $group: {
          _id: "$timeUnit",
          uniqueSiswa: { $addToSet: "$siswaId" },
          totalDatang: { $sum: 1 },
          totalPulang: { $sum: "$hasPulang" }
        }
      },
      {
        $project: {
          _id: 1,
          count: { $size: "$uniqueSiswa" },
          datang: "$totalDatang",
          pulang: "$totalPulang"
        }
      }
    ]);

    // Initialize result arrays
    const resultData = Array(dataLength).fill(0);
    const datangData = Array(dataLength).fill(0);
    const pulangData = Array(dataLength).fill(0);

    stats.forEach(item => {
      let index: number;

      if (periode === 'daily') {
        index = item._id;
      } else if (periode === 'monthly') {
        const daysDiff = Math.floor((item._id - startDate.getDate() + 30) % 30);
        index = daysDiff;
      } else {
        // weekly
        index = item._id === 1 ? 6 : item._id - 2;
      }

      if (index >= 0 && index < dataLength) {
        resultData[index] = item.count;
        datangData[index] = item.datang;
        pulangData[index] = item.pulang;
      }
    });

    res.status(200).json({
      data: resultData,
      datang: datangData,
      pulang: pulangData,
      labels: labels,
      periode: periode
    });
  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
    res.status(500).json({ message: "Gagal mengambil statistik" });
  }
}
