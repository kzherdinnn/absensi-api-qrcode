import mongoose, { Schema, Document } from "mongoose";

export interface IKodeqr extends Document {
  kode: string;
  tanggal: Date;
}

const skemaKodeQr: Schema = new Schema({
  kode: { type: String, required: true, unique: true },
  tanggal: { type: Date, required: true, default: Date.now, },
});

export default mongoose.model<IKodeqr>("KodeQr", skemaKodeQr, 'kodeqr');
