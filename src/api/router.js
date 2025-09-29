import { handleCourses } from './courses';
import { handleProgress } from './progress';
import { handleAI } from './ai';
import { handleAuth } from './auth';
import { handleMedia } from './media';
import { serveStatic } from './static';

export async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // API Routes
  if (path.startsWith('/api/')) {
    switch (true) {
      case path.startsWith('/api/courses'):
        return handleCourses(request, env, ctx);
      
      case path.startsWith('/api/progress'):
        return handleProgress(request, env, ctx);
      
      case path.startsWith('/api/ai'):
        return handleAI(request, env, ctx);
      
      case path.startsWith('/api/auth'):
        return handleAuth(request, env, ctx);
      
      case path.startsWith('/api/media'):
        return handleMedia(request, env, ctx);
      
      default:
        return new Response(JSON.stringify({
          error: 'API endpoint not found',
          path: path
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  }

  // Serve static files (React app)
  return serveStatic(request, env, ctx);
}
