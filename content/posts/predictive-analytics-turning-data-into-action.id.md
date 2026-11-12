---
title: 'Predictive Analytics: Dari Ramalan ke Tindakan'
excerpt: >-
  Ramalan baru terbayar kalau ada orang yang bertindak berbeda karenanya.
  Tentukan dulu keputusannya, pelakunya, dan apa yang berubah saat angkanya
  bergerak.
seoTitle: 'Predictive Analytics: Dari Ramalan ke Tindakan'
seoDescription: >-
  Apa yang sebenarnya dihasilkan predictive analytics, keputusan apa yang
  dibantunya sehari-hari, dan kapan sebaiknya Anda belum membangunnya.
ctaTitle: Bawa satu keputusan yang berulang ke obrolan pertama
ctaDescription: >-
  Obrolan pertama gratis dan tanpa deck, langsung dengan engineer. Sebutkan satu
  keputusan yang tim Anda ambil setiap minggu, lalu kita cek apakah prediksi
  akan mengubahnya. Kalau iya, discovery memberi rencana tertulis dan harga
  tetap yang tetap milik Anda.
tags:
  - predictive analytics
  - pengambilan keputusan
  - operasional ukm
  - otomasi
date: '2026-11-12'
updated: '2026-11-12'
category: ai-automation
author: tika-aurora
pillar: predictive-analytics-for-decision-making
image: >-
  https://images.unsplash.com/photo-1644079446600-219068676743?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzaGVsdmVzJTIwY2xpcGJvYXJkfGVufDF8MHx8fDE3OTQ0NDY4MzF8MA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: a large warehouse filled with lots of shelves
imageCredit:
  name: Lance Chang
  profileUrl: 'https://unsplash.com/@carmendis?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/a-large-warehouse-filled-with-lots-of-shelves-h3pVxOIpnzk?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 8
  developer: 7
  voice: 7
  bahasa: 7
  rounds: 1
---
Predictive analytics menghasilkan satu hal: angka perkiraan untuk periode yang belum terjadi. Berapa stok yang perlu dipesan bulan depan, invoice mana yang kemungkinan telat dibayar, pelanggan mana yang kemungkinan berhenti belanja. Angka itu menunjukkan kemungkinan, bukan kepastian.

Angka itu baru terbayar kalau ada orang yang mengerjakan sesuatu secara berbeda karena melihatnya. Jadi sebelum membahas model atau biayanya, tentukan tiga hal. Keputusan berulang mana yang akan dibantu angka ini, siapa yang bertindak, dan apa yang dia lakukan lain dari biasanya saat angkanya bergerak. Kalau tidak ada tindakan yang berubah, yang Anda beli hanya dashboard baru. Prasyarat data dan proses yang harus beres lebih dulu dibahas terpisah di [panduan predictive analytics untuk pengambilan keputusan](/blog/ai-automation/guides/predictive-analytics-for-decision-making/). Tulisan ini tidak mengulangnya.

## Apa yang sebenarnya Anda dapat dari prediksi

Hasil prediksi berupa satu angka untuk satu objek pada satu periode ke depan. Misalnya perkiraan jumlah terjual per produk untuk bulan depan, atau kemungkinan satu invoice lewat jatuh tempo.

Setiap angka keluar bersama rentangnya, dan untuk sebagian objek rentang itu lebar. Produk yang baru dua minggu dijual rentangnya sangat lebar. Rentang lebar itu pun sudah memberi tahu sesuatu, yaitu kapan angkanya layak diikuti dan kapan sebaiknya bertanya ke orang gudang.

Perlakukan prediksi seperti pendapat staf senior yang sering benar tapi tidak selalu. Rentang keyakinan itulah cara Anda tahu kapan modelnya ragu. Catatan setiap kali angkanya diubah orang, yang dibahas di bawah, adalah cara Anda tahu kapan modelnya keliru.

## Keputusannya dulu, modelnya kemudian

Cari keputusan yang sudah diambil berulang dengan informasi yang tidak lengkap. Jumlah pesanan ke pemasok minggu ini dan urutan telepon tim penagihan adalah contohnya.

Tiga hal harus bisa Anda sebutkan: keputusannya, seberapa sering diambil, dan nama orang yang mengambilnya. "Pak Budi di bagian pembelian, setiap Senin pagi, menentukan jumlah pesanan ke pemasok" sudah cukup jelas untuk dikerjakan. "Kami ingin lebih akurat dalam perencanaan" belum, karena tidak ada satu pun orang dan hari yang bisa ditunjuk di dalamnya.

Kalau salah satu dari tiga itu kosong, tidak ada yang bisa diperbaiki prediksi. Keputusan yang diambil sekali setahun, misalnya, lebih baik dibahas dalam rapat dengan data historis biasa daripada dibangun sistemnya.

## Di mana prediksi itu harus muncul

Angka yang tinggal di tool analitik terpisah akan dibuka sekali, lalu dilupakan. Angka yang baru dilihat sore hari juga tidak berguna untuk pesanan yang sudah dikirim pagi.

Prediksinya harus muncul di layar yang memang dibuka orangnya saat bekerja. Form pesanan pembelian menampilkan jumlah yang disarankan di sebelah kolom input, dan staf pembelian bisa menerimanya atau menggantinya. Daftar penagihan pagi itu sudah terurut dari yang paling berisiko telat. Pesan WhatsApp jam delapan menyebut lima akun yang perlu dihubungi hari ini.

Karena itu pekerjaan sebenarnya biasanya ada di penyambungan ke sistem internal dan ke tool yang sudah Anda pakai. Di situ juga letak sebagian besar biayanya. Penyambungan itu masuk ruang lingkup salah satu tahap, dan harga setiap tahap disepakati sebelum tahap itu dimulai, jadi Anda bisa berhenti setelah tahap mana pun. Gambaran yang lebih luas soal ke mana uang pergi di proyek AI dan otomasi ada di [panduan AI dan otomasi untuk bisnis](/blog/ai-automation/guides/ai-automation-for-businesses/).

## Yang harus berubah di prosesnya

Begitu sebuah angka masuk ke proses, ada orang yang kehilangan sebagian kewenangan atau mendapat langkah kerja baru. Kegagalan biasanya terjadi di sini, bukan di akurasi model.

Jadi sepakati ambangnya lebih dulu. Pada kemungkinan berapa tim penagihan mulai menelepon, dan pada kemungkinan berapa invoice cukup dibiarkan sampai jatuh tempo. Ambangnya diputuskan orang yang menanggung akibatnya.

Lalu tentukan siapa yang boleh mengubah angka itu, dan alasannya ikut dicatat. Kalau staf pembelian memesan lebih sedikit dari saran sistem, alasannya masuk ke catatan yang sama. Setelah dua atau tiga bulan, catatan itu memberi tahu Anda apakah modelnya yang perlu diperbaiki, atau justru orangnya yang tahu sesuatu yang tidak ada di data.

Catatan ambang dan alasan di belakangnya ada di repositori yang sama dengan kodenya. Orang berikutnya yang memegang sistemnya bisa membacanya tanpa bertanya ke siapa pun, jadi dia mewarisi pemikirannya dan tidak perlu menebak kenapa angka ambangnya segitu.

## Tiga titik awal yang biasanya terbayar

Setiap Senin pagi staf pembelian menentukan jumlah pesanan ke pemasok untuk periode depan. Riwayat penjualan per produk dan catatan stok biasanya sudah ada di sistem Anda sekarang. Prediksi mengubah angka yang dia tulis di form pesanan, dan hasilnya kelihatan dari stok mati dan barang yang kosong.

Tim penagihan memulai hari dengan daftar telepon. Kalau riwayat invoice, tanggal bayar, dan nilai tagihan per pelanggan sudah tercatat, daftar itu bisa datang sudah terurut dari yang paling berisiko telat. Yang berubah adalah siapa yang ditelepon lebih dulu.

Yang ketiga soal pelanggan yang perlahan berhenti belanja. Bahannya riwayat transaksi dengan nama atau nomor pelanggan yang konsisten, dan keluarannya daftar nama yang masuk ke pekerjaan mingguan tim penjualan. Contoh penerapan lain yang lebih luas untuk UKM ada di [tulisan soal penggunaan AI yang praktis](/blog/ai-automation/ai-in-business-practical-use-cases-for-growing-smes/).

## Kapan sebaiknya menolak predictive analytics

Ada beberapa kondisi yang membuat pembangunan model sebaiknya ditunda, dan sebagian besar bisa Anda kenali sendiri sebelum bicara dengan vendor mana pun.

- Catatan historisnya terlalu sedikit, misalnya penjualan baru tercatat rapi beberapa bulan terakhir.
- Prosesnya hanya ada di kepala satu orang dan belum pernah ditulis, jadi tidak jelas keputusan apa yang mau dibantu.
- Nama pelanggan tertulis empat versi di empat spreadsheet, sehingga riwayat satu pelanggan tidak bisa disatukan.
- Keputusannya hanya diambil sekali setahun.

Untuk kondisi seperti itu, jawaban yang jujur biasanya membenahi pencatatannya dulu. Pilihan lainnya memakai tool yang sudah punya fitur perkiraan di dalam sistem yang Anda pakai sekarang. Kalau itu yang kami lihat, kami akan bilang begitu dan menyebutkan alatnya, termasuk kalau pilihan terbaiknya adalah tidak membangun apa pun tahun ini.

## Cara menguji idenya dengan murah

Uji manualnya bisa berakhir dengan Anda tidak membeli apa pun, dan itu hasil yang sah. Kalau tim Anda ternyata sudah sama baiknya dengan hitungannya, berhenti di situ dan simpan uangnya. Jadi jalankan prediksinya manual dulu. Ambil keputusan yang sudah lewat, misalnya pesanan ke pemasok selama tiga bulan terakhir. Hitung dengan aturan sederhana di spreadsheet apa yang akan disarankan, lalu bandingkan dengan yang tim Anda pilih waktu itu dan dengan apa yang akhirnya terjual.

Dari situ Anda tahu dua hal sebelum mengeluarkan uang besar. Pertama, apakah angkanya berbeda cukup jauh dari pilihan tim sehingga ada gunanya. Kedua, apakah ada orang yang mau mengikutinya.

Kalau hasil uji manualnya menjanjikan, baru masuk ke pembangunan. Tahap pertama kami adalah discovery, satu sampai dua minggu, yang menghasilkan rencana tertulis dan harga tetap. Dokumen itu milik Anda, lanjut atau tidak. Ruang lingkup dan harga setiap tahap berikutnya disepakati sebelum tahap itu dimulai, jadi Anda bisa berhenti setelah tahap mana pun.

Satu hal lagi yang perlu dipastikan sejak awal, siapa pun yang membangunnya. Kode, server, domain, dan semua akun terdaftar atas nama bisnis Anda sejak hari pertama. Sistem yang dipakai untuk mengambil keputusan setiap minggu sebaiknya tidak bergantung pada vendor yang membangunnya.

## Bawa satu keputusan yang berulang ke obrolan pertama

Tidak perlu menyiapkan data atau dokumen teknis. Sebutkan satu keputusan yang tim Anda ambil setiap minggu dengan informasi yang kurang, siapa yang mengambilnya, dan data apa yang sekarang dipegang. Kita telusuri apakah prediksi akan mengubah keputusan itu sama sekali. Obrolan pertamanya gratis, tanpa deck, langsung dengan engineer.

Kalau jawabannya belum, kami akan bilang begitu dan menyebutkan apa yang perlu dibenahi lebih dulu. Kalau memang ada yang pantas dibangun, discovery memberi rencana tertulis dan harga tetap untuk tahap pertama, dan dokumen itu milik Anda apa pun keputusan Anda setelahnya. Gunakan formulir kontak yang membuka WhatsApp, atau kirim email ke hello@arktik.id.
