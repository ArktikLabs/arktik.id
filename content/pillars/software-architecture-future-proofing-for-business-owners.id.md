---
title: >-
  Arsitektur Software dan Daya Tahan Lima Tahun: Bagian yang Harus Diputuskan
  Pemilik, Bukan Developer
introduction: >-
  Arsitektur biasanya dibicarakan sebagai topik teknis, lalu diserahkan
  seluruhnya ke developer. Padahal yang menentukan apakah software Anda masih
  berguna lima tahun lagi justru keputusan bisnis. Siapa pemilik akunnya,
  seberapa umum teknologi yang dipakai, apakah alasan tiap pilihan dicatat, dan
  seberapa cepat developer baru bisa melanjutkan. Empat hal itu bisa Anda
  periksa sendiri tanpa membaca kode. Yang dijelaskan di sini: risiko yang
  dihindari, lima permintaan yang perlu diajukan ke vendor, dan kenapa
  pembangunan bertahap memunculkan pilihan arsitektur selagi masih murah diubah.
seoTitle: 'Arsitektur Software: Keputusan Milik Pemilik Bisnis'
seoDescription: >-
  Empat pertanyaan arsitektur yang bisa diperiksa pemilik UKM tanpa latar
  belakang teknis, agar software Anda tidak terkunci pada satu vendor.
ctaTitle: Bawa proses yang Anda khawatirkan
ctaDescription: >-
  Tidak ada deck dan tidak ada presentasi penjualan. Lewat satu panggilan
  gratis, ceritakan proses yang paling Anda khawatirkan. Kami akan mengatakan
  apakah memang perlu software custom. Kalau perlu, Discovery memberi rencana
  tertulis beserta harga tetap yang tetap menjadi milik Anda, dilanjutkan atau
  tidak.
date: '2026-10-23'
updated: '2026-10-23'
category: software-development
author: tika-aurora
image: >-
  https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxzY2FmZm9sZGluZyUyMGNvbmNyZXRlJTIwYnVpbGRpbmd8ZW58MXwwfHx8MTc5MjcxODk3MXww&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: grayscale photography of piled racks
imageCredit:
  name: Ricardo Gomez Angel
  profileUrl: 'https://unsplash.com/@rgaleriacom?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/grayscale-photography-of-piled-racks-EqUFBrTIdeE?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 7
  developer: 8
  voice: 6
  bahasa: 7
  rounds: 0
---
Software Anda bisa disebut tahan lama kalau tiga hal berikut benar. Orang lain bisa merawatnya. Anda bisa berpindah vendor tanpa membangun ulang. Dan prosesnya bisa diubah tanpa membongkar seluruh sistem. Ketiganya ditentukan oleh keputusan arsitektur.

Sebagian keputusan itu memang urusan developer, misalnya struktur tabel di database atau cara satu bagian sistem memanggil bagian lain. Tetapi empat keputusan yang paling menentukan adalah keputusan bisnis, dan jawabannya bisa Anda periksa sendiri. Kalau Anda sedang memesan software untuk pertama kali dan butuh gambaran seluruh prosesnya, mulailah dari [panduan memesan software custom](/blog/software-development/guides/custom-software-development-definitive-guide/).

## Apa yang sebenarnya dilindungi oleh arsitektur

Ada tiga cara software custom berakhir buruk, dan ketiganya baru terasa setelah setahun atau dua tahun.

Yang pertama, sistem yang tidak bisa dirawat siapa pun selain pembuatnya. Developer baru membuka kodenya, menemukan teknologi yang tidak pernah ia pakai, lalu memberi penawaran untuk menulis ulang daripada memperbaiki. Dari sisi Anda, biayanya terasa seperti membeli sistem kedua.

Yang kedua, vendor yang tidak bisa ditinggalkan. Kodenya ada di akun vendor, servernya atas nama vendor, domainnya juga. Setiap permintaan kecil harus lewat satu pintu, dan harganya ditentukan di pintu itu juga. Harga yang Anda bayar mengikuti posisi vendor itu, bukan besarnya pekerjaan.

Yang ketiga paling sering terjadi di bisnis yang tumbuh: sistem yang tidak bisa menerima perubahan proses. Anda membuka cabang kedua, menambah satu kanal penjualan, atau mengubah aturan diskon. Ternyata aturan lama tertanam di belasan tempat di dalam kode, dan perubahan yang terdengar sepele di rapat memakan waktu berpekan-pekan.

Arsitektur menentukan mana dari tiga keadaan itu yang Anda dapat. Karena itu pilihannya tidak pantas diserahkan sepenuhnya kepada pihak yang tidak akan menanggung akibatnya.

## Empat pertanyaan arsitektur yang bisa Anda ajukan tanpa latar belakang teknis

Keempat pertanyaan ini punya jawaban yang bisa dicek, bukan jawaban yang harus dipercaya:

- Teknologinya umum atau langka? Minta nama teknologinya, lalu cari berapa banyak lowongan dan developer di Indonesia yang memakainya.
- Akunnya atas nama siapa? Minta daftar akun, lalu buka salah satunya memakai email perusahaan Anda sendiri.
- Alasan tiap keputusan dicatat di mana? Minta ditunjukkan satu catatannya, bukan dijanjikan ada.
- Berapa lama developer baru bisa menjalankan sistem ini di laptopnya? Kalau jawabannya butuh pendampingan khusus dari tim lama, Anda sudah punya masalah ketergantungan.

Tidak satu pun pertanyaan itu menuntut Anda menilai kualitas kode. Semuanya menanyakan susunan, kepemilikan, dan catatan, dan ketiganya bisa diperiksa orang yang bukan developer.

## Teknologi yang biasa saja justru asuransi paling murah

Teknologi yang sudah lama terbukti dan banyak dipakai punya satu keunggulan yang sulit dikalahkan, yaitu jumlah orang yang bisa melanjutkannya. Kalau developer Anda pindah kerja, Anda mencari pengganti dari kolam yang besar, bukan dari daftar sepuluh nama.

Teknologi yang jarang dipakai juga lebih sering memberi kejutan saat pembaruan. Pustaka yang dipakai berhenti dirawat, dokumentasinya tipis, dan tidak ada orang lain yang pernah menemui masalah serupa untuk Anda tiru solusinya.

Pilihan yang eksotis biasanya menguntungkan pembuatnya. Developer ingin mencoba hal baru, dan sebagai keinginan itu wajar, tetapi biaya perawatan lima tahunnya ditanggung bisnis Anda. Kami membangun di atas teknologi yang umum dan sudah terbukti, dengan alasan tiap keputusan dicatat berdampingan dengan kodenya. Dengan begitu developer berikutnya mewarisi pemikirannya, bukan hanya file.

Teknologi umum bukan berarti teknologi tertinggal. Yang dicari adalah teknologi dengan banyak pemakai dan sejarah pemeliharaan yang jelas.

## Kepemilikan termasuk arsitektur, bukan urusan dokumen

Banyak kontrak menyebut klien sebagai pemilik kode. Yang menentukan adalah letak akunnya.

Ada lima tempat yang perlu Anda periksa: repositori kode, server atau layanan hosting, domain, akun layanan pihak ketiga seperti pembayaran dan pengiriman pesan, serta akun layanan email. Kalau kelimanya terdaftar dengan email perusahaan Anda, Anda bisa mengganti vendor tanpa meminta izin siapa pun. Kalau salah satunya atas nama vendor, perpindahan itu bergantung pada izinnya.

Di tempat kami, kode, server, domain, dan seluruh akun sudah atas nama klien sejak hari pertama, bukan dialihkan di akhir proyek. Serah terima hanya menegaskan apa yang sejak awal sudah menjadi milik klien. Tidak ada bagian dari sistem yang bergantung pada kami untuk terus berjalan.

Bedanya terasa pada saat yang paling buruk. Kalau hubungan dengan vendor memburuk di tengah jalan, janji kepemilikan berubah menjadi negosiasi. Akun yang sudah atas nama Anda tidak perlu dinegosiasikan.

## Mencatat alasan keputusan membuat sistem bisa diwarisi

Developer berikutnya yang membuka kode Anda biasanya bingung karena tidak tahu kenapa sesuatu dibuat begitu.

Kenapa persetujuan pesanan dibuat dua tahap? Kenapa data stok disimpan terpisah dari data penjualan? Kenapa integrasi ke kurir dibuat lewat satu pintu dan tidak dipanggil langsung dari beberapa halaman? Tanpa catatan alasan, developer baru menebak, dan tebakannya biasanya menyederhanakan sesuatu yang sengaja dibuat rumit. Tahap kedua persetujuan dihapus, lalu enam bulan kemudian ada pembayaran yang lolos tanpa diperiksa siapa pun.

Kode tanpa dokumentasi mengikat Anda walaupun tidak ada yang berniat mengikat. Pembuatnya satu-satunya orang yang menyimpan alasannya, dan ia menyimpannya di kepala. Karena itu catatan alasan lebih berharga daripada tumpukan dokumen yang rapi tetapi tidak menjelaskan apa-apa.

Yang perlu dicatat tidak banyak: keputusan yang punya alternatif, alasan alternatif itu ditolak, dan batasan yang harus dihormati. Catatannya tinggal di dekat kodenya supaya ikut terbaca oleh siapa pun yang membuka berkasnya.

## Bangun untuk perubahan yang sudah terlihat, bukan untuk perusahaan yang Anda bayangkan

Membangun berlebihan sama mahalnya dengan membangun setengah jadi. Sistem yang dirancang untuk sejuta pengguna padahal pemakainya dua belas admin akan lambat dikerjakan, mahal dirawat, dan sulit dipahami developer baru.

Ukurannya cukup sederhana. Rancang untuk proses yang benar-benar Anda jalankan sekarang, lalu sisakan sambungan yang jelas di tempat yang memang sering berubah. Aturan harga dan diskon berubah tiap tahun di hampir semua bisnis. Laporan selalu ditambah. Kanal penjualan baru, misalnya marketplace atau pemesanan lewat WhatsApp, biasanya datang menyusul. Tiga titik itu dibuat supaya bisa diubah tanpa membongkar yang lain.

Perubahan yang tidak bisa Anda sebutkan hari ini tidak perlu disiapkan hari ini. Cara memulai dari versi terkecil yang sudah berguna kami bahas di [MVP: mulai kecil, tumbuh cepat](/blog/software-development/mvp-development-start-small-scale-fast/).

Ada satu keputusan arsitektur yang paling sering terlewat: tidak membangun apa pun. Kalau masalah Anda penagihan, penjadwalan, atau toko online standar, tool berlangganan yang sudah ada biasanya mengerjakannya lebih baik dan lebih murah. Dalam keadaan itu kami akan mengatakannya dan menunjukkan tool-nya. Cara menimbangnya ada di [software custom atau tool jadi](/blog/software-development/custom-vs-off-the-shelf-software-right-fit/).

## Cara pembangunan bertahap menjaga arsitektur tetap jujur

Pilihan arsitektur murah diubah di pekan kedua dan mahal diubah di bulan kelima. Karena itu cara kerja vendor ikut menentukan hasil arsitekturnya.

Lingkup dan harga setiap tahap disepakati tertulis sebelum tahap itu dimulai, jadi Anda bisa berhenti setelah tahap mana pun. Anda juga tidak perlu menunggu sampai akhir untuk mengetahui bentuk sistemnya. Selama pembangunan ada software yang berjalan setiap pekan, ditambah link preview privat sejak pekan pertama. Anda bisa membukanya sendiri dan berkata bahwa alur persetujuan itu tidak cocok dengan cara tim Anda bekerja. Keberatan di pekan ketiga masih bisa dibicarakan, sedangkan keberatan yang sama di bulan kelima berarti penulisan ulang.

Satu peluncuran besar di akhir menyembunyikan semua pilihan itu sampai terlambat. Logika kerja bertahap ini kami uraikan di [pengembangan agile dan lean untuk bisnis](/blog/software-development/guides/agile-lean-development-for-businesses/). Mekanisme teknis yang membuat perubahan bisa dirilis sering tanpa merusak yang sudah berjalan ada di [CI/CD untuk pemilik bisnis](/blog/software-development/ci-cd-explained-for-business-owners/).

## Pertanyaan yang perlu Anda ajukan ke vendor sebelum tanda tangan

Lima permintaan di bawah ini bisa diajukan lewat satu pesan, dan cara vendor menjawabnya sudah memberi banyak informasi.

Sebutkan teknologinya beserta alasannya, dalam bahasa yang bisa Anda ulangi ke orang lain. Jawaban yang hanya menyebut nama tanpa alasan menandakan pilihannya kebiasaan, bukan pertimbangan.

Tunjukkan daftar akun dan atas nama siapa masing-masing. Minta juga satu akun dibuka memakai email perusahaan Anda sekarang, bukan nanti.

Tunjukkan satu contoh catatan keputusan dari proyek lain, dengan bagian rahasianya disensor. Yang Anda nilai bukan kerapiannya, melainkan apakah catatan seperti itu memang ada.

Jelaskan isi serah terima: apa yang Anda terima, siapa yang bisa melanjutkan sesudahnya, dan berapa lama developer baru butuh waktu untuk menjalankan sistemnya.

Terakhir, tanyakan apa yang vendor itu akan menolak membangun. Vendor yang tidak pernah menolak apa pun belum pernah mendahulukan kepentingan klien di atas nilai penawaran.

## Bawa proses yang Anda khawatirkan

Tidak ada deck dan tidak ada daftar periksa untuk diunduh di sini. Pilih satu proses yang paling Anda khawatirkan, entah karena hanya satu orang yang memahaminya atau karena spreadsheet-nya mulai sering salah, lalu ceritakan lewat satu panggilan gratis.

Kalau jawaban yang jujur adalah tool berlangganan, kami akan mengatakannya. Kalau memang butuh software custom, Discovery menghasilkan rencana tertulis beserta harga tetap, dan keduanya tetap milik Anda entah Anda melanjutkan bersama kami atau tidak.

Hubungi kami di WhatsApp +62 851-1769-7889 atau email hello@arktik.id.
