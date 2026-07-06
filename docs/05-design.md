# Medora — Design System & UI Guidelines (design.md)

> Single source of truth untuk konsistensi UI di seluruh modul.
> Semua sesi development WAJIB mengikuti dokumen ini. Jika ada kebutuhan di luar dokumen, tambahkan ke dokumen ini dulu — jangan improvisasi per halaman.

---

## 1. Identitas Visual

### Warna Brand (dari logo Medora — biru royal)

| Token | Hex | Penggunaan |
|---|---|---|
| `primary` | `#2B50E0` | Warna biru logo. Tombol utama, link, elemen aktif, fokus ring |
| `primary-dark` | `#2140C4` | Hover/active tombol utama |
| `primary-light` | `#E8EDFC` | Background badge/highlight primary, row selected |
| `sidebar` | `#0F1E4D` | Background sidebar (navy turunan primary) |

> Definisikan sekali sebagai `@theme` token di Tailwind v4 (`--color-primary: #2B50E0;` dst. di `app.css`) dan map ke CSS variable shadcn (`--primary`); jangan hardcode hex di komponen. Verifikasi hex final dengan color picker dari file master logo — nilai di atas hasil sampling dari PNG.

### Warna Semantik (fixed, jangan diganti)

| Peran | Warna | Contoh |
|---|---|---|
| Success | green-600 / green-100 | Pembayaran sukses, catatan final, stok aman |
| Warning | amber-600 / amber-100 | Draft, stok menipis, resep flagged |
| Danger | red-600 / red-100 | Alergi, void, cancelled, stok habis |
| Info | blue-600 / blue-100 | Status netral proses (dipanggil, in progress) |
| Muted | gray-500 / gray-100 | Nonaktif, skipped, arsip |

### Tipografi

- Font: **Poppins** (semua weight via next/font-nya Vite atau `@font-face` lokal — jangan CDN Google Fonts di produksi klinik dengan internet terbatas; bundle lokal).
- Skala: `text-2xl font-semibold` (judul halaman) · `text-lg font-semibold` (judul section/card) · `text-sm` (body & tabel) · `text-xs text-muted-foreground` (label meta/timestamp).
- Angka penting (nomor antrian, total tagihan, vital signs): `tabular-nums`.
- **Light mode only.** Jangan implementasi dark mode / toggle theme.

---

## 2. Layout Global

- **Shell**: sidebar kiri fixed (ikon + label, collapsible) + header atas tipis (breadcrumb, nama user + role aktif, jam WIB live).
- **Sidebar menu dikelompokkan per fungsi**, difilter permission:
  `Dashboard · Pendaftaran (Pasien, Kunjungan) · Antrian · Pelayanan (Worklist Perawat, Worklist Dokter) · Farmasi (Antrian Resep, Obat, Stok) · Laboratorium · Kasir · Rekam Medis (Audit Kelengkapan, Access Log) · Laporan · Master Data · Pengaturan`
- **Page header standar** di semua halaman: judul + subjudul singkat di kiri, tombol aksi utama di kanan (`Button` primary, ikon lucide + label). Maks 1 tombol primary per halaman; aksi sekunder pakai `variant="outline"`.
- Lebar konten: `max-w-screen-2xl mx-auto px-6 py-6`. Form sederhana: `max-w-3xl`.
- Breadcrumb otomatis dari struktur route: `Master Data / Obat / Tambah`.

---

## 3. Konvensi Komponen (shadcn/ui)

### CRUD — TANPA MODAL

- Create/Edit/Detail = **halaman Inertia terpisah** (`/obat`, `/obat/create`, `/obat/{id}/edit`, `/obat/{id}`). Tidak ada Dialog untuk form CRUD.
- Dialog (`AlertDialog`) HANYA untuk: konfirmasi destruktif (hapus, void, batal kunjungan, finalize catatan) — wajib menyebut konsekuensi, tombol konfirmasi `variant="destructive"` (atau primary untuk finalize).

### Tabel

- Semua listing pakai **shadcn DataTable (TanStack Table)**: server-side pagination, sorting, kolom search global + filter per kolom seperlunya.
- Baris klik → halaman detail. Kolom aksi paling kanan: `DropdownMenu` (ikon ⋮) berisi Lihat/Edit/Hapus sesuai permission.
- Empty state: ikon lucide + kalimat singkat + tombol aksi ("Belum ada data obat. **Tambah Obat**").
- Format kolom: tanggal `dd MMM yyyy HH:mm` WIB · Rupiah `Rp 1.250.000` (format dari BIGINT, tanpa desimal) · status selalu `Badge`.

### Form

- Layout: label di atas input, grid 2 kolom di desktop (`grid-cols-1 md:grid-cols-2 gap-4`), field full-width untuk textarea.
- **Placeholder WAJIB di semua input** — berisi contoh nyata, bukan mengulang label: `Contoh: Budi Santoso`, `Contoh: 3175xxxxxxxxxxxx`, `Cari nama obat atau generik...`. Placeholder tidak menggantikan label; label tetap selalu tampil.
- **Field wajib ditandai asterisk merah** setelah label via komponen `RequiredLabel`: `Nama Pasien <span className="text-red-500">*</span>`. Field opsional tidak diberi tanda apa pun (jangan tulis "(opsional)").
- **Validasi react-hook-form + zod, seluruh pesan Bahasa Indonesia** — pakai zod locale ID / custom error map global sekali di `lib/zod-id.ts` (`"Nama pasien wajib diisi"`, `"NIK harus 16 digit"`, `"Format email tidak valid"`), JANGAN tulis pesan per-field berulang kecuali butuh spesifik. Error tampil di bawah field (`text-sm text-red-600`) + `border-red-500` + `aria-invalid`. Validasi backend (FormRequest) juga Bahasa Indonesia via `lang/id/validation.php` — pesan frontend & backend harus konsisten.
- Tombol form di kanan bawah: `Batal` (ghost, kembali) · `Simpan` (ActionButton create, loading state dengan spinner + disabled).
- Notifikasi hasil aksi: **Sonner dengan `richColors`** — mapping warna baku: `toast.success()` = hijau, `toast.warning()` = oranye, `toast.error()` = merah, `toast.info()` = biru. Sukses: `toast.success("Data obat berhasil disimpan")` · peringatan non-blocking (stok menipis, catatan belum final): `toast.warning(...)` · gagal/validasi server: `toast.error(...)`. Jangan pakai alert bawaan atau banner inline untuk feedback aksi.

### Komponen Input Baku (`components/shared/form/`)

Semua form WAJIB memakai komponen ini — jangan pakai `<Input>`/`<Select>` mentah untuk kasus di bawah:

| Komponen | Kapan dipakai | Spesifikasi |
|---|---|---|
| `AsyncCombobox` | **SEMUA select yang datanya dari tabel master/transaksional** (pasien, obat, ICD-10, layanan, lab test, dokter, poli) — select2-style | shadcn Combobox + search server-side: debounce 300ms, min. 1 karakter, tampilkan `kode — nama` + info sekunder (mis. sisa stok), loading spinner inline, pesan "Tidak ditemukan", opsi terpilih tetap tampil walau di luar hasil search. Backend: endpoint search ber-limit 20, index sesuai ERD. **Dilarang** load semua opsi ke client. `Select` biasa hanya untuk enum pendek statis (jenis kelamin, golongan darah, metode bayar). |
| `RupiahInput` | Semua input nominal uang (tarif, harga, diskon, tunai) | Prefix `Rp`, auto thousand separator titik saat mengetik (`1.250.000`), hanya digit, `inputMode="numeric"`, tanpa desimal; nilai form = integer murni (BIGINT-ready). Paste "Rp 1.250.000" ter-parse benar. |
| `DatePickerId` | Semua input tanggal (tgl lahir, periode laporan, expired obat) | shadcn Date Picker (Base UI — Calendar + Popover + Input) dengan locale `id`, format tampil `dd MMM yyyy`, nilai form ISO `yyyy-MM-dd`. Tanggal lahir: dropdown bulan+tahun (jangan paksa klik mundur puluhan tahun). Periode laporan: varian range picker. Bisa ketik manual `dd/mm/yyyy`. |
| `RichEditor` (Tiptap) | Textarea konten naratif panjang yang butuh formatting: **SOAP (S/O/A/P), instruksi racikan, catatan telaah resep, addendum, isi surat rujukan** | Toolbar minimal: bold, italic, bullet/numbered list, undo — TANPA heading/gambar/tabel/warna. Simpan sebagai HTML tersanitasi (server-side purify); render riwayat dengan sanitasi juga. Cetak dokumen me-render HTML ini. |
| `Textarea` biasa | Teks pendek non-naratif: alasan batal/void/adjustment, alamat, keluhan utama | Tanpa formatting; `rows={3}`. |
| `PhoneInput` | Nomor telepon | Hanya digit, normalisasi awalan `08`, validasi 9–14 digit. |
| `NikInput` | NIK | 16 digit, `inputMode="numeric"`, auto-strip non-digit. |

### Tombol Aksi (baku — WAJIB ikon + teks)

Setiap tombol aksi **wajib** terdiri dari ikon lucide + label teks — tidak boleh ikon saja (kecuali di dalam DropdownMenu ⋮ baris tabel) dan tidak boleh teks saja. Warna mengikuti jenis aksi, konsisten di seluruh aplikasi:

| Aksi | Ikon (lucide) | Warna | Kelas |
|---|---|---|---|
| Tambah / Simpan | `Plus` / `Save` | Primary (biru logo) | `bg-primary hover:bg-primary-dark text-white` |
| Edit / Ubah | `Pencil` | Hijau | `bg-green-600 hover:bg-green-700 text-white` |
| Hapus / Void / Batal kunjungan | `Trash2` / `Ban` | Merah | `bg-red-600 hover:bg-red-700 text-white` |
| Lihat / Detail | `Eye` | Netral | `variant="outline"` |
| Panggil (antrian) | `Megaphone` | Primary | `bg-primary text-white` |
| Lewati (antrian) | `SkipForward` | Amber | `bg-amber-500 hover:bg-amber-600 text-white` |
| Finalisasi | `LockKeyhole` | Primary | `bg-primary text-white` |
| Proses Pembayaran | `Banknote` | Hijau | `bg-green-600 text-white` |
| Cetak | `Printer` | Netral | `variant="outline"` |
| Kembali / Batal (form) | `ArrowLeft` / `X` | Ghost | `variant="ghost"` |
| Export | `Download` | Netral | `variant="outline"` |

Implementasi: satu komponen `ActionButton` di `components/shared/` yang menerima prop `action` (`create | edit | delete | view | call | skip | finalize | pay | print | back | export`) dan me-resolve ikon + warna dari mapping ini. Halaman **tidak boleh** menyusun kombinasi ikon/warna sendiri. Ukuran ikon `size-4`, posisi selalu di kiri teks, `gap-2`.

### Badge Status (baku — pakai persis mapping ini)

| Konteks | Status → Variant |
|---|---|
| Encounter | registered=info · nurse_assessment=info · in_consultation=primary · waiting_lab=warning · in_pharmacy=warning · waiting_payment=warning · completed=success · cancelled=danger |
| Antrian | waiting=muted · called=info(pulse) · serving=primary · done=success · skipped=danger |
| Catatan klinis | draft=warning "Draft" · final=success "Final 🔒" |
| Resep | submitted=info · verified=primary · flagged=danger · dispensed=success · handed_over=success |
| Invoice | draft=muted · waiting_payment=warning · paid=success · void=danger |
| Stok | aman=success · ≤minimum=warning · habis=danger |

---

## 4. Pola UI Spesifik Domain Klinis

### Banner Alergi (kritis)

- Jika pasien punya alergi: banner merah **selalu tampil** di atas semua halaman klinis (asesmen, EMR, farmasi, riwayat): `bg-red-50 border-l-4 border-red-600`, ikon `TriangleAlert`, teks `font-medium text-red-800`: "Alergi: Penisilin (berat), Udang (ringan)".
- Tidak boleh collapsible/dismissible. Jika tidak ada alergi, tampilkan chip abu kecil "Tidak ada alergi tercatat" (membedakan "tidak ada" vs "belum ditanya" — chip hanya muncul jika sudah pernah dikonfirmasi).

### Header Pasien (dipakai di semua layar klinis)

Komponen `PatientHeader` yang sama di asesmen perawat, EMR dokter, farmasi, riwayat RM:
`[Avatar inisial] Nama (L/45th) · No. RM · NIK · [banner alergi di bawahnya]`. Jangan bikin varian per halaman.

### Catatan Klinis Final vs Draft

- **Draft**: form SOAP editable, badge amber "Draft", tombol `Simpan Draft` (outline) + `Finalisasi` (primary, buka AlertDialog konfirmasi: "Setelah difinalisasi, catatan tidak dapat diubah").
- **Final**: seluruh konten jadi **read-only** — render sebagai teks, BUKAN input disabled. Badge hijau "Final 🔒" + meta "Difinalisasi oleh dr. X, 05 Jul 2026 14:32 WIB". Satu-satunya aksi: tombol `+ Tambah Addendum` → textarea di bawah, addendum tampil kronologis dengan border kiri amber + timestamp + nama.

### EMR Dokter (layar kerja utama)

- Satu halaman, dua kolom: kiri sticky (`PatientHeader`, vital signs hari ini, riwayat kunjungan collapsible) · kanan tab-section berurutan: SOAP → Diagnosa → Tindakan → Resep → Lab → Dokumen.
- Diagnosa: Combobox ICD-10 async; diagnosa utama ditandai badge primary "Utama"; maksimal 1 utama.
- Resep: baris item dinamis (obat combobox dengan sisa stok inline `(stok: 120)`, qty, signa); toggle "Racikan" mengubah baris jadi grup komposisi.

### Worklist & Antrian (perawat/dokter/farmasi)

- Layout kartu antrian dalam list vertikal, urut nomor. Kartu: nomor antrian besar (`text-2xl font-semibold tabular-nums`), nama pasien, badge status, waktu tunggu berjalan ("menunggu 12 mnt").
- Satu tombol aksi kontekstual per kartu sesuai status: waiting→`Panggil` · called→`Mulai Periksa` / `Lewati` · serving→`Selesai`.
- Auto-refresh polling **5 detik** (React Query `refetchInterval`), indikator sinkron kecil di pojok ("Diperbarui 14:32:05").

### Display Antrian (layar TV publik)

- Route publik `/display`, tanpa shell/sidebar, fullscreen, **satu-satunya layar dengan background gelap** (`bg-teal-950`, teks putih) agar terbaca dari jauh.
- Grid per poli: nama poli, **nomor dipanggil sangat besar** (`text-8xl font-bold tabular-nums`), 3 nomor berikutnya kecil di bawah. Kolom farmasi terpisah.
- Nomor baru dipanggil: animasi blink 3x + TTS (`SpeechSynthesis`, `id-ID`, antrean pengumuman sekuensial). Footer: jam WIB besar + nama klinik + running text (opsional dari pengaturan).
- Polling 3 detik.

### Kasir

- Layout dua kolom: kiri daftar encounter `waiting_payment` (kartu, search) · kanan detail invoice terpilih: tabel item (nama snapshot, qty, harga, subtotal per kategori), total besar (`text-3xl`), pilihan metode bayar (RadioGroup), input tunai dengan kembalian live.
- Setelah bayar: toast sukses + auto-buka print dialog kuitansi.

### Dokumen Cetak (resep, kuitansi, surat, hasil lab)

- Route print terpisah `/print/...` render HTML polos + `@media print`, tanpa shell. Kop klinik (logo + nama + alamat + izin) dari pengaturan, konsisten di semua dokumen.
- Kuitansi: dukung lebar thermal 80mm (`max-width: 72mm`, font mono/kecil) DAN A5 — pilih via query param dari pengaturan klinik.
- Semua dokumen: nomor dokumen, tanggal WIB, nama & jabatan penanda tangan, area ttd.

---

## 5. Interaksi & Feedback

- Loading: skeleton (shadcn `Skeleton`) untuk tabel/kartu; spinner hanya di tombol.
- Semua aksi tulis: tombol disabled + spinner saat submit; cegah double-submit.
- Konfirmasi destruktif selalu AlertDialog; sebutkan objeknya: "Batalkan kunjungan atas nama **Budi Santoso**?".
- Error server (500/timeout): toast error generik "Terjadi kesalahan, coba lagi" + log; jangan tampilkan stack trace.
- Keyboard: `Enter` submit form pencarian pasien; fokus otomatis ke field pertama saat halaman form terbuka; di kasir, fokus ke input tunai setelah pilih metode.

## 6. Bahasa & Microcopy

- Seluruh UI Bahasa Indonesia baku-ringan. Istilah medis tetap standar: SOAP, ICD-10, vital signs boleh "Tanda Vital".
- Tombol = kata kerja: `Simpan`, `Panggil`, `Finalisasi`, `Proses Pembayaran`. Hindari "OK/Submit/Ya".
- Konfirmasi sukses menyebut objek: "Resep berhasil dikirim ke farmasi".
- Tanggal: `dd MMM yyyy` (05 Jul 2026), waktu `HH:mm WIB`. Jangan format relatif ("2 jam lalu") kecuali di waktu tunggu antrian.

## 7. Performa & UX Tambahan (yang sering terlupa)

### Performa Frontend

- **Partial reload & `only`**: semua `usePoll` dan submit form yang tidak butuh full page pakai `only: [...]` agar hanya prop terkait yang di-refetch.
- **`Inertia::defer()` untuk data berat non-kritis**: statistik dashboard, grafik laporan — halaman render dulu, data menyusul dengan skeleton (aturan Inertia v3: deferred props wajib punya skeleton state).
- **Prefetch navigasi**: `<Link prefetch>` pada menu sidebar dan baris tabel → halaman detail terasa instan.
- **Code splitting per halaman** otomatis via Inertia + Vite — jangan import Tiptap/chart library di level global; lazy import hanya di halaman yang memakainya (Tiptap cukup berat, jangan sampai ikut ke bundle display antrian).
- **Optimistic update** (Inertia v3) untuk aksi antrian (Panggil/Lewati/Selesai) — UI langsung berubah, rollback otomatis jika gagal; penting karena ini aksi paling sering diklik seharian.
- Font Poppins & logo: self-host + preload; logo pakai SVG (bukan PNG) agar tajam di display TV.

### Performa Backend (melengkapi PRD §5a)

- Response endpoint search combobox < 200 ms: limit 20, select kolom minimal, index prefix pada kolom pencarian.
- Master data yang jarang berubah untuk combobox (poli, layanan aktif) boleh di-cache (`Cache::remember`, invalidate saat master diubah).
- Generate PDF (kuitansi ringan boleh sinkron; resume medis/laporan besar → queue + notifikasi selesai).
- `php artisan optimize` di deployment (config/route/view cache) + OPcache aktif.

### UX Tambahan

- **Command palette `Ctrl+K`** (shadcn Command): cari pasien dari mana pun → langsung ke profil/registrasi. Ini quality-of-life terbesar untuk petugas pendaftaran.
- **Autosave draft SOAP** (debounce 2 dtk) — pemeriksaan bisa terinterupsi; dokter tidak boleh kehilangan ketikan. Indikator kecil "Draf tersimpan 14:32".
- **Undo singkat via toast** untuk aksi ringan yang reversible (Lewati antrian): `toast.success("Antrian dilewati", { action: { label: "Urungkan" } })`.
- **Konfirmasi sebelum meninggalkan form kotor** (dirty state) — cegah kehilangan input registrasi/resep.
- Angka penting selalu `tabular-nums`; kolom uang rata kanan.
- Fokus otomatis mengikuti alur kerja: buka kasir → fokus search; pilih metode tunai → fokus input nominal; buka registrasi → fokus search pasien.
- Halaman error 403/404/419 custom Bahasa Indonesia dengan tombol kembali (419 = "Sesi berakhir, silakan login kembali").
- Target sentuh min. 40px tinggi untuk tombol worklist (perawat sering pakai tablet).

## 8. Aturan untuk Sesi Development (Claude Code)

1. Cek dokumen ini SEBELUM membuat halaman/komponen baru.
2. Komponen bersama (`PatientHeader`, `StatusBadge`, `ActionButton`, `QueueCard`, `MoneyText`, `DateText`, `AllergyBanner`, `PrintLayout`) dan komponen input baku (`AsyncCombobox`, `RupiahInput`, `DatePickerId`, `RichEditor`, `RequiredLabel`, `PhoneInput`, `NikInput`) hidup di `resources/js/components/shared/` — pakai yang ada, jangan duplikasi.
3. `StatusBadge` menerima domain + status dan me-resolve variant dari mapping §3 — mapping warna TIDAK boleh ditulis ulang di halaman.
4. Semua format uang lewat `MoneyText`/helper `formatRupiah()`; semua tanggal lewat `DateText`/`formatWIB()`.
5. Jika butuh pola baru yang belum ada di dokumen ini: berhenti, usulkan penambahan ke design.md, baru implementasi.
