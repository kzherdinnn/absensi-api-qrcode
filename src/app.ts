import express from "express";
import mongoose from "mongoose";
import expressWs from 'express-ws';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rutePegawai from "./routes/rutePegawai";
import ruteKehadiran from "./routes/ruteKehadiran";
import ruteWs from './routes/ruteWs';

dotenv.config();

const app = express();
expressWs(app)

app.use(cors());
app.use(morgan('combined'))
app.use(express.json());

app.use("/api/pegawai", rutePegawai);
app.use("/api/kehadiran", ruteKehadiran);

ruteWs(app);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Terhubung dengan MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Gagal terhubung dengan MongoDB:", err)
});

