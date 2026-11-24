---
title: Biaya Nyata dari Arsitektur Sistem yang Buruk
excerpt: >-
  Arsitektur yang buruk muncul sebagai tagihan: setiap permintaan perubahan
  kecil dihargai lebih mahal daripada yang sebelumnya.
seoTitle: Biaya Arsitektur Sistem yang Buruk bagi Bisnis
seoDescription: >-
  Ke mana uang Anda sebenarnya pergi ketika struktur software bermasalah, dan
  cara memeriksa sistem yang sudah Anda bayar tanpa latar belakang teknis.
ctaTitle: Bawa sistem yang sudah Anda punya sekarang
ctaDescription: >-
  Obrolan pertama gratis dan tanpa deck, langsung dengan engineer. Sebutkan satu
  perubahan yang terasa mahal di sistem Anda sekarang. Kalau yang Anda butuhkan
  review dan bukan bangun ulang, kami akan bilang begitu.
tags:
  - arsitektur sistem
  - biaya perawatan
  - kepemilikan sistem
  - ukm
date: '2026-11-24'
updated: '2026-11-24'
category: software-development
pillar: software-architecture-future-proofing-for-business-owners
author: tika-aurora
image: >-
  https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHx0YW5nbGVkJTIwY2FibGVzJTIwc2VydmVyJTIwcmFja3xlbnwxfDB8fHwxNzk1NDgzNzA5fDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: a bunch of blue wires connected to each other
imageCredit:
  name: Scott Rodgerson
  profileUrl: 'https://unsplash.com/@scottrodgerson?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 8
  developer: 7
  voice: 6
  bahasa: 7
  rounds: 1
---
Arsitektur jarang terasa sebagai masalah teknis. Yang Anda terima adalah tagihannya. Setiap permintaan perubahan kecil dihargai lebih mahal daripada yang sebelumnya, satu laporan sederhana butuh seminggu, dan hanya satu orang yang berani membuka bagian tertentu dari aplikasinya.

Polanya bisa dikenali sendiri di software yang sudah Anda bayar. Sisi keputusannya, yaitu pilihan struktural apa yang sebaiknya Anda ambil sendiri, ada di [panduan arsitektur software untuk pemilik bisnis](/blog/software-development/guides/software-architecture-future-proofing-for-business-owners/).

## Tanda-tanda arsitektur yang buruk dari sisi bisnis

Anda tidak perlu membaca kode untuk melihat gejalanya. Yang pertama biasanya soal harga. Permintaan yang tahun lalu selesai dalam tiga hari sekarang dikutip dua minggu, padahal bentuk pekerjaannya mirip.

Gejala kedua muncul di laporan. Anda minta angka penjualan per cabang per kategori, dan jawabannya bukan angka, melainkan jadwal. Ada yang harus menarik data dari dua tempat lalu merapikannya di spreadsheet.

Gejala ketiga lebih mengganggu, yaitu dua sistem yang tidak sepakat soal pelanggan yang sama. Alamat di sistem pesanan berbeda dengan alamat di sistem pengiriman, dan staf sudah hafal mana yang biasanya benar. Gejala terakhir paling jelas: ada satu bagian aplikasi yang tidak ada orang mau sentuh, dan setiap kali bagian itu disebut, developernya menyarankan jalan lain.

Semua gejala tadi permukaan dari keputusan struktural yang diambil berbulan-bulan sebelumnya, biasanya tanpa ada yang memberi tahu Anda.

## Ke mana uangnya sebenarnya pergi

Bagian terbesar habis untuk membaca kode, belum untuk menulisnya. Developer yang akan mengubah satu halaman harus lebih dulu menelusuri bagian mana lagi yang ikut terpengaruh. Tanpa catatan, penelusuran itu dikerjakan dengan menebak dan mencoba. Anda membayar jam itu tanpa mendapat fitur baru.

Bagian kedua habis untuk mengerjakan ulang. Tanpa catatan dan tanpa cara memastikan sebuah perubahan tidak merusak yang lain, perubahan di halaman diskon baru terlihat mematikan perhitungan ongkos kirim setelah pelanggan mengeluh. Perbaikannya ditagihkan ke Anda, dan nama baik Anda ikut kena.

Bagian ketiga tidak masuk invoice vendor sama sekali, karena yang menanggungnya staf Anda. Mereka menemukan jalan memutar: satu spreadsheet bayangan di luar sistem, grup WhatsApp untuk mengabari gudang karena notifikasinya tidak jalan, atau input dua kali ke dua aplikasi berbeda. Biayanya ada di gaji bulanan, jadi tidak pernah kelihatan sebagai biaya software.

Yang paling mahal adalah keputusan yang diambil dari angka basi. Kalau stok tercatat di dua tempat, Anda memutuskan pembelian berdasarkan angka yang entah sudah diperbarui atau belum. Struktur sistem yang memisahkan data terlalu dini sering jadi sumbernya, dan pilihan itu kami bahas di [tulisan soal microservices dibanding monolith](/blog/software-development/microservices-vs-monolith-which-fits-your-business/).

## Biaya yang tidak pernah ditagihkan: permintaan yang Anda hentikan sendiri

Efek yang paling besar justru tidak bersuara. Setelah tiga kali mendengar harga yang terasa tidak masuk akal, Anda berhenti bertanya. Ide soal menambah metode pembayaran, membuka cabang kedua di sistem, atau memberi akses terbatas untuk pemasok tidak pernah sampai ke email vendor.

Bisnisnya tetap jalan dan softwarenya tetap hidup, tapi keduanya makin menjauh. Cara perusahaan bekerja hari ini berbeda dari cara yang diasumsikan sistemnya dua tahun lalu. Selisih itu ditutup oleh staf dengan pekerjaan manual, dan ditutup oleh Anda dengan menunda rencana.

Kapan terakhir kali Anda meminta perubahan yang benar-benar baru? Itu pertanyaan yang bisa diperiksa sekarang, bersama satu pertanyaan lanjutannya: apa yang membuat Anda berhenti memintanya.

## Kenapa ini terjadi, dan kenapa biasanya bukan karena malas

Hampir semua masalah arsitektur lahir dari keputusan yang waktu itu wajar. Ada fitur yang harus jalan sebelum hari raya, jadi dikerjakan dengan cara tercepat dan dicatat sebagai hal yang akan dirapikan nanti. Tidak ada yang kembali merapikannya.

Lalu ada integrasi yang dibuat untuk satu pelanggan besar, dengan aturan khusus yang hanya berlaku untuk pelanggan itu. Setahun kemudian ada lima aturan khusus semacam itu, masing-masing masuk akal sendiri-sendiri. Tidak ada satu orang pun yang memutuskan sistemnya jadi rumit.

Pendorong utamanya satu: tidak ada yang menuliskan alasannya. Developer yang memahami kenapa modul pesanan dipisah dari modul stok sudah pindah kerja, dan pertimbangannya ikut pergi. Orang berikutnya menebak ulang, dan tebakan itu menambah satu lapis lagi. Soal keputusan mana yang pantas dikunci sekarang dan mana yang sebaiknya dibiarkan terbuka, kami uraikan di [tulisan soal menyiapkan software untuk jangka panjang](/blog/software-development/future-proofing-software-what-to-plan-for-today/).

## Kemudahan perawatan menentukan harga perubahan berikutnya

Teknologi yang sudah umum dipakai lebih murah dirawat. Developer berikutnya sudah pernah memakainya, jadi dia bisa langsung bekerja. Kalau ada masalah, jawabannya sudah pernah ditulis orang lain.

Sama pentingnya, simpan alasan di balik setiap keputusan bersama kodenya. Dengan begitu orang berikutnya mewarisi pertimbangannya, bukan hanya file-nya. Kenapa stok tidak dihitung ulang setiap transaksi, kenapa pelanggan korporat dikeluarkan dari alur diskon otomatis. Satu paragraf per keputusan sudah cukup, dan paragraf itu disimpan di repo yang sama dengan kodenya, bukan di dokumen yang terpisah dari kode. Paragraf itulah yang memotong jam membaca yang tadi Anda bayar.

Ujinya bisa Anda ucapkan tanpa istilah teknis. Bisakah seorang developer yang tidak ikut membangun sistem ini membuat satu perubahan yang aman di minggu pertamanya? Pilih teknologi yang membuat jawabannya ya. Kalau jawabannya tidak, biaya perawatannya akan naik terus, siapa pun yang Anda sewa.

## Cara memeriksa software yang sudah Anda punya

Ambil lima estimasi perubahan terakhir dan urutkan berdasarkan tanggal. Bandingkan besarnya pekerjaan dengan harganya. Kalau bentuk pekerjaannya mirip dengan permintaan yang tahun lalu selesai dalam tiga hari, tapi sekarang dikutip dua minggu, selisihnya ada di struktur sistemnya, bukan di tarif vendornya.

Pemeriksaan berikutnya ada di lantai kerja. Minta staf mendaftar jalan memutar yang mereka pakai minggu ini, satu per satu, lalu hitung berapa kali sehari masing-masing dipakai. Spreadsheet bayangan yang dibuka dua puluh kali sehari memberi tahu Anda bagian mana dari sistem itu yang sudah tidak cocok dengan cara mereka bekerja.

Lalu tanyakan satu hal ke vendor atau developer Anda: selain dia, siapa lagi yang bisa mengerjakan perubahan ini. Kalau jawabannya tidak ada, Anda sedang menanggung risiko satu orang. Pertanyaan berikutnya soal catatan. Di mana alasan di balik keputusan besar sistem ini ditulis, dan bisakah Anda membukanya sendiri.

Pertanyaan terakhir soal kepemilikan. Kode, server, domain, dan semua akun layanan terdaftar atas nama siapa. Kalau yang tercatat nama vendor, Anda bertahan karena biaya pindahnya, dan biaya itu bagian dari arsitektur Anda. Pada sistem yang semuanya atas nama bisnis Anda sejak hari pertama, biaya itu hilang. Tidak ada yang bergantung pada satu pihak supaya sistemnya tetap jalan.

Review atau pendapat kedua atas sistem yang sudah jalan bisa dipesan sebagai pekerjaan sendiri, termasuk untuk tim yang sudah punya developer. Review itu dipesan sebagai satu tahap, dengan ruang lingkup dan harga tertulis lebih dulu, jadi Anda tahu biayanya sebelum memutuskan bangun ulang. Kadang kesimpulannya bahwa sebagian proses sebaiknya pindah ke tool yang sudah ada di pasar, dan soal itu kami bahas di [tulisan soal software custom dibanding produk siap pakai](/blog/software-development/custom-vs-off-the-shelf-software-right-fit/).

## Cara supaya tidak membayarnya lagi di proyek berikutnya

Tetapkan tiga syarat sebelum uang berpindah. Pertama, ruang lingkup dan harga disepakati tertulis per tahap. Dengan begitu arah struktural yang keliru hanya memakan satu tahap, dan berhenti selalu tersedia tanpa perdebatan.

Kedua, minta software yang bisa dibuka dan dicoba setiap minggu, bukan presentasi kemajuan. Setiap minggu, satu orang yang menjalani prosesnya sehari-hari menyelesaikan satu pesanan atau satu laporan sungguhan di link preview privat, dan apa yang macet dicatat di situ. Dengan cara itu masalah struktur terlihat saat masih murah diubah, bukan di peluncuran.

Ketiga, kode, server, domain, dan semua akun atas nama bisnis Anda sejak hari pertama, bukan diserahkan di akhir. Ketiga syarat ini pendek dan bisa Anda sebutkan di rapat pertama, jauh sebelum ada yang bicara soal teknologi.

## Bawa sistem yang sudah Anda punya sekarang

Tidak perlu menyiapkan dokumen apa pun. Sebutkan satu perubahan yang terasa mahal, siapa yang mengerjakan sistem itu sekarang, dan bagian mana yang staf Anda hindari. Kita telusuri apakah biayanya berasal dari strukturnya atau dari hal lain.

Kalau yang Anda butuhkan review dan bukan bangun ulang, kami akan bilang begitu. Kalau memang ada yang pantas dibangun, discovery memberi rencana tertulis dan harga tetap untuk tahap pertama. Dokumen rencananya tetap milik Anda, lanjut atau tidak. Obrolan pertamanya gratis, tanpa deck, langsung dengan engineer. Gunakan formulir kontak yang membuka WhatsApp, atau kirim email ke hello@arktik.id.
