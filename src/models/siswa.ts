import mongoose, { Schema, Document } from "mongoose";

export interface ISiswa extends Document {
  nama: string;
  email: string;
  password: string;
  peran: "Siswa" | "admin";
}

const skemaSiswa: Schema = new Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  peran: { type: String, enum: ["Siswa", "admin"], default: "Siswa" },
});

export default mongoose.model<ISiswa>("Siswa", skemaSiswa, 'Siswa');
