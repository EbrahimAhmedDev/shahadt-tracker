# 🎬 شاهدت | Shahadt - Movie & Series Tracker

تطبيق ويب عصري وفاخر لتتبع وإدارة الأفلام والمسلسلات التي تشاهدها حالياً والتي انتهيت منها، مع جلب تلقائي لبيانات وبوسترات الأعمال من موقع **توب سينما (Top Cinema)** بشكل أساسي مع التبديل التلقائي إلى **أهواك تي في (Ahwak TV)** كخيار بديل عند عدم توفر المحتوى.

---

## ✨ المميزات الرئيسية (Key Features)

- **تتبع شامل للمشاهدات**:
  - تصنيف مرن للأعمال: **أشاهد حالياً (Watching)**، **تمت المشاهدة (Completed)**، **في الخطة (Plan to Watch)**، **متوقف (Dropped)**.
  - عداد حلقات ذكي وتفاعلي للمسلسلات مع زر سريع `+1 حلقة` وشريط تقدم دقيق.
  - تقييم شخصي بالنجوم (1 إلى 10) مع تسجيل الملاحظات والانطباعات وتواريخ المشاهدة.
- **محرك جلب وبحث هجين وذكي**:
  - يبحث تلقائياً في **توب سينما** (`topcinemaa.vip` ومراياه).
  - في حال لم يتوفر العمل، ينتقل آلياً للبحث في **أهواك تي في** (`ahwaktv.cam`).
  - إمكانية الإضافة اليدوية في أي وقت مع تعديل البوستر والتفاصيل.
- **دعم كامل للغتين العربية والإنجليزية (Bilingual RTL/LTR)**:
  - واجهة عربية أصيلة مع اتجاه RTL وخط **Cairo**.
  - إمكانية التحويل الفوري بنقرة زر إلى الإنجليزية LTR.
- **تصميم سينمائي متميز (Cinema Noir & Modern Editorial)**:
  - واجهة ليلية داكنة بدرجات الأسود الفحمي (`#080C14`) مع لمسات نيون قرمزي سينمائي (`#E50914`) وانعكاسات زجاجية (Glassmorphism).
  - متجاوب بالكامل 100% مع الهواتف المحمولة والشاشات الكبيرة.
- **قاعدة بيانات Supabase مع دعم الوضع المحلي**:
  - يعمل مباشرة وفورياً بوضع الضيف (Guest / LocalStorage mode).
  - مزامنة سحابية كاملة مع جداول Supabase PostgreSQL وحماية RLS.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **الواجهة الأمامية**: [Next.js 15/16 App Router](https://nextjs.org/) + [React 19](https://react.dev/)
- **التصميم والأنماط**: [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) + [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **محرك الجلب والخوادم**: Next.js Serverless API Routes + [Cheerio](https://cheerio.js.org/)
- **قاعدة البيانات والمصادقة**: [Supabase PostgreSQL](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`)
- **الاستضافة والنشر**: [Vercel](https://vercel.com/) + [GitHub](https://github.com/)

---

## 🚀 التشغيل محلياً (Local Development)

```bash
# تثبيت الحزم
npm install

# تشغيل بيئة التطوير
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## 🗄️ إعداد قاعدة بيانات Supabase (اختياري للمزامنة السحابية)

نفّذ الأوامر الموجودة في ملف `lib/supabase/schema.sql` في محرر SQL بمشروعك على Supabase، ثم أضف المفاتيح في ملف `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

---

## 📄 الترخيص (License)
MIT © [EbrahimAhmedDev](https://github.com/EbrahimAhmedDev)
