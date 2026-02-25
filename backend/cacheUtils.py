import asyncio
from datetime import datetime

class AsyncCache:
    def __init__(self, ttl_seconds=300):
        self.cache = {}
        self.locks = {}
        self.in_progress = set()
        self.ttl = ttl_seconds

    def isExpired(self, key):
        entry = self.cache.get(key)
        if entry is None:
            return True
        return (datetime.now() - entry["timestamp"]).total_seconds() > self.ttl
    
    def get(self, key):
        if key in self.cache and not self.isExpired(key):
            return self.cache[key]["data"]
        
        if key in self.cache:
            del self.cache[key]
        return None
    
    def set(self, key, data):
        self.cache[key] = {"data": data, "timestamp": datetime.now()}

    def getLock(self, key):
        if key not in self.locks:
            self.locks[key] = asyncio.Lock()
        return self.locks[key]
    
    async def runWithLock(self, key, coro):
        cached = self.get(key)
        if cached is not None:
            print("Cache HIT")
            return cached
        
        lock = self.getLock(key)

        async with lock:
            cached = self.get(key)
            if cached is not None:
                print("Cache HIT (after lock)")
                return cached
            
            print("Cache miss - Calling API")
            result = await coro()
            self.set(key, result)
            return result