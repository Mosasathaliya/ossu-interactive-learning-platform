export async function handleAuth(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');
  const method = request.method;

  try {
    switch (method) {
      case 'POST':
        if (path === '/login') {
          return handleLogin(request, env);
        }
        
        if (path === '/register') {
          return handleRegister(request, env);
        }
        
        if (path === '/guest') {
          return handleGuestSession(request, env);
        }
        
        break;

      case 'GET':
        if (path === '/profile') {
          return handleGetProfile(request, env);
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
    console.error('Auth API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleGuestSession(request, env) {
  const { preferredLanguage = 'ar' } = await request.json();
  
  // Generate a guest user ID
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store guest session in KV
  const sessionData = {
    userId: guestId,
    type: 'guest',
    preferredLanguage,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };

  await env.USER_PROGRESS.put(`session:${guestId}`, JSON.stringify(sessionData), {
    expirationTtl: 86400 // 24 hours
  });

  return new Response(JSON.stringify({
    success: true,
    userId: guestId,
    sessionType: 'guest',
    preferredLanguage,
    message: 'Guest session created successfully'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleLogin(request, env) {
  const { username, email } = await request.json();
  
  if (!username && !email) {
    return new Response(JSON.stringify({
      error: 'Username or email is required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check if user exists
    const query = username ? 
      'SELECT * FROM users WHERE username = ?' : 
      'SELECT * FROM users WHERE email = ?';
    
    const result = await env.OSSU_DB.prepare(query)
      .bind(username || email)
      .first();

    if (!result) {
      return new Response(JSON.stringify({
        error: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create session
    const sessionData = {
      userId: result.id,
      username: result.username,
      email: result.email,
      displayName: result.display_name,
      preferredLanguage: result.preferred_language,
      type: 'authenticated',
      loginAt: new Date().toISOString()
    };

    await env.USER_PROGRESS.put(`session:${result.id}`, JSON.stringify(sessionData), {
      expirationTtl: 604800 // 7 days
    });

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
        displayName: result.display_name,
        preferredLanguage: result.preferred_language
      },
      message: 'Login successful'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      error: 'Login failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleRegister(request, env) {
  const { username, email, displayName, preferredLanguage = 'ar' } = await request.json();
  
  if (!username || !email) {
    return new Response(JSON.stringify({
      error: 'Username and email are required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert new user
    await env.OSSU_DB.prepare(`
      INSERT INTO users (id, username, email, display_name, preferred_language)
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, username, email, displayName || username, preferredLanguage).run();

    // Create session
    const sessionData = {
      userId,
      username,
      email,
      displayName: displayName || username,
      preferredLanguage,
      type: 'authenticated',
      registeredAt: new Date().toISOString()
    };

    await env.USER_PROGRESS.put(`session:${userId}`, JSON.stringify(sessionData), {
      expirationTtl: 604800 // 7 days
    });

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: userId,
        username,
        email,
        displayName: displayName || username,
        preferredLanguage
      },
      message: 'Registration successful'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({
        error: 'Username or email already exists'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Registration failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetProfile(request, env) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return new Response(JSON.stringify({
      error: 'User ID is required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get session data
    const sessionData = await env.USER_PROGRESS.get(`session:${userId}`);
    
    if (!sessionData) {
      return new Response(JSON.stringify({
        error: 'Session not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = JSON.parse(sessionData);
    
    // Get user progress summary
    const progressData = await env.USER_PROGRESS.get(`progress:${userId}`);
    const progress = progressData ? JSON.parse(progressData) : {};

    return new Response(JSON.stringify({
      success: true,
      profile: session,
      progressSummary: calculateProgressSummary(progress)
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get profile',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function calculateProgressSummary(progress) {
  if (!progress || Object.keys(progress).length === 0) {
    return {
      totalCourses: 0,
      completedCourses: 0,
      totalLessons: 0,
      completedLessons: 0,
      overallProgress: 0,
      points: 0
    };
  }

  let totalLessons = 0;
  let completedLessons = 0;
  let completedCourses = 0;
  let points = 0;

  for (const [courseId, courseProgress] of Object.entries(progress)) {
    const lessons = Object.values(courseProgress);
    totalLessons += lessons.length;
    
    const courseLessonsCompleted = lessons.filter(lesson => lesson.completed).length;
    completedLessons += courseLessonsCompleted;
    
    if (courseLessonsCompleted / lessons.length >= 0.8) {
      completedCourses++;
      points += 100;
    }
    
    points += courseLessonsCompleted * 10;
  }

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return {
    totalCourses: Object.keys(progress).length,
    completedCourses,
    totalLessons,
    completedLessons,
    overallProgress: Math.round(overallProgress),
    points
  };
}
