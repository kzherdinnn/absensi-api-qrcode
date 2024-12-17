"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pegawaiCtr_1 = require("../controllers/pegawaiCtr");
const otentikasiMw_1 = require("../middlewares/otentikasiMw");
const peranMw_1 = require("../middlewares/peranMw");
const rute = express_1.default.Router();
rute.post("/", otentikasiMw_1.otentikasiMw, (0, peranMw_1.aksesPeran)('admin'), pegawaiCtr_1.tambahPegawai);
rute.get("/", otentikasiMw_1.otentikasiMw, (0, peranMw_1.aksesPeran)('admin'), pegawaiCtr_1.semuaPegawai);
rute.get("/profil", otentikasiMw_1.otentikasiMw, pegawaiCtr_1.profil);
rute.post("/login", pegawaiCtr_1.login);
// Add more routes as needed
exports.default = rute;
//# sourceMappingURL=rutePegawai.js.map