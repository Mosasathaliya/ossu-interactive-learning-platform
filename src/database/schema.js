export async function initializeDatabase(db) {
  try {
    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        display_name TEXT,
        preferred_language TEXT DEFAULT 'ar',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_progress table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        time_spent INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id, lesson_id)
      )
    `);

    // Create course_completions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS course_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        final_score INTEGER,
        certificate_issued BOOLEAN DEFAULT FALSE,
        UNIQUE(user_id, course_id)
      )
    `);

    // Create learning_sessions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS learning_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_end DATETIME,
        duration INTEGER,
        courses_accessed TEXT,
        lessons_completed INTEGER DEFAULT 0,
        exercises_completed INTEGER DEFAULT 0
      )
    `);

    // Create ai_interactions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ai_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        session_id TEXT,
        message_type TEXT,
        user_message TEXT,
        ai_response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        response_time INTEGER
      )
    `);

    // Create user_achievements table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        achievement_type TEXT NOT NULL,
        achievement_data TEXT,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        points INTEGER DEFAULT 0
      )
    `);

    // Create indexes for better performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
