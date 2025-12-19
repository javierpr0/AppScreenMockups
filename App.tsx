import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import EditorCanvas from './components/EditorCanvas';
import { ScreenConfig } from './types';
import { DEFAULT_SCREEN_CONFIG } from './constants';

const App: React.FC = () => {
  const [config, setConfig] = useState<ScreenConfig>(DEFAULT_SCREEN_CONFIG);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    
    try {
      // @ts-ignore - html2canvas is loaded via CDN script
      const canvas = await window.html2canvas(canvasRef.current, {
        scale: 1, // Capture at 1:1 scale of the DOM element (which is already huge)
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `app-screen-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Export failed", error);
      alert("Could not export image. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Top Bar for Mobile/Tablet views could go here, currently Sidebar handles controls */}
        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
           {/* Grid Pattern Background */}
           <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} 
           ></div>
           
           <EditorCanvas config={config} canvasRef={canvasRef} />
        </div>
      </main>
      
      <Sidebar 
        config={config} 
        onChange={setConfig} 
        onExport={handleExport}
      />
    </div>
  );
};

export default App;