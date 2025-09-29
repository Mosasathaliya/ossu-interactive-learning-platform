// User progress management
export async function getUserProgress(env, userId) {
  try {
    // Try KV first
    if (env.USER_PROGRESS) {
      const kvData = await env.USER_PROGRESS.get(`progress:${userId}`);
      if (kvData) {
        return JSON.parse(kvData);
      }
    }

    // Try D1 database
    if (env.OSSU_DB) {
      const results = await env.OSSU_DB.prepare(`
        SELECT course_id, lesson_id, progress, completed, time_spent
        FROM user_progress 
        WHERE user_id = ?
      `).bind(userId).all();

      const progressData = {};
      results.results?.forEach(row => {
        if (!progressData[row.course_id]) {
          progressData[row.course_id] = {};
        }
        progressData[row.course_id][row.lesson_id] = {
          progress: row.progress,
          completed: row.completed === 1,
          timeSpent: row.time_spent
        };
      });

      return progressData;
    }

    return {};
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {};
  }
}

export async function saveUserProgress(env, userId, courseId, lessonId, progressData) {
  try {
    const { progress = 0, completed = false, timeSpent = 0 } = progressData;

    // Save to D1 database
    if (env.OSSU_DB) {
      await env.OSSU_DB.prepare(`
        INSERT OR REPLACE INTO user_progress 
        (user_id, course_id, lesson_id, progress, completed, time_spent, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(userId, courseId, lessonId, progress, completed ? 1 : 0, timeSpent).run();
    }

    // Update KV cache
    if (env.USER_PROGRESS) {
      const currentProgress = await getUserProgress(env, userId);
      if (!currentProgress[courseId]) {
        currentProgress[courseId] = {};
      }
      currentProgress[courseId][lessonId] = {
        progress,
        completed,
        timeSpent
      };
      
      await env.USER_PROGRESS.put(`progress:${userId}`, JSON.stringify(currentProgress));
    }

    return true;
  } catch (error) {
    console.error('Error saving user progress:', error);
    return false;
  }
}

export async function updateUserProgress(env, userId, updates) {
  try {
    const currentProgress = await getUserProgress(env, userId);
    
    // Apply updates
    for (const [courseId, courseUpdates] of Object.entries(updates)) {
      if (!currentProgress[courseId]) {
        currentProgress[courseId] = {};
      }
      
      for (const [lessonId, lessonData] of Object.entries(courseUpdates)) {
        currentProgress[courseId][lessonId] = {
          ...currentProgress[courseId][lessonId],
          ...lessonData
        };
        
        // Save individual progress to D1
        await saveUserProgress(env, userId, courseId, lessonId, lessonData);
      }
    }

    // Update KV cache
    if (env.USER_PROGRESS) {
      await env.USER_PROGRESS.put(`progress:${userId}`, JSON.stringify(currentProgress));
    }

    return currentProgress;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return null;
  }
}

export async function getCourseProgress(env, userId, courseId) {
  try {
    const allProgress = await getUserProgress(env, userId);
    return allProgress[courseId] || {};
  } catch (error) {
    console.error('Error getting course progress:', error);
    return {};
  }
}

export async function getProgressSummary(env, userId) {
  try {
    const allProgress = await getUserProgress(env, userId);
    
    let totalLessons = 0;
    let completedLessons = 0;
    let totalTimeSpent = 0;
    const courseStats = {};

    for (const [courseId, courseProgress] of Object.entries(allProgress)) {
      const lessons = Object.values(courseProgress);
      const courseLessonsCompleted = lessons.filter(lesson => lesson.completed).length;
      const courseTimeSpent = lessons.reduce((sum, lesson) => sum + (lesson.timeSpent || 0), 0);
      
      courseStats[courseId] = {
        totalLessons: lessons.length,
        completedLessons: courseLessonsCompleted,
        timeSpent: courseTimeSpent,
        progress: lessons.length > 0 ? (courseLessonsCompleted / lessons.length) * 100 : 0
      };
      
      totalLessons += lessons.length;
      completedLessons += courseLessonsCompleted;
      totalTimeSpent += courseTimeSpent;
    }

    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const completedCourses = Object.values(courseStats).filter(stats => stats.progress >= 80).length;

    return {
      totalCourses: Object.keys(allProgress).length,
      completedCourses,
      totalLessons,
      completedLessons,
      overallProgress: Math.round(overallProgress),
      totalTimeSpent,
      courseStats
    };
  } catch (error) {
    console.error('Error getting progress summary:', error);
    return {
      totalCourses: 0,
      completedCourses: 0,
      totalLessons: 0,
      completedLessons: 0,
      overallProgress: 0,
      totalTimeSpent: 0,
      courseStats: {}
    };
  }
}
