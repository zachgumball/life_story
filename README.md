<<<<<<< HEAD
# Nothing in My Way

Situs autobiografi bilingual yang mendokumentasikan perjalanan hidup, refleksi pribadi, dan momen-momen yang membentuk diri. Pengunjung dapat membaca cerita dalam Bahasa Indonesia atau English, sementara pemilik mengelola konten melalui studio admin privat.

**Deskripsi singkat GitHub:** Situs autobiografi bilingual dengan jurnal perjalanan dan studio admin privat berbasis Next.js dan Supabase.

## Fitur

- Beranda autobiografi dengan pilihan Bahasa Indonesia dan English.
- Timeline perjalanan hidup, rencana, jurnal, galeri foto, dan informasi kontak.
- Daftar jurnal serta halaman detail dengan checkpoint perjalanan.
- Pergantian foto interaktif pada hero dan galeri foto.
- Studio admin privat untuk mengelola teks beranda, jurnal, rencana, dan galeri.
- Autentikasi admin dan penyimpanan konten menggunakan Supabase.
- Data contoh lokal sebagai fallback ketika konfigurasi Supabase belum tersedia.
- Tata letak responsif untuk desktop dan perangkat seluler.

## Teknologi

- Next.js 16 dengan App Router
- React 19 dan TypeScript
- Supabase Auth dan PostgreSQL
- CSS Modules dan CSS responsif

## Menjalankan Secara Lokal

1. Pasang dependensi:

   ```bash
   npm install
   ```

2. Buat file `.env.local` dan isi kredensial Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Jalankan `supabase-schema.sql` melalui Supabase SQL Editor. Sebelum menjalankannya, sesuaikan alamat email pemilik pada kebijakan Row Level Security di file tersebut.

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000).

Tanpa kredensial Supabase, situs publik menggunakan data contoh lokal. Fitur admin dan autentikasi memerlukan konfigurasi Supabase.

## Perintah

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Struktur Konten

- Konten dan fallback bawaan berada di `app/data/`.
- Halaman publik berada di `app/` dan komponennya berada di `app/components/`.
- Halaman pengelolaan konten berada di `app/admin/`.
- Skema tabel dan kebijakan akses Supabase berada di `supabase-schema.sql`.

## Keamanan

Jangan unggah file `.env.local` atau kredensial Supabase ke repositori. Batasi akses tulis melalui autentikasi dan kebijakan Row Level Security yang sesuai dengan akun pemilik.
=======
# life_story
>>>>>>> origin/main
