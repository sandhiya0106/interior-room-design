import React from 'react';
import { ArrowRight, Sparkles, Layout, Box } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop")',
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 text-sm font-medium mb-8 animate-bounce">
          <Sparkles size={16} />
          <span>Interior Room Design</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6 leading-none">
          INTERIOR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">ROOM DESIGN</span>
        </h1>
        
        <p className="text-xl text-zinc-200 mb-12 max-w-2xl mx-auto leading-relaxed">
          Transform your ideas into realistic 3D environments. 
          Requirement-driven design mapping with real-time synchronization.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              GET STARTED <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full border border-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            VIEW TEMPLATES
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Layout className="text-emerald-400 mb-4" size={32} />
            <h3 className="text-white font-bold text-lg mb-2">Template Based</h3>
            <p className="text-zinc-300 text-sm">Start with professional layouts for living rooms, bedrooms, and offices.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Box className="text-indigo-400 mb-4" size={32} />
            <h3 className="text-white font-bold text-lg mb-2">3D Generation</h3>
            <p className="text-zinc-300 text-sm">Real-time 3D rendering with perspective, lighting, and realistic materials.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="text-purple-400 mb-4" size={32} />
            <h3 className="text-white font-bold text-lg mb-2">Auto-Mapping</h3>
            <p className="text-zinc-300 text-sm">Our engine automatically arranges furniture based on your specific requirements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
