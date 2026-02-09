import express from "express";
import { absen, semuaKehadiran, tampilkanKode, statistik, aktivitasTerbaru } from "../controllers/kehadiranCtr";
import { otentikasiMw } from "../middlewares/otentikasiMw";
import { aksesPeran } from "../middlewares/peranMw";

const rute = express.Router();

rute.get("/kode", otentikasiMw, aksesPeran('admin'), tampilkanKode);
rute.post("/", otentikasiMw, aksesPeran('Siswa', 'admin'), absen);
rute.get("/", otentikasiMw, aksesPeran('admin'), semuaKehadiran);
rute.get("/statistik", otentikasiMw, statistik);
rute.get("/aktivitas-terbaru", otentikasiMw, aktivitasTerbaru);


// Add more routes as needed

export default rute;
