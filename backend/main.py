from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi import Query
from datetime import datetime
import requests
import httpx
import asyncio
from cacheUtils import AsyncCache

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message: Backend running"}

cache = {}
Cache_TTL = 300
in_progress = set()
locks = {}


def make_cache_key(mood, lat, lon, distance, min_rating):
    lat = round(lat, 3)
    lon = round(lon, 3)
    return f"{mood}_{lat}_{lon}_{distance}_{min_rating}"

def get_cache(key):
    entry = cache.get(key)
    if not entry:
        return None
    if(datetime.now() - entry["timestamp"]).total_seconds() > Cache_TTL:
        return None
    return entry["data"]

cacheManager = AsyncCache(ttl_seconds=300)

@app.get("/places")
async def get_places(mood: str, lat: float, lon: float, distance: float):
    key = make_cache_key(mood, lat, lon, distance, 0)

    async def fetchOverpass():
        tags = get_osm_tags_for_mood(mood)
        query = build_overpass_query(tags, lat, lon, distance)

        async with httpx.AsyncClient() as client:
            response = await client.post(OVERPASS_URL, data={"data": query}, timeout=5)
            response.raise_for_status()
            osm_data = response.json()

        results = []
        for element in osm_data.get("elements", []):
            name = element.get("tags", {}).get("name")
            if not name: 
                continue
            results.append({
                "name": name,
                "lat": element["lat"],
                "lon": element["lon"],
                "distance": 0,
                "rating": 0  
            })
        return results
    
    return await cacheManager.runWithLock(key, fetchOverpass)
        
    

MOOD_OSM_TAGS = {
    "work" : ["amenity=office", "amenity=coworking_space"],
    "date" : ["amenity=restaurant", "amenity=cafe", "amenity=bar", "amenity=wine_bar"],
    "quick_bite" : ["amenity=fast_food", "amenity=snack_bar"],
    "budget" : ["amenity=restaurant", "amenity=fast_food"]
}

def get_osm_tags_for_mood(mood):
    return MOOD_OSM_TAGS.get(mood.lower(), [])

def build_overpass_query(tags, lat, lon, distance):
    tag_filters = ""
    for tag in tags:
        key, value = tag.split("=")
        tag_filters += f'node["{key}"="{value}"](around:{int(distance * 1000)}, {lat}, {lon});\n'

        query = f"""[out:json({tag_filters});out;"""
        return query
    
