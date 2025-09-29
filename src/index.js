import { handleRequest } from './api/router';
import { initializeDatabase } from './database/schema';
import { corsHeaders } from './services/cors';

export default {
  async fetch(request, env, ctx) {
    try {
      // Initialize database on first request
      await initializeDatabase(env.OSSU_DB);
      
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: corsHeaders
        });
      }

      // Route the request
      const response = await handleRequest(request, env, ctx);
      
      // Add CORS headers to all responses
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};
