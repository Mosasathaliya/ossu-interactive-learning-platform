import { getCourseData, saveCourseData } from '../database/courses';
import { getFromCache, setCache } from '../services/cache';

const COMPLETE_OSSU_CURRICULUM = {
  prerequisites: {
    id: 'prerequisites',
    title: 'المتطلبات الأساسية',
    titleEn: 'Prerequisites',
    description: 'المهارات الأساسية المطلوبة قبل البدء في منهج علوم الحاسوب',
    courses: [
      {
        id: 'core-cs-tools',
        title: 'أدوات علوم الحاسوب الأساسية',
        titleEn: 'Core CS Tools',
        provider: 'MIT',
        duration: '1-2 weeks',
        effort: '3-5 hours/week',
        topics: ['Command Line', 'Git', 'Text Editors', 'Development Environment'],
        topicsAr: ['سطر الأوامر', 'نظام Git', 'محررات النصوص', 'بيئة التطوير'],
        url: 'https://missing.csail.mit.edu/',
        lessons: [
          {
            week: 1,
            title: 'مقدمة في سطر الأوامر',
            titleEn: 'Introduction to Command Line',
            content: `
# سطر الأوامر (Command Line)

## ما هو سطر الأوامر؟
سطر الأوامر هو واجهة نصية للتفاعل مع نظام التشغيل. يمكنك من خلاله تنفيذ المهام بكتابة الأوامر بدلاً من استخدام الواجهة الرسومية.

## الأوامر الأساسية

### التنقل في الملفات
\`\`\`bash
# عرض المجلد الحالي
pwd

# عرض محتويات المجلد
ls

# الانتقال إلى مجلد آخر
cd اسم_المجلد

# العودة للمجلد السابق
cd ..

# الانتقال للمجلد الرئيسي
cd ~
\`\`\`

### إدارة الملفات والمجلدات
\`\`\`bash
# إنشاء مجلد جديد
mkdir اسم_المجلد

# إنشاء ملف جديد
touch اسم_الملف.txt

# نسخ ملف
cp الملف_الأصلي.txt الملف_الجديد.txt

# نقل أو إعادة تسمية ملف
mv الملف_القديم.txt الملف_الجديد.txt

# حذف ملف
rm اسم_الملف.txt

# حذف مجلد فارغ
rmdir اسم_المجلد

# حذف مجلد وكل محتوياته
rm -rf اسم_المجلد
\`\`\`

## التمارين العملية

### تمرين 1: إنشاء هيكل مشروع
\`\`\`bash
# إنشاء مجلد المشروع
mkdir مشروع_البرمجة

# الانتقال إلى المجلد
cd مشروع_البرمجة

# إنشاء مجلدات فرعية
mkdir الكود
mkdir الوثائق
mkdir الاختبارات

# إنشاء ملفات أساسية
touch الكود/main.py
touch الوثائق/README.md
touch الاختبارات/test_main.py

# عرض هيكل المشروع
ls -la
\`\`\`
            `,
            exercises: [
              {
                title: 'إنشاء مشروع شخصي',
                description: 'أنشئ مجلد لمشروعك الشخصي مع الهيكل المناسب',
                solution: 'mkdir مشروعي && cd مشروعي && mkdir src docs tests && touch src/app.py docs/README.md'
              }
            ]
          }
        ]
      }
    ]
  },
  introCS: {
    id: 'intro-cs',
    title: 'مقدمة في علوم الحاسوب',
    titleEn: 'Intro CS',
    description: 'مقدمة شاملة في علوم الحاسوب والبرمجة',
    courses: [
      {
        id: 'intro-cs-python',
        title: 'مقدمة في علوم الحاسوب والبرمجة باستخدام Python',
        titleEn: 'Introduction to Computer Science and Programming Using Python',
        provider: 'MIT',
        duration: '14 weeks',
        effort: '6-10 hours/week',
        topics: ['Python Programming', 'Data Structures', 'Algorithms', 'Problem Solving'],
        topicsAr: ['برمجة Python', 'هياكل البيانات', 'الخوارزميات', 'حل المشاكل'],
        url: 'https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/',
        lessons: [
          {
            week: 1,
            title: 'مقدمة في البرمجة والمتغيرات',
            titleEn: 'Introduction to Programming and Variables',
            content: `
# الأسبوع الأول: مقدمة في البرمجة

## ما هي البرمجة؟
البرمجة هي عملية كتابة تعليمات للحاسوب لحل مشكلة معينة أو تنفيذ مهمة محددة.

## المتغيرات في Python
المتغيرات هي أساس البرمجة. في Python، يمكننا استخدام أسماء عربية للمتغيرات:

\`\`\`python
# المتغيرات الأساسية
الاسم = "أحمد محمد"
العمر = 25
الطول = 175.5
طالب = True

print(f"الاسم: {الاسم}")
print(f"العمر: {العمر}")
print(f"الطول: {الطول} سم")
print(f"طالب: {طالب}")
\`\`\`

## أنواع البيانات

### الأرقام الصحيحة (Integers)
\`\`\`python
عدد_الطلاب = 30
عدد_الكتب = 150
السنة = 2024

print(f"عدد الطلاب: {عدد_الطلاب}")
print(f"عدد الكتب: {عدد_الكتب}")
print(f"السنة: {السنة}")
\`\`\`

### الأرقام العشرية (Floats)
\`\`\`python
درجة_الحرارة = 25.5
سعر_الكتاب = 45.75
المعدل = 3.85

print(f"درجة الحرارة: {درجة_الحرارة}°C")
print(f"سعر الكتاب: {سعر_الكتاب} ريال")
print(f"المعدل: {المعدل}")
\`\`\`

### النصوص (Strings)
\`\`\`python
اسم_الجامعة = "جامعة الملك سعود"
اسم_الكلية = "كلية علوم الحاسب"
التخصص = "هندسة البرمجيات"

print(f"الجامعة: {اسم_الجامعة}")
print(f"الكلية: {اسم_الكلية}")
print(f"التخصص: {التخصص}")
\`\`\`

### القيم المنطقية (Booleans)
\`\`\`python
مسجل_في_الكورس = True
اجتاز_الامتحان = False
يحتاج_مساعدة = True

if مسجل_في_الكورس:
    print("الطالب مسجل في الكورس")

if not اجتاز_الامتحان:
    print("الطالب لم يجتز الامتحان")

if يحتاج_مساعدة:
    print("الطالب يحتاج مساعدة")
\`\`\`

## العمليات الحسابية

\`\`\`python
# العمليات الأساسية
الرقم_الأول = 10
الرقم_الثاني = 3

الجمع = الرقم_الأول + الرقم_الثاني
الطرح = الرقم_الأول - الرقم_الثاني
الضرب = الرقم_الأول * الرقم_الثاني
القسمة = الرقم_الأول / الرقم_الثاني
القسمة_الصحيحة = الرقم_الأول // الرقم_الثاني
الباقي = الرقم_الأول % الرقم_الثاني
الأس = الرقم_الأول ** الرقم_الثاني

print(f"{الرقم_الأول} + {الرقم_الثاني} = {الجمع}")
print(f"{الرقم_الأول} - {الرقم_الثاني} = {الطرح}")
print(f"{الرقم_الأول} × {الرقم_الثاني} = {الضرب}")
print(f"{الرقم_الأول} ÷ {الرقم_الثاني} = {القسمة}")
print(f"{الرقم_الأول} ÷ {الرقم_الثاني} (صحيح) = {القسمة_الصحيحة}")
print(f"{الرقم_الأول} % {الرقم_الثاني} = {الباقي}")
print(f"{الرقم_الأول} ^ {الرقم_الثاني} = {الأس}")
\`\`\`

## التمارين العملية

### تمرين 1: حساب المعدل
\`\`\`python
# حساب معدل الطالب
الدرجة_الأولى = 85
الدرجة_الثانية = 92
الدرجة_الثالثة = 78
الدرجة_الرابعة = 88

المجموع = الدرجة_الأولى + الدرجة_الثانية + الدرجة_الثالثة + الدرجة_الرابعة
المعدل = المجموع / 4

print(f"الدرجات: {الدرجة_الأولى}, {الدرجة_الثانية}, {الدرجة_الثالثة}, {الدرجة_الرابعة}")
print(f"المجموع: {المجموع}")
print(f"المعدل: {المعدل:.2f}")
\`\`\`

### تمرين 2: حساب مساحة المستطيل
\`\`\`python
# حساب مساحة ومحيط المستطيل
الطول = 15
العرض = 8

المساحة = الطول * العرض
المحيط = 2 * (الطول + العرض)

print(f"طول المستطيل: {الطول} متر")
print(f"عرض المستطيل: {العرض} متر")
print(f"المساحة: {المساحة} متر مربع")
print(f"المحيط: {المحيط} متر")
\`\`\`
            `,
            exercises: [
              {
                title: 'تمرين: إنشاء متغيرات شخصية',
                description: 'أنشئ متغيرات لتخزين معلوماتك الشخصية واطبعها',
                solution: `
الاسم_الكامل = "اكتب اسمك هنا"
العمر = 20
المدينة = "الرياض"
الهواية = "البرمجة"
الطول = 170.5
متزوج = False

print(f"اسمي {الاسم_الكامل}")
print(f"عمري {العمر} سنة")
print(f"أسكن في {المدينة}")
print(f"هوايتي {الهواية}")
print(f"طولي {الطول} سم")
print(f"متزوج: {متزوج}")
                `
              },
              {
                title: 'تمرين: حاسبة بسيطة',
                description: 'اكتب برنامج لحساب تكلفة الشراء مع الضريبة',
                solution: `
سعر_المنتج = 100
نسبة_الضريبة = 0.15
الكمية = 3

التكلفة_الأساسية = سعر_المنتج * الكمية
قيمة_الضريبة = التكلفة_الأساسية * نسبة_الضريبة
التكلفة_الإجمالية = التكلفة_الأساسية + قيمة_الضريبة

print(f"سعر المنتج الواحد: {سعر_المنتج} ريال")
print(f"الكمية: {الكمية}")
print(f"التكلفة الأساسية: {التكلفة_الأساسية} ريال")
print(f"قيمة الضريبة ({نسبة_الضريبة*100}%): {قيمة_الضريبة} ريال")
print(f"التكلفة الإجمالية: {التكلفة_الإجمالية} ريال")
                `
              }
            ]
          },
          {
            week: 2,
            title: 'التحكم في التدفق والشروط',
            titleEn: 'Control Flow and Conditionals',
            content: `
# الأسبوع الثاني: التحكم في التدفق

## جمل الشرط (if statements)

### الشرط البسيط
\`\`\`python
العمر = 18

if العمر >= 18:
    print("يمكنك التصويت")
    print("أنت بالغ")
else:
    print("لا يمكنك التصويت بعد")
    print("أنت قاصر")
\`\`\`

### الشروط المتعددة
\`\`\`python
الدرجة = 85

if الدرجة >= 90:
    التقدير = "ممتاز"
    الرمز = "A"
elif الدرجة >= 80:
    التقدير = "جيد جداً"
    الرمز = "B"
elif الدرجة >= 70:
    التقدير = "جيد"
    الرمز = "C"
elif الدرجة >= 60:
    التقدير = "مقبول"
    الرمز = "D"
else:
    التقدير = "راسب"
    الرمز = "F"

print(f"الدرجة: {الدرجة}")
print(f"التقدير: {التقدير}")
print(f"الرمز: {الرمز}")
\`\`\`

### الشروط المركبة
\`\`\`python
العمر = 20
المعدل = 3.5
مسجل = True

if العمر >= 18 and المعدل >= 3.0 and مسجل:
    print("مؤهل للمنحة الدراسية")
elif العمر >= 18 and المعدل >= 2.5:
    print("مؤهل للمنحة الجزئية")
else:
    print("غير مؤهل للمنحة")

# استخدام or
الدرجة_الرياضيات = 85
الدرجة_الفيزياء = 78

if الدرجة_الرياضيات >= 80 or الدرجة_الفيزياء >= 80:
    print("مؤهل لدراسة الهندسة")
else:
    print("يحتاج تحسين الدرجات")
\`\`\`

## الحلقات (Loops)

### حلقة for مع range
\`\`\`python
# طباعة الأرقام من 1 إلى 10
print("الأرقام من 1 إلى 10:")
for الرقم in range(1, 11):
    print(f"الرقم: {الرقم}")

# طباعة الأرقام الزوجية
print("\\nالأرقام الزوجية من 2 إلى 20:")
for الرقم in range(2, 21, 2):
    print(f"الرقم الزوجي: {الرقم}")

# العد التنازلي
print("\\nالعد التنازلي من 10 إلى 1:")
for الرقم in range(10, 0, -1):
    print(f"العداد: {الرقم}")
\`\`\`

### حلقة for مع القوائم
\`\`\`python
# التكرار على قائمة الأسماء
الأسماء = ["أحمد", "فاطمة", "محمد", "عائشة", "علي"]

print("قائمة الطلاب:")
for الاسم in الأسماء:
    print(f"مرحباً {الاسم}")

# التكرار مع الفهرس
print("\\nقائمة الطلاب مع الأرقام:")
for الفهرس, الاسم in enumerate(الأسماء, 1):
    print(f"{الفهرس}. {الاسم}")
\`\`\`

### حلقة while
\`\`\`python
# العد التنازلي باستخدام while
العداد = 10
print("العد التنازلي:")
while العداد > 0:
    print(f"العداد: {العداد}")
    العداد -= 1
print("انتهى العد!")

# لعبة تخمين الرقم
import random

الرقم_السري = random.randint(1, 100)
المحاولات = 0
الحد_الأقصى = 7

print("لعبة تخمين الرقم!")
print(f"خمن رقماً بين 1 و 100 (لديك {الحد_الأقصى} محاولات)")

while المحاولات < الحد_الأقصى:
    التخمين = int(input("أدخل تخمينك: "))
    المحاولات += 1
    
    if التخمين == الرقم_السري:
        print(f"مبروك! لقد خمنت الرقم {الرقم_السري} في {المحاولات} محاولات")
        break
    elif التخمين < الرقم_السري:
        print("الرقم أكبر من تخمينك")
    else:
        print("الرقم أصغر من تخمينك")
    
    المحاولات_المتبقية = الحد_الأقصى - المحاولات
    if المحاولات_المتبقية > 0:
        print(f"المحاولات المتبقية: {المحاولات_المتبقية}")
else:
    print(f"انتهت المحاولات! الرقم السري كان {الرقم_السري}")
\`\`\`

## التمارين العملية

### تمرين 1: حاسبة الدرجات المتقدمة
\`\`\`python
print("حاسبة الدرجات المتقدمة")
print("-" * 30)

الدرجة = float(input("أدخل درجتك (0-100): "))

# التحقق من صحة الدرجة
if الدرجة < 0 or الدرجة > 100:
    print("خطأ: الدرجة يجب أن تكون بين 0 و 100")
else:
    # تحديد التقدير
    if الدرجة >= 95:
        التقدير = "A+"
        الوصف = "ممتاز مع مرتبة الشرف"
        النقاط = 4.0
    elif الدرجة >= 90:
        التقدير = "A"
        الوصف = "ممتاز"
        النقاط = 4.0
    elif الدرجة >= 85:
        التقدير = "B+"
        الوصف = "جيد جداً مرتفع"
        النقاط = 3.5
    elif الدرجة >= 80:
        التقدير = "B"
        الوصف = "جيد جداً"
        النقاط = 3.0
    elif الدرجة >= 75:
        التقدير = "C+"
        الوصف = "جيد مرتفع"
        النقاط = 2.5
    elif الدرجة >= 70:
        التقدير = "C"
        الوصف = "جيد"
        النقاط = 2.0
    elif الدرجة >= 65:
        التقدير = "D+"
        الوصف = "مقبول مرتفع"
        النقاط = 1.5
    elif الدرجة >= 60:
        التقدير = "D"
        الوصف = "مقبول"
        النقاط = 1.0
    else:
        التقدير = "F"
        الوصف = "راسب"
        النقاط = 0.0
    
    # طباعة النتائج
    print(f"\\nنتائج التقييم:")
    print(f"الدرجة: {الدرجة}")
    print(f"التقدير: {التقدير}")
    print(f"الوصف: {الوصف}")
    print(f"النقاط: {النقاط}")
    
    # تقديم نصائح
    if الدرجة >= 90:
        print("\\n🎉 أداء رائع! استمر على هذا المستوى")
    elif الدرجة >= 80:
        print("\\n👍 أداء جيد جداً! يمكنك الوصول للامتياز")
    elif الدرجة >= 70:
        print("\\n📚 أداء جيد، لكن يمكن التحسن أكثر")
    elif الدرجة >= 60:
        print("\\n⚠️ تحتاج لمزيد من الجهد والمراجعة")
    else:
        print("\\n❌ يجب إعادة دراسة المادة والاستعداد للإعادة")
\`\`\`
            `,
            exercises: [
              {
                title: 'تمرين: فحص الأهلية للقيادة',
                description: 'اكتب برنامج لفحص أهلية الشخص للحصول على رخصة قيادة',
                solution: `
العمر = int(input("أدخل عمرك: "))
لديه_رخصة_تعلم = input("هل لديك رخصة تعلم؟ (نعم/لا): ").lower() == "نعم"
عدد_ساعات_التدريب = int(input("كم ساعة تدريب أكملت؟ "))

if العمر >= 18:
    if لديه_رخصة_تعلم and عدد_ساعات_التدريب >= 30:
        print("✅ مؤهل للحصول على رخصة القيادة")
    elif لديه_رخصة_تعلم:
        الساعات_المطلوبة = 30 - عدد_ساعات_التدريب
        print(f"⏳ تحتاج {الساعات_المطلوبة} ساعة تدريب إضافية")
    else:
        print("❌ يجب الحصول على رخصة تعلم أولاً")
else:
    print("❌ يجب أن تكون 18 سنة أو أكثر")
                `
              }
            ]
          }
        ]
      }
    ]
  },
  coreCS: {
    id: 'core-cs',
    title: 'علوم الحاسوب الأساسية',
    titleEn: 'Core CS',
    description: 'المواد الأساسية في علوم الحاسوب',
    sections: {
      programming: {
        id: 'core-programming',
        title: 'البرمجة الأساسية',
        titleEn: 'Core Programming',
        courses: [
          {
            id: 'systematic-program-design',
            title: 'تصميم البرامج المنهجي',
            titleEn: 'Systematic Program Design',
            provider: 'UBC',
            duration: '13 weeks',
            effort: '8-12 hours/week',
            topics: ['Program Design', 'Data Structures', 'Recursion', 'Testing'],
            topicsAr: ['تصميم البرامج', 'هياكل البيانات', 'الاستدعاء المتكرر', 'الاختبار'],
            url: 'https://www.edx.org/course/how-to-code-simple-data'
          }
        ]
      },
      math: {
        id: 'core-math',
        title: 'الرياضيات الأساسية',
        titleEn: 'Core Math',
        courses: [
          {
            id: 'calculus-1a',
            title: 'حساب التفاضل والتكامل 1أ',
            titleEn: 'Calculus 1A',
            provider: 'MIT',
            duration: '13 weeks',
            effort: '6-10 hours/week',
            topics: ['Limits', 'Derivatives', 'Applications'],
            topicsAr: ['النهايات', 'المشتقات', 'التطبيقات'],
            url: 'https://www.edx.org/course/calculus-1a-differentiation'
          }
        ]
      }
    }
  }
};

export async function handleCourses(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/courses', '');
  const method = request.method;

  try {
    switch (method) {
      case 'GET':
        if (path === '' || path === '/') {
          // Get all courses
          const cachedCourses = await getFromCache(env.COURSE_CACHE, 'all-courses');
          if (cachedCourses) {
            return new Response(cachedCourses, {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const coursesData = JSON.stringify(COMPLETE_OSSU_CURRICULUM);
          await setCache(env.COURSE_CACHE, 'all-courses', coursesData, 3600); // Cache for 1 hour
          
          return new Response(coursesData, {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (path.startsWith('/')) {
          const courseId = path.substring(1);
          const course = await getCourseById(courseId);
          
          if (!course) {
            return new Response(JSON.stringify({
              error: 'Course not found',
              courseId: courseId
            }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify(course), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'POST':
        // Save course progress or data
        const data = await request.json();
        await saveCourseData(env.OSSU_DB, data);
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Course data saved successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Courses API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function getCourseById(courseId) {
  // Search through the curriculum structure
  const sections = [
    COMPLETE_OSSU_CURRICULUM.prerequisites,
    COMPLETE_OSSU_CURRICULUM.introCS,
    COMPLETE_OSSU_CURRICULUM.coreCS
  ];

  for (const section of sections) {
    if (section.courses) {
      const course = section.courses.find(c => c.id === courseId);
      if (course) return course;
    }
    
    if (section.sections) {
      for (const subsection of Object.values(section.sections)) {
        const course = subsection.courses.find(c => c.id === courseId);
        if (course) return course;
      }
    }
  }

  return null;
}
