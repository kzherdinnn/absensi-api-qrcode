import express from "express";
import { tambahPegawai, semuaPegawai, login, profil } from "../controllers/pegawaiCtr";
import { otentikasiMw } from "../middlewares/otentikasiMw";
import { aksesPeran } from "../middlewares/peranMw";

const rute = express.Router();

rute.post("/", otentikasiMw, aksesPeran('admin'), tambahPegawai);
rute.get("/", otentikasiMw, aksesPeran('admin'), semuaPegawai);
rute.get("/profil", otentikasiMw, profil)
rute.post("/login", login);

// Add more routes as needed

export default rute;
