import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported
import L from 'leaflet';
import api from '../../../api/axios';
import { Bus, Navigation } from 'lucide-react';

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Internal component to fit bounds
const FitBounds = ({ vehicles }) => {
    const map = useMap();
    const [fitted, setFitted] = useState(false);

    useEffect(() => {
        if (!fitted && vehicles.length > 0) {
            const bounds = L.latLngBounds(vehicles.map(v => [v.lat, v.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
            setFitted(true);
        }
    }, [vehicles, map, fitted]);
    return null;
};

// Controller to handle external focus requests
const MapController = ({ focusTarget }) => {
    const map = useMap();
    useEffect(() => {
        if (focusTarget) {
            map.flyTo([focusTarget.lat, focusTarget.lng], 16, { animate: true, duration: 1.5 });
        }
    }, [focusTarget, map]);
    return null;
};

const AdminLiveMap = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focusTarget, setFocusTarget] = useState(null);

    // Initial Fetch
    const fetchData = async () => {
        try {
            const res = await api.get('/transport/vehicles');

            const allVehicles = res.data.map(v => ({
                id: v.id,
                lat: v.current_lat ? parseFloat(v.current_lat) : null,
                lng: v.current_lng ? parseFloat(v.current_lng) : null,
                number: v.vehicle_number,
                driver: v.driver_name,
                status: v.status || 'Active',
                isLive: !!(v.current_lat && v.current_lng)
            }));

            setVehicles(allVehicles);
        } catch (error) {
            console.error("Failed to load map data", error);
        } finally {
            setLoading(false);
        }
    };

    // Polling every 5 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Default center (Bangalore/India generic) if no vehicles found
    const defaultCenter = [12.9716, 77.5946];

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Navigation className="text-indigo-600" /> Live Fleet Tracking
                </h2>
                <div className="flex gap-4">
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Live Signal: {vehicles.filter(v => v.isLive).length}
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                        Total Fleet: {vehicles.length}
                    </div>
                    <div className="text-xs font-bold text-indigo-500 bg-white px-3 py-1 rounded-full border border-indigo-200">
                        Auto-updating every 5s
                    </div>
                </div>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-300 shadow-xl relative z-0 min-h-[500px]">
                {loading && vehicles.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <p className="text-slate-400 font-bold animate-pulse">Establishing Satellite Link...</p>
                    </div>
                ) : (
                    <MapContainer
                        center={vehicles.find(v => v.isLive) ? [vehicles.find(v => v.isLive).lat, vehicles.find(v => v.isLive).lng] : defaultCenter}
                        zoom={13}
                        style={{ height: '600px', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapController focusTarget={focusTarget} />

                        {vehicles.filter(v => v.isLive).map(v => (
                            <Marker key={v.id} position={[v.lat, v.lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <div className="font-bold text-indigo-700 flex items-center gap-1">
                                            <Bus size={14} /> {v.number}
                                        </div>
                                        <div className="text-xs text-slate-600 mt-1">Driver: {v.driver}</div>
                                        <div className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Live Signal</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        <FitBounds vehicles={vehicles.filter(v => v.isLive)} />
                    </MapContainer>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vehicles.map(v => (
                    <button
                        key={v.id}
                        onClick={() => v.isLive && setFocusTarget({ lat: v.lat, lng: v.lng, id: v.id })}
                        disabled={!v.isLive}
                        className={`p-3 rounded-xl border shadow-sm flex items-center gap-3 transition-all ${!v.isLive ? 'opacity-60 bg-slate-50 cursor-not-allowed grayscale' : focusTarget?.id === v.id ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${v.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <div className="text-left overflow-hidden w-full">
                            <div className="text-sm font-bold text-slate-800 truncate">{v.number}</div>
                            <div className="text-xs text-slate-500 truncate">{v.isLive ? v.driver : 'Offline / No Signal'}</div>
                        </div>
                    </button>
                ))}
                {vehicles.length === 0 && !loading && (
                    <div className="col-span-full text-center text-slate-400 text-sm py-4 italic">
                        No active vehicles found on the network.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLiveMap;
