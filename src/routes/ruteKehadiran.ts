import express from "express";
import { absen, semuaKehadiran, tampilkanKode, statistik } from "../controllers/kehadiranCtr";
import { otentikasiMw } from "../middlewares/otentikasiMw";
import { aksesPeran } from "../middlewares/peranMw";

const rute = express.Router();

rute.get("/kode", otentikasiMw, aksesPeran('admin'), tampilkanKode);
rute.post("/", otentikasiMw, aksesPeran('siswa'), absen);
rute.get("/", otentikasiMw, aksesPeran('admin'), semuaKehadiran);
rute.get("/statistik", otentikasiMw, statistik);

// Add more routes as needed

export default rute;
