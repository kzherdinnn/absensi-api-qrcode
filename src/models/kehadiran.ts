import mongoose, { Schema, Document } from "mongoose";

export interface IKehadiran extends Document {
  Siswa: mongoose.Types.ObjectId;
  datang: Date;
  pulang: Date;
}

const skemaKehadiran: Schema = new Schema({
  Siswa: { type: mongoose.Schema.Types.ObjectId, ref: "Siswa", required: true, },
  datang: { type: Date, required: true, default: Date.now, },
  pulang: { type: Date, },
});

export default mongoose.model<IKehadiran>("Kehadiran", skemaKehadiran, 'kehadiran');
