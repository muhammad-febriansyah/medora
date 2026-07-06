# Medora — User Stories

> Format: Sebagai [role], saya ingin [aksi], agar [manfaat].
> Prioritas: **P0** = MVP wajib, **P1** = penting setelah MVP stabil, **P2** = nice-to-have.

---

## 1. Petugas Pendaftaran (Front Office)

| ID | User Story | Prioritas |
|---|---|---|
| FO-01 | Sebagai petugas pendaftaran, saya ingin mendaftarkan pasien baru dengan data demografi (nama, NIK, tanggal lahir, jenis kelamin, alamat, telepon) sehingga pasien mendapat nomor RM unik seumur hidup. | P0 |
| FO-02 | Sebagai petugas pendaftaran, saya ingin mencari pasien lama berdasarkan nomor RM, NIK, nama, atau tanggal lahir agar registrasi kunjungan ulang cepat (< 1 menit). | P0 |
| FO-03 | Sebagai petugas pendaftaran, saya ingin membuat registrasi kunjungan (encounter) dengan memilih poli dan dokter yang praktik hari itu, sehingga pasien otomatis masuk antrian poli tersebut. | P0 |
| FO-04 | Sebagai petugas pendaftaran, saya ingin mencetak/menampilkan nomor antrian pasien agar pasien tahu urutannya. | P0 |
| FO-05 | Sebagai petugas pendaftaran, saya ingin melihat jadwal praktik dokter hari ini beserta kuota agar tidak mendaftarkan pasien ke dokter yang tidak praktik/penuh. | P0 |
| FO-06 | Sebagai petugas pendaftaran, saya ingin memperbarui data demografi pasien (alamat, telepon) dengan riwayat perubahan tercatat. | P1 |
| FO-07 | Sebagai petugas pendaftaran, saya **tidak boleh** melihat catatan klinis pasien (SOAP, diagnosa) — hanya data demografi dan status kunjungan. | P0 |
| FO-08 | Sebagai petugas pendaftaran, saya ingin membatalkan registrasi kunjungan (pasien pulang sebelum diperiksa) dengan alasan tercatat. | P0 |

## 2. Perawat

| ID | User Story | Prioritas |
|---|---|---|
| NS-01 | Sebagai perawat, saya ingin melihat worklist pasien yang menunggu di poli saya hari ini agar tahu siapa yang harus dilayani berikutnya. | P0 |
| NS-02 | Sebagai perawat, saya ingin memanggil pasien berikutnya (tombol "Panggil") sehingga nomor tampil di display ruang tunggu dan diumumkan via suara. | P0 |
| NS-03 | Sebagai perawat, saya ingin mencatat vital signs terstruktur (TD sistolik/diastolik, nadi, suhu, RR, SpO2, BB, TB) dan keluhan utama pasien sebelum masuk ke dokter. | P0 |
| NS-04 | Sebagai perawat, saya ingin menandai pasien "skip" jika tidak hadir saat dipanggil, dan bisa recall kembali kemudian. | P0 |
| NS-05 | Sebagai perawat, saya ingin melihat riwayat vital signs pasien di kunjungan sebelumnya sebagai pembanding. | P1 |
| NS-06 | Sebagai perawat, saya ingin mencatat riwayat alergi pasien sehingga muncul sebagai peringatan mencolok di semua layar klinis. | P0 |

## 3. Dokter

| ID | User Story | Prioritas |
|---|---|---|
| DR-01 | Sebagai dokter, saya ingin melihat worklist pasien poli saya (sudah asesmen perawat) dan memanggil pasien berikutnya. | P0 |
| DR-02 | Sebagai dokter, saya ingin melihat ringkasan pasien di satu layar: identitas, alergi (highlight), vital signs hari ini, dan riwayat kunjungan sebelumnya. | P0 |
| DR-03 | Sebagai dokter, saya ingin menulis catatan pemeriksaan dalam format SOAP (Subjective, Objective, Assessment, Plan). | P0 |
| DR-04 | Sebagai dokter, saya ingin memilih diagnosa dengan autocomplete kode ICD-10 (utama + sekunder) agar diagnosa terkode standar. | P0 |
| DR-05 | Sebagai dokter, saya ingin mencatat tindakan medis (kode ICD-9-CM + tarif otomatis dari master layanan) sehingga masuk ke billing. | P0 |
| DR-06 | Sebagai dokter, saya ingin membuat e-resep (pilih obat dari master + dosis + aturan pakai + jumlah) sehingga otomatis masuk antrian farmasi. | P0 |
| DR-07 | Sebagai dokter, saya ingin membuat order pemeriksaan lab internal dan menerima notifikasi/hasil di worklist saat hasil selesai. | P0 |
| DR-08 | Sebagai dokter, saya ingin mem-finalisasi catatan klinis; setelah final tidak dapat diedit, hanya bisa menambah addendum bertanda waktu. | P0 |
| DR-09 | Sebagai dokter, saya ingin mencetak surat keterangan sakit, surat sehat, dan surat rujukan yang terisi otomatis dari data kunjungan. | P0 |
| DR-10 | Sebagai dokter, saya ingin mengakses RM pasien yang bukan pasien saya dalam kondisi darurat (break-the-glass) dengan mengisi alasan yang tercatat di audit log. | P1 |
| DR-11 | Sebagai dokter, saya ingin menggunakan template SOAP untuk keluhan umum (ISPA, hipertensi kontrol, dsb.) agar dokumentasi lebih cepat. | P1 |
| DR-12 | Sebagai dokter, saya ingin melihat peringatan interaksi/duplikasi sederhana ketika meresepkan obat yang sama dengan resep aktif pasien. | P2 |

## 4. Apoteker / Petugas Farmasi

| ID | User Story | Prioritas |
|---|---|---|
| PH-01 | Sebagai apoteker, saya ingin melihat antrian resep masuk (dipisah racikan / non-racikan) secara real-time (polling). | P0 |
| PH-02 | Sebagai apoteker, saya ingin melakukan telaah resep (verifikasi) dan menandai resep bermasalah untuk konfirmasi ke dokter. | P0 |
| PH-03 | Sebagai apoteker, saya ingin memproses dispensing sehingga stok obat berkurang otomatis dan pasien terpanggil untuk penyerahan obat. | P0 |
| PH-04 | Sebagai apoteker, saya ingin mengelola master obat (nama, satuan, harga jual, stok minimum) dan mencatat stok masuk (pembelian) & penyesuaian (stock opname). | P0 |
| PH-05 | Sebagai apoteker, saya ingin melihat daftar obat di bawah stok minimum dan yang mendekati kadaluarsa. | P1 |
| PH-06 | Sebagai apoteker, saya ingin mengganti obat dengan substitusi (konfirmasi dokter) jika stok habis, dengan perubahan tercatat. | P1 |

## 5. Petugas Laboratorium

| ID | User Story | Prioritas |
|---|---|---|
| LB-01 | Sebagai petugas lab, saya ingin melihat daftar order lab masuk dari dokter beserta jenis pemeriksaannya. | P0 |
| LB-02 | Sebagai petugas lab, saya ingin menginput hasil pemeriksaan per parameter (nilai + satuan + rentang normal + flag H/L) sehingga hasil terkirim ke dokter pemesan. | P0 |
| LB-03 | Sebagai petugas lab, saya ingin mencetak hasil lab dengan kop klinik. | P0 |

## 6. Kasir

| ID | User Story | Prioritas |
|---|---|---|
| CS-01 | Sebagai kasir, saya ingin melihat daftar kunjungan yang siap dibayar dengan rincian otomatis (konsultasi, tindakan, lab, obat). | P0 |
| CS-02 | Sebagai kasir, saya ingin memproses pembayaran (tunai / transfer / QRIS statis) dan mencetak kuitansi. | P0 |
| CS-03 | Sebagai kasir, saya ingin memberikan diskon dengan batas otoritas dan alasan tercatat. | P1 |
| CS-04 | Sebagai kasir, saya ingin melihat rekap kas harian per shift saya untuk serah terima. | P0 |
| CS-05 | Sebagai kasir, saya **tidak boleh** melihat diagnosa/catatan klinis — hanya item tagihan. | P0 |

## 7. Petugas Rekam Medis

| ID | User Story | Prioritas |
|---|---|---|
| RM-01 | Sebagai petugas RM, saya ingin melihat daftar encounter dengan dokumentasi belum lengkap (tanpa diagnosa terkode / SOAP belum final) untuk ditindaklanjuti ke dokter. | P0 |
| RM-02 | Sebagai petugas RM, saya ingin mencari & membuka rekam medis pasien lengkap (semua kunjungan) untuk keperluan administrasi resmi. | P0 |
| RM-03 | Sebagai petugas RM, saya ingin melihat access log: siapa mengakses RM pasien mana, kapan, dari halaman apa. | P0 |
| RM-04 | Sebagai petugas RM, saya ingin mencetak resume medis pasien untuk keperluan rujukan/asuransi atas permintaan resmi. | P1 |
| RM-05 | Sebagai petugas RM, saya ingin laporan 10 besar penyakit (ICD-10) per periode. | P0 |

## 8. Admin / Pemilik Klinik

| ID | User Story | Prioritas |
|---|---|---|
| AD-01 | Sebagai admin, saya ingin mengelola user, role, dan permission granular per jenis data. | P0 |
| AD-02 | Sebagai admin, saya ingin mengelola master data: poli, dokter & jadwal praktik, layanan & tarif, obat, pemeriksaan lab, kode ICD-10/ICD-9-CM. | P0 |
| AD-03 | Sebagai admin, saya ingin dashboard: kunjungan hari ini per poli, pendapatan, pasien baru vs lama, rata-rata waktu tunggu. | P0 |
| AD-04 | Sebagai admin, saya ingin laporan pendapatan per periode, per poli, per dokter, dan per kategori (konsultasi/tindakan/obat/lab). | P0 |
| AD-05 | Sebagai admin, saya ingin mengatur profil klinik (nama, logo, alamat, kop surat) yang tampil di semua dokumen cetak. | P0 |
| AD-06 | Sebagai admin, saya ingin melihat audit trail perubahan data master & transaksi penting. | P1 |

## 9. Pasien (di Ruang Tunggu — tanpa login)

| ID | User Story | Prioritas |
|---|---|---|
| PT-01 | Sebagai pasien, saya ingin melihat layar display antrian per poli (nomor yang sedang dipanggil + berikutnya) agar tahu kapan giliran saya. | P0 |
| PT-02 | Sebagai pasien, saya ingin mendengar panggilan suara nomor antrian dan poli tujuan. | P0 |
| PT-03 | Sebagai pasien, saya ingin melihat antrian pengambilan obat di farmasi. | P0 |
