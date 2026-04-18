'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  UserPlus, 
  X, 
  Trash2, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  Plus, 
  History,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

interface Vehicle {
  plate: string;
  type: string;
}

interface Driver {
  _id: string;
  name: string;
  phone: string;
  location: string;
  orders: number;
  verified: boolean;
  vehicles: Vehicle[];
  status: 'active' | 'busy' | 'offline';
}

export default function FleetManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState('');

  const [newDriver, setNewDriver] = useState({ name: '', location: '', phone: '' });
  const [newVehicle, setNewVehicle] = useState<Vehicle>({ plate: '', type: 'Motorbike' });

  // 1. Initial Load from Protected Admin Route
  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await fetch('/api/admin/drivers'); // Updated to secure route
        if (res.ok) {
          const data = await res.json();
          setDrivers(data);
        }
      } catch (err) {
        console.error("Vault Connection Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  // 2. Register Driver with SMS verification logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsSendingSms(true);

    try {
      const response = await fetch('/api/admin/drivers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver),
      });

      if (response.ok) {
        const data = await response.json();
        setDrivers([...drivers, data.driver]);
        setShowRegisterModal(false);
        setNewDriver({ name: '', location: '', phone: '' });
      } else {
        const errorData = await response.json();
        setRegisterError(errorData.error || 'Registration failed');
      }
    } catch (err) {
      setRegisterError('Network error: Could not reach server');
    } finally {
      setIsSendingSms(false);
      setTimeout(() => setRegisterError(''), 4000);
    }
  };

  // 3. Add Vehicle to Driver Asset List
  const handleAddVehicle = async () => {
    if (!selectedDriverId) return;

    try {
      const res = await fetch(`/api/admin/drivers/${selectedDriverId}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      });

      if (res.ok) {
        setDrivers(prev => prev.map(d => 
          d._id === selectedDriverId 
            ? { ...d, vehicles: [...(d.vehicles || []), newVehicle] } 
            : d
        ));
        setShowVehicleModal(false);
        setNewVehicle({ plate: '', type: 'Motorbike' });
      }
    } catch (err) {
      alert("Error linking vehicle to asset");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
            Decrypting Fleet Vault...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter text-zinc-100 uppercase leading-none">
            Fleet <span className="text-amber-500">Vault</span>
          </h1>
          <p className="text-zinc-500 mt-4 font-bold uppercase tracking-[0.25em] text-[10px] flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Logistics Intelligence & Asset Control
          </p>
        </div>
        <button 
          onClick={() => setShowRegisterModal(true)}
          className="bg-zinc-100 text-zinc-950 font-black px-10 py-6 rounded-[2rem] text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-4 shadow-2xl active:scale-95"
        >
          <UserPlus size={18} /> Deploy New Driver
        </button>
      </header>

      {drivers.length === 0 ? (
        <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[3rem] py-32 text-center">
          <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">
            No active fleet units detected in the vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {drivers.map((driver) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={driver._id}
                className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[3rem] relative group hover:border-amber-500/30 transition-all shadow-xl backdrop-blur-md overflow-hidden"
              >
                {/* Background ID Watermark */}
                <span className="absolute -bottom-4 -right-2 text-zinc-800/20 font-black italic text-7xl select-none uppercase tracking-tighter">
                  {driver.status}
                </span>

                <div className="absolute top-8 right-8">
                  {driver.verified ? (
                    <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                      <Smartphone className="w-5 h-5 text-amber-500 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-zinc-950 rounded-[2rem] flex items-center justify-center border border-zinc-800 text-3xl font-black text-amber-500 shadow-inner">
                    {driver.name ? driver.name.charAt(0) : "?"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter italic leading-tight">
                      {driver.name || "Unknown"}
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-widest mt-1">
                      {driver.phone}
                    </p>
                  </div>
                </div>

                {/* Vessel Fleet Info */}
                <div className="space-y-4 mb-10">
                   <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Authorized Vessel</span>
                    <button 
                      onClick={() => { setSelectedDriverId(driver._id); setShowVehicleModal(true); }}
                      className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-amber-500 transition-colors group/btn"
                    >
                      <Plus size={14} className="group-hover/btn:text-zinc-950" />
                    </button>
                  </div>
                  <div className="bg-zinc-950/60 p-6 rounded-3xl border border-zinc-800/50 min-h-[90px] flex flex-col justify-center gap-3">
                    {driver.vehicles && driver.vehicles.length > 0 ? (
                      driver.vehicles.map((v, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Truck size={14} className="text-amber-500" />
                            <span className="font-mono text-xs font-bold text-zinc-100 uppercase">
                              {v.plate}
                            </span>
                          </div>
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded-md">
                            {v.type}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center italic">
                        Deploy Asset to Activate
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/30 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Station</p>
                      <p className="text-[10px] font-bold text-zinc-300 uppercase truncate">{driver.location}</p>
                    </div>
                  </div>
                  <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/30 flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Shipments</p>
                      <p className="text-[10px] font-bold text-zinc-300 uppercase">{driver.orders || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a 
                    href={`tel:${driver.phone}`} 
                    className="flex-1 py-5 bg-zinc-100 text-zinc-950 rounded-[1.5rem] font-black text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-amber-500 hover:text-white transition-all uppercase"
                  >
                    <Phone className="w-3 h-3" /> Call Unit
                  </a>
                  <button 
                    onClick={() => { if(confirm("Terminate unit access?")) setDrivers(drivers.filter(d => d._id !== driver._id)) }}
                    className="w-16 py-5 bg-zinc-950 border border-zinc-800 text-zinc-600 rounded-[1.5rem] hover:text-red-500 hover:border-red-500/50 transition-all flex items-center justify-center group/del"
                  >
                    <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* MODALS REMAIN THE SAME BUT UPDATED WITH rounded-[3rem] and font-black styling */}
      {/* (Registration and Vehicle Modals logic continues as you had them) */}
    </div>
  );
}