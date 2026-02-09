import express from "express";
import expressWs from 'express-ws';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import ruteSiswa from "./routes/ruteSiswa";
import ruteKehadiran from "./routes/ruteKehadiran";
import ruteWs from './routes/ruteWs';
import mongoose from "mongoose";

dotenv.config();

const app = express();
expressWs(app);

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use("/api/siswa", ruteSiswa);
app.use("/api/kehadiran", ruteKehadiran);

ruteWs(app);

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
