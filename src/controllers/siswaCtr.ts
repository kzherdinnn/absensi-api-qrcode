import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Siswa from "../models/siswa";
import { broadcast } from "../services/socketService";

const tambahData = async (nama: string, email: string, password: string, peran: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordTerenkripsi = await bcrypt.hash(password, salt);

  // Membuat Siswa baru
  const SiswaBaru = new Siswa({ nama, email, password: passwordTerenkripsi, peran });

  // Menyimpan Siswa baru ke database
  await SiswaBaru.save();
  return SiswaBaru
}

export const tambahSiswa = async (req: Request, res: Response) => {
  const { nama, email, password, peran } = req.body;

  // Validasi data yang diterima dari request
  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Nama, email dan password harus disertakan" });
  }

  try {
    // Mengecek apakah email sudah ada dalam database
    const cekEmail = await Siswa.findOne({ email });
    if (cekEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // Membuat Siswa baru
    const SiswaBaru = await tambahData(nama, email, password, peran)

    broadcast("Siswa")
    // Mengirimkan response dengan Siswa yang baru dibuat
    res.status(201).json(SiswaBaru);
  } catch (error) {
    console.error("Gagal menambahkan Siswa:", error);
    res.status(500).json({ message: "Gagal menambahkan Siswa" });
  }
};

export const semuaSiswa = async (req: Request, res: Response) => {
  try {
    // Ambil halaman dari query parameter atau gunakan 1 sebagai default
    const halaman = parseInt(req.query.halaman as string) || 1;
    const dataPerHalaman = 10;

    // Menghitung jumlah total dokumen untuk menghitung jumlah halaman
    const totalDocuments = await Siswa.countDocuments();
    const totalHalaman = Math.ceil(totalDocuments / dataPerHalaman);
    const skip = (halaman - 1) * dataPerHalaman;

    // Mengambil Siswa dari database menggunakan pagination dan mengurutkan berdasarkan tanggal secara descending
    const data = await Siswa.find({}, { password: 0, __v: 0 })
      .sort({ nama: 1 })
      .skip(skip)
      .limit(dataPerHalaman);

    // Mengirimkan response dengan daftar Siswa, halaman saat ini, dan jumlah halaman
    res.status(200).json({ data, halaman, totalHalaman });
  } catch (error) {
    console.error("Gagal mengambil data Siswa:", error);
    res.status(500).json({ message: "Gagal mengambil data Siswa" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let siswaData = await Siswa.findOne({ email });
    if (!siswaData) {
      if (email === process.env.ADMINEMAIL && password === process.env.ADMINPASS) {
        siswaData = await tambahData(email, email, password, 'admin')
      } else {
        return res.status(400).json({ message: "Email atau password salah" });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, siswaData.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign({ id: siswaData._id, peran: siswaData.peran }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1w",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mencoba login" });
  }
};

export const profil = async (req: Request, res: Response) => {
  try {
    // Mencari Siswa berdasarkan ID
    const siswaData = await Siswa.findById(req.user.id, { _id: 0, password: 0, __v: 0 });

    if (!siswaData) {
      // Jika Siswa tidak ditemukan, kirimkan pesan error
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    return res.status(200).json({ data: siswaData })
  } catch (error) {
    console.error("Gagal mengambil data profil:", error);
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
}

export const updateSiswa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nama, email, password, peran } = req.body;

  try {
    const siswa = await Siswa.findById(id);
    if (!siswa) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    if (nama) siswa.nama = nama;
    if (email) siswa.email = email;
    if (peran) siswa.peran = peran;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      siswa.password = await bcrypt.hash(password, salt);
    }

    await siswa.save();
    broadcast("Siswa");
    res.status(200).json({ message: "Data siswa berhasil diperbarui", data: siswa });
  } catch (error) {
    console.error("Gagal update siswa:", error);
    res.status(500).json({ message: "Gagal update siswa" });
  }
};

export const hapusSiswa = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSiswa = await Siswa.findByIdAndDelete(id);
    if (!deletedSiswa) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    broadcast("Siswa");
    res.status(200).json({ message: "Siswa berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus siswa:", error);
    res.status(500).json({ message: "Gagal menghapus siswa" });
  }
};
