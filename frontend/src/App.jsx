import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import './App.css';


function App() {
  const [userPosition, setUserPosition] = useState(null);
  const [mood, setMood] = useState("");
  const [distance, setDistance] = useState(5);
  const [minRating, setMinRating] = useState(0);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);

  useEffect(() => {
    if(!navigator.geolocation) {
      setLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      () => {
        setLocationError(true);
        setError("Standort nicht verfügbar. Bitte manuell eingeben.")
      }
    );
  }, []);

  const fetchPlaces = async () => {
    if(!userPosition || !mood) return;

    const [lat,lon] = userPosition;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/places?mood=${mood}&lat=${lat}&lon=${lon}&distance=${distance}&min_rating=${minRating}`
      );

      const data = await response.json();

      if(data.status === "processing") {
        setError("Server verabreitet Anfrage, bitte warten");
        return;
      }

      setPlaces(data);

    } catch (err) {
      console.error(err);
      setError("Fehler beim Laden der Orte")
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [mood, distance, minRating, userPosition])

  function RecenterMap({position}) {
    const map = useMap();
    if(position) {
      map.flyTo(position, 13, {animate: true});
    }
    return null
  }

  const handleManualLocation = async () => {
    if(!manualLocation) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${manualLocation}`
      );

      const data = await response.json();

      if(data.length === 0) {
        setError("Ort nicht gefunden");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      setPendingLocation({
        name: data[0].display_name,
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      });
      setLocationError(false);
      setError(null);
    } catch(err) {
      setError("Fehler beim Abrufen des Standorts.")
    }
  };

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

      <button onClick={() => setMood("work")}>Work</button>
      <button onClick={() => setMood("date")}>Date</button>
      <button onClick={() => setMood("quick_bite")}>Quick Bite</button>
      <button onClick={() => setMood("budget")}>Budget</button>

      <p>Selected Mood: {mood || "None"}</p>

      {locationError && (
        <div style={{marginTop: "10px"}}>
          <input type="text" placeholder="Stadt eingeben" value={manualLocation} onChange={(e) => setManualLocation(e.target.value)}/>
          <button onClick={handleManualLocation}>Standort setzen</button>
        </div>
      )}

      {pendingLocation && (
        <div style={{marginTop: "10px"}}>
          <p>Gefundener Ort</p>
          <p>{pendingLocation.name}</p>
          <button onClick={ () => {
            setUserPosition[pendingLocation.lat, pendingLocation.lon];
            setPendingLocation(null);
            setLocationError(false);
          }}>Bestätigen</button>
          <button onClick={() => setPendingLocation(null)}>Abbrechen</button>
        </div>
      )}

      {loading && <p>Loading places...</p>}
      {error && <p style={{color: "red"}}>{error}</p>}
      {mood && !loading && !error && places.length === 0 && (<p>no location found.</p>)}

      <MapContainer center={[52.52, 13.41]} zoom={13} scrollWheelZoom={true} style={{height: "100vh", width: "120vh"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition && <RecenterMap position={userPosition}/>}

        {places.map((place, idx) => (
          <Marker key={idx} position={[place.lat, place.lon]}>
            <Popup>
              {place.name}
            </Popup>
          </Marker>
        ))}
        </MapContainer>
    </div>
        
  )
}

export default App
