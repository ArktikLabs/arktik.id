# Indonesian voice for social posts

Included in the social generation prompt. Personas: `docs/superpowers/specs/2026-09-20-social-distribution-design.md`.

## Root rule: write in Indonesian first, never translate

Draft the Indonesian post directly from the article's *ideas*. Do not translate the English
post or the English article's sentences. The Indonesian article is itself a transcreation
from English, so don't copy its phrasing either. Test every line with one question: would an
Indonesian business owner actually say this out loud? If not, rewrite it.

## Register per platform

| Platform | Persona | Pronoun | Register | Sample |
|---|---|---|---|---|
| Instagram (company) + Reels | the teacher | **kamu** (or none) | santai-rapi: `aja`, `nggak`, `bikin`, `gimana` OK; no slang (`gaes`, `cuy`, `bestie`) | "Kalau cara kerjanya sama kayak bisnis lain, langganan aja." |
| Facebook (company) | neighbour who runs a business | **Anda** | semi-formal spoken: `saja`, `tidak`, `sudah`; sentences are short and conversational, not brochure-like | "Banyak pemilik usaha baru sadar setelah tagihannya naik tiap bulan." |
| Threads (company) | the "admin" (trial, see `threads-admin-persona.md`) | **gw/lu** | santai Jakarta, setup + one punchline, jokes about the situation never about our competence | "Excel kantor lu udah 47 sheet, yang ngerti cuma 3 orang, 1 udah resign? Itu bukan spreadsheet lagi. Itu warisan." |
| Threads (founder) | founder thinking out loud | **aku** | santai and reflective, first person, no "kami/kita", never selling | "Minggu ini aku nyaranin calon klien buat nggak bikin software. Aneh juga rasanya." |
| LinkedIn, X | — | English | per spec | — |

Never mix registers within one post: "Anda" + "aja/nggak" sounds wrong. Formal "Anda"
posts use `saja/tidak`; "kamu" posts use `aja/nggak`.

## Keep these in English (this is how owners actually talk)

software, custom, aplikasi, link, budget, update, tools, add-on, maintenance, training,
dashboard, fitur, vendor, deadline, meeting, upgrade, website, online, admin.
Use "link di bio", **never** "tautan di bio". Use "custom" or "bikin sendiri", not "kustom".

## Banned calques (English structure in Indonesian words) → natural version

- "Ini cara memutuskannya" (here's how to decide) → "Cek dulu sebelum keluar duit"
- "X punya harga" (X has a price) → "X itu mahal di depan"
- "inti nilai Anda" (your core value) → "alasan pelanggan milih kamu"
- "menahan Anda" (holding you back) → "mulai nggak cocok" / "malah bikin repot"
- "software siap pakai" (off-the-shelf) → "aplikasi langganan" / "yang sudah jadi"
- "investasi awal" → "biaya di depan"
- "diferensiasi kompetitif" → "yang nggak bisa ditiru kompetitor"
- "TCO" / "total biaya kepemilikan" → "hitung biayanya 3–5 tahun"
- "memberdayakan", "solusi terbaik", "transformasi digital", "mendorong pertumbuhan" → cut; say what it concretely does
- "Apakah Anda ...?" as an opener → state it, or ask it the way people talk ("Pernah ngalamin...?")
- a noun-stacked title ("Pemilihan Software untuk Pertumbuhan Bisnis") → a sentence with a verb

## Self-check before render

1. Could this line be read out in a voice note without sounding weird?
2. Is the register consistent all the way through the post (pronoun + particles)?
3. Is any calque from the list above still in there?
4. Is every claim still traceable to the article or the value themes?
