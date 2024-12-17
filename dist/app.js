"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_ws_1 = __importDefault(require("express-ws"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const rutePegawai_1 = __importDefault(require("./routes/rutePegawai"));
const ruteKehadiran_1 = __importDefault(require("./routes/ruteKehadiran"));
const ruteWs_1 = __importDefault(require("./routes/ruteWs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, express_ws_1.default)(app);
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use("/api/pegawai", rutePegawai_1.default);
app.use("/api/kehadiran", ruteKehadiran_1.default);
(0, ruteWs_1.default)(app);
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("Terhubung dengan MongoDB");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.log("Gagal terhubung dengan MongoDB:", err);
});
//# sourceMappingURL=app.js.map