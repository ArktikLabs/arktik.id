---
title: Menjalankan Produk Data Harian dengan Satu Orang dan Satu Agen AI
excerpt: >-
  Jejak Saham kami jalankan dengan satu orang dan satu agen AI. Pemeriksaan bisa
  menahan rilis, dan setiap keputusan uang tetap di tangan manusia.
seoTitle: 'Produk Data Harian, Satu Orang dan Agen AI'
seoDescription: >-
  Satu orang dan agen AI menjalankan produk data harian: 22 pemeriksaan tiap
  data masuk, dan output AI ditolak kalau angkanya tidak cocok.
ctaTitle: Ceritakan proses yang paling rawan salah
ctaDescription: >-
  Obrolan pertama gratis dan tanpa deck. Kita lihat proses mana yang paling
  rawan salah, lalu discovery memberi rencana tertulis dan harga tetap yang
  tetap milik Anda.
tags:
  - studi kasus
  - ai
  - kualitas data
  - software custom
  - operasional
date: '2026-10-11'
updated: '2026-10-11'
category: case-studies
author: tika-aurora
image: >-
  https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwbW9uaXRvcnxlbnwxfDB8fHwxNzkxNjgxOTY0fDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: cable network
imageCredit:
  name: Taylor Vick
  profileUrl: 'https://unsplash.com/@tvick?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/cable-network-M5tzZtFCOfs?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 7
  developer: 7
  voice: 7
  bahasa: 7
  rounds: 0
---
Pertanyaan yang pantas diajukan ke studio kecil: bisakah mereka membangun sesuatu yang benar-benar jalan setiap hari, dan bukan menyerahkan proyek lalu hilang. Kalau mereka memakai AI, apakah hasilnya bisa dipercaya di produksi.

Jejak Saham produk kami sendiri, jadi di sini kami menjadi klien kami sendiri. Yang menjalankannya satu orang, dibantu satu agen AI. Ada tiga hal yang menahan kesalahan di produk ini: pemeriksaan sebelum terbit, penolakan output AI yang angkanya tidak cocok, dan keputusan uang yang tetap di tangan manusia.

## Apa produknya dan siapa yang menjalankannya

Jejak Saham melaporkan investor mana yang masuk, menambah, mengurangi, atau keluar dari saham di Bursa Efek Indonesia. Sumbernya keterbukaan publik dari KSEI dan IDX, jadi datanya memang terbuka. Yang kami bangun adalah cara membacanya setiap hari tanpa membuka puluhan file.

Commit pertama tanggal 27 September 2026, dan repositorinya publik sejak hari itu. Sampai sekarang sudah 121 commit.

Timnya satu founder, ditambah T.I.KA, agen operator yang kami bangun di atas Claude. Agen itu ikut mengerjakan operasional harian, tidak hanya menulis kode.

## Siklus harian di hari bursa

Di hari bursa, data diambil dua kali sehari. Setelah diambil, data dimuat ke database, lalu diperiksa, baru alert dikirim ke pengguna. Jaraknya satu menit dari saat proses pemuatan selesai. Sampai sekarang 195 alert sudah terkirim.

Jadwalnya tetap, dan itu yang membuat prosesnya bisa diaudit. Kalau alert telat, penyebabnya ketahuan di tahap mana.

Posting harian di media sosial mengambil dari data yang sama, setelah pemeriksaan yang sama. Tidak ada jalur kedua yang lebih cepat tapi belum diperiksa. Di banyak sistem, jalur pintas seperti itulah yang akhirnya menerbitkan angka salah.

## Pemeriksaan yang berjalan sebelum apa pun diterbitkan

Setiap kali data masuk, 22 pemeriksaan kualitas data berjalan otomatis. Sampai sekarang prosesnya sudah jalan 24 kali, dan 2 di antaranya menahan data yang mencurigakan sebelum sempat diterbitkan. Dua kejadian itu menunjukkan pemeriksaannya memang bisa menghentikan rilis.

Ada satu lapisan lagi. Audit acak mengambil pergerakan yang sudah terdeteksi, lalu mencocokkannya kembali ke file Excel mentah dari IDX. Audit itu memakai pembaca filenya sendiri, terpisah dari yang dipakai di jalur utama. Hasilnya 560 dari 560 cocok.

Kenapa pembacanya harus terpisah? Kalau pemeriksaannya memakai kode yang sama dengan yang memuat data, salah tafsir di kode itu akan lolos dua kali. Pembaca independen memberi kesempatan hasilnya tidak cocok, dan itu yang membuat angka 560 tadi ada artinya.

## Di mana AI boleh menulis dan di mana tidak

Claude kami pakai untuk mengekstrak tabel segmen pendapatan dari PDF laporan tahunan yang sudah diaudit. Pekerjaan ini memang cocok untuk AI: formatnya berbeda di setiap perusahaan, dan orang butuh waktu lama untuk mengetik ulang.

Tapi hasilnya tidak langsung dipakai. Tabelnya hanya disimpan kalau totalnya cocok dengan angka pendapatan dari XBRL, yaitu laporan keuangan dalam format yang bisa dibaca mesin. Dua sumber berbeda, dan angkanya harus bertemu.

Dari 889 laporan, 578 lolos pemeriksaan ini. Sebanyak 63 ditahan untuk ditinjau manual. Angka yang tidak cocok tidak pernah ditampilkan ke pengguna.

Posisi kami soal AI di produksi: AI boleh mengerjakan bagian yang melelahkan, selama ada angka independen yang bisa menolak hasilnya. Tanpa penolak itu, yang Anda dapat hanya tebakan yang kelihatan rapi.

## Yang dikerjakan agen operator, dan yang tidak pernah ia putuskan

T.I.KA mengerjakan hal yang nyata setiap hari. Ia meninjau pencocokan nama investor, dan sudah 802 keputusan pencocokan yang ia tangani. Nama yang sama sering ditulis berbeda di dokumen berbeda, dan pekerjaan itu butuh penilaian, bukan hanya aturan.

Selain itu ia melakukan deploy, serta memperbaiki masalah data saat ada yang tidak wajar. Konfirmasi pembayaran juga lewat dia, dikirim ke bot Telegram dengan tombol Accept dan Reject.

Alurnya selalu begitu: agennya menyiapkan, manusianya menekan tombol. Setiap keputusan bisnis dan setiap keputusan uang tetap di tangan manusia, dan tidak ada jalur yang memungkinkan agen menyetujui pembayaran sendiri.

## Skala tanpa tim

Yang tersimpan sekarang lebih besar daripada yang bisa diurus manual oleh satu orang.

- Kepemilikan harian untuk porsi 5 persen ke atas, sekitar 850 ticker, sejak 29 Mei 2026. Isinya 163 ribu baris.
- Kepemilikan bulanan mulai dari porsi 1 persen, sejak Februari 2026.
- 12.663 pergerakan kepemilikan yang terdeteksi, menyebar di 5.719 investor.
- Harga harian sejak 2020, sebanyak 1,37 juta baris.

Satu orang bisa menjalankan semua itu karena pemeriksaannya berjalan sendiri dan bisa menghentikan rilis. Orangnya hanya perlu muncul saat ada yang ditahan.

## Apa artinya kalau Anda mau membangun software

Mekanisme yang sama kami pakai di pekerjaan klien, karena memang di situ asalnya.

Pemeriksaan otomatis yang bisa menghentikan rilis berarti kesalahan tertahan sebelum sampai ke pelanggan Anda. Ini penting kalau sistemnya mengurus stok, tagihan, atau harga, karena di situ satu angka salah langsung jadi uang.

Alasan di balik setiap keputusan teknis dicatat di sebelah kodenya. Jadi developer berikutnya mewarisi pemikirannya, bukan hanya filenya. Teknologinya pun konvensional dan sudah terbukti, supaya orang lain bisa melanjutkannya.

Lalu soal biaya. Ruang lingkup dan harga disepakati tertulis sebelum setiap tahap dimulai, jadi Anda bisa berhenti setelah tahap mana pun tanpa perdebatan. Kode, server, domain, dan semua akun atas nama Anda sejak hari pertama. Kalau Anda berhenti di tengah, yang sudah dibangun tetap bisa dibuka siapa pun yang Anda pilih.

## Ceritakan proses yang paling rawan salah

Tidak perlu menyiapkan daftar kebutuhan teknis. Ceritakan saja proses mana yang paling sering salah sampai Anda harus minta maaf ke pelanggan, dan siapa yang sekarang memeriksanya. Obrolan pertamanya gratis dan tanpa deck.

Kalau ternyata ada alat siap pakai yang sudah menyelesaikannya, kami akan bilang begitu. Kalau memang perlu dibangun, discovery memberi rencana tertulis dan harga tetap dalam satu sampai dua minggu. Dokumen itu milik Anda, apa pun keputusan Anda setelahnya. Gunakan formulir kontak yang membuka WhatsApp, atau kirim email ke hello@arktik.id.
