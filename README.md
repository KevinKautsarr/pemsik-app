# 📚 PEMSIK App — Sistem Manajemen Akademik

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

Aplikasi web manajemen akademik berbasis React yang dibangun sebagai tugas mata kuliah **Pemrograman Sisi Klien**. Aplikasi ini mendukung pengelolaan data mahasiswa, dosen, mata kuliah, kelas, dan rencana studi secara terintegrasi dengan fitur autentikasi berbasis peran (Role-Based Access Control).

🔗 **Live Demo:** [https://pemsik-app.vercel.app](https://pemsik-app.vercel.app)

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Login dan Register dengan validasi form
- Role-Based Access Control (RBAC): Admin dan Mahasiswa
- Protected Routes — halaman admin tidak bisa diakses tanpa login
- Session disimpan di `localStorage`

### 📊 Dashboard
- Visualisasi data menggunakan **Recharts**
- Statistik jumlah mahasiswa, dosen, mata kuliah, dan kelas
- Grafik distribusi dan tren akademik

### 👨‍🎓 Manajemen Mahasiswa
- CRUD data mahasiswa (Tambah, Lihat, Edit, Hapus)
- Detail profil mahasiswa: NIM, nama, IPS, maksimal SKS, status
- Tabel mata kuliah yang diikuti beserta total SKS terpakai
- Filter dan paginasi (khusus Admin)

### 👨‍🏫 Manajemen Dosen
- CRUD data dosen
- Informasi kode dosen, nama, dan mata kuliah yang diampu

### 📖 Manajemen Mata Kuliah
- CRUD data mata kuliah
- Informasi kode, nama, jumlah SKS, dan semester

### 🏫 Manajemen Kelas
- CRUD data kelas
- Relasi antara dosen, mata kuliah, dan mahasiswa peserta

### 📋 Rencana Studi
- Melihat dan merencanakan pengambilan mata kuliah per semester
- Validasi batas maksimal SKS per mahasiswa

### 👤 Manajemen User
- CRUD akun pengguna sistem
- Pengelolaan role (admin / mahasiswa)

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework UI | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| State & Data Fetching | TanStack React Query v5 |
| Visualisasi Grafik | Recharts |
| Notifikasi | React Hot Toast & SweetAlert2 |
| Icons | Lucide React |
| Mock Backend | JSON Server |
| Deployment | Vercel |

---

## 📁 Struktur Proyek

```
pemsik-app/
├── public/
├── src/
│   ├── Components/
│   │   ├── Organisms/        # Layout components (AdminLayout, AuthLayout, Sidebar)
│   │   └── ProtectedRoute.jsx
│   ├── Pages/
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MahasiswaDetail.jsx
│   │   │   ├── Mahasiswa/
│   │   │   ├── Dosen/
│   │   │   ├── Matakuliah/
│   │   │   ├── Kelas/
│   │   │   ├── RencanaStudi/
│   │   │   └── User/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── Error/
│   │       └── PageNotFound.jsx
│   ├── Utils/
│   │   ├── Apis/             # API layer (Axios calls)
│   │   │   ├── AuthApi.jsx
│   │   │   ├── MahasiswaApi.jsx
│   │   │   ├── DosenApi.jsx
│   │   │   ├── MatakuliahApi.jsx
│   │   │   ├── KelasApi.jsx
│   │   │   ├── UserApi.jsx
│   │   │   └── ChartApi.jsx
│   │   ├── Contexts/         # React Context providers
│   │   ├── Helpers/          # Utility functions (toast, etc.)
│   │   ├── Hooks/            # Custom React hooks
│   │   └── AxiosInstance.jsx
│   ├── App.jsx
│   └── main.jsx
├── db/                       # JSON database partials
├── db.json                   # Database utama (json-server)
├── merge-json.cjs            # Script untuk merge db partials
├── vite.config.js
└── package.json
```

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- **Node.js** versi 18 atau lebih baru
- **npm** versi 8 atau lebih baru

### Langkah Instalasi

**1. Clone repositori**
```bash
git clone https://github.com/KevinKautsarr/pemsik-app.git
cd pemsik-app
```

**2. Install dependensi**
```bash
npm install
```

**3. Jalankan Mock API (JSON Server)**

Buka terminal pertama:
```bash
npm run serve
```
> JSON Server akan berjalan di `http://localhost:3001`

**4. Jalankan Development Server**

Buka terminal kedua:
```bash
npm run dev
```
> Aplikasi akan berjalan di `http://localhost:5173`

---

## 📜 Script yang Tersedia

| Script | Perintah | Keterangan |
|---|---|---|
| `dev` | `npm run dev` | Menjalankan dev server (Vite) |
| `build` | `npm run build` | Build untuk production |
| `preview` | `npm run preview` | Preview build production |
| `serve` | `npm run serve` | Menjalankan JSON Server (mock API) |
| `lint` | `npm run lint` | Memeriksa kode dengan ESLint |

---

## 🔑 Akun Demo

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Mahasiswa | Sesuai NIM | Sesuai yang didaftarkan |

> Akun dapat ditambah atau diubah melalui halaman **Manajemen User** (khusus Admin).

---

## 🗺️ Routing Aplikasi

```
/                   → Redirect ke /login
/login              → Halaman Login
/register           → Halaman Register
/admin/dashboard    → Dashboard (Protected)
/admin/mahasiswa    → Daftar Mahasiswa (Protected)
/admin/mahasiswa/:id → Detail Mahasiswa (Protected)
/admin/dosen        → Daftar Dosen (Protected)
/admin/matakuliah   → Daftar Mata Kuliah (Protected)
/admin/kelas        → Daftar Kelas (Protected)
/admin/rencana-studi → Rencana Studi (Protected)
/admin/user         → Manajemen User (Protected)
*                   → 404 Not Found
```

---

## ☁️ Deployment

Aplikasi di-deploy ke **Vercel** secara otomatis dari branch `main`.

| Konfigurasi | Nilai |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Root Directory | `./` |

> **Catatan:** Mock API (JSON Server) hanya tersedia di lokal. Vercel hanya menjalankan frontend statis.

---

## 👨‍💻 Pengembang

**Kevin Kautsar**
- GitHub: [@KevinKautsarr](https://github.com/KevinKautsarr)

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas akademik mata kuliah **Pemrograman Sisi Klien**.
