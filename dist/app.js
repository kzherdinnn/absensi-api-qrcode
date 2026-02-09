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
exports.connectToDatabase = void 0;
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const ruteSiswa_1 = __importDefault(require("./routes/ruteSiswa"));
const ruteKehadiran_1 = __importDefault(require("./routes/ruteKehadiran"));
const ruteWs_1 = __importDefault(require("./routes/ruteWs"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, express_ws_1.default)(app);
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use("/api/siswa", ruteSiswa_1.default);
app.use("/api/kehadiran", ruteKehadiran_1.default);
(0, ruteWs_1.default)(app);
// Cached connection for serverless
let isConnected = false;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected) {
        console.log("Menggunakan koneksi database yang sudah ada.");
        return;
    }
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI harus didefinisikan");
        }
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Terhubung dengan MongoDB");
    }
    catch (error) {
        console.error("Gagal terhubung dengan MongoDB:", error);
    }
});
exports.connectToDatabase = connectToDatabase;
exports.default = app;
//# sourceMappingURL=app.js.map