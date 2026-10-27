---
title: 'Security by Design: Apa Artinya Kalau Kunci Dipegang Orang Lain'
excerpt: >-
  Kebanyakan masalah keamanan di software UKM berawal dari akses dan
  kepemilikan, bukan serangan rumit. Semuanya bisa Anda cek sendiri.
seoTitle: Security by Design untuk Pemilik Bisnis UKM
seoDescription: >-
  Arti security by design dalam praktik: atas nama siapa akunnya, siapa boleh
  melihat apa, apa yang dicatat sistem, dan apa yang perlu Anda tanyakan.
ctaTitle: Mari cek dulu siapa yang memegang akun Anda
ctaDescription: >-
  Obrolan pertama gratis dan tanpa deck. Kita telusuri akun mana yang sekarang
  bukan atas nama Anda dan apa yang perlu dicatat sistem berikutnya. Discovery
  memberi rencana tertulis dan harga tetap yang tetap milik Anda.
tags:
  - keamanan software
  - kepemilikan akun
  - software custom
  - ukm
date: '2026-10-27'
updated: '2026-10-27'
category: software-development
author: tika-aurora
pillar: software-architecture-future-proofing-for-business-owners
image: >-
  https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkb29yJTIwa2V5c3xlbnwxfDB8fHwxNzkzMDY0MjYzfDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: keys on hand
imageCredit:
  name: Maria Ziegler
  profileUrl: >-
    https://unsplash.com/@schluesseldienstvergleich_eu?utm_source=arktik&utm_medium=referral
  photoUrl: >-
    https://unsplash.com/photos/keys-on-hand-jJnZg7vBfMs?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 7
  developer: 7
  voice: 7
  bahasa: 7
  rounds: 0
---
Kalau vendor menyebut "security by design" di penawaran, Anda berhak tahu apa yang sebenarnya ia janjikan. Untuk bisnis seukuran UKM, isinya hampir selalu soal akses dan kepemilikan: akun atas nama siapa, siapa yang boleh membuka data apa, dan apakah sistem mencatat siapa yang mengubah sesuatu.

Ketiganya bisa Anda periksa tanpa membaca satu baris kode, cukup dengan login dan melihat. Kalau Anda sedang menimbang membangun software sendiri dan ingin gambaran utuhnya lebih dulu, urutannya ada di [panduan pembangunan software custom](/blog/software-development/guides/custom-software-development-definitive-guide/).

## Risiko yang benar-benar dihadapi bisnis kecil

Yang merusak bisnis kecil biasanya bukan serangan yang direncanakan dari luar. Bentuknya jauh lebih biasa, dan sudah ada di banyak kantor sekarang.

- Satu login admin dipakai bergantian oleh beberapa orang, dan passwordnya ada di grup WhatsApp tim.
- Staf yang sudah resign beberapa bulan lalu masih bisa membuka dashboard, karena tidak ada yang ingat mencabut aksesnya.
- Data pelanggan lengkap dengan nomor HP diekspor ke spreadsheet, lalu dikirim lewat email ke siapa pun yang meminta.
- Domain perusahaan terdaftar memakai email pribadi developer, dan kartu kreditnya juga punya dia.

Keempat kejadian itu bisa dikenali tanpa pengetahuan teknis sama sekali. Yang membuatnya mahal justru karena terlihat sepele sampai ada yang terjadi. Pesanan hilang dan tidak ada yang bisa dimintai penjelasan. Domain mati di hari Sabtu dan Anda tidak bisa memperpanjangnya sendiri.

## Akun-akun itu atas nama siapa

Software Anda berjalan di atas beberapa akun terpisah: hosting, nama domain, database, email, payment gateway, dan listing di App Store atau Play Store kalau ada aplikasi. Masing-masing punya pemilik yang terdaftar.

Begitu salah satu terdaftar atas nama vendor, keamanan dan kelangsungan bisnis jadi satu masalah yang sama. Vendor yang hilang kontak berarti Anda kehilangan kemampuan mencabut akses orang lain, memperpanjang domain, atau memindahkan server. Tidak perlu ada yang berniat jahat, cukup kunci itu ada di tangan orang lain.

Di Arktik, kode, server, domain, dan semua akun atas nama Anda sejak hari pertama, bukan diserahkan di akhir proyek. Cara mengeceknya sederhana: buka email yang terdaftar di tiap akun, lihat apakah itu email perusahaan Anda, dan coba login sendiri. Kalau Anda bisa masuk tanpa minta tolong siapa pun, kepemilikannya nyata.

## Siapa yang boleh melihat apa, dan siapa yang memutuskan

Pembagian hak akses sering dianggap urusan teknis, lalu dibiarkan jadi tebakan developer. Padahal yang paling tahu siapa boleh melihat apa adalah Anda. Developer tidak tahu bahwa harga khusus untuk reseller tertentu tidak boleh dilihat kasir, atau bahwa data gaji hanya untuk dua orang di kantor.

Anda tidak perlu bahasa teknis untuk menyampaikannya. Cukup sebutkan peran orangnya dan apa yang boleh ia kerjakan. Misalnya: kasir boleh membuat pesanan dan melihat stok, tapi tidak boleh melihat margin. Admin gudang boleh mengubah jumlah stok, tapi tidak boleh membatalkan pesanan. Supervisor boleh membatalkan pesanan, dan pembatalannya perlu alasan tertulis.

Aturan seperti itu kami bahas di discovery dan masuk ke rencana tertulis sebelum pembangunan mulai. Harganya tetap, dan dokumen rencananya milik Anda apa pun keputusan Anda setelahnya. Dengan urutan ini, keputusan soal akses diambil oleh orang yang menanggung akibatnya di lapangan.

## Mencatat siapa yang mengubah apa

Minta satu hal ini kalau tidak ada yang lain: sistem harus mencatat siapa mengubah apa dan kapan. Ketika harga satu produk tiba-tiba berubah jauh di bawah seharusnya, catatan itu yang memberi tahu Anda akun siapa yang mengubahnya dan jam berapa.

Gunanya terasa saat ada selisih. Stok di sistem tidak cocok dengan stok di gudang, dan beberapa orang punya versi cerita yang berbeda. Tanpa catatan, Anda hanya bisa menebak dan memarahi semua orang. Dengan catatan, Anda tahu pengurangan stok itu diinput oleh akun mana pada jam berapa, lalu bisa bertanya langsung ke orangnya.

Akuntan dan auditor juga menanyakan hal yang sama. Pesanan yang dibatalkan, invoice yang direvisi, dan pembayaran yang ditandai lunas secara manual semuanya perlu jejak. Jadi saat berbicara dengan vendor, sebutkan kejadian apa saja yang harus punya jejak di bisnis Anda. Pembatalan pesanan, perubahan harga, perubahan stok, dan penghapusan data pelanggan biasanya sudah menutup sebagian besar perkara.

## Keamanan yang tetap jalan setelah orangnya berganti

Komponen yang dipakai di dalam software terus diperbarui, dan sebagian pembaruan itu menutup celah keamanan. Sementara itu staf berganti, dan developer yang membangunnya pindah pekerjaan.

Ada tiga hal yang menentukan apakah orang berikutnya bisa menambal celah tanpa membongkar ulang. Pertama, teknologinya umum dan sudah terbukti, sehingga banyak developer di pasar mengenalinya dan perbaikannya jadi pekerjaan rutin. Kedua, alasan di balik setiap keputusan dicatat di sebelah kodenya, jadi developer baru mewarisi pemikirannya, tidak hanya kumpulan file. Ia tahu kenapa satu bagian sengaja dibuat begitu sebelum memutuskan mengubahnya.

Yang ketiga soal cara perbaikan itu sampai ke pengguna. Kalau setiap rilis butuh satu orang mengunggah file secara manual, perbaikan keamanan akan tertunda sampai orang itu punya waktu. Kalau prosesnya otomatis, perbaikan bisa naik di hari yang sama. Prosesnya kami uraikan di [CI/CD dijelaskan untuk orang yang membayar proyeknya](/blog/software-development/ci-cd-explained-for-business-owners/). Pertimbangan ini satu paket dengan keputusan arsitektur lain yang sebaiknya Anda pegang sendiri, dan daftarnya ada di [panduan arsitektur software untuk pemilik bisnis](/blog/software-development/guides/software-architecture-future-proofing-for-business-owners/).

## Yang perlu Anda tanyakan sebelum tanda tangan

Empat pertanyaan ini cukup untuk obrolan pertama, dan jawabannya bisa Anda nilai sendiri.

- Nama siapa yang terdaftar di hosting, domain, database, dan payment gateway, dan kapan saya bisa login pertama kali?
- Kalau ada celah keamanan ditemukan hari Senin, lewat jalan mana perbaikannya sampai ke pengguna, dan berapa lama?
- Kalau kerja sama kita berhenti, apa yang terjadi pada akses tim Anda ke sistem saya?
- Kejadian apa saja yang dicatat sistem, dan di mana saya bisa membacanya tanpa minta tolong developer?

Bentuk jawabannya sudah memberi petunjuk. Jawaban yang bisa dipakai menyebut nama akun, nama layanan, dan hitungan waktu. Jawaban yang perlu Anda curigai berhenti di kata sifat: aman, terenkripsi, sesuai standar industri. Soal apa lagi yang pantas Anda minta dari sebuah kerja sama, kami uraikan di [yang wajar Anda harapkan dari software house](/blog/software-development/what-clients-should-expect-in-a-software-house-partnership/).

## Setelah peluncuran: menambal itu pekerjaan rutin

Setelah software jalan, ada pekerjaan yang tidak pernah selesai. Pembaruan komponen harus dipasang dan sertifikat keamanan harus diperpanjang. Kegagalan di server juga perlu diawasi, supaya Anda tidak baru tahu dari chat pelanggan.

Pekerjaan itu harus jelas pemiliknya: dikerjakan tim Anda sendiri, atau diserahkan ke pihak lain dengan biaya bulanan. Kalau dibiarkan tanpa pemilik, sertifikat yang kedaluwarsa akan membuat website Anda ditandai tidak aman di browser pelanggan.

Kami menyediakan layanan bulanan untuk itu: hosting, pemantauan, perbaikan, dan perubahan kecil. Sifatnya pilihan, bisa dihentikan kapan saja, dan semua akun tetap atas nama Anda selama maupun setelah layanan berjalan. Kalau Anda punya staf IT sendiri dan lebih suka mengerjakannya di dalam, itu juga jawaban yang baik.

## Mari cek dulu siapa yang memegang akun Anda

Tidak perlu menyiapkan istilah teknis. Ceritakan saja software apa yang sekarang Anda pakai dan siapa yang dulu membuatnya. Kita telusuri bersama akun mana yang sebaiknya pindah ke nama Anda, dan kejadian apa yang perlu dicatat oleh sistem berikutnya. Obrolan pertamanya gratis, tanpa deck, langsung dengan engineer yang akan mengerjakannya.

Kalau ternyata urusan Anda sudah selesai dengan alat siap pakai yang dijual bulanan, kami akan bilang begitu. Kalau memang perlu dibangun, discovery memberi rencana tertulis dan harga tetap, dan dokumen itu milik Anda apa pun keputusan Anda setelahnya. Gunakan formulir kontak yang membuka WhatsApp, atau kirim email ke hello@arktik.id.
