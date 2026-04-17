'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, X, Save, Camera, Upload, Edit3, 
  FolderPlus, List, Circle, RefreshCw, ChefHat, 
  LayoutGrid, ShieldCheck, Eye, EyeOff // Added Eye icons
} from 'lucide-react';
import { useCart, MenuItem } from '@/lib/store';

export default function MenuManagement() {
  const menuItems = useCart((state) => state.menu);
  const setMenu = useCart((state) => state.setMenu);
  const showToast = useCart((state) => state.showToast);

  // --- UI CONTROLS ---
  const [showModal, setShowModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  // --- FORM STATE ---
  const [formItem, setFormItem] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    image: '',
    isAvailable: true // New Field
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- HYDRATION ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        }
      } catch (error) {
        console.error("Vault Connection Error:", error);
        showToast("Database Offline: Using local cache");
      }
    };
    fetchMenu();
  }, [setMenu, showToast]);

  // --- NEW: TOGGLE AVAILABILITY HANDLER ---
  const toggleAvailability = async (item: MenuItem) => {
    const updatedItem = { ...item, isAvailable: !item.isAvailable };
    
    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id,
          isAvailable: updatedItem.isAvailable
        }),
      });

      if (response.ok) {
        setMenu(menuItems.map(i => i._id === item._id ? { ...i, isAvailable: updatedItem.isAvailable } : i));
        showToast(updatedItem.isAvailable ? "Asset Live: Visible to customers" : "Asset Hidden: Removed from menu");
      }
    } catch (error) {
      showToast("Sync Error: Status update failed");
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (itemId: string) => {
    if (!window.confirm("CRITICAL: Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/menu?id=${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenu(menuItems.filter(item => item._id !== itemId));
        showToast("Entry Purged: Removed from Cloud Vault");
      } else {
        showToast("Security Refusal: Could not delete item");
      }
    } catch (error) {
      showToast("Connection Failure: Delete signal lost");
    }
  };

  const existingGroups = useMemo(() => {
    const groups = Array.from(new Set(menuItems.map(item => item.category)));
    return groups.length > 0 ? groups.sort() : ['Pastries', 'Cakes', 'Bread'];
  }, [menuItems]);

  // --- CAMERA LOGIC (Condensed for brevity, same as yours) ---
  const startCamera = async (modeOverride?: 'user' | 'environment') => {
    setIsCameraActive(true);
    const mode = modeOverride || facingMode;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { showToast("Camera access denied"); setIsCameraActive(false); }
  };
  const stopCamera = () => {
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsCameraActive(false);
  };
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setFormItem({ ...formItem, image: canvas.toDataURL('image/webp', 0.8) });
      stopCamera();
    }
  };

  // --- SAVE HANDLER ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const dishData = {
      id: editingItemId,
      name: formItem.name,
      price: Number(formItem.price),
      category: formItem.category,
      image: formItem.image,
      isAvailable: formItem.isAvailable, // Added to save
    };

    try {
      const response = await fetch('/api/menu', {
        method: editingItemId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData),
      });

      if (response.ok) {
        const savedItem = await response.json();
        if (editingItemId) {
          setMenu(menuItems.map(item => item._id === editingItemId ? savedItem : item));
        } else {
          setMenu([...menuItems, savedItem]);
        }
        showToast("Vault Updated: Entry Secured");
        closeModal();
      }
    } catch (error) { showToast("Connection Error: Backend unreachable"); }
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItemId(item._id);
      setFormItem({
        name: item.name,
        price: String(item.price), 
        category: item.category,
        image: item.image,
        isAvailable: item.isAvailable ?? true
      });
    } else {
      setFormItem({ name: '', price: '', category: existingGroups[0], image: '', isAvailable: true });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    stopCamera(); setShowModal(false); setEditingItemId(null); setIsAddingNewCategory(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 px-6 py-16 selection:bg-amber-500/30">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="text-amber-500 w-8 h-8" />
            <span className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] font-bold">Culinary Systems v2.0</span>
          </div>
          <h1 className="text-6xl font-black italic text-zinc-100 uppercase tracking-tighter leading-none">
            Inventory <span className="text-amber-500 underline decoration-zinc-800 underline-offset-8">Control</span>
          </h1>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()} 
          className="bg-zinc-100 text-zinc-950 font-black px-10 py-5 rounded-full hover:bg-amber-500 hover:text-white transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] uppercase text-xs tracking-widest"
        >
          <Plus className="w-5 h-5" /> Create New Asset
        </motion.button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-3xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        
        <table className="w-full text-left border-collapse relative">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-800/50">
              <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">Preview</th>
              <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Asset Detail</th>
              <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Status</th>
              <th className="p-10 text-right text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {menuItems.map((item) => (
              <tr key={item._id} className={`group hover:bg-white/[0.02] transition-all ${!item.isAvailable ? 'opacity-50 grayscale' : ''}`}>
                <td className="p-10 w-24">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative group-hover:border-amber-500/30 transition-all duration-500">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-zinc-950 flex items-center justify-center"><Camera className="text-zinc-800"/></div>
                    )}
                  </div>
                </td>
                <td className="p-10">
                  <div className="text-2xl font-black text-zinc-100 uppercase italic tracking-tight">{item.name}</div>
                  <div className="font-mono text-amber-500 font-bold mt-1 text-lg">KSh {item.price?.toLocaleString()}</div>
                </td>
                <td className="p-10">
                  {/* --- STATUS TOGGLE --- */}
                  <button 
                    onClick={() => toggleAvailability(item)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                      item.isAvailable 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' 
                      : 'border-zinc-700 bg-zinc-800/50 text-zinc-500'
                    }`}
                  >
                    {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {item.isAvailable ? 'Live' : 'Hidden'}
                    </span>
                  </button>
                </td>
                <td className="p-10 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button onClick={() => openModal(item)} className="p-4 bg-zinc-800/50 text-zinc-400 rounded-2xl hover:text-white hover:bg-zinc-700 transition-all">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-4 bg-zinc-800/50 text-zinc-400 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* MODAL (unchanged except for adding the isAvailable toggle inside the form if you want) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-[3rem] p-12 relative shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-100">{editingItemId ? 'Update Dish' : 'New Entry'}</h2>
                <button onClick={closeModal} className="p-4 bg-zinc-800/50 rounded-full text-zinc-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-10">
                {/* --- IMAGE SECTION --- */}
                <div className="w-full h-60 bg-zinc-950 border-2 border-dashed border-zinc-800/50 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center">
                    {isCameraActive ? (
                      <div className="relative w-full h-full">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                          <button type="button" onClick={capturePhoto} className="p-5 bg-amber-500 text-zinc-950 rounded-full shadow-2xl"><Circle className="w-7 h-7 fill-current" /></button>
                          <button type="button" onClick={stopCamera} className="p-4 bg-zinc-900/80 backdrop-blur-md text-white rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                      </div>
                    ) : formItem.image ? (
                      <div className="relative w-full h-full">
                        <img src={formItem.image} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormItem({...formItem, image: ''})} className="absolute top-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ) : (
                      <div className="flex gap-6">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-3 p-8 bg-zinc-900 rounded-[2rem] text-zinc-600 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-500 transition-all">
                            <Upload className="w-8 h-8" />
                            <span className="text-[10px] font-black uppercase">Upload</span>
                        </button>
                        <button type="button" onClick={() => startCamera()} className="flex flex-col items-center gap-3 p-8 bg-zinc-900 rounded-[2rem] text-zinc-600 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-500 transition-all">
                            <Camera className="w-8 h-8" />
                            <span className="text-[10px] font-black uppercase">Camera</span>
                        </button>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if(file) {
                         const reader = new FileReader();
                         reader.onloadend = () => setFormItem({...formItem, image: reader.result as string});
                         reader.readAsDataURL(file);
                       }
                    }} />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Dish Identity</label>
                    <input required type="text" value={formItem.name} onChange={(e) => setFormItem({...formItem, name: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl text-zinc-100 outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Market Price (KSh)</label>
                    <input required type="number" value={formItem.price} onChange={(e) => setFormItem({...formItem, price: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl text-zinc-100 outline-none font-mono" />
                  </div>
                </div>

                {/* --- CATEGORY --- */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Category Registry</label>
                    <button type="button" onClick={() => setIsAddingNewCategory(!isAddingNewCategory)} className="text-[10px] font-black uppercase text-amber-500">
                      {isAddingNewCategory ? 'View Registry' : 'New Category'}
                    </button>
                  </div>
                  {isAddingNewCategory ? (
                    <input autoFocus type="text" placeholder="Specify new group..." value={formItem.category} onChange={(e) => setFormItem({...formItem, category: e.target.value})} className="w-full bg-zinc-950/50 border border-amber-500/50 p-6 rounded-2xl text-zinc-100 outline-none" />
                  ) : (
                    <select value={formItem.category} onChange={(e) => setFormItem({...formItem, category: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl text-zinc-100 outline-none">
                      {existingGroups.map(group => <option key={group} value={group}>{group}</option>)}
                    </select>
                  )}
                </div>

                <button type="submit" className="w-full py-8 bg-amber-500 text-zinc-950 font-black rounded-3xl hover:bg-white transition-all uppercase tracking-[0.3em] text-xs">
                  <Save className="w-5 h-5 inline-block mr-2" /> Finalize & Secure Asset
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}