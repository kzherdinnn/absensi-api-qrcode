"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kehadiranCtr_1 = require("../controllers/kehadiranCtr");
const otentikasiMw_1 = require("../middlewares/otentikasiMw");
const peranMw_1 = require("../middlewares/peranMw");
const rute = express_1.default.Router();
rute.get("/kode", otentikasiMw_1.otentikasiMw, (0, peranMw_1.aksesPeran)('admin'), kehadiranCtr_1.tampilkanKode);
rute.post("/", otentikasiMw_1.otentikasiMw, (0, peranMw_1.aksesPeran)('pegawai'), kehadiranCtr_1.absen);
rute.get("/", otentikasiMw_1.otentikasiMw, (0, peranMw_1.aksesPeran)('admin'), kehadiranCtr_1.semuaKehadiran);
// Add more routes as needed
exports.default = rute;
//# sourceMappingURL=ruteKehadiran.js.map