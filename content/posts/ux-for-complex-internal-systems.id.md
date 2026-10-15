---
title: Merancang Sistem Internal yang Benar-Benar Dipakai Staf
excerpt: >-
  Sistem internal biasanya gagal bukan karena fiturnya kurang, tapi karena cara
  pakainya tidak cocok dengan jalannya pekerjaan.
seoTitle: 'UX Sistem Internal: Rumit tapi Mudah Dipakai'
seoDescription: >-
  Kenapa staf kembali ke spreadsheet, dan keputusan desain apa yang membuat
  sistem internal yang rumit tetap enak dipakai setiap hari.
ctaTitle: Ceritakan sistem internal yang sekarang dihindari staf
ctaDescription: >-
  Obrolan pertama gratis dan tanpa deck. Kita lihat bagian mana yang dilewati
  staf, lalu discovery memberi rencana tertulis dan harga tetap yang tetap milik
  Anda.
tags:
  - ux
  - sistem internal
  - software custom
  - ukm
  - operasional
date: '2026-10-15'
updated: '2026-10-15'
category: design-ux
author: tika-aurora
pillar: business-value-of-ux-design
image: >-
  https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkZXNrJTIwcGFwZXJ3b3JrfGVufDF8MHx8fDE3OTIwMjc0NTl8MA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: 'MacBook Pro, white ceramic mug,and black smartphone on table'
imageCredit:
  name: Andrew Neel
  profileUrl: 'https://unsplash.com/@andrewtneel?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 8
  developer: 7
  voice: 7
  bahasa: 7
  rounds: 0
---
Banyak sistem internal sudah punya semua fitur yang diminta waktu brief, tapi staf tetap mencatat yang sebenarnya di spreadsheet sebelah. Software itu melawan urutan kerja yang nyata, jadi orang mencari jalan yang lebih cepat.

Kalau Anda sedang mau membangun atau membangun ulang sistem internal, yang menentukan hasilnya adalah cara layarnya dirancang dan seberapa awal pemakainya bisa ikut mengoreksi. Di bawah ini kami uraikan apa yang biasanya salah, dan apa yang bisa ditanyakan ke vendor sebelum ada yang mulai mengerjakan.

## Kenapa staf kembali ke spreadsheet

Polanya hampir selalu sama. Sistemnya ada dan lisensinya dibayar, tapi catatan yang dipercaya orang gudang ada di satu file Excel yang hanya ia yang rapikan. Sistem resminya diisi belakangan, kadang beberapa hari sekali, kadang menjelang tutup bulan.

Mencatat satu barang keluar butuh banyak klik: pilih gudang, pilih dokumen, cari kode barang, isi jumlah, simpan, lalu kembali ke awal untuk barang berikutnya. Di Excel, itu satu baris saja, dan satu daftar panjang selesai sebelum halaman kedua sistemnya dimuat.

Ongkosnya muncul di tempat lain. Anda melihat rekap dari angka yang sudah beberapa hari tidak diperbarui, lalu memutuskan pembelian berdasarkan stok yang sudah berubah. Prosesnya juga bergantung pada satu orang yang hafal isi filenya, sehingga pekerjaan berhenti waktu ia cuti.

## Pekerjaan rumit, layar sederhana: apa maksudnya

Sederhana di sini tidak berarti fiturnya dikurangi. Pekerjaan gudang, penagihan, atau penjadwalan memang rumit, dan kerumitannya tidak bisa dihapus dari layar. Yang bisa diatur adalah berapa banyak kerumitan itu yang harus dipikul orangnya dalam satu waktu.

Bedanya paling kelihatan di form. Form yang mencontoh tabel database menampilkan semua kolom yang ada di tabel itu, dalam urutan kolom di database. Kode wilayah, kode cabang, tipe dokumen, dan status pajak muncul sekaligus di satu halaman. Form yang mencontoh pekerjaan hanya menanyakan yang belum diketahui sistem, dalam urutan yang biasa ditanyakan admin ke pelanggan.

Sisanya diisi sistem. Begitu admin memilih pelanggan, alamat kirim, termin pembayaran, dan harga khususnya ikut terisi, karena semua itu sudah tersimpan. Satu layar mengerjakan satu pekerjaan, dengan isian yang sudah separuh jadi. Argumen umum soal apa yang diberikan desain ke bisnis kami bahas di [nilai bisnis dari desain UX](/blog/design-ux/guides/business-value-of-ux-design/); tulisan ini bagian khususnya untuk sistem internal.

## Rancang alur satu hari kerja, bukan daftar fitur

Mulai dari urutan kerja satu orang, bukan dari modul. Admin penjualan menerima permintaan di grup WhatsApp, mengecek stok, mengonfirmasi harga dan tanggal kirim ke pelanggan, lalu mencatat pesanannya. Empat langkah itu yang jadi rangka layarnya.

Kalau rangkanya diikuti, pengecekan stok ada di halaman yang sama dengan pesanan yang sedang diketik, bukan di menu lain yang memaksa admin membuka tab kedua. Teks konfirmasi untuk pelanggan juga bisa disiapkan dari situ, karena di situlah pekerjaannya terjadi.

Fitur yang tidak pernah dilewati di jalur itu ada biayanya. Fitur itu tetap harus dibangun, diuji, dirawat, dan nanti dipelajari developer berikutnya, padahal tidak ada yang membukanya. Lebih baik dicatat untuk tahap selanjutnya dan diputuskan setelah sistemnya dipakai sebulan. Untuk sisi yang berhadapan dengan pelanggan, disiplinnya sama dan kami bahas terpisah di [UI/UX dan pertumbuhan bisnis](/blog/design-ux/ui-ux-design-business-growth/).

## Layar yang menentukan sistemnya dipakai atau tidak

Ada tiga layar yang menentukan. Pertama, daftar harian: apa yang harus saya kerjakan hari ini, urut berdasarkan yang paling mendesak, tanpa perlu memasang filter dulu. Kedua, tampilan satu data: satu pesanan atau satu pelanggan, lengkap dengan riwayatnya, supaya orang bisa menjawab telepon tanpa membuka tiga halaman.

Ketiga, dan ini yang paling sering tidak dirancang sama sekali, layar saat ada yang salah. Stoknya minus, pembayaran masuk dua kali, admin salah pilih pelanggan dan datanya sudah tersimpan, atau barang sudah dikirim padahal pesanannya dibatalkan.

Di banyak sistem internal, kejadian seperti itu berakhir di pesan error yang tidak memberi jalan keluar, atau di nomor WhatsApp vendornya. Di situ staf berhenti percaya, lalu membuka spreadsheet lagi, karena di Excel kesalahan bisa dibetulkan sendiri saat itu juga. Jadi tanyakan sejak awal: kalau datanya salah, siapa yang boleh membetulkan, lewat layar mana, dan apakah perubahannya terekam.

## Merancang untuk orang yang belum pernah dilatih

Sistem internal selalu mewarisi orang baru. Ada staf yang masuk bulan depan, ada yang menggantikan rekannya yang izin, ada kepala toko yang hanya membuka sistem itu saat tutup bulan. Tidak satu pun dari mereka ikut pelatihan tiga tahun lalu.

Yang menolong mereka adalah label yang memakai istilah yang sudah dipakai di kantor. Kalau orang gudang menyebutnya "surat jalan", layarnya menulis surat jalan, bukan "dokumen pengiriman keluar". Status juga harus terlihat tanpa ditafsirkan: pesanan ini sudah dibayar atau belum, sudah dikirim atau masih menunggu. Tindakan yang bisa dibatalkan juga membuat orang baru berani mencoba.

Kebutuhan yang sama berlaku untuk staf yang memakai ukuran huruf paling besar di ponselnya, atau yang bekerja di gudang dengan cahaya terang dan satu tangan memegang barang. Ini bagian dari pekerjaan desain yang sama, dan kami uraikan lebih jauh di [desain yang bisa dipakai semua orang](/blog/design-ux/accessibility-inclusive-design-for-business/).

## Layar yang bisa diklik lebih berguna daripada dokumen desain

Desain produk kami serahkan sebagai layar yang bisa dibuka dan diklik, bukan PDF. Kepala operasional Anda sulit menilai alur kerja dari gambar di dokumen, tapi ia langsung tahu ada yang keliru begitu mencoba memasukkan satu pesanan sungguhan.

Karena itu ada demo setiap minggu dan link preview privat sejak minggu pertama. Orang yang mengerjakan pekerjaannya bisa membuka sendiri dan berkata "bukan begitu urutannya di sini", selagi mengubah keputusan desain masih murah. Komentar yang sama kalau baru muncul setelah sistemnya dipakai berarti pekerjaan ulang.

Alasan di balik tiap keputusan desain dan teknis juga dicatat di sebelah kodenya. Jadi orang yang merawat sistemnya nanti mewarisi pemikirannya, bukan hanya filenya, dan tidak mengubah sesuatu yang dulu sengaja dibuat begitu.

## Yang perlu ditanyakan sebelum pembangunan dimulai

Anda tidak perlu paham teknologinya untuk menilai apakah vendor akan mengerjakan bagian ini dengan benar. Empat pertanyaan ini cukup, dan jawabannya akan terdengar berbeda antara vendor yang sudah memikirkannya dan yang belum.

- Siapa yang akan mengamati admin atau orang gudang mengerjakan pekerjaannya sebelum ada satu layar pun dirancang, dan kapan.
- Kapan saya bisa membuka layar yang sudah bisa diklik, dan siapa dari tim saya yang boleh mencobanya.
- Apa yang terjadi kalau datanya salah: siapa yang boleh membetulkan, dari layar mana.
- Kalau ternyata alur yang dirancang tidak cocok dengan cara kami bekerja, berapa biaya mengubahnya dan di tahap mana.

Pertanyaan terakhir berhubungan langsung dengan cara membayarnya. Karena ruang lingkup dan harga setiap tahap disepakati tertulis sebelum tahap itu mulai, arah desain yang keliru paling banyak memakan satu tahap, bukan seluruh proyek. Anda juga bisa berhenti setelah tahap mana pun tanpa perdebatan.

Satu hal lagi, dan ini sering lebih menghemat daripada desain yang bagus. Kalau prosesnya sebenarnya sudah selesai dengan alat siap pakai yang dijual bulanan, kami akan bilang begitu, dan Anda tidak mengeluarkan anggaran build sama sekali.

## Ceritakan sistem internal yang sekarang dihindari staf

Tidak perlu menyiapkan daftar kebutuhan teknis. Ceritakan saja bagian mana dari sistem yang sekarang dilewati staf, dan catatan apa yang masih mereka simpan di luar sistem itu. Kalau sistemnya belum ada, ceritakan satu hari kerja admin Anda dari pagi sampai tutup. Obrolan pertamanya gratis dan tanpa deck.

Kalau ternyata ada alat siap pakai yang sudah menyelesaikannya, kami akan bilang begitu. Kalau memang perlu dibangun, discovery memberi rencana tertulis dan harga tetap, dan dokumen itu milik Anda apa pun keputusan Anda setelahnya. Gunakan formulir kontak yang membuka WhatsApp, atau kirim email ke hello@arktik.id.
