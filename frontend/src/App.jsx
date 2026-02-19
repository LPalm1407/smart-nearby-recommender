import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import './App.css';


function App() {
  const position = [51.505, -0.09];
  const [mood, setMood] = useState("");
  const [distance, setDistance] = useState(5);
  const [minRating, setMinRating] = useState(0);

  return (
    <div style={{margin: "10px"}}>

      <label>
        Max Distance (km):
        <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} min={0}></input>
      </label>

      <label style={{marginLeft: "20px"}}>
        Min Rating:
        <input type="number" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} min={0} max={5} step={0.1}></input>
      </label>

      <button onClick={() => setMood("Work")}>Work</button>
      <button onClick={() => setMood("Date")}>Date</button>
      <button onClick={() => setMood("Quick Bite")}>Quick Bite</button>
      <button onClick={() => setMood("Budget")}>Budget</button>

      <p>Selected Mood: {mood || "None"}</p>

      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{height: "100vh", width: "120vh"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mood && dummyPlaces[mood].filter(place => place.distance <= distance && place.rating >= minRating).map((place, idx) => (
        <Marker key={idx} position={place.position}>
        <Popup>{place.name}<br/> Rating: {place.rating} <br/> Distance: {place.distance}</Popup>
        </Marker>
))}
        </MapContainer>
    </div>
        
  )
}

const dummyPlaces = {
  Work: [
    { name: "Cafe Productivity", position: [51.505, -0.08], rating: 4.2, distance: 2 },
    { name: "Co-Working Space", position: [51.51, -0.1] , rating: 4.5, distance: 5}
  ],
  Date: [
    { name: "Romantic Restaurant", position: [51.507, -0.09], rating: 4.8, distance: 3 },
    { name: "City Park", position: [51.503, -0.07], rating: 4.0, distance: 1 }
  ],
  "Quick Bite": [
    { name: "Fast Food Place", position: [51.506, -0.095], rating: 3.8, distance: 3 },
    { name: "Bakery Corner", position: [51.509, -0.08], rating: 4.1, distance: 4 }
  ],
  Budget: [
    { name: "Cheap Eats", position: [51.504, -0.085], rating: 3.5, distance: 1 },
    { name: "Budget Cafe", position: [51.508, -0.09], rating: 4.0, distance: 5 }
  ]
};


export default App
