'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, EyeOff, Eye, UtensilsCrossed, X, Save } from 'lucide-react';

export default function MenuManagement() {
  // 1. Logic: State for Menu Items
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Classic Sourdough', price: 450, category: 'Bread', stock: true },
    { id: 2, name: 'Black Forest Gateau', price: 3200, category: 'Cakes', stock: true },
    { id: 3, name: 'Butter Croissant', price: 250, category: 'Pastries', stock: false },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Pastries' });
  const [isSyncing, setIsSyncing] = useState(false);

  // 2. Logic: Functional Handlers
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const item = {
      id: menuItems.length + 1,
      name: newItem.name,
      price: Number(newItem.price),
      category: newItem.category,
      stock: true,
    };
    setMenuItems([...menuItems, item]);
    setShowAddModal(false);
    setNewItem({ name: '', price: '', category: 'Pastries' });
  };

  const toggleStock = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, stock: !item.stock } : item
    ));
  };

  const deleteItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // Logic: This will eventually push changes to the Home Screen
  const handleSyncMenu = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Menu Synced! Changes are now live on the home screen.");
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight text-amber-500 uppercase">Menu Vault</h1>
          <p className="text-zinc-500 mt-2 font-medium italic">Manage Jomo’s Baker offerings and pricing.</p>
        </div>
        <div className="flex gap-4">
            <button 
              onClick={handleSyncMenu}
              disabled={isSyncing}
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-500 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> {isSyncing ? 'Syncing...' : 'Sync to Site'}
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-zinc-100 text-zinc-950 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2 shadow-xl shadow-white/5"
            >
              <Plus className="w-5 h-5" /> Add New Item
            </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          className="w-full bg-zinc-900/50 border border-zinc-800 p-6 pl-16 rounded-[2rem] text-zinc-100 outline-none focus:border-amber-500/50 transition-all font-medium"
        />
      </div>

      {/* Menu Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Product Detail</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Category</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Price (KSh)</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
              <th className="p-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            <AnimatePresence>
              {menuItems.map((item) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id} 
                  className={`group hover:bg-white/5 transition-colors ${!item.stock ? 'opacity-50' : ''}`}
                >
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 group-hover:border-amber-500/50 transition-colors">
                        <UtensilsCrossed className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <span className="text-lg font-bold text-zinc-200 tracking-tight">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-8 font-mono text-zinc-100 font-bold">{item.price.toLocaleString()}</td>
                  <td className="p-8">
                    <button 
                      onClick={() => toggleStock(item.id)}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                        item.stock 
                        ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' 
                        : 'border-zinc-700 text-zinc-500 bg-zinc-800'
                      }`}
                    >
                      {item.stock ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {item.stock ? 'In Stock' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:text-white hover:bg-zinc-700 transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ADD ITEM MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[3rem] p-10 relative overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black italic tracking-tight">New Vault Entry</h2>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-600 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Product Name</label>
                  <input 
                    required 
                    type="text" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 focus:border-amber-500 outline-none transition-all placeholder:text-zinc-800"
                    placeholder="e.g. Strawberry Cheesecake"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Price (KSh)</label>
                    <input 
                      required 
                      type="number" 
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 focus:border-amber-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Category</label>
                    <select 
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 focus:border-amber-500 outline-none cursor-pointer appearance-none"
                    >
                      <option value="Cakes">Cakes</option>
                      <option value="Pastries">Pastries</option>
                      <option value="Bread">Bread</option>
                      <option value="Coffee">Coffee</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-6 bg-amber-500 text-zinc-950 font-black rounded-[2rem] hover:bg-white transition-all uppercase tracking-[0.2em] text-xs"
                >
                  Verify & Add Product
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}