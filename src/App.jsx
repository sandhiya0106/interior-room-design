import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import TemplateGallery from './components/TemplateGallery';
import RequirementForm from './components/RequirementForm';
import ThreeScene from './components/ThreeScene';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DEFAULT_DESIGN = {
  template: 'living',
  wallColor: '#f5f5f5',
  accentWallColor: '#e5e7eb',
  ceilingColor: '#ffffff',
  flooring: 'wood',
  flooringColor: '#8b5a2b',
  windowPosition: 'right',
  hasCurtains: true,
  sofaPosition: 'center',
  bedPosition: 'center',
  tablePosition: 'right',
  chairPosition: 'nearTable',
  lighting: 'natural',
  roomSize: 'medium',
  hasRug: true,
  hasPlant: true,
  hasPainting: true,
  hasClock: true,
  hasBookshelf: false,
  theme: 'light',
};

export default function App() {
  const [view, setView] = useState('landing');
  const [designData, setDesignData] = useState(DEFAULT_DESIGN);
  const [storedDesigns, setStoredDesigns] = useState([]);

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/designs`);
        if (!response.ok) {
          throw new Error('API unavailable');
        }

        const designs = await response.json();
        setStoredDesigns(designs);
        localStorage.setItem('interior_designs', JSON.stringify(designs));
      } catch {
        const saved = localStorage.getItem('interior_designs');
        if (saved) {
          setStoredDesigns(JSON.parse(saved));
        }
      }
    };

    loadDesigns();
  }, []);

  const saveDesign = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/designs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      const savedDesign = await response.json();
      const updated = [...storedDesigns, savedDesign];
      setStoredDesigns(updated);
      localStorage.setItem('interior_designs', JSON.stringify(updated));
    } catch {
      const updated = [...storedDesigns, data];
      setStoredDesigns(updated);
      localStorage.setItem('interior_designs', JSON.stringify(updated));
    }
  };

  const startDesignWithTemplate = (template) => {
    setDesignData({ ...DEFAULT_DESIGN, template });
    setView('requirements');
  };

  const generateDesign = (data) => {
    setDesignData(data);
    setView('design');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${designData.theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onStart={() => setView('templates')} />
          </motion.div>
        )}
        {view === 'templates' && (
          <motion.div key="templates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <TemplateGallery 
              onSelect={startDesignWithTemplate} 
              onBack={() => setView('landing')}
              storedDesigns={storedDesigns}
              onSelectStored={(data) => {
                setDesignData(data);
                setView('design');
              }}
            />
          </motion.div>
        )}
        {view === 'requirements' && (
          <motion.div key="requirements" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <RequirementForm 
              initialData={designData} 
              onGenerate={generateDesign} 
              onBack={() => setView('templates')} 
            />
          </motion.div>
        )}
        {view === 'design' && (
          <motion.div key="design" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="h-screen w-full relative">
            <ThreeScene designData={designData} onBack={() => setView('requirements')} onSave={() => saveDesign(designData)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
