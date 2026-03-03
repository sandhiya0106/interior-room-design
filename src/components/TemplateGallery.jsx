import React from 'react';
import { ArrowLeft, Home, Bed, Briefcase, Utensils, History } from 'lucide-react';

const TEMPLATES = [
  { 
    id: 'living', 
    name: 'Living Room', 
    icon: Home, 
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    desc: 'Bespoke modern living with architectural depth and premium finishes.'
  },
  { 
    id: 'bedroom', 
    name: 'Bedroom', 
    icon: Bed, 
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop',
    desc: 'High-end master suite with atmospheric lighting and luxury textures.'
  },
  { 
    id: 'office', 
    name: 'Home Office', 
    icon: Briefcase, 
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    desc: 'Professional executive suite designed for peak productivity.'
  },
  { 
    id: 'dining', 
    name: 'Dining Room', 
    icon: Utensils, 
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5O8o6ZiPy1iOJCND8_tc7MtGR6-HiWRXZWw&s',
    desc: 'Grand dining hall with cinematic shadows and bespoke furniture.'
  },
];

export default function TemplateGallery({ onSelect, onBack, storedDesigns, onSelectStored }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO HOME
      </button>

      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">SELECT A CATEGORY</h2>
        <p className="text-zinc-500 max-w-2xl">Choose a room type to start your design process. Each template comes with optimized furniture sets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group relative h-96 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-2xl hover:-translate-y-2"
          >
            <img 
              src={t.image} 
              alt={t.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-8 text-left w-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-zinc-950 mb-4 group-hover:scale-110 transition-transform">
                <t.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t.name}</h3>
              <p className="text-zinc-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {storedDesigns.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <History className="text-emerald-500" />
            <h2 className="text-2xl font-bold tracking-tight">SAVED DESIGNS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {storedDesigns.map((d, i) => (
              <button
                key={i}
                onClick={() => onSelectStored(d)}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 transition-all text-left"
              >
                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">{d.template}</div>
                <div className="font-bold mb-4">Design #{i + 1}</div>
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: d.wallColor }} />
                  <div className="text-xs text-zinc-500 capitalize">{d.flooring} floor</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
