import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import './App.css';


function App() {
  const position = [51.505, -0.09];

  return (
    
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{height: "100vh", width: "120vh"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        </MapContainer>
  )
}

export default App
