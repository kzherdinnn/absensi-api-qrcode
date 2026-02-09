import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import ruteSiswa from "./routes/ruteSiswa";
import ruteKehadiran from "./routes/ruteKehadiran";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working", time: new Date().toISOString(), hasMongoUri: !!process.env.MONGO_URI });
});

app.use("/api/siswa", ruteSiswa);
app.use("/api/kehadiran", ruteKehadiran);

// Cached connection for serverless
let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Menggunakan koneksi database yang sudah ada.");
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI harus didefinisikan");
    }
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Terhubung dengan MongoDB");
  } catch (error) {
    console.error("Gagal terhubung dengan MongoDB:", error);
  }
};

export default app;
