# Audit Holistik D'YFleur

Status fase: FASE 0 — AUDIT HOLISTIK (REVISI P0)
Tanggal audit: 2026-11-24
Basis audit: `feat/dyfleur-trust-accessibility-ux` (`e5666af23e598f60451e9a3279f51ecaf6c729fa`)
Cabang aktif workspace: `fix/custom-bouquet-cart-mobile` (dikonfirmasi dari output terminal; `HEAD` pada `953d9a8`)
Mode revisi: perbandingan commit GitHub dan pemeriksaan statis sumber pada branch basis; tidak ada pengujian browser baru

> Batas bukti revisi: Branch aktif lokal `fix/custom-bouquet-cart-mobile` dikonfirmasi dari output terminal pengguna. Branch basis `feat/dyfleur-trust-accessibility-ux` terverifikasi melalui GitHub, bukan sebagai branch aktif lokal. Temuan dan pengukuran dari audit terdahulu tidak otomatis berlaku pada branch basis; hanya delta yang dapat dibuktikan secara statis yang diperbarui di bawah. Klaim pengujian browser sebelumnya dipertahankan sebagai riwayat, bukan hasil verifikasi branch basis.

> Catatan lingkup: Pemeriksaan Lighthouse mobile/desktop dan axe-core belum dapat dijalankan dari lingkungan saat ini karena akses npm/browser automation ke layanan lokal dibatasi. Temuan yang membutuhkan alat tersebut diberi status "BUTUH VERIFIKASI EKSTERNAL". Tidak ada klaim kepatuhan WCAG atau skor performa yang dibuat.

## Delta P0

Perbandingan GitHub mengonfirmasi `feat/dyfleur-trust-accessibility-ux` berada 8 commit di depan `fix/custom-bouquet-cart-mobile` (merge-base `953d9a88f128275d39c5311a28b29044c125381f`; tip `e5666af23e598f60451e9a3279f51ecaf6c729fa`). File berubah: `index.html`, `script.js`, `style.css`. Nomor P0-1..P0-6 di bawah mengikuti pemetaan audit ini; rincian P0-5 dan P0-6 adalah perubahan aksesibilitas cart yang juga terlihat dalam delta branch.

| Item | Status di branch basis | Bukti statis |
|---|---|---|
| P0-1 Skip navigation | FIX TERLIHAT | `index.html`: `<a class="skip-link" href="#main">` dan `<main id="main" tabindex="-1">`; commit `6cbebcef68b919faa43d49ba9b745016417d85dc`. |
| P0-2 Kontras teks sekunder | FIX TERLIHAT, rasio belum diukur ulang | `style.css`: `--muted: #6f595d` (menggantikan `#8b7779`); commit `75d1ce02b6da657428a6de0e7a172b29589ee04a`. Rasio kontras lama 3.76:1/4.12:1 tidak mewakili token baru. |
| P0-3 Alt gambar kartu produk | FIX TERLIHAT | `index.html`: tiga `.shop-card-art` kini mempunyai alt deskriptif; patch menampilkan alt untuk tiap bouquet, bukan `alt=""`; commit `6cbebcef68b919faa43d49ba9b745016417d85dc`. |
| P0-4 Fokus keyboard terlihat | FIX TERLIHAT di CSS | `style.css`: `:where(...):focus-visible` dan `.shop-product-card:focus-visible` menetapkan outline 2px dengan offset 3px; commit `75d1ce02b6da657428a6de0e7a172b29589ee04a`. Perilaku visual lintas latar belum diuji ulang di browser. |
| P0-5 Isolasi dan focus trap cart | PARTIAL — focus trap pasti melempar TypeError pada event Tab | `script.js:4` mendefinisikan `$` dengan `querySelector`. Pada focus trap (`script.js:1594-1597`), hasil `$()` langsung diberi `.filter()`, yang bukan metode `Element` atau `null`. Karena itu setiap event Tab ketika drawer terbuka melempar `TypeError`, terlepas dari jumlah item cart. Commit `bcb1360e2dc6537a6652ffa437d4174dffdbd71d`. |
| P0-6 Status dan batas kuantitas cart | FIX TERLIHAT di kode | `index.html`: `#cartQuantityStatus` berstatus live; `script.js`: perubahan jumlah mengumumkan status dan kuantitas dibatasi 1–99 (tombol tambah dinonaktifkan di 99). Commits `283764ae9f7c64958fccf462a9975ae55e0b3a6c` dan `e5666af23e598f60451e9a3279f51ecaf6c729fa`. Belum diuji ulang dengan screen reader/browser. |

Audit ulang ini bersifat statis dan dibatasi pada delta P0; tidak mengklaim bahwa seluruh pengujian visual/interaksi audit awal telah diulang pada branch basis.

## Ringkasan eksekutif

Situs memiliki identitas visual burgundy/off-white yang konsisten, landasan navigasi, katalog produk, pembuat rangkaian, keranjang, dan checkout demo yang sudah lengkap secara prototipe. Struktur halaman juga tunggal, dapat dipindai, dan sudah menggunakan bahasa Indonesia pada elemen serta konten utama.

Masalah paling penting adalah beberapa saluran konversi belum menjawab keraguan pembeli. Harga rangkaian kustom dibangun dari angka per batang yang ditandai sebagai nilai demo dalam kode, tetapi checkout juga secara eksplisit memakai ongkir simulasi. Informasi ini sudah disampaikan di UI, tetapi terlalu mudah dilewatkan dan dapat membingungkan jika pelanggan menganggap harga atau ongkir sudah final.

Dari sisi aksesibilitas, delta branch basis menambahkan skip link, alt deskriptif pada kartu produk, warna muted yang diperbarui, serta indikator fokus yang terlihat di CSS. Isolasi cart dan pengumuman perubahan kuantitas juga diperkuat. Efek aktual dan rasio kontras belum diuji ulang di browser pada branch ini.

Pengukuran overflow pada 375, 390, 768, 1024, dan 1440 piksel serta observasi browser berasal dari audit sebelumnya dan belum diulang pada branch basis. Stabilitas CTA hero belum dapat disimpulkan karena pengujian yang tersedia gagal.

## Metode dan bukti

Audit terdahulu membaca `index.html`, `style.css`, dan `script.js`, serta menjalankan observasi Playwright pada checkout, cart, viewport dan localStorage. Bukti tersebut dikumpulkan sebelum revisi branch dan tidak dianggap sebagai pengujian ulang `feat/dyfleur-trust-accessibility-ux`.

Untuk revisi ini, perbandingan GitHub memeriksa commit, daftar file berbeda, serta patch sumber pada `index.html`, `script.js`, dan `style.css`. Tidak ada browser/keyboard/screen-reader test yang berhasil dijalankan pada branch basis. Baris temuan selain delta P0 di bawah merupakan catatan dari audit sebelumnya dan harus diverifikasi ulang sebelum dianggap temuan aktif.

## Temuan

> Status baris yang bukan Delta P0: diwarisi dari audit sebelumnya dan belum dikonfirmasi ulang pada `feat/dyfleur-trust-accessibility-ux`.

| Area | Masalah | Bukti | Dampak (bisnis/a11y) | Severity |
|---|---|---|---|---|
| Navigasi | Skip link kini tersedia pada branch basis. | `index.html`: `.skip-link` mengarah ke `#main`; `<main>` memiliki `id="main"` dan `tabindex="-1"`. | Jalur lewati navigasi terlihat tersedia secara statis; operasi keyboard belum diuji ulang. | FIX TERLIHAT |
| Hero mobile | Stabilitas CTA belum dapat disimpulkan. | Klaim rect berubah berasal dari uji yang gagal dengan `Execution context was destroyed`; tidak ada angka rect valid untuk scroll-Y 0/200/400. Status: **BUTUH VERIFIKASI ULANG**. | Risiko perubahan posisi CTA belum terkonfirmasi. | Belum ditetapkan |
| Kontras teks | Token muted diperbaiki pada branch basis; nilai rasio belum diverifikasi ulang. | `style.css`: `--muted: #6f595d`; angka Playwright terdahulu 3.76:1/4.12:1 diambil untuk warna lama `#8b7779`. | Jangan menganggap rasio lama sebagai pengukuran kondisi branch ini. | BUTUH UKUR ULANG |
| Fokus keyboard | Selector fokus terlihat ada di CSS; perilaku aktual belum diuji. | `style.css`: `:where(...):focus-visible` dan `.shop-product-card:focus-visible` dengan outline 2px/offset 3px. | Kontras aktual pada semua latar dan komponen belum dipastikan secara visual. | BUTUH VERIFIKASI |
| Checkout | Copy checkout dan ongkir memakai status demo/simulasi, tetapi masih berada dalam alur "Place order". | `index.html: <p class="shipping-helper">Pilih zona sebagai estimasi demo...`; disclaimer demo akademik di checkout. | Bisa menurunkan kepercayaan atau menciptakan ekspektasi pembayaran/pengiriman nyata. | High |
| Harga kustom | Harga bunga dan wrapping dapat tampak final meskipun kode menyatakan katalog dan tarif masih provisi. | `script.js`: komentar "Catalog prices are provisional demo values until final prices are supplied."; wrapping dan ongkir memakai tarif kode. | Risiko pembeli mendapat komitmen harga yang belum final. | High |
| IA/label | Navigasi masih memakai nama bahasa Inggris tanpa konteks bahasa Indonesia yang konsisten. | `Home`, `Shop`, `Custom Bouquet`, `About Us`, `Contact`, `Add to Cart`, `Continue to order` pada halaman berbahasa Indonesia. | Daya yakin dan pemahaman menurun pada pengguna Indonesia. | Medium |
| Studio builder | Struktur editor sangat padat dan memakai kontrol "02 / ARRANGEMENT STUDIO" serta panel lain yang hampir identik. | `index.html` builder; satu katalog, canvas, editor, dan checkout tampil bersamaan pada desktop. | Beban kognitif tinggi, khususnya memilih bunga, wrapping, dan mengatur posisi. | High |
| Studio mobile | Urutan tiga panel (materi, preview, arrangement) berpotensi membuat pengguna memindah fokus terlalu jauh. | CSS grid desktop pada `.builder-workspace`; 375 belum diuji flow visual detail. | Konversi builder mungkin rendah dan kesalahan penempatan bunga lebih sering. | Medium |
| Cart | Drawer mengubah `aria-hidden`, `inert`, backdrop, dan `overflow` dengan benar, serta menetapkan fokus ke close. | Browser: drawer open, `aria-hidden=false`, `aria-modal=true`, backdrop visible, body overflow hidden, active element `closeCart`. | Dasar popup sudah kuat, tetapi trapping fokus Escape dan fokus kembali perlu pengujian menyeluruh. | Medium |
| Cart | Tidak ada mekanisme konfirmasi berbeda untuk `Clear cart`; native `confirm()` dipakai. | `script.js: clearCart` memanggil `window.confirm(...)`. | Konfirmasi native konsisten lintas browser tetapi belum premium dan sulit dikustomisasi. | Low |
| Cart drawer | Isolasi halaman terlihat, tetapi focus trap akan gagal pada setiap event Tab saat drawer terbuka. | `script.js:4` `$` memakai `querySelector`; `script.js:1594-1597` memanggil `.filter()` pada hasilnya. Daftar kandidat perlu memakai helper `$$(...)`. | Keyboard Tab/Shift+Tab di drawer memicu `TypeError`; trap gagal berjalan. Perlu diperbaiki dan diuji. | High |
| Dialog native | Checkout dan riwayat memakai `<dialog>`, tetapi close oleh backdrop memanggil `close()` tanpa guard internal. | `index.html` dan listener `click` pada `checkoutDialog`/`orderHistoryDialog`. | Umumnya aksesibel, tetapi perlu pengujian Escape, close, dan restore focus. | Medium |
| Produk | Alt deskriptif ditambahkan ke gambar kartu produk. | `index.html`: tiga `.shop-card-art` menyebut nama/jenis bouquet; lihat Delta P0 P0-3. | Memberi konteks gambar pada teknologi bantu; belum diuji dengan screen reader. | FIX TERLIHAT |
| SEO | Belum terlihat Open Graph/Twitter Card, canonical, dan structured data produk. | Head `index.html` hanya description dasar, favicon, viewport, dan theme color. | Potensi discoverability dan tampilan berbagi rendah. | Medium |
| Performance | Font Google memiliki 3 keluarga + beberapa weight dan aset SVG/PNG tanpa bukti ukuran/format. | `index.html` head; folder aset berisi PNG dan SVG, lazy loading hanya pada beberapa gambar. | Dapat memengaruhi LCP, CLS, dan render awal; Lighthouse harus mengukur. | Medium |
| Motion | Aturan `prefers-reduced-motion` ada pada branch basis; animasi belum diuji pada browser. | `style.css`: media query mengurangi durasi animasi/transisi dan menonaktifkan smooth scrolling. | Dukungan statis terlihat; efek terhitung aktual perlu verifikasi. | FIX TERLIHAT / BUTUH VERIFIKASI |
| WhatsApp | Nomor WhatsApp tersembunyi sebagai angka internasional dan dapat terlihat sebagai mock/nominal data. | `script.js: WHATSAPP_NUMBER = "08881548329"` dan konversi ke 628881548329. | Bila benar, ini inti pelanggan; perlu verifikasi pemilik. Jangan menyajikan sebagai data palsu. | High |
| Brand/copy | Email footer berpotensi salah domain (`dyfeur.com` versus nama brand D'YFleur). | `index.html`: `hello@dyfeur.com`. | Komunikasi pelanggan atau trust signal bisa gagal. | High |
| LocalStorage | Pembacaan data rusak ditangani dan tidak membuat halaman crash. | Browser: string tidak valid direload, cart count 0, warning console dari `readArray`, tidak ada page crash. | Keandalan baik untuk data corrupt. | Low |
| Console | Uji corrupt localStorage menghasilkan satu warning yang disengaja dan dapat digunakan. | Browser console: `Could not read lorem-cart-v1: SyntaxError...`. | Bukan JS fatal; perlu jaga agar fase berikutnya tidak menambah error runtime. | Low |

## Hal yang sudah baik dan jangan diubah

1. Identitas burgundy/off-white dan tipografi Bodoni + Inter sudah konsisten sebagai brand premium.
2. Halaman memiliki satu struktur single-page yang sederhana dan mudah dipindah ke shop/builder.
3. `lang="id"` sudah ada pada elemen root.
4. Landmark utama `header`, `nav`, `main`, dan `footer` tersedia.
5. Ada satu `h1` pada hero dan heading hierarchy untuk collection/builder/about/contact.
6. Semua gambar yang dilihat lewat Playwright memiliki atribut `alt`.
7. Search dan sort produk berlabel secara programatik.
8. Kartu produk memakai tombol serta `aria-pressed` untuk pilihan aktif.
9. Cart menyimpan data ke localStorage dan memvalidasi data dasar saat dibaca.
10. Data cart rusak tidak membuat halaman crash.
11. Cart drawer memakai `aria-modal`, menyembunyikan backdrop, mengunci body scroll, dan mengembalikan fokus ke kontrol penutup saat dibuka.
12. Checkout native `<dialog>` memberikan baseline modal browser dan kembali ke cart button saat ditutup.
13. Builder membatasi maksimum 12 bunga dan memberikan pembatasan angka 99 pada quantity cart.
14. UI checkout menandai ongkir sebagai simulasi dan status pesanan sebagai demo.
15. Ada live region untuk toast dan beberapa region hasil/filter.

## Redirect risk / regression guard

- Jangan mengubah harga produk atau membuat stok/ongkir/ulasan seolah-nyata tanpa data pemilik.
- Jangan menghapus fitur custom bouquet, cart edit, cart preview, atau order history yang sudah berfungsi.
- Jangan mengubah brand wine/off-white atau font display/sans secara total.
- Jangan mengganti native dialog/drawer dengan popup visual tanpa mempertahankan `Escape`, restore focus, dan keyboard trap.
- Jangan menambah dependency atau backend tanpa persetujuan fase implementasi.

## Rekomendasi arah redesign

Redesign disarankan bersifat penyederhanaan, bukan visual total:

1. Pertahankan hero mobile agar satu CTA utama tetap dapat dikenali dan posisinya stabil di 375x667.
2. Ukur ulang kontras teks sekunder untuk token `--muted: #6f595d` di seluruh latar yang digunakan.
3. Rapikan bahasa UI ke Bahasa Indonesia yang konsisten untuk mengurangi friksi pasar lokal.
4. Pecah builder menjadi tiga langkah yang jelas: pilih bunga, pilih wrapping, tinjau/beri nama. Pertahankan preview dan kontrol manual sebagai lanjutan opsional.
5. Tambahkan trust strip yang benar-benar tersedia: prosedur pengiriman, kondisi packaging, dan syarat custom tanpa membuat klaim material/garansi stok yang belum terverifikasi.
6. Pisahkan status "estimasi demo" dari tombol pesanan agar tidak ada pengguna yang salah mengira pembayaran sudah diproses.

## Status alat verifikasi

| Pemeriksaan | Status |
|---|---|
| Lighthouse mobile | BUTUH VERIFIKASI EKSTERNAL |
| Lighthouse desktop | BUTUH VERIFIKASI EKSTERNAL |
| axe-core homepage | BUTUH VERIFIKASI EKSTERNAL |
| axe-core shop | BUTUH VERIFIKASI EKSTERNAL |
| axe-core product detail | BUTUH VERIFIKASI EKSTERNAL |
| axe-core cart drawer | BUTUH VERIFIKASI EKSTERNAL |
| axe-core checkout | BUTUH VERIFIKASI EKSTERNAL |
| Keyboard-only alur utama | Audit sebelumnya: sebagian lulus; branch basis belum diuji ulang |
| prefers-reduced-motion | BUTUH VERIFIKASI EKSTERNAL |
| prefers-color-scheme | Tidak relevan; situs tidak menawarkan dark mode |
| Viewport 375/390/768/1024/1440 | Audit sebelumnya: lulus; branch basis belum diuji ulang |
| Console error fatal | Audit sebelumnya: tidak ditemukan; branch basis belum diuji ulang |
| Corrupt localStorage | Audit sebelumnya: lulus; branch basis belum diuji ulang |
