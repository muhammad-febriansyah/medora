# Medora — Product Requirements Document (PRD)

> Versi 1.0 · Status: In Progress · Scope: Klinik single-lokasi, rawat jalan, tanpa integrasi eksternal

---

## 1. Ringkasan Produk

Medora adalah sistem rekam medis elektronik (RME) berbasis web untuk klinik di Indonesia yang mendigitalkan seluruh alur rawat jalan: pendaftaran → antrian → asesmen perawat → pemeriksaan dokter → farmasi → kasir, dengan rekam medis longitudinal per pasien, sistem antrian multi-stage, dan kepatuhan Permenkes 24/2022 & UU PDP.

### Alur Utama (Happy Path)

```
Pasien datang
   → [Pendaftaran] registrasi kunjungan, dapat nomor antrian poli
   → [Antrian poli] menunggu, dipanggil via display + suara
   → [Perawat] vital signs + keluhan utama
   → [Dokter] SOAP + diagnosa ICD-10 + tindakan + e-resep + order lab (opsional)
        ↳ jika ada order lab: [Lab] periksa → input hasil → kembali ke dokter
   → [Farmasi] antrian resep → telaah → dispensing → penyerahan obat
   → [Kasir] billing akumulatif → bayar → kuitansi
   → [Rekam Medis] audit kelengkapan (background/harian)
```

Setiap kunjungan = 1 **encounter**. Semua data klinis dan finansial menempel ke encounter, bukan langsung ke pasien.

---

## 2. Daftar Modul

| # | Modul | Fase | Status |
|---|---|---|---|
| M1 | Autentikasi & Manajemen User (RBAC) | MVP | Done |
| M2 | Master Data | MVP | In Progress |
| M3 | Manajemen Pasien | MVP | - |
| M4 | Registrasi Kunjungan (Encounter) | MVP | - |
| M5 | Sistem Antrian & Display | MVP | - |
| M6 | Asesmen Perawat | MVP | - |
| M7 | EMR Dokter | MVP | - |
| M8 | Farmasi & Stok Obat | MVP | - |
| M9 | Laboratorium Internal | MVP | - |
| M10 | Kasir & Billing | MVP | - |
| M11 | Rekam Medis & Audit | MVP | - |
| M12 | Laporan & Dashboard | MVP | - |
| M13 | Pengaturan Klinik & Dokumen Cetak | MVP | - |

---

## 3. Requirement per Modul

### M1 — Autentikasi & Manajemen User

- Login email/username + password; session-based (Laravel Fortify — sesuai stack project).
- Role bawaan: `admin`, `pendaftaran`, `perawat`, `dokter`, `apoteker`, `petugas_lab`, `kasir`, `petugas_rm`. Satu user dapat memiliki lebih dari satu role (klinik kecil sering merangkap).
- Permission granular via spatie/laravel-permission, dikelompokkan per jenis data (bukan hanya per menu):
  - `patients.view_demographics`, `patients.manage`
  - `clinical.view`, `clinical.write`, `clinical.finalize`
  - `prescriptions.create`, `prescriptions.dispense`
  - `billing.view`, `billing.process`, `billing.discount`
  - `reports.view`, `masterdata.manage`, `users.manage`, `access_logs.view`
- Policy per resource menegakkan need-to-know:
  - Pendaftaran & kasir **tidak dapat** membuka catatan klinis.
  - Dokter default hanya membuka RM pasien pada encounter yang ditugaskan padanya; akses di luar itu memicu **break-the-glass** (wajib isi alasan, tercatat di access log). *(P1)*
- Nonaktifkan user (bukan hapus); riwayat tindakan user lama tetap utuh.

### M2 — Master Data

Semua master data: soft delete, tidak boleh hard delete jika sudah dipakai transaksi.

- **Poli/Departemen**: nama, kode antrian (mis. `U` untuk umum, `G` untuk gigi), status aktif.
- **Dokter**: relasi ke user, nomor SIP & STR, spesialisasi, poli default.
- **Jadwal praktik dokter**: hari, jam mulai/selesai, kuota pasien (opsional).
- **Layanan & Tarif**: nama layanan, kategori (konsultasi/tindakan/administrasi), kode ICD-9-CM opsional, tarif. Perubahan tarif tidak mengubah transaksi lama (snapshot).
- **Obat**: nama, nama generik, satuan, bentuk sediaan, harga jual, stok minimum, flag `is_racikan_component`.
- **Pemeriksaan Lab**: nama pemeriksaan, parameter (satu pemeriksaan bisa multi-parameter), satuan, rentang normal per jenis kelamin/umur (sederhana), tarif.
- **Kode ICD-10 & ICD-9-CM**: seeder dari dataset resmi; pencarian autocomplete (kode + deskripsi Indonesia jika tersedia).

### M3 — Manajemen Pasien

- Nomor RM auto-generate, format konfigurabel (default: `RM-000001`), unik seumur hidup, tidak pernah didaur ulang.
- Data demografi: nama, NIK (unik, opsional untuk bayi/tanpa KTP), tempat/tanggal lahir, jenis kelamin, alamat, telepon, golongan darah, pekerjaan, penanggung jawab.
- **Alergi** dicatat di level pasien (bukan encounter) dan tampil sebagai banner peringatan di semua layar klinis.
- Pencarian cepat: nomor RM / NIK / nama / tanggal lahir / telepon.
- Deteksi duplikat saat input pasien baru (NIK sama, atau nama + tanggal lahir mirip) → tampilkan kandidat sebelum simpan.
- Perubahan data demografi tercatat (activity log).

### M4 — Registrasi Kunjungan (Encounter)

- Encounter dibuat oleh pendaftaran: pilih pasien → poli → dokter (dari jadwal hari itu) → jenis kunjungan (baru/kontrol) → metode bayar rencana (umum/asuransi manual).
- Status encounter (state machine):
  `registered → nurse_assessment → in_consultation → waiting_lab (opsional) → in_pharmacy (opsional) → waiting_payment → completed` | `cancelled`
- Membuat encounter otomatis membuat entri antrian poli (M5) dan invoice draft (M10) berisi biaya pendaftaran/konsultasi.
- Pembatalan hanya sebelum pemeriksaan dokter dimulai; wajib alasan.
- Satu pasien tidak dapat memiliki 2 encounter aktif di poli yang sama pada hari yang sama.

### M5 — Sistem Antrian & Display

- **Antrian multi-stage** dalam satu tabel `queues` dengan `queue_type`:
  - `poli` — dibuat saat registrasi; nomor per poli per hari, format `{kode_poli}-{urut}` (mis. `U-012`).
  - `pharmacy` — dibuat otomatis saat dokter finalize resep; dipisah sub-tipe racikan / non-racikan.
- Status antrian: `waiting → called → serving → done` | `skipped`. Skipped dapat di-recall (kembali ke waiting dengan prioritas setelah 2 nomor berikutnya).
- **Worklist = antrian.** Halaman worklist perawat/dokter/farmasi adalah query antrian poli/farmasi terkait dengan status `waiting/called`. Tombol "Panggil berikutnya" mengubah status → `called`, mulai layani → `serving`, selesai → `done` dan otomatis menggerakkan status encounter.
- **Display ruang tunggu**: route publik tanpa login, fullscreen, menampilkan nomor yang dipanggil + 3 berikutnya per poli & farmasi. Refresh via **polling 3–5 detik** (tanpa WebSocket).
- **Panggilan suara**: Web Speech API (`SpeechSynthesis`, `id-ID`) dari halaman display: "Nomor antrian U dua belas, silakan menuju Poli Umum". Antrian pengumuman diproses berurutan agar tidak tumpang tindih.
- Statistik antrian per hari: rata-rata waktu tunggu per stage (dihitung dari `created_at → called_at → served_at`).

### M6 — Asesmen Perawat

- Form vital signs terstruktur per field: TD sistolik/diastolik (mmHg), nadi (x/mnt), suhu (°C), RR (x/mnt), SpO2 (%), berat (kg), tinggi (cm); BMI dihitung otomatis.
- Validasi rentang wajar per field (mis. suhu 30–45°C) dengan konfirmasi jika di luar rentang.
- Keluhan utama (free text) + update daftar alergi pasien jika ada temuan baru.
- Simpan asesmen → status encounter maju ke `nurse_assessment` selesai; pasien tampil di worklist dokter.
- Riwayat vital signs kunjungan sebelumnya ditampilkan sebagai pembanding (tabel/sparkline). *(P1)*

### M7 — EMR Dokter

Layar pemeriksaan satu halaman dengan panel:

1. **Header pasien**: identitas ringkas, umur, banner alergi (merah), vital signs hari ini.
2. **Riwayat**: daftar encounter sebelumnya (tanggal, poli, diagnosa utama) — klik untuk buka detail (akses tercatat).
3. **SOAP**: empat field terpisah (Subjective, Objective, Assessment, Plan). Template SOAP per keluhan umum *(P1)*.
4. **Diagnosa**: autocomplete ICD-10; wajib 1 diagnosa utama, sekunder opsional (maks 5).
5. **Tindakan**: pilih dari master layanan → otomatis menambah item invoice (snapshot nama + tarif).
6. **E-Resep**: pilih obat (tampil sisa stok), qty, dosis, aturan pakai (signa), flag racikan (komposisi multi-obat + instruksi peracikan). Submit resep → antrian farmasi + item invoice draft.
7. **Order Lab**: pilih pemeriksaan dari master → status encounter `waiting_lab`; hasil masuk kembali ke panel ini dengan penanda "hasil baru".
8. **Dokumen**: generate surat sakit (jumlah hari), surat sehat, surat rujukan — terisi otomatis, cetak PDF dengan kop klinik.

**Finalisasi (aturan inti):**
- SOAP + diagnosa berstatus `draft` selama pemeriksaan; dokter menekan **Finalize** untuk mengunci.
- Setelah `final`: konten tidak dapat diedit oleh siapa pun (termasuk admin). Koreksi hanya melalui **addendum** — entri baru bertanda waktu + user, tampil kronologis di bawah catatan asli.
- Finalize memvalidasi kelengkapan minimum: SOAP terisi + diagnosa utama ada.
- Encounter tidak bisa `completed` jika catatan belum final (dapat dikonfigurasi: blokir keras vs. masuk daftar audit RM).

### M8 — Farmasi & Stok Obat

- **Antrian resep** masuk otomatis dari EMR; dua lajur: non-racikan & racikan (estimasi waktu berbeda).
- **Telaah resep**: apoteker verifikasi (checklist sederhana) → status `verified`; jika bermasalah → `flagged` dengan catatan, dokter mendapat penanda di worklist untuk konfirmasi/revisi.
- **Dispensing**: konfirmasi penyiapan → stok berkurang otomatis via `stock_movements` (append-only: `type: out, reference: prescription_item`). Penyerahan obat memanggil antrian farmasi pasien.
- **Stok**: pencatatan stok masuk (pembelian sederhana: tanggal, supplier text, qty, harga beli, expired date per batch — batch tracking sederhana), penyesuaian stock opname (wajib alasan), laporan kartu stok per obat.
- Peringatan: stok ≤ minimum, expired ≤ 90 hari. *(P1)*
- Harga obat di resep = snapshot harga saat diresepkan.

### M9 — Laboratorium Internal

- Worklist order masuk (dari EMR) per hari.
- Input hasil per parameter: nilai, satuan (prefill dari master), rentang normal (prefill), flag otomatis H (tinggi) / L (rendah).
- Submit hasil → status order `resulted`, dokter pemesan mendapat penanda hasil baru; hasil tampil di EMR & riwayat pasien.
- Cetak hasil lab (PDF, kop klinik, tanda tangan petugas).
- Hasil final immutable; koreksi = hasil amandemen baru dengan referensi ke hasil lama. 

### M10 — Kasir & Billing

- **Invoice per encounter**, dibuat draft saat registrasi, item bertambah otomatis dari: biaya pendaftaran/konsultasi, tindakan dokter, order lab, resep (setelah dispensing).
- Setiap `invoice_item` menyimpan **snapshot**: nama item, kategori, harga satuan, qty — tidak berubah walau master berubah.
- Kasir membuka daftar encounter status `waiting_payment`, melihat rincian, memproses pembayaran: tunai (dengan hitung kembalian), transfer, QRIS statis (konfirmasi manual). Split payment sederhana *(P1)*.
- Diskon: nominal/persen per invoice, batas otoritas per role, wajib alasan. *(P1)*
- Pembayaran sukses → cetak kuitansi (PDF/thermal-friendly) → encounter `completed`.
- Rekap kas harian per kasir (shift): total per metode bayar, untuk serah terima.
- Void pembayaran hanya oleh admin, wajib alasan, tercatat; data tidak dihapus (reversal entry).

### M11 — Rekam Medis & Audit

- **Audit kelengkapan**: daftar encounter dengan dokumentasi tidak lengkap (catatan belum final / tanpa diagnosa terkode) + umur keterlambatan; petugas RM menindaklanjuti ke dokter.
- **Riwayat pasien lengkap**: timeline semua encounter + detail; akses oleh petugas RM tercatat dengan tujuan akses.
- **Access log (append-only)**: setiap pembukaan halaman berisi data klinis pasien mencatat: user, pasien, encounter (jika ada), konteks halaman, timestamp, flag break-the-glass + alasan. Tidak ada UI hapus/edit. Retensi mengikuti retensi RM.
- **Resume medis**: generate PDF ringkasan riwayat untuk permintaan resmi (rujukan/asuransi). *(P1)*
- **Retensi**: tidak ada penghapusan data klinis. Arsip/inaktif hanya berupa penanda, minimal 25 tahun sejak kunjungan terakhir.

### M12 — Laporan & Dashboard

- **Dashboard admin**: kunjungan hari ini (per poli, per status), pendapatan hari ini, pasien baru vs lama, rata-rata waktu tunggu, resep menunggu, stok kritis.
- **Laporan** (filter periode, export Excel/PDF):
  - Kunjungan: per poli, per dokter, per jenis pasien.
  - Pendapatan: per kategori (konsultasi/tindakan/lab/obat), per poli, per dokter, per metode bayar.
  - Morbiditas: 10/20 besar penyakit berdasarkan ICD-10.
  - Farmasi: pemakaian obat, kartu stok, nilai persediaan.
  - Kinerja antrian: rata-rata waktu tunggu per stage per poli.

### M13 — Pengaturan Klinik & Dokumen Cetak

- Profil klinik: nama, logo, alamat, telepon, jam operasional, nomor izin — dipakai di kop semua dokumen.
- Konfigurasi: format nomor RM, format nomor antrian per poli, teks TTS panggilan, biaya pendaftaran default, kebijakan blokir encounter belum final.
- Template dokumen cetak: resep, kuitansi, surat sakit/sehat/rujukan, hasil lab, resume medis (PDF; kuitansi mendukung ukuran thermal 58/80mm).

---

## 4. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Keamanan | Password hashing (bcrypt/argon2), rate limiting login, session timeout konfigurabel, HTTPS wajib di produksi, enkripsi at-rest untuk field sensitif tertentu (NIK) |
| Privasi | RBAC need-to-know, access log append-only, break-the-glass, tidak ada data pasien di URL (gunakan UUID/route model binding aman) |
| Integritas | Catatan klinis final immutable + addendum; transaksi finansial reversal-only; stok append-only movements; snapshot fields |
| Ketersediaan | Target uptime jam operasional > 99%; backup database otomatis harian + sebelum update |
| Performa | Registrasi pasien lama < 1 menit; halaman worklist & display polling 3–5 dtk tanpa degradasi; pencarian pasien < 500 ms pada 100k pasien |
| Kompatibilitas | Browser modern (Chrome/Edge terbaru); display antrian di TV via browser fullscreen; printer thermal via print dialog |
| Lokalisasi | Seluruh UI & validasi Bahasa Indonesia; tanggal WIB (simpan UTC); Rupiah BIGINT tanpa desimal |
| Auditabilitas | Activity log perubahan master data & transaksi penting (spatie/laravel-activitylog) |

## 5. Keputusan Arsitektur Kunci

1. **Encounter-centric**: seluruh data klinis & finansial ber-FK ke `encounters`, memungkinkan rekam medis longitudinal dan billing per kunjungan yang bersih.
2. **Queue sebagai state machine alur pasien**: worklist semua role dibangun di atas tabel antrian yang sama; perpindahan stage = transisi status antrian + encounter.
3. **Immutability selektif**: klinis final & finansial = append-only/addendum; master data = soft delete + activity log.
4. **FHIR-friendly tanpa integrasi**: diagnosa terkode ICD-10, vital signs terstruktur per field, konsep encounter — memudahkan integrasi SATUSEHAT di fase berikutnya tanpa restrukturisasi.
5. **Polling, bukan WebSocket**: kompatibel shared hosting; interval 3–5 detik cukup untuk kebutuhan antrian klinik.
6. **Service–Repository–Action** (konvensi standar): Controller tipis → Action per use case (mis. `FinalizeClinicalNoteAction`, `DispensePrescriptionAction`) → Service/Repository.

## 5a. Konvensi Query & Anti N+1 (wajib di semua modul)

1. **`Model::preventLazyLoading(! app()->isProduction())`** diaktifkan di `AppServiceProvider::boot()` — lazy loading melempar exception di lokal/testing sehingga N+1 ketahuan sejak development, tidak sampai produksi.
2. **Eager loading eksplisit di Repository/Query class**, bukan `$with` global di model (kecuali relasi yang benar-benar selalu dibutuhkan, mis. `Encounter` → `patient:id,name,medical_record_number`). Selalu batasi kolom: `->with(['patient:id,name,medical_record_number', 'doctor.user:id,name'])`.
3. **Query worklist/antrian (polling 3–5 dtk) harus paling ringan**: select kolom seperlunya, eager load minimal, index sesuai ERD §2.7, dan hasil di-cache singkat bila perlu. Endpoint polling tidak boleh menyentuh relasi klinis berat.
4. **Agregat via `withCount`/`withSum`/subquery**, bukan loop koleksi: jumlah antrian per poli, total invoice, sisa stok (`stock_quantity` cache + rekonsiliasi `SUM(stock_movements)` via command terjadwal).
5. **Listing selalu server-side pagination** (`->paginate()`), tidak pernah `->get()` tanpa batas pada tabel transaksional (encounters, queues, invoice, access logs).
6. **Riwayat pasien di EMR**: daftar encounter dimuat ringkas (tanggal, poli, diagnosa utama via join/subselect); detail per encounter dimuat saat diklik (Inertia v3 `Inertia::optional()` / partial reload), bukan semuanya di muka.
7. **Guard rail pengujian**: gunakan Pest + `AssertableJson`/`expect(DB::getQueryLog())` atau `assertDatabaseQueryCount` pattern pada endpoint kritis (worklist, EMR, kasir) untuk mengunci jumlah query maksimum agar regresi N+1 tertangkap CI.
8. **Inertia v3 polling bawaan** (`usePoll`) dipakai untuk worklist & display antrian — bukan interval manual — dengan `only: [...]` agar hanya prop antrian yang di-refetch.

## 6. Open Questions

1. Apakah klinik target memiliki poli gigi? (Odontogram adalah modul khusus yang cukup besar — usul: fase 2.)
2. Apakah perlu dukungan asuransi swasta manual (penjamin, plafon) di MVP, atau semua pasien umum dulu?
3. Printer kuitansi: thermal atau A5/A4 biasa?
4. Apakah stok obat perlu harga beli & laporan laba kotor di MVP, atau cukup kartu stok?

## 7. Progress Implementasi

**M1 Done** — Auth Fortify + RBAC spatie, 8 role / 14 permission, User CRUD + policy, 15 test pass.

**Database Done** — 28 migration (27 bisnis + spatie/fortify), 27 Eloquent model dengan relasi + casts, factory + MasterDataSeeder (8 dept, 8 svc, 15 ICD-10, 12 meds, 5 lab tests + 11 params).
