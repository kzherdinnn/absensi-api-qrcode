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
exports.getDb = exports.connect = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
// Memuat variabel lingkungan dari file .env
dotenv_1.default.config();
const uri = process.env.MONGO_URI || ""; // Ambil MONGO_URI dari .env
const dbName = process.env.MONGO_DB || "absensi"; // Ambil nama database dari .env, jika ada
let db;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!uri) {
            throw new Error("MongoDB URI is missing from environment variables.");
        }
        // Menghubungkan ke MongoDB menggunakan URI dari .env tanpa opsi useNewUrlParser dan useUnifiedTopology
        const client = yield mongodb_1.MongoClient.connect(uri);
        db = client.db(dbName);
        console.log(`Connected to MongoDB at ${uri}`);
    }
    catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
});
exports.connect = connect;
const getDb = () => {
    if (!db) {
        throw new Error("Database not initialized. Call connect first.");
    }
    return db;
};
exports.getDb = getDb;
//# sourceMappingURL=index.js.map