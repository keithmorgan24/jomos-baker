'use client';

import { motion } from 'framer-motion';
import Hero from './components/Hero';
import { MenuItem } from '../lib/menu';
import { useCart } from '../lib/store';

export default function Home() {
  const menu = useCart((state) => state.menu);
  const addItem = useCart((state) => state.addItem);

  return (
    <main className="bg-zinc-950 min-h-screen">
      {/* 1. HERO SECTION (Usually includes id="home") */}
      <section id="home">
        <Hero />
      </section>

      {/* 2. MENU SECTION (The "Signature Selection") */}
      {/* We added id="menu" so the Header button works */}
      <section id="menu" className="py-20 px-6 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center italic text-amber-500 uppercase tracking-tighter">
          Our Signature Selection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.map((item: MenuItem, index: number) => (
            <motion.div
              key={item._id || `${item.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-zinc-900/30 rounded-2xl overflow-hidden border border-zinc-800"
            >
              <div className="h-64 w-full overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-4 py-1 rounded-full border border-white/10">
                  <span className="text-xs font-black text-amber-500 tracking-widest uppercase">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-zinc-100 uppercase italic leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-amber-500 font-mono font-bold">
                    KSh {Number(item.price).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => addItem(item)}
                  className="w-full py-4 bg-zinc-100 text-zinc-950 font-black rounded-xl hover:bg-amber-500 hover:text-white transition-all active:scale-95"
                >
                  ADD TO BAG
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SERVICES SECTION (Added from your handwritten notes) */}
      <section id="services" className="py-24 bg-zinc-900/50 px-6 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black italic text-white uppercase mb-12 tracking-tighter">
            Our <span className="text-amber-500">Logistics</span> Services
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Home Deliveries", "Catering Host", "Grill Masters", 
              "Cocktail Parties", "Baked Products", "Birthday Cakes", 
              "Graduation Cakes", "Snack Box Packages", "Pizza Deliveries"
            ].map((service) => (
              <div key={service} className="bg-zinc-950 px-6 py-3 rounded-full border border-zinc-700 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION (Includes your phone number) */}
      <section id="contact" className="py-32 bg-zinc-950 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-amber-500 p-12 rounded-[3rem] shadow-2xl">
          <h2 className="text-5xl font-black italic text-zinc-950 uppercase mb-2 tracking-tighter">
            Ready to Order?
          </h2>
          <p className="text-zinc-900 font-bold uppercase text-xs tracking-widest mb-8">
            Contact our dispatch line directly
          </p>
          <a 
            href="tel:0103990200" 
            className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter hover:scale-105 transition-transform inline-block"
          >
            0103990200
          </a>
        </div>
      </section>
      {/* WHATSAPP HOVER BUTTON */}
<a
  href="https://wa.me/254103990200"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-10 right-10 z-50 group transition-all duration-300 active:scale-95"
  aria-label="Chat on WhatsApp"
>
  {/* 1. Lively, Authentic Pulse Halo (The "Aura") */}
  <div className="absolute inset-0 bg-[#25D366]/40 rounded-full animate-wa-pulse blur-[10px] group-hover:bg-[#25D366]/60 transition-all duration-500" />

  {/* 2. Official Brand Container */}
  <div className="relative w-16 h-16 bg-[#25D366] rounded-full shadow-2xl shadow-[#25D366]/30 flex items-center justify-center border-2 border-white/30 group-hover:border-white transition-all duration-500 group-hover:scale-110">
    
    {/* 3. --- OFFICIAL, BRAND-COMPLIANT WHATSAPP SVG --- */}
    <svg 
      width="34" 
      height="34" 
      viewBox="0 0 24 24" 
      fill="white" 
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:rotate-[-5deg] transition-transform duration-300"
    >
      <path d="M12.012 21.602c-2.133 0-4.218-.567-6.052-1.639l-.434-.253-4.505 1.182 1.203-4.394-.283-.451c-1.181-1.884-1.807-4.062-1.807-6.29 0-6.49 5.278-11.768 11.768-11.768 3.146 0 6.103 1.226 8.328 3.45 2.225 2.225 3.451 5.182 3.451 8.328 0 6.491-5.277 11.769-11.768 11.769m0-22.614c-6.621 0-12.012 5.391-12.012 12.012 0 2.155.568 4.257 1.644 6.136l-1.644 6 6.138-1.609c1.834 1.037 3.91 1.585 6.009 1.585 6.621 0 12.012-5.391 12.012-12.012 0-3.208-1.248-6.223-3.518-8.494-2.271-2.271-5.286-3.518-8.494-3.518m5.42 15.353c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
    </svg>
  </div>
</a>
    </main>
  );
}