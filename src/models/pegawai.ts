import mongoose, { Schema, Document } from "mongoose";

export interface IPegawai extends Document {
  nama: string;
  email: string;
  password: string;
  peran: "pegawai" | "admin";
}

const skemaPegawai: Schema = new Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  peran: { type: String, enum: ["pegawai", "admin"], default: "pegawai" },
});

export default mongoose.model<IPegawai>("Pegawai", skemaPegawai, 'pegawai');
