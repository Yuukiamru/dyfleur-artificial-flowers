# D'YFleur — Design Plan

Status: FASE 1 — DESIGN PLAN  
Tanggal: 2026-11-24  
Basis: Audit yang disetujui; arah visual dipertahankan, fokus pada aksesibilitas, kejelasan pembelian, dan penyederhanaan builder.

## 1. Tujuan dan prinsip

1. Pertahankan identitas burgundy/off-white, tipografi display yang elegan, dan karakter premium.
2. Buat alur shop dan custom bouquet lebih jelas pada mobile tanpa menghilangkan kemampuan kustomisasi.
3. Jadikan harga, ongkir, dan status demo mudah dipahami sebelum pengguna memasukkan data atau menekan CTA.
4. Pertahankan akses keyboard, nama kontrol yang jelas, state yang diumumkan, dan dukungan reduced motion.
5. Jangan membuat klaim material, ketersediaan, garansi, atau pengiriman sebelum datanya dikonfirmasi pemilik.

## 2. Design tokens

### Fondasi yang dipertahankan

| Token | Nilai saat ini / arah | Penggunaan |
|---|---|---|
| Wine | `#351923` | Header, tombol utama, teks aksen gelap |
| Wine 2 | `#4a2030` | Hover/variasi permukaan gelap |
| Wine 3 | `#642f43` | Fokus, tautan, aksen |
| Rose | `#c9959a` | Aksen dekoratif |
| Rose light | `#ead4d2` | Latar aksen lembut |
| Ivory | `#f7f2eb` | Latar halaman |
| Paper | `#fffdf9` | Kartu, panel, dialog |
| Ink | `#291d20` | Teks utama |
| Muted | `#6f595d` pada branch audit | Teks sekunder; ukur kontras ulang pada semua latar sebelum implementasi |
| Line | `rgba(53, 25, 35, 0.14)` | Divider dan batas halus |
| Display | Bodoni Moda | Judul editorial dan heading |
| Sans | Inter | Navigasi, kontrol, isi, dan angka |

### Aturan penggunaan

- Teks normal harus memenuhi rasio kontras minimal 4.5:1; teks besar minimal 3:1. Jangan menganggap nilai token sudah lulus tanpa mengukur pasangan warna sebenarnya.
- Jangan memakai warna rose muda untuk teks kecil di atas ivory/paper.
- Fokus keyboard: outline kontras, minimal 2px, offset yang terlihat, tidak dihapus tanpa pengganti.
- Spasi mengikuti skala 4/8/12/16/24/32px; radius kecil untuk kontrol dan radius sedang untuk kartu/panel.
- Pertahankan bayangan lembut; gunakan border dan spacing sebagai pemisah utama.

## 3. Inventaris komponen

| Komponen | Tugas dan state penting | Arah desain |
|---|---|---|
| Header dan navigasi | Brand, anchor section, menu mobile, cart count | Ringkas; bahasa Indonesia konsisten; fokus dan expanded state jelas |
| Hero | Satu pesan utama, CTA ke katalog, dekorasi bunga | CTA utama stabil di semua breakpoint; dekorasi tidak menghalangi teks |
| Katalog / shop | Search, sort, pilihan produk, hasil, empty result | Label Indonesia, pilihan aktif dapat dikenali tanpa warna saja |
| Detail produk | Foto, deskripsi, harga, dimensi, komposisi, Add to Cart | CTA jelas; spesifikasi dan ketidakpastian data mudah dipindai |
| Bouquet builder | Kategori, bunga, wrapping, preview, editor manual/otomatis, nama, estimasi | Jadikan langkah utama progresif; kontrol lanjutan tetap tersedia sebagai opsi |
| Cart drawer | Item, kuantitas, hapus/edit, subtotal, checkout | Pertahankan isolasi halaman, keyboard trap, Escape, dan restore focus |
| Checkout dialog | Alamat, pengiriman simulasi, metode pembayaran, ringkasan | Nyatakan simulasi sebelum aksi; jangan memberi kesan pembayaran sungguhan |
| Riwayat dan status order | Pesanan lokal, status demo, konfirmasi WhatsApp | Tegaskan bahwa data hanya tersimpan di browser dan status bukan tracking live |
| Toast dan live regions | Hasil aksi, error, perubahan kuantitas | Pesan singkat, spesifik, diumumkan sekali tanpa memindahkan fokus |
| About dan footer | Cerita brand, kontak, bantuan | Copy ringkas dan detail kontak diverifikasi pemilik |

## 4. Wireframe teks

### Homepage / hero

```text
[Brand]                      [Menu] [Keranjang (n)]

        Headline singkat tentang bunga artifisial
        Satu kalimat manfaat yang tidak menjanjikan hal tak terverifikasi
        [Jelajahi koleksi]

        Aset bunga dekoratif (tidak menutupi teks/CTA)
```

Pada layar kecil, susun konten secara normal (tanpa posisi CTA absolut yang rapuh), tampilkan CTA di area awal, lalu lanjutkan ke katalog.

### Shop

```text
[Judul koleksi] [Intro]
[Cari produk____________] [Urutkan]
[Hasil / empty state]

Desktop: [Daftar pilihan produk] [Detail + gambar + harga + CTA]
Mobile:  [Pilihan produk]
         [Gambar]
         [Nama, deskripsi, dimensi, komposisi, harga]
         [CTA tambah ke keranjang]
```

### Custom bouquet

```text
[Langkah 1: Pilih bunga] [Langkah 2: Wrapping] [Langkah 3: Tinjau]

Langkah aktif:
[Kategori / katalog material] [Preview bouquet]
[Kontrol dasar]

Tinjau:
[Nama bouquet] [Ringkasan item dan estimasi harga]
[Kontrol manual lanjutan (opsional)]
[Tambah bouquet ke keranjang]
```

Desktop boleh menampilkan katalog, preview, dan kontrol berdampingan. Pada mobile, dahulukan tugas saat ini dan preview; kontrol lanjutan dapat dibuka setelah pengguna memilih bunga. Jangan menghapus pengaturan manual yang sudah ada.

### Cart dan checkout

```text
Cart drawer:
[Keranjang] [Tutup]
[Item, preview custom, jumlah, edit/hapus]
[Subtotal]
[Catatan: checkout/pengiriman masih simulasi]
[Lanjut ke checkout]

Checkout:
[Alamat] [Zona pengiriman: tarif simulasi]
[Metode pembayaran demo] [Ringkasan]
[Peringatan transaksi belum diproses]
[Buat pesanan demo]
```

## 5. UX copy matrix

| Lokasi / keadaan | Copy yang disarankan | Catatan |
|---|---|---|
| Skip link | “Langsung ke konten utama” | Tampilkan saat mendapat fokus |
| Navigasi | “Beranda”, “Koleksi”, “Buat Bouquet”, “Tentang”, “Kontak” | Gunakan istilah yang konsisten |
| Hero CTA | “Jelajahi koleksi” | Satu CTA primer |
| Search | Label “Cari bouquet”; placeholder “Cari nama atau jenis bunga” | Placeholder bukan pengganti label |
| Hasil kosong | “Tidak ada produk yang cocok. Coba kata kunci lain.” | Sediakan tindakan hapus pencarian |
| Produk | “Harga”, “Ukuran (lebar × tinggi)”, “Komposisi bunga” | Tandai estimasi bila angka belum final |
| Builder kosong | “Pilih bunga untuk mulai menyusun bouquet.” | Jelaskan aksi pertama |
| Batas bunga | “Maksimal 12 bunga per bouquet.” | Umumkan saat batas tercapai |
| Harga builder | “Estimasi harga” | Tarif belum final harus ditandai dekat total |
| Cart kosong | “Keranjang masih kosong.” / “Jelajahi koleksi” | CTA menuju katalog |
| Kuantitas | “{nama}, jumlah {jumlah}” | Pesan status untuk screen reader |
| Checkout | “Checkout demo — pembayaran belum diproses.” | Tampilkan sebelum tombol submit |
| Ongkir | “Estimasi simulasi; belum dihitung dari alamat.” | Jangan gunakan “ongkir final” |
| Pesanan tersimpan | “Pesanan demo tersimpan di browser ini.” | Bedakan dari konfirmasi pembayaran |
| Error penyimpanan | “Pesanan gagal disimpan. Keranjang tetap aman; coba lagi.” | Pertahankan input dan cart |
| Riwayat | “Riwayat hanya tersimpan di browser ini.” | Hindari kesan sinkronisasi akun |

Semua harga, nomor kontak, metode pembayaran, dan klaim operasional harus dikonfirmasi pemilik sebelum copy produksi.

## 6. Motion spec

- Transisi standar 160–240ms dengan easing lembut; utamakan opacity dan transform kecil.
- Hindari animasi dekoratif yang terus bergerak atau menunda interaksi/CTA.
- Hormati `prefers-reduced-motion`: matikan gerak dekoratif, smooth scrolling, dan transisi non-esensial.
- Jangan mengandalkan animasi untuk menyampaikan state; state terpilih, error, dan fokus harus tetap terlihat tanpa motion.
- Uji menu, drawer, dialog, preview builder, dan fokus pada mode reduced motion.

## 7. Prioritas kerja

| Prioritas | Pekerjaan | Kriteria selesai |
|---|---|---|
| P0 | Perbaiki focus trap pada branch `feat/dyfleur-trust-accessibility-ux` dengan daftar elemen fokus berbentuk array; buat commit terpisah sesuai pesan yang diminta | Tab dan Shift+Tab bekerja saat cart kosong maupun berisi; Escape menutup drawer; fokus kembali ke pemicu; tidak ada TypeError |
| P1 | Verifikasi aksesibilitas dasar | Skip link, alt, fokus, live region, dan kontras diuji dengan keyboard dan axe; pasangan teks normal memenuhi 4.5:1 |
| P1 | Rapikan copy kritis pembelian | Harga, ongkir, pembayaran, dan status demo jelas sebelum aksi; klaim belum terverifikasi tidak ditampilkan sebagai fakta |
| P2 | Sederhanakan builder menjadi tiga langkah progresif | Bunga, wrapping, dan tinjau mudah dipahami pada mobile; preview serta edit manual tetap ada |
| P2 | Stabilkan hero dan layout responsif | CTA utama terlihat dan dapat digunakan pada viewport 375/390px; tidak ada overflow |
| P3 | Verifikasi trust data | Pemilik mengonfirmasi WhatsApp, email, harga, material, pengemasan, dan pengiriman sebelum publikasi |
| P3 | Ukur performa dan SEO | Lighthouse mobile/desktop dan metadata diperiksa setelah desain disetujui |

Tidak ada implementasi produk yang termasuk dalam fase dokumen ini. Implementasi dimulai setelah rencana desain ditinjau dan prioritas disetujui.
