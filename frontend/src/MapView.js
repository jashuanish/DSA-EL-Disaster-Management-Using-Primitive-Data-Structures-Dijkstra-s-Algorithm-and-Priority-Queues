import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle
} from "react-leaflet";
import L from "leaflet";

// Layout & Components
import DashboardLayout from "./components/layout/DashboardLayout";
import ControlDeck from "./components/features/ControlDeck";
import LiveMonitor from "./components/features/LiveMonitor";

// Simulation Components
import SimulationPanel from "./components/features/SimulationPanel";
import DijkstraVisualizer from "./components/map/DijkstraVisualizer";
import RealisticDisasterLayer from "./components/map/RealisticDisasterLayer";
import { useSimulation } from "./hooks/useSimulation";

/* ---------------- LEAFLET ICON FIX ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/* ---------------- CLICK HANDLER FOR MAP ---------------- */
function MapClickEvents({ onClick }) {
  useMapEvents({
    click(e) { onClick([e.latlng.lat, e.latlng.lng]); }
  });
  return null;
}

/* ---------------- CINEMATIC CAMERA OPERATOR ---------------- */
function CameraOperator({ position, isNavigating }) {
  const map = useMap();
  const prevNavState = useRef(false);

  useEffect(() => {
    if (isNavigating && !prevNavState.current) {
      // STARTED NAVIGATION: Cinematic Zoom In to Street Level
      map.flyTo(position, 19, {
        animate: true,
        duration: 2 // smooth 2s zoom
      });
    }

    if (isNavigating) {
      // Tracking Shot
      map.panTo(position, {
        animate: true,
        duration: 0.5 // tight follow
      });
    }

    prevNavState.current = isNavigating;
  }, [isNavigating, position, map]);

  return null;
}

/* ---------------- 3D VEHICLE MARKER (CUSTOM ASSET) ---------------- */
const VehicleMarker = ({ position, heading }) => {
  // Uses user-uploaded drone.jpg
  // Assuming top-down view. We rotate the container.
  const icon = L.divIcon({
    className: 'vehicle-icon',
    html: `
            <div style="
                transform: rotate(${heading}deg); 
                transition: transform 0.1s linear;
                width: 60px; height: 60px;
                display: flex; justify-content: center; align-items: center;
                filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
            ">
                <img src="/images/drone.jpg" 
                     style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px;" 
                     alt="Vehicle"
                />
            </div>
        `,
    iconSize: [60, 60],
    iconAnchor: [30, 30]
  });

  return <Marker position={position} icon={icon} zIndexOffset={2000} />;
};

function MapView() {
  const [mode, setMode] = useState("live");
  const [selectedDisasterType, setSelectedDisasterType] = useState('flood');
  const [position, setPosition] = useState(null);
  const sim = useSimulation();

  const [alertMsg, setAlertMsg] = useState(null);
  const [zones, setZones] = useState([]);
  const [weather, setWeather] = useState(null);

  // POLL BACKEND FOR ALERTS, ZONES, & WEATHER
  useEffect(() => {
    if (mode !== 'live') return;

    const fetchStatus = async () => {
      try {
        // Fetch Alerts
        const alertRes = await fetch('http://127.0.0.1:8000/alerts');
        const alertData = await alertRes.json();
        if (alertData.alert) {
          setAlertMsg(alertData.alert[1]); 
        } else {
          setAlertMsg(null);
        }

        // Fetch Zones
        const zoneRes = await fetch('http://127.0.0.1:8000/zones');
        const zoneData = await zoneRes.json();
        setZones(zoneData.zones || []);

        // Fetch Weather
        const weatherRes = await fetch('http://127.0.0.1:8000/weather');
        const weatherData = await weatherRes.json();
        setWeather(weatherData.weather);

      } catch (err) {
        console.error("Backend polling error:", err);
      }
    };

    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (!position) {
      if (mode === 'simulation') setPosition([12.9716, 77.5946]);
      else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
            () => setPosition([12.9716, 77.5946])
          );
        } else setPosition([12.9716, 77.5946]);
      }
    }
  }, [mode]);

  const handleMapClick = (latlng) => {
    if (mode === 'simulation') {
      if (!selectedDisasterType) return;
      if (['flood', 'fire', 'chemical'].includes(selectedDisasterType)) {
        sim.actions.addDisaster(selectedDisasterType, latlng);
      } else if (selectedDisasterType === 'shelter') {
        sim.actions.addShelter(latlng);
      } else if (selectedDisasterType === 'start') {
        sim.actions.setStartPoint(latlng);
      }
    }
  };

  if (!position) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="h-full w-full relative">

        <div className="absolute top-4 right-4 z-[3000] flex gap-2">
          <button onClick={() => setMode('live')} className={`btn ${mode === 'live' ? 'btn-primary' : 'bg-slate-800 text-slate-400'}`}>📡 Live Feed</button>
          <button onClick={() => setMode('simulation')} className={`btn ${mode === 'simulation' ? 'btn-danger' : 'bg-slate-800 text-slate-400'}`}>🎮 Elite Sim</button>
        </div>

        {mode === 'live' && (
          <div className="absolute left-0 top-0 w-[380px] h-full p-4 z-20 hidden md:block">
            <LiveMonitor alertMsg={alertMsg} riskReduced={null} zones={zones} weather={weather} />
          </div>
        )}

        <div className="h-full w-full relative z-10">

          {mode === 'simulation' && (
            <SimulationPanel
              simState={sim}
              selectedMode={selectedDisasterType}
              onSetMode={setSelectedDisasterType}
            />
          )}

          {mode === 'live' && (
            <ControlDeck
              scenarios={{ live: { label: "Live" } }}
              currentScenario="live"
              setScenario={() => { }}
              onFindRoute={() => { }}
              simulate={false}
              setSimulate={() => { }}
              hasRoute={false}
            />
          )}

          <MapContainer center={position} zoom={14} zoomControl={false} attributionControl={mode !== 'simulation'} style={{ height: "100%", width: "100%", background: '#0f172a' }}>
            <TileLayer attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <MapClickEvents onClick={handleMapClick} />

            {mode === 'live' && (
              <Marker position={position}><Popup>System Location</Popup></Marker>
            )}

            {mode === 'simulation' && (
              <>
                <RealisticDisasterLayer disasters={sim.entities.disasters} />

                {sim.entities.userStart && (
                  <>
                    {/* Swaps between Pin and Car based on Nav state */}
                    {sim.isNavigating ? (
                      <VehicleMarker
                        position={sim.entities.userStart}
                        heading={sim.entities.userHeading}
                      />
                    ) : (
                      <Marker position={sim.entities.userStart} icon={simIcons.start}>
                        <Popup>📍 Extraction Point</Popup>
                      </Marker>
                    )}

                    <CameraOperator
                      position={sim.entities.userStart}
                      isNavigating={sim.isNavigating}
                    />
                  </>
                )}

                {sim.entities.userShelters.map(s => (
                  <Marker key={s.id} position={s.position} icon={simIcons.shelter}>
                    <Popup>🏠 Safe House {s.id}</Popup>
                  </Marker>
                ))}

                <DijkstraVisualizer algoState={sim.algoState} nodes={sim.graphData.nodes} />
              </>
            )}

          </MapContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

const simIcons = {
  start: new L.DivIcon({ className: 'custom-icon', html: '<div style="font-size: 32px;">📍</div>', iconAnchor: [16, 32] }),
  shelter: new L.DivIcon({ className: 'custom-icon', html: '<div style="font-size: 32px;">🏠</div>', iconAnchor: [16, 16] })
};

export default MapView;
