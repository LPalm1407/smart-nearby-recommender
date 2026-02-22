from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi import Query
from datetime import datetime

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


def make_cache_key(mood, lat, lon, distance, min_rating):
    lat = round(lat, 3)
    lon = round(lon, 3)
    return f"{mood}_{lat}_{lon}_{distance}_{min_rating}"

@app.get("/places")
def get_places(
        mood: str,
        lat: float = Query(...),
        lon: float = Query(...),
        distance: float = Query(5),
        min_rating: float = Query(0),
):
    key = make_cache_key(mood, lat, lon, distance, min_rating)

    if key in cache:
        entry = cache[key]

        if(datetime.now() -entry["timestamp"]).total_seconds() < Cache_TTL:
            return entry["data"]
        
    data = [
        {"name": f"{mood} Place 1", "lat": lat + 0.001, "lon": lon + 0.001, "rating": 4.2, "distance": 1},
        {"name": f"{mood} Place 2", "lat": lat + 0.002, "lon": lon - 0.001, "rating": 4.5, "distance": 2},
    ]

    cache[key] = {"data": data, "timestamp": datetime.now()}

    return data