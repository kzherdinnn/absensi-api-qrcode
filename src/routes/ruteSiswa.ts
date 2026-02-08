import express from "express";
import { tambahSiswa, semuaSiswa, login, profil } from "../controllers/siswaCtr";
import { otentikasiMw } from "../middlewares/otentikasiMw";
import { aksesPeran } from "../middlewares/peranMw";

const rute = express.Router();

rute.post("/", otentikasiMw, aksesPeran('admin'), tambahSiswa);
rute.get("/", otentikasiMw, aksesPeran('admin'), semuaSiswa);
rute.get("/profil", otentikasiMw, profil)
rute.post("/login", login);

// Add more routes as needed

export default rute;
