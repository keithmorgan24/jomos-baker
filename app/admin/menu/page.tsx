'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, UtensilsCrossed, X, Save, Camera, Upload, RotateCcw } from 'lucide-react';
import { useCart } from '@/lib/store';

export default function MenuManagement() {
  const menuItems = useCart((state) => state.menu);
  const setMenu = useCart((state) => state.setMenu);
  const showToast = useCart((state) => state.showToast);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const [newItem, setNewItem] = useState({ 
    name: '', 
    price: '', 
    category: 'Pastries',
    image: '' 
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showToast("Camera access denied");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/png');
      setNewItem({ ...newItem, image: imageData });
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  // --- FILE LOGIC ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewItem({ ...newItem, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const item = {
      name: newItem.name,
      price: `KSh ${newItem.price}`,
      category: newItem.category,
      image: newItem.image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    };

    setMenu([...menuItems, item]);
    setShowAddModal(false);
    setNewItem({ name: '', price: '', category: 'Pastries', image: '' });
    showToast(`${item.name} added to Vault`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HEADER & SEARCH (Kept from your original) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight text-amber-500 uppercase">Menu Vault</h1>
          <p className="text-zinc-500 mt-2 font-medium italic">Manage Jomo’s Baker offerings and pricing.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowAddModal(true)} className="bg-zinc-100 text-zinc-950 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2 shadow-xl shadow-white/5">
            <Plus className="w-5 h-5" /> Add New Item
          </button>
        </div>
      </header>

      {/* TABLE (Kept from your original logic) */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Product Detail</th>
              <th className="p-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.name} className="group border-b border-zinc-800/50">
                <td className="p-8 flex items-center gap-4">
                  <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <span className="font-bold text-zinc-200">{item.name}</span>
                </td>
                <td className="p-8 text-right">
                   <button onClick={() => setMenu(menuItems.filter(i => i.name !== item.name))} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL WITH LIVE CAMERA */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
              
              <form onSubmit={handleAddItem} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Dish Image</label>
                  
                  <div className="w-full h-56 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-2xl relative overflow-hidden group">
                    {isCameraActive ? (
                      /* Live Camera View */
                      <div className="absolute inset-0">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <button type="button" onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-950 p-3 rounded-full shadow-xl"><Camera className="w-6 h-6" /></button>
                      </div>
                    ) : newItem.image ? (
                      /* Image Preview */
                      <div className="absolute inset-0">
                        <img src={newItem.image} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setNewItem({...newItem, image: ''})} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white"><RotateCcw className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      /* Selection State */
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="flex gap-4">
                          <button type="button" onClick={startCamera} className="p-4 bg-zinc-900 rounded-xl hover:text-amber-500 border border-zinc-800 transition-colors"><Camera className="w-6 h-6" /></button>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 bg-zinc-900 rounded-xl hover:text-amber-500 border border-zinc-800 transition-colors"><Upload className="w-6 h-6" /></button>
                        </div>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Capture or Upload</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Product Name</label>
                  <input required type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 focus:border-amber-500 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Price (KSh)</label>
                    <input required type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 focus:border-amber-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Category</label>
                    <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 focus:border-amber-500 outline-none appearance-none">
                      <option value="Cakes">Cakes</option>
                      <option value="Pastries">Pastries</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-6 bg-amber-500 text-zinc-950 font-black rounded-[2rem] hover:bg-white transition-all uppercase tracking-[0.2em] text-xs">Verify & Add Product</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}