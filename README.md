# Davomat — Maktab tizimi (PWA)

Sinf rahbarlari uchun tezkor davomat belgilash va direktor oʻrinbosariga kunlik hisobot yuborish uchun zamonaviy Progressive Web App (PWA).

## Asosiy imkoniyatlar

- **Sinf rahbari rejimi (Davomat):**
  - Barcha oʻquvchilar sukut boʻyicha «Keldi» holatida — 20–30 oʻquvchini 5 soniyada belgilash mumkin.
  - 1 bosishda holat tanlash: `Keldi`, `Kasal`, `Sababli`, `Sababsiz`, `Kechikdi`.
  - «Hammasi keldi (1 bosish)» tezkor tugmasi.
  - Har bir oʻquvchi uchun tayyor shablonli sabab/izoh qoʻshish.
  - Qidiruv va filtrlash (`Barchasi`, `Kelmaganlar`, `Kechikkanlar`).
  - Telegramga tayyor hisobot yuborish (Bot API yoki Telegramda ulashish / nusxalash).

- **Direktor oʻrinbosari paneli (Hisobot):**
  - Kunlik umumiy davomat foizi va sabablar kesimidagi statistika.
  - Topshirgan va hali topshirmagan sinflar nazorati.
  - Topshirmagan sinf rahbarlariga 1 bosishda Telegram eslatma yuborish.
  - Maktab boʻyicha yagona umumiy hisobotni Telegramga yuborish va Excel (CSV) shaklida yuklab olish.

- **PWA va Oflayn rejim:**
  - Telefon bosh ekraniga alohida ilova kabi oʻrnatiladi (`manifest.webmanifest` + Service Worker).
  - Internet oʻchganda ham ishlaydi va maʼlumotlarni saqlab qoladi.
  - Yorugʻ va tungi mavzularni qoʻllab-quvvatlaydi.

## Ishga tushirish

```bash
npm install
npm run dev
npm run build
```
