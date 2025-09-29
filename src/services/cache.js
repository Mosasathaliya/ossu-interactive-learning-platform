export async function getFromCache(kv, key) {
  try {
    return await kv.get(key);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCache(kv, key, value, ttl = 3600) {
  try {
    await kv.put(key, value, { expirationTtl: ttl });
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

export async function deleteFromCache(kv, key) {
  try {
    await kv.delete(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}
