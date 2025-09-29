import { getUserProgress, saveUserProgress, updateUserProgress } from '../database/progress';

export async function handleProgress(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/progress', '');
  const method = request.method;

  try {
    switch (method) {
      case 'GET':
        if (path === '' || path === '/') {
          // Get user progress overview
          const userId = url.searchParams.get('userId') || 'anonymous';
          const progress = await getUserProgress(env.OSSU_DB, userId);
          
          return new Response(JSON.stringify({
            userId: userId,
            progress: progress,
            summary: calculateProgressSummary(progress)
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (path.startsWith('/course/')) {
          const courseId = path.replace('/course/', '');
          const userId = url.searchParams.get('userId') || 'anonymous';
          
          const courseProgress = await getCourseProgress(env.OSSU_DB, userId, courseId);
          
          return new Response(JSON.stringify({
            userId: userId,
            courseId: courseId,
            progress: courseProgress
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'POST':
        const data = await request.json();
        const { userId = 'anonymous', courseId, lessonId, progress, completed } = data;
        
        await updateUserProgress(env.OSSU_DB, {
          userId,
          courseId,
          lessonId,
          progress,
          completed,
          timestamp: new Date().toISOString()
        });

        // Update KV cache
        const cacheKey = `progress:${userId}`;
        const currentProgress = await env.USER_PROGRESS.get(cacheKey);
        let progressData = currentProgress ? JSON.parse(currentProgress) : {};
        
        if (!progressData[courseId]) {
          progressData[courseId] = {};
        }
        
        progressData[courseId][lessonId] = {
          progress,
          completed,
          timestamp: new Date().toISOString()
        };

        await env.USER_PROGRESS.put(cacheKey, JSON.stringify(progressData));

        return new Response(JSON.stringify({
          success: true,
          message: 'Progress updated successfully',
          data: {
            userId,
            courseId,
            lessonId,
            progress,
            completed
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'PUT':
        // Bulk update progress
        const bulkData = await request.json();
        const { userId: bulkUserId = 'anonymous', progressUpdates } = bulkData;
        
        for (const update of progressUpdates) {
          await updateUserProgress(env.OSSU_DB, {
            userId: bulkUserId,
            ...update,
            timestamp: new Date().toISOString()
          });
        }

        return new Response(JSON.stringify({
          success: true,
          message: `Updated ${progressUpdates.length} progress entries`,
          userId: bulkUserId
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
    console.error('Progress API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getCourseProgress(db, userId, courseId) {
  try {
    const result = await db.prepare(`
      SELECT lesson_id, progress, completed, timestamp
      FROM user_progress 
      WHERE user_id = ? AND course_id = ?
      ORDER BY timestamp DESC
    `).bind(userId, courseId).all();

    return result.results || [];
  } catch (error) {
    console.error('Error getting course progress:', error);
    return [];
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
      streak: 0,
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
    
    // Course is considered complete if 80% of lessons are done
    if (courseLessonsCompleted / lessons.length >= 0.8) {
      completedCourses++;
      points += 100; // Bonus points for course completion
    }
    
    // Points for individual lessons
    points += courseLessonsCompleted * 10;
  }

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return {
    totalCourses: Object.keys(progress).length,
    completedCourses,
    totalLessons,
    completedLessons,
    overallProgress: Math.round(overallProgress),
    streak: calculateStreak(progress),
    points
  };
}

function calculateStreak(progress) {
  // Calculate learning streak based on recent activity
  const allTimestamps = [];
  
  for (const courseProgress of Object.values(progress)) {
    for (const lesson of Object.values(courseProgress)) {
      if (lesson.timestamp) {
        allTimestamps.push(new Date(lesson.timestamp));
      }
    }
  }
  
  if (allTimestamps.length === 0) return 0;
  
  allTimestamps.sort((a, b) => b - a); // Sort descending
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const timestamp of allTimestamps) {
    const activityDate = new Date(timestamp);
    activityDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  return streak;
}
