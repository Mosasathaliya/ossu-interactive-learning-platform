export async function handleAI(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/ai', '');
  const method = request.method;

  try {
    switch (method) {
      case 'POST':
        if (path === '/chat') {
          return handleAIChat(request, env);
        }
        
        if (path === '/code-help') {
          return handleCodeHelp(request, env);
        }
        
        if (path === '/lesson-explain') {
          return handleLessonExplanation(request, env);
        }
        
        if (path === '/progress-analysis') {
          return handleProgressAnalysis(request, env);
        }
        
        break;

      default:
        return new Response(JSON.stringify({
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('AI API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAIChat(request, env) {
  const { message, userId = 'anonymous', sessionId, language = 'ar' } = await request.json();
  
  if (!message) {
    return new Response(JSON.stringify({
      error: 'Message is required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get conversation history from KV
    const historyKey = `chat:${userId}:${sessionId || 'default'}`;
    const historyData = await env.AI_SESSIONS.get(historyKey);
    const history = historyData ? JSON.parse(historyData) : [];

    // Prepare system prompt in Arabic
    const systemPrompt = language === 'ar' ? 
      `أنت مساعد ذكي متخصص في تعليم علوم الحاسوب والبرمجة باللغة العربية. 
      تساعد الطلاب في فهم المفاهيم البرمجية وحل المشاكل التقنية.
      
      مهامك:
      1. شرح المفاهيم البرمجية بطريقة بسيطة ومفهومة
      2. مساعدة الطلاب في كتابة الكود باستخدام أسماء متغيرات عربية
      3. تقديم أمثلة عملية وتمارين مفيدة
      4. تشجيع الطلاب ودعمهم في رحلة التعلم
      5. الإجابة على الأسئلة التقنية بدقة ووضوح
      
      استخدم اللغة العربية في جميع إجاباتك وقدم أمثلة كود بأسماء متغيرات عربية عندما يكون ذلك مناسباً.` :
      `You are an AI assistant specialized in computer science and programming education.
      Help students understand programming concepts and solve technical problems.
      
      Your tasks:
      1. Explain programming concepts in simple, understandable ways
      2. Help students write code with clear variable names
      3. Provide practical examples and useful exercises
      4. Encourage and support students in their learning journey
      5. Answer technical questions accurately and clearly`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiResult = await openaiResponse.json();
    const aiMessage = aiResult.choices[0].message.content;

    // Update conversation history
    const updatedHistory = [
      ...history.slice(-10), // Keep last 10 messages
      { role: 'user', content: message },
      { role: 'assistant', content: aiMessage }
    ];

    // Save to KV with 1 hour expiration
    await env.AI_SESSIONS.put(historyKey, JSON.stringify(updatedHistory), {
      expirationTtl: 3600
    });

    return new Response(JSON.stringify({
      success: true,
      message: aiMessage,
      sessionId: sessionId || 'default',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Fallback response in Arabic
    const fallbackMessage = language === 'ar' ? 
      'عذراً، أواجه مشكلة تقنية حالياً. يرجى المحاولة مرة أخرى لاحقاً. في هذه الأثناء، يمكنك مراجعة الدروس المتاحة أو طرح سؤالك في منتدى النقاش.' :
      'Sorry, I\'m experiencing technical difficulties. Please try again later. In the meantime, you can review the available lessons or ask your question in the discussion forum.';

    return new Response(JSON.stringify({
      success: false,
      message: fallbackMessage,
      error: 'AI service temporarily unavailable'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCodeHelp(request, env) {
  const { code, problem, language = 'python', userLanguage = 'ar' } = await request.json();
  
  const systemPrompt = userLanguage === 'ar' ?
    `أنت خبير في البرمجة تساعد الطلاب في فهم وإصلاح الأكواد البرمجية.
    عندما يقدم الطالب كوداً، قم بما يلي:
    1. تحليل الكود وفهم الهدف منه
    2. تحديد أي أخطاء أو مشاكل موجودة
    3. اقتراح حلول وتحسينات
    4. شرح المفاهيم البرمجية المستخدمة
    5. تقديم نصائح لكتابة كود أفضل
    
    استخدم أسماء متغيرات عربية في الأمثلة عندما يكون ذلك مناسباً.` :
    `You are a programming expert helping students understand and fix code.
    When a student provides code, do the following:
    1. Analyze the code and understand its purpose
    2. Identify any errors or issues
    3. Suggest solutions and improvements
    4. Explain the programming concepts used
    5. Provide tips for writing better code`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `${problem ? `المشكلة: ${problem}\n\n` : ''}الكود:\n\`\`\`${language}\n${code}\n\`\`\`` 
      }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.3
      })
    });

    const aiResult = await openaiResponse.json();
    const analysis = aiResult.choices[0].message.content;

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Code help error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Code analysis service temporarily unavailable'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLessonExplanation(request, env) {
  const { topic, level = 'beginner', userLanguage = 'ar' } = await request.json();
  
  const systemPrompt = userLanguage === 'ar' ?
    `أنت معلم علوم حاسوب متخصص في شرح المفاهيم البرمجية باللغة العربية.
    اشرح المواضيع بطريقة تدريجية ومفهومة مع أمثلة عملية.
    استخدم أسماء متغيرات عربية في الأمثلة البرمجية.` :
    `You are a computer science teacher specialized in explaining programming concepts.
    Explain topics in a gradual, understandable way with practical examples.`;

  try {
    const levelText = {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط', 
      'advanced': 'متقدم'
    };

    const messages = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `اشرح موضوع "${topic}" لطالب في المستوى ${levelText[level] || 'مبتدئ'}. قدم أمثلة عملية وتمارين بسيطة.`
      }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.5
      })
    });

    const aiResult = await openaiResponse.json();
    const explanation = aiResult.choices[0].message.content;

    return new Response(JSON.stringify({
      success: true,
      explanation: explanation,
      topic: topic,
      level: level,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Lesson explanation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Explanation service temporarily unavailable'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleProgressAnalysis(request, env) {
  const { userId, progressData, userLanguage = 'ar' } = await request.json();
  
  const systemPrompt = userLanguage === 'ar' ?
    `أنت مستشار تعليمي ذكي تحلل تقدم الطلاب في تعلم البرمجة.
    بناءً على بيانات التقدم، قدم:
    1. تحليل نقاط القوة والضعف
    2. توصيات للتحسين
    3. خطة دراسية مخصصة
    4. تحفيز وتشجيع للطالب` :
    `You are an intelligent educational advisor analyzing student progress in programming.
    Based on progress data, provide:
    1. Analysis of strengths and weaknesses
    2. Recommendations for improvement
    3. Personalized study plan
    4. Motivation and encouragement`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `حلل تقدم الطالب التالي وقدم توصيات:\n${JSON.stringify(progressData, null, 2)}`
      }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.6
      })
    });

    const aiResult = await openaiResponse.json();
    const analysis = aiResult.choices[0].message.content;

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      userId: userId,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Progress analysis error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Progress analysis service temporarily unavailable'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
