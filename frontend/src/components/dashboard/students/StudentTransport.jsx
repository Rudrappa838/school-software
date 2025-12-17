import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Bus, Phone, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const StudentTransport = () => {
    // Info hardcoded for now or fetch from API if available
    const transportInfo = {
        busNumber: "KA-01-AB-1234",
        driverName: "Ramesh Kumar",
        driverContact: "+91 98765 43210",
        route: "Route 12-A (Indiranagar to School)",
        pickupTime: "7:45 AM",
        dropTime: "3:30 PM",
        position: [12.9716, 77.5946] // Bangalore coords
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Bus className="text-indigo-600" /> My School Bus
                    </h3>
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        Live Tracking Active
                    </div>
                </div>

                {/* Map Container */}
                <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-300 z-0 relative">
                    <MapContainer
                        center={transportInfo.position}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={transportInfo.position}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold">{transportInfo.busNumber}</p>
                                    <p className="text-xs">Current Location</p>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                            <Bus size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Bus Number</p>
                            <p className="font-bold text-slate-800">{transportInfo.busNumber}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Driver Info</p>
                            <p className="font-bold text-slate-800">{transportInfo.driverName}</p>
                            <p className="text-xs text-slate-500">{transportInfo.driverContact}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                            <Navigation size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Route Info</p>
                            <p className="font-bold text-slate-800">{transportInfo.route}</p>
                            <p className="text-xs text-slate-500">Pick: {transportInfo.pickupTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTransport;
