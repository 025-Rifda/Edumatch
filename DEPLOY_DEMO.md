# EduMatch Demo Deployment

Panduan ini memakai:

- `Frontend`: Vercel
- `Backend`: Railway
- `Database`: SQLite dengan Railway Volume

## 1. Persiapan Repository

Pastikan perubahan berikut sudah ada:

- frontend memakai `VITE_API_BASE_URL`
- backend membaca `PORT`
- backend membaca `EDUMATCH_DATABASE_PATH`
- repository punya `Dockerfile` untuk backend

## 2. Push ke GitHub

1. Commit perubahan project.
2. Push ke repository GitHub.

## 3. Deploy Backend ke Railway

1. Login ke Railway.
2. Klik `New Project`.
3. Pilih `Deploy from GitHub repo`.
4. Pilih repository `Edumatch`.
5. Railway akan build backend dari `Dockerfile`.

### Tambahkan Volume

1. Buka project Railway kamu.
2. Tambahkan `Volume`.
3. Mount path: `/data`

### Tambahkan Environment Variable

Tambahkan variable ini di service backend:

```env
EDUMATCH_DATABASE_PATH=/data/edumatch.db
FLASK_DEBUG=0
```

`PORT` tidak perlu diisi manual karena Railway menyediakannya sendiri.

### Domain Backend

1. Buka tab `Settings` atau `Networking`.
2. Generate domain Railway.
3. Simpan URL backend, misalnya:

```text
https://edumatch-backend-production.up.railway.app
```

## 4. Deploy Frontend ke Vercel

1. Login ke Vercel.
2. Klik `Add New Project`.
3. Import repository GitHub yang sama.
4. Saat konfigurasi project:

- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### Tambahkan Environment Variable Frontend

Isi variable berikut di Vercel:

```env
VITE_API_BASE_URL=https://URL-BACKEND-KAMU
```

Contoh:

```env
VITE_API_BASE_URL=https://edumatch-backend-production.up.railway.app
```

5. Klik `Deploy`.

## 5. Setelah Deploy

Uji hal berikut:

1. Buka URL frontend dari Vercel.
2. Coba `register`.
3. Coba `login`.
4. Coba halaman hasil rekomendasi.
5. Coba halaman admin tambah/edit/hapus jurusan.

## 6. Kalau Backend Error

Cek hal ini:

1. Railway Volume benar-benar ter-mount ke `/data`.
2. `EDUMATCH_DATABASE_PATH=/data/edumatch.db`
3. Service backend berhasil start.
4. Buka endpoint root backend:

```text
https://URL-BACKEND-KAMU/
```

Kalau sehat, harus muncul JSON healthcheck.

## 7. Kalau Frontend Tidak Bisa Request API

Biasanya penyebabnya:

1. `VITE_API_BASE_URL` di Vercel belum benar.
2. Frontend belum redeploy setelah env var diubah.
3. URL backend salah atau backend belum aktif.

## 8. Catatan Penting

- Setup ini cocok untuk `demo`, bukan production ramai.
- Pertahankan `1 instance` backend.
- Jangan pakai multi-replica untuk SQLite.
- SQLite aman untuk presentasi, sidang, atau uji coba ringan.
