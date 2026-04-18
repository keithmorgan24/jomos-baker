'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { pusherClient } from '@/lib/pusher';

// Fix for default Leaflet icon issues in Next.js/React
const radarIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
}) : null;

export default function FleetRadar() {
  const [activeUnits, setActiveUnits] = useState<any[]>([]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const res = await fetch('/api/admin/drivers');
        if (res.ok) {
          const data = await res.json();
          // Filter units that have existing location data
          setActiveUnits(data.filter((u: any) => u.lastLocation && u.lastLocation.lat));
        }
      } catch (err) {
        console.error("Radar Sync Error:", err);
      }
    };
    
    loadUnits();

    if (pusherClient) {
      const channel = pusherClient.subscribe('fleet-tracking');
      
      channel.bind('location-update', (data: { driverId: string, coords: { lat: number, lng: number } }) => {
        setActiveUnits(prev => prev.map(unit => 
          unit._id === data.driverId 
            ? { ...unit, lastLocation: data.coords } 
            : unit
        ));
      });

      return () => {
        pusherClient?.unsubscribe('fleet-tracking');
      };
    }
  }, []);

  return (
    <div className="space-y-8 p-4">
      <header>
        <h1 className="text-5xl font-black italic tracking-tighter text-zinc-100 uppercase">
          Fleet <span className="text-amber-500">Radar</span>
        </h1>
        <p className="text-zinc-500 mt-2 font-bold uppercase tracking-widest text-[10px]">
          Live Geospatial Intelligence
        </p>
      </header>

      <div className="h-[70vh] w-full rounded-[3rem] overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl relative">
        <MapContainer 
          center={[-1.286389, 36.817223]} 
          zoom={13} 
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {activeUnits.map(unit => (
            unit.lastLocation?.lat && radarIcon && (
              <Marker 
                key={unit._id} 
                position={[unit.lastLocation.lat, unit.lastLocation.lng]}
                icon={radarIcon}
              >
                <Popup>
                  <div className="p-1">
                    <p className="text-amber-600 font-black uppercase text-[10px] m-0">{unit.name}</p>
                    <p className="text-zinc-500 text-[9px] font-bold m-0">{unit.status || 'Active'}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>

        <div className="absolute bottom-8 left-8 z-[1000] bg-zinc-950/80 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-4 text-white">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Live Units</span>
              <span className="text-2xl font-black italic">{activeUnits.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}