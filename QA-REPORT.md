# QA Report — D'YFleur Accessibility

- Tanggal: <isi>
- Browser: <Chrome versi / Firefox>
- OS: <Windows 11 / macOS 14>
- Branch: feat/dyfleur-trust-accessibility-ux
- Commit HEAD: <hasil `git rev-parse --short HEAD`>
- Viewport yang diuji: 375, 768, 1024, 1440
- Akses ke screen reader: <NVDA 2024.x / VoiceOver macOS / TIDAK ADA>

## Ringkasan Status

- Total test: 10
- PASS: __
- FAIL: __
- BLOCKED: __
- BELUM DIVERIFIKASI: __

## Hasil per Test

| # | Test | Actual | Status | Evidence |
|---|---|---|---|---|
| 1 | CTA terlihat 375×667 tanpa scroll | | | screenshot-01-cta-375.png |
| 2 | Horizontal overflow 375/768/1024/1440 | | | console.log Test 2 |
| 3 | Keyboard-only flow lengkap sampai checkout | | | screenshot-03-focus-ring.png + catatan tab stop |
| 4 | Screen reader NVDA/VoiceOver | | | screenreader-transcript.txt |
| 5 | Focus trap drawer 20× Tab + 20× Shift+Tab | | | console.log Test 5 |
| 6 | Escape drawer & checkout; fokus kembali | | | console.log Test 6 |
| 7 | Cart persistence reload + corrupt + migrasi | | | console.log Test 7 |
| 8 | Reduced-motion tidak ada animasi | | | catatan per interaksi |
| 9 | Lighthouse mobile & desktop | | | lighthouse-mobile.png, lighthouse-desktop.png |
| 10 | axe DevTools Shop / cart / checkout | | | axe-shop.png, axe-cart.png, axe-checkout.png |

## Detail Test 1 — CTA di 375×667

- Viewport: 375 × 667 (iPhone SE)
- Elemen yang diperiksa: `<selector tombol add to cart>`
- Posisi CTA pertama terlihat: scroll-Y = __
- Posisi bottom CTA: __ px
- Viewport height: 667 px
- Terlihat tanpa scroll: <YA / TIDAK>
- Screenshot: screenshot-01-cta-375.png

## Detail Test 2 — Overflow

| Viewport | scrollWidth | innerWidth | Overflow? | Elemen overflow |
|---|---|---|---|---|
| 375 | | | | |
| 768 | | | | |
| 1024 | | | | |
| 1440 | | | | |

Output console: <paste>

## Detail Test 3 — Keyboard

Urutan tab stop (sampai checkout):

1. ___
2. ___
3. ___
...

- Setiap tab stop punya ring terlihat: <YA / TIDAK, sebutkan yang tidak>
- Skip link berfungsi (Enter → #main): <YA / TIDAK>
- Sampai checkout tanpa mouse: <YA / TIDAK>

## Detail Test 4 — Screen reader

- Tool: <NVDA versi / VoiceOver / TIDAK ADA>
- Transkrip:
  - Fokus kartu produk: "__"
  - Setelah add to cart: "__"
  - Qty berubah: "__"
  - Drawer buka: "__"
  - Drawer tutup: "__"

## Detail Test 5 — Focus Trap

- Sebelum Tab pertama, activeElement: ___
- Tab 1: ___
- Tab 2: ___
- ...
- Tab 20: ___
- Pernah keluar drawer: <YA / TIDAK>
- Shift+Tab 20×: pernah keluar: <YA / TIDAK>
- Escape: drawer tutup? <YA / TIDAK>; fokus kembali ke: ___

## Detail Test 6 — Escape & Fokus Return

- Drawer: Escape tutup? <YA / TIDAK>; fokus ke: ___
- Checkout: Escape tutup? <YA / TIDAK>; fokus ke: ___
- Verifikasi `<dialog>` pakai showModal: `document.querySelector('dialog[open]')?.matches(':modal')` = <true/false>

## Detail Test 7 — Cart Persistence

- Skenario A (normal): setelah reload, isi cart = ___, badge = ___
- Skenario B (corrupt JSON): halaman crash? <YA / TIDAK>; cart = ___
- Skenario C (migrasi `lorem-cart-v1`): termigrasi? <YA / TIDAK>; key lama masih ada? <YA / TIDAK>

## Detail Test 8 — Reduced Motion

| Interaksi | Animasi masih jalan? | Catatan |
|---|---|---|
| Buka drawer | | |
| Toast add to cart | | |
| Hover kartu produk | | |
| Scroll smooth | | |
| Focus ring transition | | |

## Detail Test 9 — Lighthouse

- Mobile: Accessibility __ / Performance __ / Best Practices __ / SEO __
- Desktop: Accessibility __ / Performance __ / Best Practices __ / SEO __
- Top 3 issue Accessibility (jika ada): ___
- Top 3 issue Performance (jika ada): ___

## Detail Test 10 — axe DevTools

| Halaman | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|
| Shop | | | | |
| Cart drawer | | | | |
| Checkout | | | | |

Detail violations (Critical + Serious):

- `<selector>` — <rule id> — <description>

## Verifikasi Flag F1–F6 (dari laporan agent)

| Flag | Status | Bukti |
|---|---|---|
| F1 — Checkout pakai showModal() | | |
| F2 — Tidak ada double focus trap | | |
| F3 — Fokus awal drawer = heading/konten, bukan close | | |
| F4 — Reduced-motion tidak mematikan focus/loading | | |
| F5 — Migrasi key lama dihapus setelah dipakai | | |
| F6 — Input quantity max="99" + guard manual | | |

## Console Errors (WAJIB dilampirkan)

<Paste semua error merah dari tab Console, atau tulis "tidak ada">

## Blocker untuk Keluar Draft

- <item 1>
- <item 2>
