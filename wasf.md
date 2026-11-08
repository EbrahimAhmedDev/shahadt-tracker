# 🎬 شاهدت | Shahadt — دليل المشروع الكامل

> ملف الوصف الرسمي للمشروع: فكرته، مخططه، بنية ملفاته، قاعدة بياناته، والنشر.
> آخر تحديث: 8 نوفمبر 2026

---

## 1) المشروع في سطر واحد

تطبيق ويب شخصي لتتبع الأفلام والمسلسلات — بتسجل "بتشاهد دلوقتي" و"خلّصت" و"ناوي تشاهد"، مع جلب تلقائي لبيانات وبوسترات الأعمال من توب سينما وأهواك، ومزامنة سحابية مجانية عبر Supabase.

---

## 2) الروابط المهمة

| الوجهة | الرابط |
|---|---|
| التطبيق (Live) | https://shahadt-tracker.vercel.app |
| كود المشروع (GitHub) | https://github.com/EbrahimAhmedDev/shahadt-tracker |
| لوحة Vercel | https://vercel.com/ebrahimahmeddevs-projects/shahadt-tracker |
| لوحة Supabase | https://supabase.com/dashboard/project/zgdthcpftcicbjihbtfj |
| Supabase Project Ref | `zgdthcpftcicbjihbtfj` (eu-central-1) |
| Vercel Project ID | `prj_6ImzUzo0pIulHoN2OPKw3DvLs0lO` |

---

## 3) المميزات

- **تتبع كامل للمشاهدات** بأربع حالات: يشاهد الآن `watching` / تم الانتهاء `completed` / في الخطة `plan_to_watch` / متوقف `dropped`.
- **عداد حلقات وذكاء تقدم**: زرار `+1 حلقة` سريع على كارت أي مسلسل، شريط تقدم، وانتقال تلقائي لـ"تم الانتهاء" مع كونفيتي لما توصل للحلقة الأخيرة.
- **تقييم شخصي** من 0 إلى 10 بخانة سحب، ولوحة ملاحظات حرة.
- **محرك بحث هجين**: API routes بتحرّك في توب سينما أولًا ولو مفيش نتيجة تنقل تلقائيًا لأهواك (scraping بـ cheerio على السيرفر).
- **إضافة يدوية** لأي عمل مش موجود (اسم، نوع، سنة، بوستر، نبذة).
- **ثنائي اللغة** عربي/إنجليزي مع قلب RTL/LTR فوري (محفوظ في `localStorage`).
- **مزامنة سحابية** عبر Supabase بدوال `anonymous auth`، مع تشغيل أوفلاين كامل بـ `localStorage` (source of truth محلي، والسحاب نسخة).
- **شريط حالة مزامنة حي** في الـ Navbar (متصل / محلي / غلط؟).
- **وضع عرض غير مزدحم**: hero لآخر عمل بتشاهده.

---

## 4) هيكل الشجرة

```
shahadt-tracker/
├── app/
│   ├── layout.tsx          # الجذر: خطوط IBM Plex Sans Arabic + Space Grotesk، RTL
│   ├── page.tsx            # الصفحة الرئيسية: هيرو + إحصائيات + تبويبات + شبكة كروت
│   ├── globals.css         # نظام التصميم (Design System) كامل بالـ tokens
│   ├── favicon.ico
│   └── api/
│       ├── media/search/   # GET  ?q=  — بحث هجين توب سينما/أهواك
│       └── media/details/  # GET  ?url= — تفاصيل عمل بالإسكرين
├── components/
│   ├── Navbar.tsx          # هيدر ثابت: لوجو، بحث، شارة مزامنة، زر إضافة
│   ├── StatsSummary.tsx    # 4 كروت أرقام (أفلام/مسلسلات/حلقات/متوسط)
│   ├── StatusFilterTabs.tsx# تبويبات الحالة + segmented للنوع
│   ├── MediaCard.tsx       # كارت العمل: بوستر + حالة + تقدم + إجراءات
│   ├── AddMediaModal.tsx   # مودال: بحث من API أو إدخال يدوي + إعداد الحفظ
│   └── MediaDetailModal.tsx# مودال: تعديل الحالة/الحلقات/التقييم/الملاحظات/حذف
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # إنشاء عميل Supabase من env + isSupabaseConfigured
│   │   └── schema.sql      # مخطط DB المرجعي (مزامن مع القاعدة الحية)
│   ├── store/
│   │   └── tracking-context.tsx  # العقل: React Context فيه كل الحالة + طبقة المزامنة
│   ├── i18n.ts             # كل النصوص عربي/إنجليزي (TranslationRecord typed)
│   └── scraper/
│       ├── topcinema.ts    # scraper توب سينما (مع مرايا)
│       ├── ahwak.ts        # scraper أهواك (بديل fallback)
│       └── index.ts        # محرك العرض/theo hybrid engine
├── types/media.ts          # MediaItem / UserTracking / WatchStatus / MediaType
├── wasf.md                 # ← ملف الوصف هذا
├── opencode.json           # إعداد MCPs (Supabase + Vercel) للمطور
├── .env.local              # مفتاح Supabase (publishable, public key — مش سر)
└── package.json
```

---

## 5) مخطط قاعدة البيانات (Supabase PostgreSQL)

### Table: `public.media_items` — كاتالوج الأعمال
المعبّأة تلقائيًا من الجلب، مشتركة بين كل الأجهزة.

| العمود | النوع | ملاحظات |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `title_ar` | text NOT NULL | الاسم العربي |
| `title_en` | text | الاسم الإنجليزي (اختياري) |
| `type` | text CHECK | `movie` أو `series` |
| `poster_url` | text | رابط صورة البوستر |
| `overview` | text | وصف العمل |
| `release_year` | integer | سنة الإصدار |
| `genres` | text[] | (مستقبلًا) |
| `source` | text CHECK | `topcinema` / `ahwak` / `manual` |
| `source_url` | text | رابط صفحة العمل، لها unique index جزئي لمنع التكرار |

### Table: `public.user_tracking` — سجل المتابعة الشخصي
| العمود | النوع | ملاحظات |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `user_id` | uuid | FK إلى `auth.users` — من anonymous auth |
| `media_id` | uuid NOT NULL | FK إلى `media_items` ON DELETE CASCADE |
| `status` | text CHECK | `watching`/`completed`/`plan_to_watch`/`dropped` |
| `current_season` | integer default 1 | المواسم |
| `current_episode` | integer default 0 | رقم الحلقة الحالية |
| `total_episodes` | integer | عدد الحلقات (اختياري) |
| `user_rating` | numeric(3,1) | 0–10 |
| `user_notes` | text | ملاحظات المستخدم |
| `started_at` / `completed_at` | timestamptz | تواريخ |
| `updated_at` | timestamptz | **يتحدث تلقائيًا** بـ trigger `moddatetime` |

### القيود والفهارس (Constraints & Indexes)
- `unique(user_id, media_id)` على `user_tracking` — كل عمل مرة واحدة لكل مستخدم.
- `unique index` جزئي على `media_items.source_url` — مفيش عمل اتنسخ مرتين.
- GIN index على `to_tsvector('arabic', title_ar)` لتسريع البحث العربي.
- فهارس عادية: `idx_user_tracking_user_status`, `idx_user_tracking_media_id`.

### الأمان (RLS)
- `media_items`: قراءة/إضافة مسموحة لـ `anon, authenticated` (كاتالوج عام). التحديث محجوب.
- `user_tracking`: **كل شي خاص بالمستخدم** — select/insert/update/delete بـ `auth.uid() = user_id`.

---

## 6) كيف شغل المزامنة (Data Flow)

```
المستخدم يضيف/يعدل عمل
        │
        ▼
React Context (tracking-context.tsx)
        │  تحديث فوري في الـ State + localStorage (SHA₁ للـ try/catch فقط لو الذاكرة مليت).
        ▼
sync(payload) background
  ├─ أول مرة: signInAnonymously() → auth.uid()
  ├─ media: select بـ source_url → لو مش موجود insert
  └─ tracking: insert/update بـ remoteId/remoteMediaId المربوطين بالعنصر
Failure path: أي خطأ → syncStatus = 'error' في الـ Navbar، والبيانات محفوظة محليًا زي الخظر.
Next session: ميزة (load) — pull من السحاب مع merge، والسحاب هو بلح السورس حقيقي لو فيه نسخة.
```

- **مفاتيح الربط** بين الكائن المحلي والسحابي مخزنة على `UserTracking.remoteId` و `remoteMediaId`.
- الـ `localStorage` دايمًا مصدره مرجعي (offline-first).

---

## 7) نظام التصميم (Design System)

المبدأ: لوحة تحكم هادئة. رمادي غامق محايد + لون أحمر واحد + خطوط مرتبة. مفيش جرّ (glass)، وبلاش توهج.

### الـ Tokens (في `globals.css`)
| Token | القيمة | الاستخدام |
|---|---|---|
| `--bg` | `#0f1115` | خلفية التطبيق |
| `--bg-elevated` | `#16181d` | كروت، هيدر |
| `--bg-raised` | `#1d2027` | هوفر، مودال |
| `--bg-input` | `#121419` | حقول الإدخال |
| `--stroke` | `#26292f` | كل الحدود |
| `--text-hi / mid / low` | `#f4f5f6 / #aab0ba / #6b7280` | هرم النصوص |
| `--accent` | `#e5484d` | أحمر واحد فقط — CTA، progress، active |
| `--ok / --warn` | `#46a758 / #f2b441` | حالة "تم الانتهاء" / "في الخطة" |
| `--r-sm / md / lg` | `8 / 12 / 16px` | نصف قطر الأطراف |

### الكلاسات الجاهزة (Primitives)
`.btn`, `.btn-primary`, `.btn-ghost`, `.btn-icon`, `.btn-sm/lg` · `.input`, `.input-search` · `.chip`, `.status-chip` (`status-watching/completed/plan/dropped`) · `.media-card`, `.progress-track/fill` · `.tab` + `.seg` · `.overlay`, `.modal`, `.modal-head/body/foot` · `.section`, `.section-label` · `.nums` (أرقام بـ Space Grotesk) · `focus-visible` موحد + `prefers-reduced-motion` مدعوم.

### الخطوط
- **IBM Plex Sans Arabic** (300–700) — نص التطبيق والعناوين.
- **Space Grotesk** (400/700) — الأرقام والـ tabular figures عنصر `.nums`.

### المنطق اللوني للحالات
أحمر = بشاهده دلوقتي · أخضر = خلصت · أصفر = في الخطة · رمادي = موقّف.

---

## 8) التقنيات المستخدمة (Tech Stack)

- **Next.js 16 App Router** + **React 19** — كل الـ UI في مكونات client؛ الـ scraping في API routes serverless (شغالة على Vercel functions).
- **Tailwind CSS v4** (`@import "tailwindcss"`) + CSS Variables لنظام التصميم في `globals.css`.
- **Supabase JS v2** — `signInAnonymously()` لتسجيل دخول مجهول لكل جهاز.
  ملاحظة: لو رجعت رسالة `Anonymous sign-ins are disabled` في الكونسول، فعّلها من:
  `https://supabase.com/dashboard/project/zgdthcpftcicbjihbtfj/auth/signinup` → اشتغل "Sign in with anonymous".
- **Cheerio** لتحليل صفحات توب سينما/أهواك على السيرفر (الـ scraping مش في المتصفح).
- **canvas-confetti** للاحتفال بإتمام عمل.
- **Deployment**: GitHub → Vercel (push تلقائي)، قاعدة البيانات Supabase Postgres.
- **Dev tooling**: OpenCode مع MCPs (Supabase + Vercel) متصلين في `opencode.json`.

---

## 9) البيئة والنشر

- **Env vars** (على Vercel، target=production/preview/development — الحقوق العامية للـ/anon key public):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Push → Deploy تلقائي**: أي `git push` لـ `main` يبنى ويوزع على `shahadt-tracker.vercel.app`.
- **Supabase MCP** (connected بعرف EbrahimAhmedDev) و **Vercel MCP** (نفس الاعتماد) موصلين في `opencode.json` للعمل من المتصفح/الطرفية.

---

## 10) أوامر التشغيل محلياً

```bash
npm install          # أول مرة فقط
npm run dev          # بيفتح على http://localhost:3000
npm run build        # build تحقق (passes)
npm run lint         # تنظيف الكود
```

`node 20+` مطلوب. مفيش إعداد محلي للـ DB — القاعدة على Supabase بقدرة الاتصال تلقائياً من env.

---

## 11) أفكار موثّقة للتطور (Roadmap)

- [ ] تتبع تفصيلي للمواسم (موسم-بحلقة بدل عدّاد واحد).
- [ ] حسابات فعلية (Email/Google OAuth) لكل الأجهزة والمزامنة بينها.
- [ ] بلوحة إحصائيات سنوية (أفكيش السنة، ساعات المشاهدة، أعلى التقييم).
- [ ] استيراد/تصدير CSV — التوافق مع Trakt / MyAnimeList.
- [ ] استخدام حقل `genres` الموجود في القاعدة + فلترة بأنواع في الواجهة.
- [ ] Reseñas/بيانات بديلة: إضافة بنفسك في نهايته.
- [ ] إشعارات عند صدور حلقة جديدة (Supabase Edge Functions + Cron).

---

## 12) ملاحظات سريعة للمطور

- حقول `remoteId` / `remoteMediaId` على كائن `UserTracking` هي حلقة الربط بين الحالة المحلية والـ DB — لا تُعرض للمستخدم ولا تعدّلها يدوياً.
- أي تعديل في الـ DB: حدّث `schema.sql` + نفّذ **Supabase MCP → apply_migration** (مش drop يدوي على القاعدة الحية).
- متعدّلش على `lib/i18n.ts` إلا بإضافة المفتاح في الـ union (من نوع `TranslationRecord`) — TypeScript بيلاحظ النواقص فوراً.
- المكونات كلها بتستخدم كلاسات نظام التصميم في `globals.css` (`.btn`, `.input`, `.card`, `.modal`) — لو ضفت عنصر جديد استخدمها عشان الموقع يفضل موحّد.
- الصور الخارجية (بوسترات توب سينما/أهواك) بتعرض بـ `<img>` عادي — من غير `next/image` لأن الدومينات بتتغير بين المصادر.
