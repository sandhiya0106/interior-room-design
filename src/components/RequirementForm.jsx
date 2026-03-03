import React, { useState } from 'react';
import { 
  ArrowLeft, Sparkles, Palette, Grid, Monitor, Sofa, Bed, Table, 
  Sun, Maximize, CheckCircle2, Image as ImageIcon, Flower2, Layers, Box 
} from 'lucide-react';

const FLOORING_OPTIONS = [
  { id: 'wood', name: 'Wood' },
  { id: 'tiles', name: 'Tiles' },
  { id: 'marble', name: 'Marble' },
];

const LIGHTING_OPTIONS = [
  { id: 'warm', name: 'Warm', icon: Sun, color: 'text-orange-400' },
  { id: 'cool', name: 'Cool', icon: Sun, color: 'text-blue-400' },
  { id: 'natural', name: 'Natural', icon: Sun, color: 'text-yellow-400' },
];

const SIZE_OPTIONS = [
  { id: 'small', name: 'Small' },
  { id: 'medium', name: 'Medium' },
  { id: 'large', name: 'Large' },
];

export default function RequirementForm({ initialData, onGenerate, onBack }) {
  const [data, setData] = useState(initialData);

  const update = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO TEMPLATES
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="mb-12">
            <h2 className="text-5xl font-extrabold mb-4 tracking-tighter uppercase">
              CUSTOMIZE <span className="text-emerald-500">{data.template}</span>
            </h2>
            <p className="text-zinc-500 text-lg">Define every detail of your space. Our 3D engine will procedurally generate the environment based on these parameters.</p>
          </div>

          <div className="space-y-16">
            {/* Surfaces & Colors */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Palette size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">SURFACES & COLORS</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Main Wall Color</label>
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <input 
                      type="color" 
                      value={data.wallColor} 
                      onChange={(e) => update('wallColor', e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold uppercase">{data.wallColor}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Primary Walls</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Accent Wall Color</label>
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <input 
                      type="color" 
                      value={data.accentWallColor} 
                      onChange={(e) => update('accentWallColor', e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold uppercase">{data.accentWallColor}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Feature Wall</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ceiling Color</label>
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <input 
                      type="color" 
                      value={data.ceilingColor} 
                      onChange={(e) => update('ceilingColor', e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold uppercase">{data.ceilingColor}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Ceiling Surface</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Flooring Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {FLOORING_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => update('flooring', f.id)}
                        className={`py-4 rounded-2xl border-2 transition-all ${data.flooring === f.id ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300'}`}
                      >
                        <span className="text-sm font-bold">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Atmospheric Lighting</label>
                  <div className="grid grid-cols-3 gap-2">
                    {LIGHTING_OPTIONS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => update('lighting', l.id)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all ${data.lighting === l.id ? 'border-yellow-500 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300'}`}
                      >
                        <l.icon size={18} className={l.color} />
                        <span className="text-xs font-bold">{l.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Layout & Dimensions */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Maximize size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">LAYOUT & DIMENSIONS</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Room Scale</label>
                  <div className="flex gap-2">
                    {SIZE_OPTIONS.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => update('roomSize', size.id)}
                        className={`flex-1 py-3 rounded-2xl border-2 transition-all ${data.roomSize === size.id ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300'}`}
                      >
                        <span className="text-sm font-bold">{size.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Window Placement</label>
                  <div className="flex gap-2">
                    {['left', 'right', 'none'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => update('windowPosition', pos)}
                        className={`flex-1 py-3 rounded-2xl border-2 transition-all capitalize ${data.windowPosition === pos ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300'}`}
                      >
                        <span className="text-sm font-bold">{pos}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Decor & Accents */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Layers size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">DECOR & ACCENTS</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'hasRug', name: 'Area Rug', icon: Grid },
                  { id: 'hasPlant', name: 'Indoor Plant', icon: Flower2 },
                  { id: 'hasPainting', name: 'Wall Art', icon: ImageIcon },
                  { id: 'hasCurtains', name: 'Curtains', icon: Layers },
                  { id: 'hasClock', name: 'Wall Clock', icon: Sun },
                  { id: 'hasBookshelf', name: 'Bookshelf', icon: Box },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => update(item.id, !data[item.id])}
                    className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${data[item.id] ? 'border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400' : 'border-zinc-100 dark:border-zinc-800 text-zinc-400'}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="font-bold text-sm">{item.name}</span>
                    </div>
                    {data[item.id] && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={() => onGenerate(data)}
              className="group relative w-full py-8 bg-zinc-950 dark:bg-emerald-500 text-white dark:text-zinc-950 font-black text-xl rounded-[2rem] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                GENERATE 3D SPACE <Sparkles size={24} className="animate-pulse" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>

        {/* Sticky Preview Sidebar */}
        <div className="w-full lg:w-96">
          <div className="sticky top-12 p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">CONFIGURATION</h4>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold animate-pulse">LIVE SYNC</div>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Base Template</span>
                <span className="text-2xl font-black tracking-tight capitalize">{data.template}</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lighting</span>
                  <span className="font-bold text-sm capitalize">{data.lighting}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Scale</span>
                  <span className="font-bold text-sm capitalize">{data.roomSize}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-zinc-500">Requirement Score</span>
                  <span className="text-xs font-bold text-emerald-500">92%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%] transition-all duration-500" />
                </div>
              </div>
              
              <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                * Room dimensions and furniture placement will be automatically calculated based on the selected scale and position mapping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
