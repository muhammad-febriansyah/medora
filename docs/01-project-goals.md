# Medora — Project Goals

> Sistem Rekam Medis Elektronik (RME) untuk klinik di Indonesia.
> Dokumen: Project Goals · Versi 1.0 · Status: In Progress

---

## 1. Visi Produk

Menjadi sistem rekam medis elektronik yang sederhana, cepat, dan patuh regulasi untuk klinik pratama/utama di Indonesia — menggantikan rekam medis kertas dan pencatatan manual (buku register, Excel) dengan satu alur digital dari pasien datang sampai pulang.

## 2. Latar Belakang & Masalah

| Masalah Saat Ini | Dampak |
|---|---|
| Rekam medis kertas: mudah hilang, sulit dicari, tulisan tidak terbaca | Riwayat pasien tidak utuh, risiko medis |
| Antrian manual (panggil nama / kertas nomor) | Ruang tunggu chaos, pasien tidak tahu estimasi |
| Resep kertas ke farmasi | Salah baca resep, tidak ada telaah terstruktur |
| Billing manual / terpisah dari layanan | Tagihan tidak akurat, kebocoran pendapatan |
| Tidak ada jejak akses data pasien | Tidak patuh UU PDP & Permenkes 24/2022 |
| Stok obat dicatat terpisah | Selisih stok, obat kadaluarsa tidak terpantau |

## 3. Tujuan Proyek (Objectives)

1. **Digitalisasi penuh alur rawat jalan** — pendaftaran → antrian → asesmen perawat → pemeriksaan dokter (SOAP + ICD-10) → farmasi → kasir, tanpa kertas kecuali output cetak (resep, kuitansi, surat).
2. **Rekam medis longitudinal per pasien** — satu nomor RM seumur hidup, semua kunjungan (encounter) tercatat dan dapat ditelusuri kembali oleh dokter.
3. **Sistem antrian multi-stage** — antrian poli dan farmasi dengan display ruang tunggu + panggilan suara, terintegrasi dengan worklist petugas.
4. **Kepatuhan regulasi by design** — Permenkes No. 24/2022 (RME, retensi 25 tahun, immutability catatan klinis) dan UU PDP (audit log akses, RBAC need-to-know), **tanpa** integrasi SATUSEHAT pada fase ini namun struktur data disiapkan FHIR-friendly.
5. **Billing akurat dan otomatis** — semua layanan, tindakan, dan obat terakumulasi otomatis ke invoice per kunjungan dengan snapshot harga.

## 4. Sasaran Pengguna

- **Primer**: Klinik pratama & utama (1 lokasi), 2–10 poli, 5–30 staf.
- **Sekunder**: Praktek dokter bersama / balai pengobatan.
- **Bukan sasaran (fase ini)**: Rumah sakit (rawat inap), apotek standalone, multi-cabang.

## 5. Success Metrics

| Metrik | Target |
|---|---|
| Waktu registrasi pasien lama | < 1 menit |
| Waktu registrasi pasien baru | < 3 menit |
| Kelengkapan catatan klinis (SOAP + diagnosa terkode) | > 95% encounter |
| Selisih billing vs layanan tercatat | 0% (otomatis) |
| Akses RM tanpa jejak audit | 0 kejadian |
| Uptime jam operasional klinik | > 99% |

## 6. Ruang Lingkup

### In Scope (MVP)
- Manajemen pasien & nomor RM
- Registrasi kunjungan rawat jalan
- Antrian multi-stage (poli, farmasi) + display publik + panggilan suara (TTS browser)
- Asesmen awal perawat (vital signs, keluhan)
- EMR dokter: SOAP, diagnosa ICD-10, tindakan ICD-9-CM, e-resep, order lab internal
- Farmasi: telaah resep, dispensing, manajemen stok obat sederhana
- Laboratorium internal sederhana (order → input hasil → hasil kembali ke dokter)
- Kasir & billing (tunai, QRIS statis/transfer manual — tanpa payment gateway)
- Modul rekam medis: audit kelengkapan, riwayat pasien, access log
- Laporan operasional (kunjungan, pendapatan, 10 penyakit terbanyak, stok)
- Manajemen user & role (RBAC granular)
- Surat cetak: resep, kuitansi, surat sakit, surat rujukan, surat sehat

### Out of Scope (Fase Berikutnya)
- Integrasi SATUSEHAT / FHIR (struktur data sudah disiapkan)
- Integrasi BPJS (PCare)
- Payment gateway otomatis (Duitku/Midtrans)
- Booking online pasien / ambil antrian via WhatsApp
- Rawat inap, IGD, CPPT multi-profesi
- Radiologi / PACS
- Multi-cabang & multi-tenant
- Aplikasi mobile

## 7. Asumsi & Batasan

- Deployment: VPS atau shared hosting → **tanpa WebSocket**; display antrian & worklist memakai polling (React Query, interval 3–5 detik).
- Satu zona waktu operasional (WIB); penyimpanan UTC, tampilan WIB.
- Semua nominal Rupiah disimpan sebagai `BIGINT` (tanpa desimal).
- Bahasa antarmuka & pesan validasi: Bahasa Indonesia.
- Data klinis **tidak pernah dihapus** (soft delete pada master data; catatan klinis final bersifat immutable + addendum).
- Retensi data minimal 25 tahun sejak kunjungan terakhir (Permenkes 24/2022).

## 8. Stack & Konvensi Teknis

- **Backend**: Laravel 13, PHP 8.4 (Service–Repository–Action pattern), Fortify (auth), Wayfinder (typed routes di frontend), Pest (testing), Pint + Larastan (quality)
- **Frontend**: React 19 + Inertia.js v3 + TypeScript, Tailwind CSS v4 (@theme tokens), shadcn/ui — polling worklist/display via Inertia `usePoll`
- **Auth & RBAC**: spatie/laravel-permission + Policy per resource
- **UI conventions**: tanpa modal untuk CRUD (halaman Inertia terpisah), Sonner untuk notifikasi, shadcn DataTable (TanStack), font Poppins, light mode only
- **Database**: MySQL/MariaDB, soft deletes pada master data, snapshot fields pada data transaksional (harga, nama layanan/obat di invoice)

## 9. Risiko Utama

| Risiko | Mitigasi |
|---|---|
| Dokter enggan mengetik SOAP | UX minimal-klik, template keluhan umum, autocomplete ICD-10 |
| Listrik/internet mati saat operasional | Deployment lokal opsional / UPS; desain form tahan kehilangan koneksi singkat |
| Perubahan regulasi (kewajiban lapor SATUSEHAT) | Skema data FHIR-friendly sejak awal, modul integrasi sebagai fase 2 |
| Penyalahgunaan akses data pasien | RBAC need-to-know + access log append-only + break-the-glass |
