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
  AlertCircle
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

  // Load Fleet from Backend
  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await fetch('/api/drivers');
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

  // Register & SMS Verification
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsSendingSms(true);

    try {
      const response = await fetch('/api/verify-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver),
      });

      if (response.ok) {
        const data = await response.json();
        const savedDriver = data.driver;

        setDrivers([...drivers, savedDriver]);
        setShowRegisterModal(false);
        setNewDriver({ name: '', location: '', phone: '' });
        setRegisterError('');
      } else {
        const errorData = await response.json();

        if (response.status === 409) {
          setRegisterError('This phone number is already registered');
        } else {
          setRegisterError(errorData.error || 'Registration failed');
        }

        // Auto-clear error after 3 seconds
        setTimeout(() => setRegisterError(''), 3000);
      }
    } catch (err) {
      setRegisterError('Network error: Could not reach server');
      setTimeout(() => setRegisterError(''), 3000);
    } finally {
      setIsSendingSms(false);
    }
  };

  // Add Vehicle to Driver
  const handleAddVehicle = async () => {
    if (!selectedDriverId) return;

    try {
      const res = await fetch(`/api/drivers/${selectedDriverId}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      });

      if (res.ok) {
        setDrivers(drivers.map(d => 
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

  // Suspend/Delete Driver
  const handleSuspend = async (id: string) => {
    if (confirm("Terminate access for this driver?")) {
      try {
        const res = await fetch(`/api/drivers?id=${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setDrivers(drivers.filter(d => d._id !== id));
        } else {
          alert("Failed to remove driver from fleet");
        }
      } catch (err) {
        alert("Network error while suspending driver");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs animate-pulse">
          Loading Fleet Vault...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 relative px-4 py-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-zinc-100 uppercase">
            Fleet <span className="text-amber-500">Vault</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-bold uppercase tracking-widest text-[10px]">
            Logistics & Intelligence Command
          </p>
        </div>
        <button 
          onClick={() => setShowRegisterModal(true)}
          className="bg-zinc-100 text-zinc-950 font-black px-8 py-5 rounded-2xl text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-3 shadow-2xl"
        >
          <UserPlus className="w-4 h-4" /> Deploy New Driver
        </button>
      </header>

      {drivers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">
            No drivers deployed yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {drivers.map((driver) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={driver._id}
                className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[3rem] relative group hover:border-amber-500/30 transition-all shadow-xl backdrop-blur-sm"
              >
                <div className="absolute top-8 right-8">
                  {driver.verified ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-amber-500 animate-pulse" />
                  )}
                </div>

                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center border border-zinc-800 text-3xl font-black text-amber-500">
                    {driver.name ? driver.name.charAt(0) : "?"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter italic">
                      {driver.name || "Unknown"}
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      {driver.phone || "No phone"}
                    </p>
                  </div>
                </div>

                {/* Fleet/Vehicle Section */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active Vessel</span>
                    <button 
                      onClick={() => { setSelectedDriverId(driver._id); setShowVehicleModal(true); }}
                      className="p-1 hover:text-amber-500 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800 shadow-inner min-h-[80px] flex flex-col justify-center">
                    {driver.vehicles && driver.vehicles.length > 0 ? (
                      driver.vehicles.map((v, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Truck size={14} className="text-amber-500" />
                            <span className="font-mono text-xs font-bold text-zinc-300 uppercase">
                              {v.plate || "N/A"}
                            </span>
                          </div>
                          <span className="text-[9px] font-black text-zinc-600 uppercase">
                            {v.type || "Unknown"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center italic">
                        No Vehicle Assigned
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center px-4 mb-8">
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase">
                    <MapPin className="w-3 h-3 text-amber-500" /> {driver.location || "Unassigned"}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase">
                    <History className="w-3 h-3 text-blue-500" /> {driver.orders || 0} Shipments
                  </div>
                </div>

                <div className="flex gap-4">
                  <a 
                    href={`tel:${driver.phone || ""}`} 
                    className="flex-1 py-5 bg-zinc-100 text-zinc-950 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all uppercase"
                  >
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <button 
                    onClick={() => handleSuspend(driver._id)}
                    className="px-6 py-5 bg-zinc-950 border border-zinc-800 text-zinc-600 rounded-2xl hover:text-red-500 hover:border-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* VEHICLE MODAL */}
      <AnimatePresence>
        {showVehicleModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[3rem] p-10 overflow-hidden shadow-2xl"
            >
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-zinc-100 mb-8">
                Register Vehicle
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
                    License Plate
                  </label>
                  <input 
                    value={newVehicle.plate} 
                    onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})} 
                    placeholder="KAA 001X" 
                    className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 outline-none focus:border-amber-500 font-mono" 
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
                    Vessel Type
                  </label>
                  <select 
                    value={newVehicle.type} 
                    onChange={e => setNewVehicle({...newVehicle, type: e.target.value})} 
                    className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 outline-none appearance-none font-black uppercase text-xs"
                  >
                    <option>Motorbike</option>
                    <option>Tuk Tuk</option>
                    <option>Small Van</option>
                  </select>
                </div>
                <button 
                  onClick={handleAddVehicle} 
                  className="w-full py-6 bg-amber-500 text-zinc-950 font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl"
                >
                  Assign to Fleet
                </button>
                <button 
                  onClick={() => setShowVehicleModal(false)} 
                  className="w-full text-zinc-600 font-bold uppercase text-[9px] tracking-widest mt-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[3rem] overflow-hidden"
            >
              <div className="p-10 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                  Protocol Alpha: Register
                </h2>
                <button 
                  onClick={() => { setShowRegisterModal(false); setRegisterError(''); }} 
                  className="text-zinc-500"
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleRegister} className="p-10 space-y-8">

                {/* Error Prompt */}
                <AnimatePresence>
                  {registerError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {registerError}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input 
                  required 
                  value={newDriver.name} 
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})} 
                  placeholder="FULL NAME" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 outline-none focus:border-amber-500 placeholder:text-zinc-800 font-black uppercase text-xs" 
                />
                <input 
                  required 
                  type="tel" 
                  value={newDriver.phone} 
                  onChange={(e) => { 
                    setNewDriver({...newDriver, phone: e.target.value}); 
                    setRegisterError(''); 
                  }} 
                  placeholder="+254 PHONE" 
                  className={`w-full bg-zinc-950 border p-5 rounded-2xl text-zinc-100 outline-none font-mono ${
                    registerError 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-zinc-800 focus:border-amber-500'
                  }`}
                />
                <input 
                  required 
                  value={newDriver.location} 
                  onChange={(e) => setNewDriver({...newDriver, location: e.target.value})} 
                  placeholder="BASE STATION (e.g. Westlands)" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 outline-none focus:border-amber-500 placeholder:text-zinc-800 font-black uppercase text-xs" 
                />
                <button 
                  disabled={isSendingSms} 
                  type="submit" 
                  className="w-full py-7 bg-amber-500 text-zinc-950 font-black rounded-3xl hover:bg-white transition-all uppercase tracking-widest text-[10px] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingSms ? 'DISPATCHING SIGNAL...' : 'AUTHORIZE & DISPATCH SMS'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}