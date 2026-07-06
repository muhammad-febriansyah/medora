# Medora

Sistem Rekam Medis Elektronik (RME) untuk klinik di Indonesia.

## Stack

- **Backend**: Laravel 13, PHP 8.4, Fortify (auth), spatie/laravel-permission (RBAC)
- **Frontend**: React 19 + Inertia.js v3 + TypeScript, Tailwind CSS v4, shadcn/ui
- **Database**: MySQL/MariaDB

## Fitur

- Manajemen pasien & nomor RM
- Registrasi kunjungan rawat jalan
- Antrian multi-stage (poli, farmasi) + display publik + panggilan suara (TTS)
- Asesmen perawat (vital signs)
- EMR dokter: SOAP, diagnosa ICD-10, e-resep, order lab
- Farmasi: telaah resep, dispensing, manajemen stok
- Laboratorium: order → input hasil
- Kasir & billing (tunai, transfer, QRIS)
- Rekam medis: audit kelengkapan, access log, riwayat pasien
- Dashboard & laporan operasional
- Manajemen user & role (RBAC granular)
- Dokumen cetak: resep, kuitansi, surat sakit, surat rujukan

## Setup

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
npm install && npm run build
```

Login: `admin@medora.id` / `password`

## Lisensi

Proprietary.
