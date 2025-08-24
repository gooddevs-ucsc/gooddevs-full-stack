import redis
from typing import Optional
from app.core.config import settings

redis_client: Optional[redis.Redis] = None

def get_redis_client() -> redis.Redis:
    global redis_client
    if redis_client is None:
        # settings.REDIS_URI should be something like "redis://localhost:6379/0"
        redis_client = redis.from_url(str(settings.REDIS_URI), decode_responses=False)
    return redis_client