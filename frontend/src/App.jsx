import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
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
        </MapContainer>
    </div>
        
  )
}

export default App
