<div align="center">

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>

# 📡 Absensi API — QR Code Backend

**REST API + WebSocket** untuk sistem absensi digital berbasis QR Code.  
Dibangun dengan **Express.js**, **TypeScript**, dan **MongoDB** — siap deploy ke **Vercel**.

[![Frontend Repo](https://img.shields.io/badge/🖥️_Frontend_App-absensi--nextjs--qrcode-6366f1?style=for-the-badge)](https://github.com/kzherdinnn/absensi-nextjs-qrcode)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-absensiku.onesite.my.id-10b981?style=for-the-badge)](https://absensiku.onesite.my.id)

</div>

---

## 📌 Tentang Project

API ini merupakan **backend** dari sistem absensi digital yang menggunakan **QR Code** sebagai metode pencatatan kehadiran. API ini terhubung langsung dengan aplikasi frontend Next.js dan mendukung komunikasi **real-time** menggunakan **WebSocket**.

> 🔗 **Frontend**: [absensi-nextjs-qrcode](https://github.com/kzherdinnn/absensi-nextjs-qrcode) — Antarmuka web yang dikonsumsi oleh API ini.

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 🔐 **Autentikasi JWT** | Login & proteksi endpoint dengan JSON Web Token |
| 👥 **Manajemen Siswa** | CRUD data siswa lengkap (tambah, lihat, update, hapus) |
| 📋 **Pencatatan Kehadiran** | Absen masuk & pulang melalui scan QR Code |
| 🔑 **Kode QR Dinamis** | Generate & validasi kode QR yang unik per sesi |
| 📊 **Statistik Kehadiran** | Endpoint statistik & aktivitas terbaru |
| 🌐 **WebSocket Real-time** | Update kehadiran secara real-time ke semua client |
| 🛡️ **Role-based Access** | Kontrol akses berdasarkan peran (`Siswa` / `admin`) |
| ☁️ **Serverless Ready** | Optimized untuk deploy di Vercel (serverless) |

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** | ≥ 18 | Runtime JavaScript |
| **Express.js** | ^4.18 | Web framework |
| **TypeScript** | ^5.7 | Type safety |
| **MongoDB** | ^6.12 | Database NoSQL |
| **Mongoose** | ^7.0 | ODM untuk MongoDB |
| **JSON Web Token** | ^9.0 | Autentikasi |
| **bcryptjs** | ^3.0 | Enkripsi password |
| **express-ws** | ^5.0 | WebSocket support |
| **Morgan** | ^1.10 | HTTP request logger |
| **CORS** | ^2.8 | Cross-Origin Resource Sharing |
| **Vercel** | ^50 | Deployment serverless |

---

## 📁 Struktur Project

```
absensi-api-qrcode/
│
├── api/
│   └── index.ts              # Entry point Vercel serverless
│
├── src/
│   ├── app.ts                # Konfigurasi Express & koneksi DB
│   ├── server.ts             # Server lokal (dev)
│   │
│   ├── controllers/          # Logic handler request
│   │   ├── siswaCtr.ts       # Controller siswa
│   │   └── kehadiranCtr.ts   # Controller kehadiran
│   │
│   ├── models/               # Schema MongoDB (Mongoose)
│   │   ├── siswa.ts          # Model data siswa
│   │   ├── kehadiran.ts      # Model data kehadiran
│   │   └── kodeqr.ts         # Model kode QR
│   │
│   ├── routes/               # Definisi endpoint API
│   │   ├── ruteSiswa.ts      # Route /api/siswa
│   │   ├── ruteKehadiran.ts  # Route /api/kehadiran
│   │   └── ruteWs.ts         # Route WebSocket /ws
│   │
│   ├── middlewares/          # Middleware Express
│   │   ├── otentikasiMw.ts   # Middleware JWT autentikasi
│   │   └── peranMw.ts        # Middleware role-based access
│   │
│   └── services/
│       └── socketService.ts  # Manajemen koneksi WebSocket
│
├── .env                      # Environment variables (jangan di-commit!)
├── env-sample                # Contoh konfigurasi .env
├── vercel.json               # Konfigurasi deploy Vercel
├── tsconfig.json             # Konfigurasi TypeScript
└── package.json
```

---

## 🗄️ Database Schema

### 👤 Siswa
```ts
{
  nama: String,      // Nama lengkap
  email: String,     // Email (unique)
  password: String,  // Hashed dengan bcryptjs
  peran: 'Siswa' | 'admin'
}
```

### 📋 Kehadiran
```ts
{
  Siswa: ObjectId,   // Referensi ke model Siswa
  datang: Date,      // Waktu absen masuk
  pulang: Date       // Waktu absen pulang
}
```

### 🔑 Kode QR
```ts
{
  kode: String,      // Kode unik (unique)
  tanggal: Date      // Waktu generate kode
}
```

---

## 🔌 API Endpoints

### 🔐 Autentikasi
```
POST   /api/siswa/login          # Login (public)
```

### 👥 Siswa
```
GET    /api/siswa/profil         # Lihat profil sendiri        [Auth]
POST   /api/siswa/               # Tambah siswa baru           [Admin]
GET    /api/siswa/               # Lihat semua siswa           [Admin]
PUT    /api/siswa/:id            # Update data siswa           [Auth]
DELETE /api/siswa/:id            # Hapus siswa                 [Admin]
```

### 📋 Kehadiran
```
POST   /api/kehadiran/           # Absen (scan QR)             [Auth]
GET    /api/kehadiran/           # Semua data kehadiran        [Admin]
GET    /api/kehadiran/kode       # Tampilkan QR Code aktif     [Admin]
GET    /api/kehadiran/statistik  # Statistik kehadiran         [Auth]
GET    /api/kehadiran/aktivitas-terbaru  # Aktivitas terbaru   [Auth]
```

### 🟢 Health Check
```
GET    /api/test                 # Cek status API (public)
```

### 🌐 WebSocket
```
WS     /ws                      # Real-time connection
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js ≥ 18
- MongoDB (lokal atau Atlas)
- npm / yarn

### 1. Clone Repository
```bash
git clone https://github.com/kzherdinnn/absensi-api-qrcode.git
cd absensi-api-qrcode
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment
```bash
# Salin file contoh
cp env-sample .env
```

Edit file `.env`:
```env
MONGO_URI=mongodb://username:password@host:port/absensi
PORT=5000
JWT_SECRET=your_super_secret_key_here
ADMINEMAIL=admin@example.com
ADMINPASS=yourpassword
```

### 4. Jalankan Development Server
```bash
npm run dev
```
> API akan berjalan di `http://localhost:5000`

### 5. Build untuk Production (Lokal)
```bash
npm run build:local
npm start
```

---

## ☁️ Deploy ke Vercel

Project ini sudah dikonfigurasi untuk **Vercel Serverless** melalui `vercel.json` dan `api/index.ts`.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Pastikan environment variables sudah diatur di **Vercel Dashboard**:
- `MONGO_URI`
- `JWT_SECRET`
- `ADMINEMAIL`
- `ADMINPASS`

---

## 🔒 Keamanan

- Password dienkripsi menggunakan **bcryptjs**
- Autentikasi via **JSON Web Token (JWT)**
- Akses endpoint dikontrol berdasarkan **role** (`Siswa` / `admin`)
- Environment variables tidak pernah di-commit ke repository

---

## 🔗 Hubungan dengan Frontend

API ini dikonsumsi oleh aplikasi **frontend Next.js**. Pastikan `NEXT_PUBLIC_API_URL` di repo frontend mengarah ke URL API ini.

| Layanan | URL |
|---------|-----|
| **🌐 Live Demo** | [absensiku.onesite.my.id](https://absensiku.onesite.my.id) |
| **Frontend App** | [github.com/kzherdinnn/absensi-nextjs-qrcode](https://github.com/kzherdinnn/absensi-nextjs-qrcode) |
| **Backend API** | [github.com/kzherdinnn/absensi-api-qrcode](https://github.com/kzherdinnn/absensi-api-qrcode) *(repo ini)* |

---

## 📅 Riwayat Update Terakhir

| Tanggal | Perubahan |
|---------|-----------|
| **27 Feb 2026** | Menambahkan endpoint `aktivitas-terbaru` dan `statistik` |
| **27 Feb 2026** | Menambahkan WebSocket route untuk real-time update |
| **27 Feb 2026** | Konfigurasi deployment Vercel serverless (`vercel.json`) |
| **27 Feb 2026** | Implementasi role-based access control middleware |
| **27 Feb 2026** | Initial commit — setup Express, MongoDB, JWT Auth |

---

## 👤 Developer

**kzherdinnn**  
[![GitHub](https://img.shields.io/badge/GitHub-kzherdinnn-181717?style=flat-square&logo=github)](https://github.com/kzherdinnn)

---

<div align="center">
  <sub>🔗 Backend dari <a href="https://github.com/kzherdinnn/absensi-nextjs-qrcode">Sistem Absensi Digital QR Code</a></sub>
</div>
