import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import './App.css';


function App() {
  const position = [51.505, -0.09];
  const [mood, setMood] = useState("");

  return (
    <div style={{margin: "10px"}}>
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
        {mood && dummyPlaces[mood].map((place, idx) => (
        <Marker key={idx} position={place.position}>
        <Popup>{place.name}</Popup>
        </Marker>
))}
        </MapContainer>
    </div>
        
  )
}

const dummyPlaces = {
  Work: [
    { name: "Cafe Productivity", position: [51.505, -0.08] },
    { name: "Co-Working Space", position: [51.51, -0.1] }
  ],
  Date: [
    { name: "Romantic Restaurant", position: [51.507, -0.09] },
    { name: "City Park", position: [51.503, -0.07] }
  ],
  "Quick Bite": [
    { name: "Fast Food Place", position: [51.506, -0.095] },
    { name: "Bakery Corner", position: [51.509, -0.08] }
  ],
  Budget: [
    { name: "Cheap Eats", position: [51.504, -0.085] },
    { name: "Budget Cafe", position: [51.508, -0.09] }
  ]
};


export default App
