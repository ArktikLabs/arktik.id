---
title: Keputusan Desain yang Masih Masuk Akal Tiga Tahun Lagi
excerpt: >-
  Yang lebih dulu rusak biasanya pilihan yang tidak pernah dicatat alasannya,
  lalu bisnisnya menambah satu kasus baru.
seoTitle: Keputusan Desain yang Tahan Lama untuk Produk Anda
seoDescription: >-
  Kenapa sebagian keputusan desain harus diulang dalam setahun, dan apa yang
  membuat sebagian lain tetap bisa dikembangkan orang berikutnya.
ctaTitle: Bawa satu layar yang akan segera Anda lampaui
ctaDescription: >-
  Obrolan pertama gratis dan tanpa deck, langsung dengan engineer. Sebutkan satu
  layar atau proses yang Anda perkirakan akan segera tidak cukup, lalu kita
  telusuri bagian mana yang tidak akan bertahan. Discovery memberi rencana
  tertulis dan harga tetap yang tetap milik Anda.
tags:
  - keputusan desain
  - desain produk
  - kepemilikan sistem
  - ukm
date: '2026-11-22'
updated: '2026-11-22'
category: design-ux
author: tika-aurora
pillar: design-systems-for-scalable-products
image: >-
  https://images.unsplash.com/photo-1603901622056-0a5bee231395?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3QlMjBkcmF3aW5ncyUyMHdvcmtiZW5jaHxlbnwxfDB8fHwxNzk1MzEwNzc1fDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: >-
  Architectural blueprints with drafting pencils, a metal ruler, and a storage
  tube
imageCredit:
  name: Lucas Kepner
  profileUrl: 'https://unsplash.com/@lucaskphoto?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/architectural-blueprints-with-drafting-tools-Yn8D5B8C-eY?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 8
  developer: 8
  voice: 6
  bahasa: 7
  rounds: 1
---
Pertanyaannya biasanya muncul setelah kejadian kedua. Website atau aplikasi yang dibuat setahun lalu masih jalan, tapi setiap kali bisnis menambah satu lini produk, satu cabang, atau satu peran staf baru, ada layar yang harus dibongkar ulang. Vendornya lalu menagih seperti proyek baru.

Keputusan desain bertahan kalau alasannya masih bisa ditemukan orang berikutnya. Jawaban strukturalnya ada di [panduan design system untuk produk yang berkembang](/blog/design-ux/guides/design-systems-for-scalable-products/).

## Apa yang biasanya rusak lebih dulu

Yang rusak lebih dulu biasanya bagian yang dibuat untuk satu kasus, lalu bisnisnya menambah kasus kedua.

Bentuknya mirip-mirip. Layar yang dibuat untuk satu jenis produk tidak bisa dipakai saat jenis kedua muncul, dan label seperti "Nama Toko" yang ditulis di dalam kode hanya bisa diubah developer. Alurnya pun disusun untuk satu peran saja: pemilik yang melihat semuanya. Begitu ada kasir dan staf gudang yang perlu akses terbatas, alurnya harus disusun ulang dari awal.

Satu lagi yang sering terlewat: tabel yang dirancang untuk empat kolom. Saat kolom kelima dan keenam ditambahkan, tabelnya melebar ke samping dan tidak terbaca di layar laptop staf, apalagi di ponsel. Pada hari pertama tidak ada yang salah, dan masalahnya baru kelihatan di perubahan pertama.

## Bedanya selera dan keputusan

Pilihan selera tidak bisa ditelusuri ulang. Kalau jarak antar elemen dibuat lebar karena perancangnya merasa itu lebih enak dilihat, orang berikutnya tidak punya pegangan apa pun. Dia hanya punya dua pilihan: menebak maksudnya, atau membuang pilihan itu dan mulai sendiri.

Keputusan punya alasan yang menempel padanya. Jarak barisnya dibuat sempit karena tabel pesanan harus menampung empat kolom di layar laptop yang dipakai admin. Tombolnya ditaruh di kanan bawah karena staf gudang memakai satu tangan sambil memegang barang. Istilah "nota" dipakai, bukan "invoice", karena tim Anda sudah menyebutnya begitu bertahun-tahun.

Keduanya bisa menghasilkan tampilan yang sama. Bedanya baru terasa setahun kemudian, ketika ada yang perlu mengubahnya dan harus tahu mana yang boleh digeser dan mana yang akan merusak pekerjaan orang.

## Catat alasannya di samping pekerjaannya

Alasan di balik setiap keputusan disimpan bersama kodenya, sehingga orang berikutnya mewarisi pertimbangannya, bukan hanya file-nya. Desain sama saja. Satu paragraf di sebelah layar itu, menyebut siapa yang memakainya, di perangkat apa, dan batasan apa yang membentuk bentuknya.

Bagian yang paling sering dilupakan adalah pilihan yang ditolak. Kalau dulu sudah dicoba menaruh filter di sisi kiri dan ternyata menggeser tabel keluar layar, tulis itu. Tanpa catatan itu, designer berikutnya akan mencoba cara yang sama dan membuang waktu untuk sampai ke kesimpulan yang sudah pernah Anda bayar.

Catatan ini bukan dokumen tebal. Isinya cukup satu atau dua kalimat per keputusan, ditaruh di tempat yang sama dengan pekerjaannya, bukan di folder terpisah yang hanya dibuka saat orientasi. Dokumen yang letaknya jauh dari pekerjaan tidak pernah dibaca dan tidak pernah diperbarui.

## Yang lazim lebih baik daripada yang pintar

Pola yang sudah dikenali orang lebih murah dirawat. Form yang bentuknya seperti form, tabel yang bisa diurutkan dengan mengklik judul kolom, menu yang ada di tempat biasa. Staf baru tidak perlu dilatih, dan developer baru tidak perlu membaca apa pun sebelum bisa menambah satu kolom. Pola seperti itu bisa diteruskan tanpa penjelasan dari pembuatnya.

Interaksi yang tidak lazim menjadi beban begitu pembuatnya pergi. Animasi khusus, cara navigasi yang ditemukan sendiri, atau komponen yang dibuat dari nol karena yang standar dianggap kurang menarik. Semuanya bekerja selama orang yang merancangnya masih ada. Setelah itu tidak ada yang tahu kenapa komponen itu dibuat sendiri, dan menulis ulang jadi lebih murah daripada membacanya.

Tampilan yang tidak seragam biasanya gejala keputusan yang tidak pernah dicatat, lalu ditebak ulang orang lain. Soal itu kami bahas di [tulisan soal konsistensi antarmuka dan kepercayaan](/blog/design-ux/ui-consistency-and-brand-trust/).

## Uji kasus kedua sebelum Anda membutuhkannya

Anda tidak perlu meramalkan lima tahun ke depan. Yang perlu diperiksa jauh lebih sempit: apakah layar ini masih masuk akal kalau ada satu hal kedua.

Ambil layar yang paling sering dipakai, lalu ajukan pertanyaan berikut. Kalau ada satu jenis produk baru dengan sifat yang berbeda, apakah layarnya masih muat. Kalau cabang kedua dibuka, apakah ada tempat untuk menandai cabangnya. Kalau ada peran staf ketiga yang hanya boleh melihat sebagian data, apakah alurnya bisa dibatasi tanpa membongkar halamannya. Dan kalau staf gudang memakai satu tangan sambil memegang barang, apakah dia masih bisa menyelesaikan satu pesanan di layar ini.

Kalau salah satu jawabannya tidak, perbaikannya nanti akan ditagih lagi sebagai pekerjaan baru. Memperbaikinya sekarang hanya butuh satu diskusi. Memperbaikinya setelah dipakai berbulan-bulan berarti ada data lama yang harus dipindahkan dan staf yang harus dilatih ulang. Sistem internal paling sering kena di pertanyaan soal peran, dan contohnya ada di [tulisan soal UX untuk sistem internal yang rumit](/blog/design-ux/ux-for-complex-internal-systems/).

## Kepemilikan menentukan daya tahannya

Desain yang bagus tidak ada gunanya kalau Anda tidak bisa mengubahnya sendiri. Kalau besok satu label perlu diubah, siapa yang punya aksesnya?

Kode, file desain, server, domain, dan semua akun terdaftar atas nama bisnis Anda sejak hari pertama, bukan diserahkan di akhir proyek. Dengan begitu produknya bisa hidup lebih lama daripada siapa pun yang membangunnya. Tidak ada yang bergantung pada kami untuk tetap jalan.

Bedanya terasa pada hari Anda ingin mengganti orang. Kalau semuanya ada di nama Anda, developer berikutnya bisa mulai bekerja minggu itu. Kalau akunnya atas nama vendor, pekerjaan pertamanya adalah bernegosiasi, dan Anda yang membayar waktu itu.

## Cara menguji keputusan sebelum Anda mengunci pilihannya

Keputusan yang tidak akan bertahan paling cepat terlihat di layar yang bisa diklik. Desain produk kami serahkan sebagai layar yang berfungsi, bukan PDF. Mockup di dokumen menyembunyikan masalahnya sampai tahap pembuatan, karena di dokumen setiap tabel selalu muat dan setiap nama produk selalu pendek.

Setiap minggu ada software yang bisa dibuka dan dicoba, dan link preview privat tersedia sejak minggu pertama. Jadi kalau ada keputusan yang keliru, Anda menemukannya di minggu kedua, bukan di peluncuran. Orang yang mengerjakan prosesnya setiap hari bisa membuka link itu dan menjalankan satu pekerjaan sungguhan di minggu kedua, lalu bilang bagian mana yang tidak cocok.

## Bawa satu layar yang akan segera Anda lampaui

Tidak perlu menyiapkan dokumen atau mockup apa pun. Sebutkan satu layar atau satu proses yang Anda perkirakan akan segera tidak cukup, siapa yang memakainya, dan perubahan apa yang sedang direncanakan di bisnisnya. Kita telusuri bagian mana yang tidak akan bertahan dan apa yang perlu dicatat sekarang.

Kalau memang ada yang pantas dibangun, discovery memberi rencana tertulis dan harga tetap untuk tahap pertama. Tahap berikutnya disepakati sebelum dimulai, jadi Anda bisa berhenti setelah tahap mana pun. Dokumen rencananya tetap milik Anda, lanjut atau tidak. Obrolan pertamanya gratis, tanpa deck, langsung dengan engineer. Gunakan formulir kontak yang membuka WhatsApp, atau kirim email ke hello@arktik.id.
