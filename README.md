# Case Bazar — React (Next.js) Store

یہ Case Bazar کی نئی ویب سائٹ ہے جو **Next.js (React)** پر بنی ہے — SEO فرینڈلی، تیز، اور WordPress سے آزاد۔
خریداری cart کے بجائے سیدھا **WhatsApp** پر ہوتی ہے۔

## چلانے کا طریقہ (Run locally)

```bash
npm install      # ایک بار dependencies انسٹال کریں
npm run dev      # development سرور:  http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## ⚙️ اہم سیٹنگز

ساری settings یہاں ایک جگہ ہیں: **`src/lib/site.ts`**

- `whatsappNumber` — یہاں اپنا اصلی WhatsApp نمبر لگائیں
  (international format، بغیر +، بغیر space)۔ پاکستان کے لیے: `92` پھر نمبر بغیر شروع کے 0۔
  مثلاً اگر نمبر `0300 1234567` ہے تو لکھیں: `923001234567`
- `url` — جب سائٹ live ہو تو یہاں اپنا اصلی domain لکھیں (SEO کے لیے ضروری)۔
- `email`, `instagram`, `facebook` — footer میں دکھتے ہیں۔

## 🛍️ نئی product کیسے add کریں

1. product کی تصاویر `public/products/` فولڈر میں رکھیں۔
2. `src/data/products.ts` کھولیں اور `products` array میں ایک نیا object کاپی کر کے اپنی values ڈالیں:
   - `slug` (unique، URL میں آتا ہے)، `title`, `price`, `images`, `categories` وغیرہ۔
3. بس — صفحہ خودبخود بن جائے گا۔

## 🗂️ نئی category کیسے add کریں

`src/data/products.ts` میں `categories` array میں ایک نیا object شامل کریں
(`slug`, `name`, `description`, `image`)۔

## فولڈر کا خاکہ

```
src/
  app/                 صفحات (home, category, product) + SEO (sitemap, robots)
  components/          Header, Footer, ProductCard, Gallery, WhatsApp button
  data/products.ts     ⭐ ساری products اور categories یہاں
  lib/site.ts          ⭐ ساری سیٹنگز (WhatsApp نمبر، domain) یہاں
public/                تصاویر اور logo
```
