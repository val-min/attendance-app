# 🏠 WFH Attendance App

Aplikasi absensi Work From Home (WFH) berbasis web yang memungkinkan karyawan untuk melakukan absensi dengan capture waktu dan upload foto sebagai bukti bekerja dari rumah. Admin HRD dapat memantau dan mengelola data karyawan serta absensi.

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + TypeScript
- NestJS Framework
- MySQL Database
- TypeORM
- JWT Authentication

**Frontend:**
- React.js + TypeScript
- Material UI (MUI)
- Axios

---

## ⚙️ Prerequisites

Pastikan sudah terinstall:
- Node.js v18+
- MySQL
- npm

---

## 🚀 Cara Menjalankan Project

### 1. Clone Repository
```bash
git clone https://github.com/val-min/attendance-app.git
cd attendance-app
```

### 2. Setup Database
Masuk ke MySQL dan jalankan:
```sql
CREATE DATABASE attendance_db;
USE attendance_db;

CREATE TABLE employees (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  department  VARCHAR(100),
  position    VARCHAR(100),
  role        ENUM('admin', 'employee') DEFAULT 'employee',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE attendances (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  date        DATE NOT NULL,
  check_in    DATETIME,
  check_out   DATETIME,
  photo_url   VARCHAR(255),
  status      ENUM('present','late','absent') DEFAULT 'present',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

### 3. Jalankan Backend
```bash
cd backend
npm install
npm run start:dev
```
Backend berjalan di: `http://localhost:3000`

### 4. Jalankan Frontend
```bash
cd frontend
npm install
npm start
```
Frontend berjalan di: `http://localhost:3001`

---

## 🔐 Demo Accounts

### 👨‍💼 Admin (HRD)
| Email | Password |
|-------|----------|
| admin@company.com | Admin@1234 |

### 👨‍💻 Employee
| Email | Password |
|-------|----------|
| budi@company.com | tes123 |
| valen@company.com | lanjut123 |
| sella@company.com | coba123 |

---

## 📋 Fitur Aplikasi

### Employee
- ✅ Login
- ✅ Absensi WFH dengan upload foto sebagai bukti
- ✅ Capture tanggal & waktu otomatis
- ✅ Lihat riwayat absensi pribadi

### Admin (HRD)
- ✅ Login
- ✅ Tambah karyawan baru
- ✅ Edit data karyawan
- ✅ Hapus karyawan
- ✅ Monitor absensi semua karyawan

---

## 📁 Struktur Project

```
attendance-app/
├── backend/                # NestJS API
│   └── src/
│       ├── auth/           # Authentication & JWT
│       ├── employees/      # CRUD Karyawan
│       ├── attendance/     # Absensi
│       └── app.module.ts
└── frontend/               # React.js
    └── src/
        ├── pages/          # Login, Employee, Admin
        └── services/       # API calls
```
---

## 👨‍💻 Author

Valencia — Fullstack Developer Skill Test