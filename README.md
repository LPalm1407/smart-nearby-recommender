# Nearby Places Recommender
This project is a location based recommendation system that suggests nearby places based on a user´s current location. The application uses OpenStreetMap data to retrieve nearby locations and processes them using filters and a recommendation logic implemented in the backend. The ratings are generated locally and are only used to demonstrate the filtering and recommendation functionality.


## Overview

- Search for nearby places based on user location
- Search function if your browser don´t share the user location
- Integration with OpenStreetMap data
- Backend API built with FastAPI
- React frontend for interactive UI
- Interactive map visualization built with Leaflet, which animates to your location and shows nearby places with distance and ratings(not real)
- Dynamic place recommendations through moods


## Features

- Location-based place recommendations
- Mood-based filtering (Work, Date, Quick Bite, Budget)
- Interactive map visualization using Leaflet
- Backend caching to reduce external API requests
- Distance calculation for nearby places


## Tech Stack

Frontend
- React
- HTML/CSS
- Leaflet

Backend
- FastAPI
- Python

Data Source
- OpenStreetMap


## Architecture 

The project follows a simple fullstack architecture:
React + Leaflet Frontend -> FastAPI Backend -> OpenStreetMap Data

1. The frontend collects the user Location (automatically/manually).
2. The backend queries nearby places using the the filters and OpenStreetMap.
3. The backend stores API responses in a temporary cache with a TTL of 5 minutes to reduce external API requests and improve response times.
4. Returns the recommendations with distance and rating
5. The frontend displays the results on a map 


## Installation

1. Clone the repository 
2. Install backend dependencies 
3. Install frontend dependencies
4. Activate the venv environment in python
5. Start the backend server
6. Install npm and choose React
7. Start the frontend

# Backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start


## Usage

1. Allow location access in the browser 
2. The map automatically moves to your location
3. Nearby places are displayed on the map
4. Use the filters or moods to get different recommendations


### Performance Optimization

To reduce external API requests and improve reliability, the backend implements a caching mechanism with a 5-minute TTL.  
This minimizes repeated queries to OpenStreetMap services and improves response time.


### Mood-Based Recommendations

The system supports several predefined moods (Work, Date, Quick Bite, Budget).  
Each mood maps to a set of OpenStreetMap tags that represent suitable places.

For example:
- Work → cafes, coworking spaces
- Date → restaurants, bars
- Quick Bite → fast food locations
- Budget → low-cost food options

These tags are used as filters when querying OpenStreetMap data.