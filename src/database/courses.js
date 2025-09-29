// Course data management
export async function getCourseData(env) {
  try {
    // Try to get from KV cache first
    const cachedData = await env.COURSE_DATA?.get('all-courses');
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fallback to default course data
    const defaultCourses = getDefaultCourseData();
    
    // Cache the data
    if (env.COURSE_DATA) {
      await env.COURSE_DATA.put('all-courses', JSON.stringify(defaultCourses), {
        expirationTtl: 86400 // 24 hours
      });
    }

    return defaultCourses;
  } catch (error) {
    console.error('Error getting course data:', error);
    return getDefaultCourseData();
  }
}

export async function saveCourseData(env, courseData) {
  try {
    if (env.COURSE_DATA) {
      await env.COURSE_DATA.put('all-courses', JSON.stringify(courseData));
    }
    return true;
  } catch (error) {
    console.error('Error saving course data:', error);
    return false;
  }
}

function getDefaultCourseData() {
  return {
    prerequisites: [
      {
        id: 'intro-cs-tools',
        title: 'أدوات علوم الحاسوب',
        titleEn: 'Intro CS Tools',
        description: 'تعلم الأدوات الأساسية المطلوبة لدراسة علوم الحاسوب',
        duration: '2 weeks',
        effort: '6 hours/week',
        topics: ['Git', 'Command Line', 'Text Editors', 'Development Environment'],
        progress: 0,
        lessons: [
          {
            id: 'git-basics',
            title: 'أساسيات Git',
            content: 'تعلم استخدام Git لإدارة الكود',
            completed: false
          },
          {
            id: 'command-line',
            title: 'سطر الأوامر',
            content: 'إتقان استخدام Terminal/Command Prompt',
            completed: false
          }
        ]
      }
    ],
    introCS: [
      {
        id: 'intro-programming-python',
        title: 'مقدمة في البرمجة باستخدام Python',
        titleEn: 'Introduction to Programming using Python',
        description: 'تعلم أساسيات البرمجة باستخدام Python مع أسماء متغيرات عربية',
        duration: '14 weeks',
        effort: '15 hours/week',
        topics: ['المتغيرات', 'الدوال', 'الكلاسات', 'هياكل البيانات', 'الخوارزميات'],
        progress: 0,
        lessons: [
          {
            id: 'python-variables',
            title: 'المتغيرات في Python',
            content: 'تعلم كيفية إنشاء واستخدام المتغيرات بأسماء عربية',
            completed: false,
            code: `# المتغيرات الأساسية
الاسم = "أحمد محمد"
العمر = 25
الطول = 175.5
طالب = True

print(f"الاسم: {الاسم}")
print(f"العمر: {العمر}")
print(f"الطول: {الطول} سم")
print(f"طالب: {'نعم' if طالب else 'لا'}")`
          },
          {
            id: 'python-functions',
            title: 'الدوال في Python',
            content: 'تعلم كيفية إنشاء واستخدام الدوال بأسماء عربية',
            completed: false,
            code: `def احسب_المساحة(الطول, العرض):
    """دالة لحساب مساحة المستطيل"""
    المساحة = الطول * العرض
    return المساحة

def فحص_العمر(العمر):
    """دالة لتحديد فئة العمر"""
    if العمر < 13:
        return "طفل"
    elif العمر < 20:
        return "مراهق"
    elif العمر < 60:
        return "بالغ"
    else:
        return "كبير السن"

# استخدام الدوال
الطول = 10
العرض = 5
المساحة = احسب_المساحة(الطول, العرض)
print(f"مساحة المستطيل: {المساحة}")

العمر = 25
الفئة = فحص_العمر(العمر)
print(f"فئة العمر: {الفئة}")`
          }
        ]
      }
    ],
    coreCS: [
      {
        id: 'programming',
        title: 'البرمجة',
        titleEn: 'Programming',
        description: 'تعلم مفاهيم البرمجة المتقدمة وهياكل البيانات',
        courses: [
          {
            id: 'systematic-program-design',
            title: 'تصميم البرامج المنهجي',
            duration: '13 weeks',
            effort: '8-10 hours/week',
            progress: 0
          },
          {
            id: 'programming-languages',
            title: 'لغات البرمجة',
            duration: '10 weeks', 
            effort: '8-12 hours/week',
            progress: 0
          }
        ]
      },
      {
        id: 'math',
        title: 'الرياضيات',
        titleEn: 'Core Math',
        description: 'الرياضيات الأساسية لعلوم الحاسوب',
        courses: [
          {
            id: 'calculus',
            title: 'حساب التفاضل والتكامل',
            duration: '15 weeks',
            effort: '8-10 hours/week',
            progress: 0
          },
          {
            id: 'discrete-math',
            title: 'الرياضيات المتقطعة',
            duration: '13 weeks',
            effort: '5 hours/week',
            progress: 0
          }
        ]
      },
      {
        id: 'systems',
        title: 'الأنظمة',
        titleEn: 'Core Systems',
        description: 'أساسيات أنظمة الحاسوب',
        courses: [
          {
            id: 'computer-architecture',
            title: 'معمارية الحاسوب',
            duration: '7 weeks',
            effort: '10-12 hours/week',
            progress: 0
          },
          {
            id: 'operating-systems',
            title: 'أنظمة التشغيل',
            duration: '10-12 weeks',
            effort: '8-12 hours/week',
            progress: 0
          }
        ]
      },
      {
        id: 'theory',
        title: 'النظرية',
        titleEn: 'Core Theory',
        description: 'النظريات الأساسية في علوم الحاسوب',
        courses: [
          {
            id: 'algorithms',
            title: 'الخوارزميات وهياكل البيانات',
            duration: '13 weeks',
            effort: '8-10 hours/week',
            progress: 0
          }
        ]
      },
      {
        id: 'applications',
        title: 'التطبيقات',
        titleEn: 'Core Applications',
        description: 'التطبيقات العملية لعلوم الحاسوب',
        courses: [
          {
            id: 'databases',
            title: 'قواعد البيانات',
            duration: '12 weeks',
            effort: '8-12 hours/week',
            progress: 0
          },
          {
            id: 'computer-networking',
            title: 'شبكات الحاسوب',
            duration: '8 weeks',
            effort: '4-12 hours/week',
            progress: 0
          }
        ]
      }
    ],
    advancedCS: [
      {
        id: 'advanced-programming',
        title: 'البرمجة المتقدمة',
        titleEn: 'Advanced Programming',
        description: 'مواضيع متقدمة في البرمجة',
        courses: [
          {
            id: 'compilers',
            title: 'المترجمات',
            duration: '9 weeks',
            effort: '6-8 hours/week',
            progress: 0
          },
          {
            id: 'software-debugging',
            title: 'تصحيح البرمجيات',
            duration: '8 weeks',
            effort: '6 hours/week',
            progress: 0
          }
        ]
      },
      {
        id: 'advanced-systems',
        title: 'الأنظمة المتقدمة',
        titleEn: 'Advanced Systems',
        description: 'مواضيع متقدمة في أنظمة الحاسوب',
        courses: [
          {
            id: 'parallel-computing',
            title: 'الحوسبة المتوازية',
            duration: '4 weeks',
            effort: '6-8 hours/week',
            progress: 0
          },
          {
            id: 'distributed-systems',
            title: 'الأنظمة الموزعة',
            duration: '6 weeks',
            effort: '5 hours/week',
            progress: 0
          }
        ]
      },
      {
        id: 'advanced-theory',
        title: 'النظرية المتقدمة',
        titleEn: 'Advanced Theory',
        description: 'مواضيع متقدمة في نظرية الحاسوب',
        courses: [
          {
            id: 'computational-geometry',
            title: 'الهندسة الحاسوبية',
            duration: '6 weeks',
            effort: '4 hours/week',
            progress: 0
          }
        ]
      },
      {
        id: 'advanced-applications',
        title: 'التطبيقات المتقدمة',
        titleEn: 'Advanced Applications',
        description: 'تطبيقات متقدمة في علوم الحاسوب',
        courses: [
          {
            id: 'artificial-intelligence',
            title: 'الذكاء الاصطناعي',
            duration: '12 weeks',
            effort: '15 hours/week',
            progress: 0
          },
          {
            id: 'machine-learning',
            title: 'تعلم الآلة',
            duration: '11 weeks',
            effort: '4-6 hours/week',
            progress: 0
          },
          {
            id: 'computer-graphics',
            title: 'رسوميات الحاسوب',
            duration: '6 weeks',
            effort: '12 hours/week',
            progress: 0
          }
        ]
      }
    ],
    finalProject: {
      id: 'final-project',
      title: 'المشروع النهائي',
      titleEn: 'Final Project',
      description: 'مشروع تطبيقي شامل يجمع كل ما تعلمته',
      duration: '1-2 semesters',
      effort: 'varies',
      progress: 0,
      requirements: [
        'إكمال جميع المتطلبات الأساسية',
        'اختيار موضوع المشروع',
        'تصميم وتطوير المشروع',
        'كتابة التوثيق',
        'عرض المشروع'
      ]
    }
  };
}
