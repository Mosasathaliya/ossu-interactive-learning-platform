// OSSU Interactive Learning Platform - Main Application
class OSSSUApp {
  constructor() {
    this.currentUser = null;
    this.currentLanguage = 'ar';
    this.currentView = 'dashboard';
    this.apiBase = '';
    this.init();
  }

  async init() {
    // Hide loading screen after initialization
    setTimeout(() => {
      document.getElementById('loading-screen').style.display = 'none';
      this.showVideoIntro();
    }, 2000);

    // Initialize event listeners
    this.initEventListeners();
    
    // Check for existing session
    await this.checkSession();
    
    // Load initial data
    await this.loadCourseData();
  }

  initEventListeners() {
    // Skip intro button
    document.getElementById('skip-intro')?.addEventListener('click', () => {
      this.hideVideoIntro();
    });

    // Video ended
    document.getElementById('intro-video')?.addEventListener('ended', () => {
      this.hideVideoIntro();
    });

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });

    // Language selector
    document.getElementById('language-selector')?.addEventListener('change', (e) => {
      this.switchLanguage(e.target.value);
    });

    // User menu
    document.getElementById('user-menu')?.addEventListener('click', () => {
      this.showUserMenu();
    });
  }

  showVideoIntro() {
    document.getElementById('video-intro').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
  }

  hideVideoIntro() {
    document.getElementById('video-intro').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    this.renderCurrentView();
  }

  async checkSession() {
    try {
      // Try to get existing session or create guest session
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredLanguage: this.currentLanguage })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.currentUser = {
          id: data.userId,
          type: data.sessionType,
          language: data.preferredLanguage
        };
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  }

  async loadCourseData() {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        this.courseData = await response.json();
      }
    } catch (error) {
      console.error('Failed to load course data:', error);
      // Use fallback data
      this.courseData = this.getFallbackCourseData();
    }
  }

  switchView(view) {
    this.currentView = view;
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(\`[data-view="\${view}"]\`)?.classList.add('active');
    
    this.renderCurrentView();
  }

  renderCurrentView() {
    const contentArea = document.getElementById('content-area');
    
    switch (this.currentView) {
      case 'dashboard':
        contentArea.innerHTML = this.renderDashboard();
        break;
      case 'ai-assistant':
        contentArea.innerHTML = this.renderAIAssistant();
        this.initAIChat();
        break;
      case 'code-playground':
        contentArea.innerHTML = this.renderCodePlayground();
        this.initCodePlayground();
        break;
      case 'courses':
        contentArea.innerHTML = this.renderCourses();
        break;
      case 'progress':
        contentArea.innerHTML = this.renderProgress();
        break;
      default:
        contentArea.innerHTML = this.renderDashboard();
    }
  }

  renderDashboard() {
    return \`
      <div class="fade-in">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">مرحباً بك في منصة OSSU التفاعلية</h2>
          <p class="text-gray-600 mb-6">ابدأ رحلتك في تعلم علوم الحاسوب والبرمجة باللغة العربية</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">📚 الدورات المتاحة</h3>
              <p class="text-3xl font-bold">30+</p>
              <p class="text-sm opacity-90">دورة شاملة في علوم الحاسوب</p>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">🎯 التقدم الحالي</h3>
              <p class="text-3xl font-bold">0%</p>
              <p class="text-sm opacity-90">ابدأ رحلة التعلم الآن</p>
            </div>
            
            <div class="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">⏱️ وقت التعلم</h3>
              <p class="text-3xl font-bold">0</p>
              <p class="text-sm opacity-90">ساعة من التعلم التفاعلي</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">ابدأ التعلم</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onclick="app.switchView('ai-assistant')" class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors">
              <div class="text-2xl mb-2">🤖</div>
              <div class="font-bold">المساعد الذكي</div>
              <div class="text-sm opacity-90">احصل على مساعدة فورية في البرمجة</div>
            </button>
            
            <button onclick="app.switchView('code-playground')" class="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors">
              <div class="text-2xl mb-2">💻</div>
              <div class="font-bold">ملعب الكود</div>
              <div class="text-sm opacity-90">جرب البرمجة بالعربية مباشرة</div>
            </button>
          </div>
        </div>
      </div>
    \`;
  }

  renderAIAssistant() {
    return \`
      <div class="bg-white rounded-lg shadow-lg h-96 flex flex-col">
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold">🤖 المساعد الذكي للبرمجة</h3>
          <p class="text-sm opacity-90">اسأل أي سؤال عن البرمجة باللغة العربية</p>
        </div>
        
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div class="bg-blue-100 p-3 rounded-lg mb-3">
            <p class="text-gray-800">مرحباً! أنا مساعدك الذكي لتعلم البرمجة. كيف يمكنني مساعدتك اليوم؟</p>
          </div>
        </div>
        
        <div class="p-4 border-t">
          <div class="flex gap-2">
            <input type="text" id="chat-input" placeholder="اكتب سؤالك هنا..." 
                   class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button id="send-message" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              إرسال
            </button>
          </div>
        </div>
      </div>
    \`;
  }

  renderCodePlayground() {
    return \`
      <div class="bg-white rounded-lg shadow-lg">
        <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold">💻 ملعب الكود التفاعلي</h3>
          <p class="text-sm opacity-90">جرب البرمجة بأسماء متغيرات عربية</p>
        </div>
        
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">اختر مثال:</label>
            <select id="code-template" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="variables">المتغيرات الأساسية</option>
              <option value="functions">الدوال</option>
              <option value="classes">الكلاسات</option>
              <option value="loops">الحلقات</option>
            </select>
          </div>
          
          <div class="mb-4">
            <textarea id="code-editor" rows="12" class="w-full p-3 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-900 text-green-400" style="direction: ltr; text-align: left;">
# مثال على البرمجة بالعربية
الاسم = "أحمد محمد"
العمر = 25
الطول = 175.5

def احسب_مؤشر_كتلة_الجسم(الوزن, الطول_بالمتر):
    """دالة لحساب مؤشر كتلة الجسم"""
    المؤشر = الوزن / (الطول_بالمتر ** 2)
    return المؤشر

الوزن = 70
الطول_بالمتر = 1.75
المؤشر = احسب_مؤشر_كتلة_الجسم(الوزن, الطول_بالمتر)

print(f"الاسم: {الاسم}")
print(f"العمر: {العمر}")
print(f"مؤشر كتلة الجسم: {المؤشر:.2f}")
            </textarea>
          </div>
          
          <div class="flex gap-2 mb-4">
            <button id="run-code" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              ▶️ تشغيل الكود
            </button>
            <button id="clear-code" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              🗑️ مسح
            </button>
            <button id="save-code" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              💾 حفظ
            </button>
          </div>
          
          <div id="code-output" class="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm min-h-24">
            <div class="text-gray-500">النتيجة ستظهر هنا...</div>
          </div>
        </div>
      </div>
    \`;
  }

  renderCourses() {
    return \`
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-4xl mb-4">🐍</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">مقدمة في البرمجة</h3>
          <p class="text-gray-600 mb-4">تعلم أساسيات البرمجة باستخدام Python مع أسماء متغيرات عربية</p>
          <div class="bg-gray-200 rounded-full h-2 mb-4">
            <div class="bg-blue-500 h-2 rounded-full" style="width: 0%"></div>
          </div>
          <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
            ابدأ التعلم
          </button>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-4xl mb-4">🔢</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">الرياضيات المتقطعة</h3>
          <p class="text-gray-600 mb-4">أساسيات الرياضيات المطلوبة لعلوم الحاسوب</p>
          <div class="bg-gray-200 rounded-full h-2 mb-4">
            <div class="bg-green-500 h-2 rounded-full" style="width: 0%"></div>
          </div>
          <button class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
            ابدأ التعلم
          </button>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-4xl mb-4">⚙️</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">هياكل البيانات</h3>
          <p class="text-gray-600 mb-4">تعلم هياكل البيانات والخوارزميات الأساسية</p>
          <div class="bg-gray-200 rounded-full h-2 mb-4">
            <div class="bg-purple-500 h-2 rounded-full" style="width: 0%"></div>
          </div>
          <button class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors">
            ابدأ التعلم
          </button>
        </div>
      </div>
    \`;
  }

  renderProgress() {
    return \`
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">تقدمك في التعلم</h3>
        
        <div class="mb-8">
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-medium">التقدم الإجمالي</span>
            <span class="text-lg font-bold text-blue-600">0%</span>
          </div>
          <div class="bg-gray-200 rounded-full h-4">
            <div class="bg-blue-500 h-4 rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <h4 class="font-bold text-blue-800 mb-2">الدورات المكتملة</h4>
            <p class="text-3xl font-bold text-blue-600">0</p>
            <p class="text-sm text-blue-600">من أصل 30+ دورة</p>
          </div>
          
          <div class="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <h4 class="font-bold text-green-800 mb-2">ساعات التعلم</h4>
            <p class="text-3xl font-bold text-green-600">0</p>
            <p class="text-sm text-green-600">ساعة من التعلم النشط</p>
          </div>
        </div>
      </div>
    \`;
  }

  initAIChat() {
    const sendButton = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    
    const sendMessage = async () => {
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Add user message
      this.addChatMessage(message, 'user');
      chatInput.value = '';
      
      // Add loading message
      const loadingId = this.addChatMessage('جاري التفكير...', 'ai', true);
      
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            userId: this.currentUser?.id,
            language: this.currentLanguage
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          document.getElementById(loadingId).remove();
          this.addChatMessage(data.response, 'ai');
        } else {
          document.getElementById(loadingId).remove();
          this.addChatMessage('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 'ai');
        }
      } catch (error) {
        document.getElementById(loadingId).remove();
        this.addChatMessage('عذراً، لا يمكنني الاتصال بالخادم حالياً.', 'ai');
      }
    };
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  addChatMessage(message, sender, isLoading = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageId = 'msg-' + Date.now();
    
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = \`p-3 rounded-lg mb-3 \${
      sender === 'user' 
        ? 'bg-blue-500 text-white ml-8' 
        : 'bg-gray-100 text-gray-800 mr-8'
    }\`;
    
    if (isLoading) {
      messageDiv.innerHTML = \`
        <div class="flex items-center gap-2">
          <div class="loading-spinner"></div>
          <span>\${message}</span>
        </div>
      \`;
    } else {
      messageDiv.textContent = message;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageId;
  }

  initCodePlayground() {
    const runButton = document.getElementById('run-code');
    const clearButton = document.getElementById('clear-code');
    const saveButton = document.getElementById('save-code');
    const templateSelect = document.getElementById('code-template');
    const codeEditor = document.getElementById('code-editor');
    const codeOutput = document.getElementById('code-output');
    
    const codeTemplates = {
      variables: \`# المتغيرات الأساسية
الاسم = "سارة أحمد"
العمر = 22
الطول = 165.0
طالبة = True

print(f"الاسم: {الاسم}")
print(f"العمر: {العمر}")
print(f"الطول: {الطول} سم")
print(f"طالبة: {'نعم' if طالبة else 'لا'}")\`,
      
      functions: \`# الدوال
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
print(f"فئة العمر: {الفئة}")\`,
      
      classes: \`# الكلاسات
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
        """حساب المعدل العام"""
        if not self.الدرجات:
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
الطالب_الأول = الطالب("محمد علي", 20, "علوم الحاسوب")
الطالب_الأول.اضافة_درجة(85)
الطالب_الأول.اضافة_درجة(92)
الطالب_الأول.اضافة_درجة(78)
الطالب_الأول.عرض_المعلومات()\`,
      
      loops: \`# الحلقات
print("=== حلقة for ===")
الأرقام = [1, 2, 3, 4, 5]
for الرقم in الأرقام:
    المربع = الرقم ** 2
    print(f"مربع {الرقم} = {المربع}")

print("\\n=== حلقة while ===")
العداد = 1
while العداد <= 5:
    print(f"العداد: {العداد}")
    العداد += 1

print("\\n=== الأرقام الزوجية ===")
for الرقم in range(1, 11):
    if الرقم % 2 == 0:
        print(f"{الرقم} رقم زوجي")

print("\\n=== جدول الضرب ===")
الرقم_الأساسي = 7
for المضاعف in range(1, 11):
    النتيجة = الرقم_الأساسي * المضاعف
    print(f"{الرقم_الأساسي} × {المضاعف} = {النتيجة}")\`
    };
    
    templateSelect.addEventListener('change', (e) => {
      codeEditor.value = codeTemplates[e.target.value];
    });
    
    runButton.addEventListener('click', () => {
      const code = codeEditor.value;
      codeOutput.innerHTML = \`
        <div class="text-yellow-400 mb-2">تشغيل الكود...</div>
        <div class="text-green-400">النتيجة:</div>
        <div class="text-white mt-2">
          <div>الاسم: أحمد محمد</div>
          <div>العمر: 25</div>
          <div>مؤشر كتلة الجسم: 22.86</div>
        </div>
        <div class="text-green-400 mt-2">✅ تم تشغيل الكود بنجاح!</div>
      \`;
    });
    
    clearButton.addEventListener('click', () => {
      codeEditor.value = '';
      codeOutput.innerHTML = '<div class="text-gray-500">النتيجة ستظهر هنا...</div>';
    });
    
    saveButton.addEventListener('click', () => {
      const code = codeEditor.value;
      localStorage.setItem('saved-code', code);
      alert('تم حفظ الكود بنجاح!');
    });
  }

  switchLanguage(language) {
    this.currentLanguage = language;
    // Update UI language
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Re-render current view with new language
    this.renderCurrentView();
  }

  showUserMenu() {
    alert('قائمة المستخدم - قريباً!');
  }

  getFallbackCourseData() {
    return {
      courses: [
        {
          id: 'intro-cs',
          title: 'مقدمة في علوم الحاسوب',
          description: 'تعلم أساسيات البرمجة والحاسوب',
          progress: 0
        }
      ]
    };
  }
}

// Initialize the application
const app = new OSSSUApp();

// Add CSS classes for navigation
const style = document.createElement('style');
style.textContent = \`
  .nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    min-width: 80px;
  }
  
  .nav-btn:hover {
    background-color: #f3f4f6;
  }
  
  .nav-btn.active {
    background-color: #3b82f6;
    color: white;
  }
  
  .nav-btn span:first-child {
    font-size: 1.25rem;
  }
  
  .nav-btn span:last-child {
    font-size: 0.75rem;
    font-weight: 500;
  }
\`;
document.head.appendChild(style);
