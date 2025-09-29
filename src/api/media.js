export async function handleMedia(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/media', '');
  const method = request.method;

  try {
    switch (method) {
      case 'GET':
        if (path.startsWith('/')) {
          const fileName = path.substring(1);
          return getMediaFile(fileName, env);
        }
        break;

      case 'POST':
        if (path === '/upload') {
          return handleMediaUpload(request, env);
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
    console.error('Media API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getMediaFile(fileName, env) {
  try {
    const object = await env.MEDIA_STORAGE.get(fileName);
    
    if (!object) {
      return new Response(JSON.stringify({
        error: 'File not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000'); // 1 year cache

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Get media file error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to retrieve file'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleMediaUpload(request, env) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId') || 'anonymous';
    const category = formData.get('category') || 'general';

    if (!file) {
      return new Response(JSON.stringify({
        error: 'No file provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const extension = file.name.split('.').pop();
    const fileName = `${category}/${userId}/${timestamp}_${randomId}.${extension}`;

    // Upload to R2
    await env.MEDIA_STORAGE.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        contentDisposition: `inline; filename="${file.name}"`
      },
      customMetadata: {
        originalName: file.name,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
        category: category
      }
    });

    return new Response(JSON.stringify({
      success: true,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: `/api/media/${fileName}`,
      message: 'File uploaded successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Media upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
