**نشر المشروع على Vercel**

خطوات سريعة لتشغيل الموقع على Vercel:

- 1) تأكد أن التغييرات على `main` موجودة في GitHub (تمت بالفعل).
- 2) أضف متغير البيئة `DATABASE_URL` في إعدادات المشروع على Vercel (Production):

  - مثال PostgreSQL:
    `postgresql://user:password@host:5432/database`

  - مفضلات شائعة: Neon, Supabase, PlanetScale

- 3) تأكد أن Build Command في إعدادات المشروع هو `npm run vercel-build` أو اتركه فارغ لأن `vercel.json` يحدد ذلك.
- 4) اضغط "Redeploy" لفرع `main` في لوحة Vercel.

ملاحظات تقنية:

- سكربت البناء الآن يقوم بـ `prisma migrate deploy && prisma generate && next build` ليضمن تطبيق الـ migrations وتوليد Prisma Client خلال البناء.
- لا تستخدم SQLite في بيئة Vercel الإنتاجية لأن الملفات غير ثابتة — استخدم قاعدة بعيدة (Postgres/MySQL).

أقدر أُجري إعادة النشر نيابةً عنك إذا زوّدتني بتوكن Vercel (أو تفعلها بنفسك كما في الخطوات أعلاه).
