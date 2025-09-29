// Static file serving
export async function handleStatic(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle favicon
  if (pathname === '/favicon.ico') {
    return new Response(getFavicon(), {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

  // Handle main app
  if (pathname === '/' || pathname.startsWith('/app')) {
    return new Response(getMainApp(), {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  // Handle CSS
  if (pathname === '/styles.css') {
    return new Response(getStyles(), {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

  // Handle JavaScript
  if (pathname === '/app.js') {
    return new Response(getAppJS(), {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

  // 404 for other static files
  return new Response('Not Found', { status: 404 });
}

function getFavicon() {
  // Simple base64 encoded favicon
  return "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A";
}

function getMainApp() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة OSSU التفاعلية لتعلم علوم الحاسوب</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="app">
        <div class="loading">
            <div class="spinner"></div>
            <p>جاري تحميل المنصة...</p>
        </div>
    </div>
    <script src="/app.js"></script>
</body>
</html>`;
}

function getStyles() {
  return `
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Noto Sans Arabic', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
    direction: rtl;
    text-align: right;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header */
.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
}

.header p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
}

/* Navigation */
.nav-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.nav-tab {
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    font-family: inherit;
}

.nav-tab:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-tab.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

/* Cards */
.card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

/* Buttons */
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border: 1px solid #ddd;
}

.btn-secondary:hover {
    background: white;
    transform: translateY(-2px);
}

/* Loading */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: white;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Course Grid */
.course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.course-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.course-card:hover {
    transform: translateY(-3px);
}

.course-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

.course-description {
    color: #666;
    margin-bottom: 15px;
    line-height: 1.6;
}

.course-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 0.9rem;
    color: #888;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 15px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
}

/* Chat Interface */
.chat-container {
    height: 500px;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    overflow: hidden;
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f8f9fa;
}

.message {
    margin-bottom: 15px;
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 80%;
    word-wrap: break-word;
}

.message.user {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    margin-left: auto;
    margin-right: 0;
}

.message.ai {
    background: white;
    color: #333;
    border: 1px solid #e0e0e0;
    margin-right: auto;
    margin-left: 0;
}

.chat-input {
    display: flex;
    padding: 20px;
    background: white;
    border-top: 1px solid #e0e0e0;
}

.chat-input input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 25px;
    font-family: inherit;
    margin-left: 10px;
}

.chat-input button {
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
}

/* Code Editor */
.code-editor {
    background: #2d3748;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: auto;
    margin: 15px 0;
}

.code-output {
    background: #1a202c;
    color: #68d391;
    padding: 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    margin-top: 10px;
    white-space: pre-wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .header h1 {
        font-size: 2rem;
    }
    
    .nav-tabs {
        justify-content: center;
    }
    
    .nav-tab {
        padding: 10px 16px;
        font-size: 0.9rem;
    }
    
    .course-grid {
        grid-template-columns: 1fr;
    }
    
    .message {
        max-width: 90%;
    }
    
    .chat-input {
        padding: 15px;
    }
}

/* Arabic RTL Specific */
[dir="rtl"] .message.user {
    margin-right: auto;
    margin-left: 0;
}

[dir="rtl"] .message.ai {
    margin-left: auto;
    margin-right: 0;
}

[dir="rtl"] .chat-input input {
    margin-right: 10px;
    margin-left: 0;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.mb-20 { margin-bottom: 20px; }
.mt-20 { margin-top: 20px; }
.hidden { display: none; }
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.gap-10 { gap: 10px; }
.gap-20 { gap: 20px; }
`;
}

function getAppJS() {
  return `
// OSSU Interactive Learning Platform
class OSSUApp {
    constructor() {
        this.currentView = 'dashboard';
        this.courses = [];
        this.userProgress = {};
        this.init();
    }

    async init() {
        await this.loadCourses();
        this.render();
        this.attachEventListeners();
    }

    async loadCourses() {
        try {
            const response = await fetch('/api/courses');
            const data = await response.json();
            this.courses = data.courses || [];
        } catch (error) {
            console.error('Error loading courses:', error);
            this.courses = this.getDefaultCourses();
        }
    }

    getDefaultCourses() {
        return [
            {
                id: 'intro-programming-python',
                title: 'مقدمة في البرمجة باستخدام Python',
                titleEn: 'Introduction to Programming using Python',
                description: 'تعلم أساسيات البرمجة باستخدام Python مع أسماء متغيرات عربية',
                duration: '14 weeks',
                effort: '15 hours/week',
                progress: 0,
                category: 'introCS'
            },
            {
                id: 'algorithms-data-structures',
                title: 'الخوارزميات وهياكل البيانات',
                titleEn: 'Algorithms and Data Structures',
                description: 'تعلم الخوارزميات الأساسية وهياكل البيانات',
                duration: '13 weeks',
                effort: '8-10 hours/week',
                progress: 0,
                category: 'coreCS'
            },
            {
                id: 'computer-architecture',
                title: 'معمارية الحاسوب',
                titleEn: 'Computer Architecture',
                description: 'فهم كيفية عمل الحاسوب من الداخل',
                duration: '7 weeks',
                effort: '10-12 hours/week',
                progress: 0,
                category: 'coreCS'
            }
        ];
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = \`
            <div class="container">
                <div class="header">
                    <h1>🚀 منصة OSSU التفاعلية</h1>
                    <p>تعلم علوم الحاسوب بالعربية مع الذكاء الاصطناعي</p>
                    <div class="nav-tabs">
                        <button class="nav-tab \${this.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
                            📊 لوحة التحكم
                        </button>
                        <button class="nav-tab \${this.currentView === 'ai-assistant' ? 'active' : ''}" data-view="ai-assistant">
                            🤖 المساعد الذكي
                        </button>
                        <button class="nav-tab \${this.currentView === 'code-playground' ? 'active' : ''}" data-view="code-playground">
                            💻 ملعب الكود
                        </button>
                        <button class="nav-tab \${this.currentView === 'courses' ? 'active' : ''}" data-view="courses">
                            📚 الدورات
                        </button>
                    </div>
                </div>
                
                <div class="content">
                    \${this.renderCurrentView()}
                </div>
            </div>
        \`;
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                return this.renderDashboard();
            case 'ai-assistant':
                return this.renderAIAssistant();
            case 'code-playground':
                return this.renderCodePlayground();
            case 'courses':
                return this.renderCourses();
            default:
                return this.renderDashboard();
        }
    }

    renderDashboard() {
        const totalCourses = this.courses.length;
        const completedCourses = this.courses.filter(c => c.progress >= 100).length;
        const overallProgress = totalCourses > 0 ? Math.round(this.courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses) : 0;

        return \`
            <div class="card fade-in">
                <h2>📈 إحصائيات التقدم</h2>
                <div class="course-grid">
                    <div class="course-card">
                        <h3>إجمالي الدورات</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: #667eea;">\${totalCourses}</div>
                    </div>
                    <div class="course-card">
                        <h3>الدورات المكتملة</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: #48bb78;">\${completedCourses}</div>
                    </div>
                    <div class="course-card">
                        <h3>التقدم الإجمالي</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: #ed8936;">\${overallProgress}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${overallProgress}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card fade-in">
                <h2>🎯 الدورات الموصى بها</h2>
                <div class="course-grid">
                    \${this.courses.slice(0, 3).map(course => \`
                        <div class="course-card">
                            <h3 class="course-title">\${course.title}</h3>
                            <p class="course-description">\${course.description}</p>
                            <div class="course-meta">
                                <span>⏱️ \${course.duration}</span>
                                <span>📚 \${course.effort}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: \${course.progress}%"></div>
                            </div>
                            <button class="btn btn-primary" onclick="app.startCourse('\${course.id}')">
                                \${course.progress > 0 ? 'متابعة الدورة' : 'بدء الدورة'}
                            </button>
                        </div>
                    \`).join('')}
                </div>
            </div>
        \`;
    }

    renderAIAssistant() {
        return \`
            <div class="card fade-in">
                <h2>🤖 المساعد الذكي للبرمجة</h2>
                <p>اسأل أي سؤال حول البرمجة بالعربية وسأساعدك!</p>
                
                <div class="chat-container">
                    <div class="chat-messages" id="chat-messages">
                        <div class="message ai">
                            مرحباً! أنا مساعدك الذكي لتعلم البرمجة بالعربية. كيف يمكنني مساعدتك اليوم؟
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chat-input" placeholder="اكتب سؤالك هنا..." />
                        <button onclick="app.sendMessage()">إرسال</button>
                    </div>
                </div>
            </div>
        \`;
    }

    renderCodePlayground() {
        return \`
            <div class="card fade-in">
                <h2>💻 ملعب الكود التفاعلي</h2>
                <p>جرب كتابة الكود بالعربية هنا!</p>
                
                <div class="mb-20">
                    <button class="btn btn-secondary" onclick="app.loadCodeTemplate('variables')">المتغيرات</button>
                    <button class="btn btn-secondary" onclick="app.loadCodeTemplate('functions')">الدوال</button>
                    <button class="btn btn-secondary" onclick="app.loadCodeTemplate('classes')">الكلاسات</button>
                </div>
                
                <textarea id="code-editor" class="code-editor" rows="15" placeholder="# اكتب الكود هنا
الاسم = 'أحمد محمد'
العمر = 25
print(f'الاسم: {الاسم}')
print(f'العمر: {العمر}')"># اكتب الكود هنا
الاسم = "أحمد محمد"
العمر = 25
print(f"الاسم: {الاسم}")
print(f"العمر: {العمر}")</textarea>
                
                <div class="mt-20">
                    <button class="btn btn-primary" onclick="app.runCode()">▶️ تشغيل الكود</button>
                    <button class="btn btn-secondary" onclick="app.clearCode()">🗑️ مسح</button>
                </div>
                
                <div id="code-output" class="code-output hidden"></div>
            </div>
        \`;
    }

    renderCourses() {
        return \`
            <div class="card fade-in">
                <h2>📚 جميع الدورات</h2>
                <div class="course-grid">
                    \${this.courses.map(course => \`
                        <div class="course-card">
                            <h3 class="course-title">\${course.title}</h3>
                            <p class="course-description">\${course.description}</p>
                            <div class="course-meta">
                                <span>⏱️ \${course.duration}</span>
                                <span>📚 \${course.effort}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: \${course.progress}%"></div>
                            </div>
                            <button class="btn btn-primary" onclick="app.startCourse('\${course.id}')">
                                \${course.progress > 0 ? 'متابعة الدورة' : 'بدء الدورة'}
                            </button>
                        </div>
                    \`).join('')}
                </div>
            </div>
        \`;
    }

    attachEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });

        // Chat input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');
        
        if (!input.value.trim()) return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = input.value;
        messages.appendChild(userMessage);

        const userQuestion = input.value;
        input.value = '';

        // Add AI response
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai';
        aiMessage.textContent = 'جاري التفكير...';
        messages.appendChild(aiMessage);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userQuestion })
            });

            const data = await response.json();
            aiMessage.textContent = data.response || 'عذراً، حدث خطأ في الاستجابة.';
        } catch (error) {
            aiMessage.textContent = 'عذراً، لا أستطيع الرد في الوقت الحالي. جرب مرة أخرى لاحقاً.';
        }

        messages.scrollTop = messages.scrollHeight;
    }

    loadCodeTemplate(type) {
        const editor = document.getElementById('code-editor');
        const templates = {
            variables: \`# المتغيرات في Python
الاسم = "أحمد محمد"
العمر = 25
الطول = 175.5
طالب = True

print(f"الاسم: {الاسم}")
print(f"العمر: {العمر}")
print(f"الطول: {الطول} سم")
print(f"طالب: {'نعم' if طالب else 'لا'}")\`,

            functions: \`# الدوال في Python
def احسب_المساحة(الطول, العرض):
    """دالة لحساب مساحة المستطيل"""
    المساحة = الطول * العرض
    return المساحة

def فحص_العمر(العمر):
    """دالة لتحديد فئة العمر"""
    if العمر < 13:
        return "طفل"
    elif العمر < 20:
        return "مراهق"
    else:
        return "بالغ"

# استخدام الدوال
الطول = 10
العرض = 5
المساحة = احسب_المساحة(الطول, العرض)
print(f"مساحة المستطيل: {المساحة}")

العمر = 25
الفئة = فحص_العمر(العمر)
print(f"فئة العمر: {الفئة}")\`,

            classes: \`# الكلاسات في Python
class الطالب:
    def __init__(self, الاسم, العمر, التخصص):
        self.الاسم = الاسم
        self.العمر = العمر
        self.التخصص = التخصص
        self.الدرجات = []
    
    def اضافة_درجة(self, الدرجة):
        """إضافة درجة جديدة"""
        self.الدرجات.append(الدرجة)
    
    def احسب_المعدل(self):
        """حساب المعدل"""
        if len(self.الدرجات) == 0:
            return 0
        return sum(self.الدرجات) / len(self.الدرجات)
    
    def عرض_المعلومات(self):
        """عرض معلومات الطالب"""
        المعدل = self.احسب_المعدل()
        print(f"الاسم: {self.الاسم}")
        print(f"العمر: {self.العمر}")
        print(f"التخصص: {self.التخصص}")
        print(f"المعدل: {المعدل:.2f}")

# إنشاء طالب جديد
الطالب_الجديد = الطالب("سارة أحمد", 20, "علوم الحاسوب")
الطالب_الجديد.اضافة_درجة(95)
الطالب_الجديد.اضافة_درجة(88)
الطالب_الجديد.اضافة_درجة(92)
الطالب_الجديد.عرض_المعلومات()\`
        };

        if (editor && templates[type]) {
            editor.value = templates[type];
        }
    }

    runCode() {
        const editor = document.getElementById('code-editor');
        const output = document.getElementById('code-output');
        
        if (!editor || !output) return;

        const code = editor.value;
        output.classList.remove('hidden');
        output.textContent = 'جاري تشغيل الكود...';

        // Simulate code execution
        setTimeout(() => {
            try {
                // This is a simulation - in a real app you'd send to a backend
                if (code.includes('print(')) {
                    const lines = code.split('\\n');
                    const printLines = lines.filter(line => line.trim().startsWith('print('));
                    const results = printLines.map(line => {
                        // Simple simulation of print output
                        const match = line.match(/print\\((.+)\\)/);
                        if (match) {
                            let content = match[1];
                            // Handle f-strings
                            if (content.includes('f"') || content.includes("f'")) {
                                content = content.replace(/f["'](.+?)["']/, '$1');
                                content = content.replace(/{([^}]+)}/g, (match, variable) => {
                                    // Simple variable substitution
                                    if (variable === 'الاسم') return 'أحمد محمد';
                                    if (variable === 'العمر') return '25';
                                    if (variable === 'الطول') return '175.5';
                                    return variable;
                                });
                            }
                            return content.replace(/["']/g, '');
                        }
                        return '';
                    });
                    output.textContent = results.join('\\n');
                } else {
                    output.textContent = 'تم تشغيل الكود بنجاح!';
                }
            } catch (error) {
                output.textContent = 'خطأ في الكود: ' + error.message;
            }
        }, 1000);
    }

    clearCode() {
        const editor = document.getElementById('code-editor');
        const output = document.getElementById('code-output');
        
        if (editor) editor.value = '';
        if (output) {
            output.textContent = '';
            output.classList.add('hidden');
        }
    }

    startCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            alert(\`بدء دورة: \${course.title}\\n\\nسيتم إضافة المحتوى التفاعلي قريباً!\`);
        }
    }
}

// Initialize the app
const app = new OSSUApp();
`;
}
