import React from 'react';
import { DeviceType } from '../types';

interface DeviceFrameProps {
  type: DeviceType;
  imageSrc: string | null;
  className?: string;
  style?: React.CSSProperties;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ type, imageSrc, className = '', style = {} }) => {
  
  const renderContent = (radiusStyle: React.CSSProperties) => {
    if (imageSrc) {
      return (
        <img 
          src={imageSrc} 
          alt="Screen" 
          className="w-full h-full object-cover"
          style={radiusStyle}
        />
      );
    }
    return (
      <div 
        className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500"
        style={radiusStyle}
      >
        <span className="text-xl font-medium">Upload Image</span>
      </div>
    );
  };

  // Glass/Gloss overlay for realism on the screen
  const GlossOverlay = ({ borderRadius }: { borderRadius: string }) => (
    <div className="absolute inset-0 pointer-events-none z-40 opacity-40 mix-blend-soft-light"
         style={{
           borderRadius: borderRadius,
           background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.1) 100%)'
         }}
    ></div>
  );

  /* --- iPHONE 15 PRO (SVG High Fidelity) --- */
  if (type === DeviceType.IPHONE_15_PRO) {
    // Aspect Ratio ~ 19.5:9
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
         {/* Screen Content Container */}
         {/* Inset by approx 3% for bezel, z-20 to appear below notch */}
         <div className="absolute inset-[3%] rounded-[48px] bg-black overflow-hidden z-20">
             {renderContent({ borderRadius: '0px' })}
         </div>

         {/* SVG Frame Overlay - pointer-events-none allows clicks through */}
         <svg
            viewBox="0 0 430 932"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            style={{ overflow: 'visible' }}
         >
            <defs>
                <linearGradient id="titanium_frame" x1="0" y1="0" x2="430" y2="932" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5E5E5E"/>
                    <stop offset="0.1" stopColor="#3A3A3A"/>
                    <stop offset="0.3" stopColor="#222222"/>
                    <stop offset="0.7" stopColor="#222222"/>
                    <stop offset="0.9" stopColor="#3A3A3A"/>
                    <stop offset="1" stopColor="#5E5E5E"/>
                </linearGradient>
                <linearGradient id="bezel_shine" x1="215" y1="20" x2="215" y2="912" gradientUnits="userSpaceOnUse">
                     <stop stopColor="#000000" />
                     <stop offset="1" stopColor="#111111" />
                </linearGradient>
                <filter id="frame_shadow" x="-50" y="-50" width="530" height="1032" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#000" floodOpacity="0.5"/>
                </filter>
            </defs>

            {/* Outer Frame (Titanium) */}
            <path d="M60 0H370C403.137 0 430 26.8629 430 60V872C430 905.137 403.137 932 370 932H60C26.8629 932 0 905.137 0 872V60C0 26.8629 26.8629 0 60 0Z" fill="url(#titanium_frame)"/>

            {/* Inner Bezel stroke for depth */}
            <path d="M60 4H370C400.928 4 426 29.0721 426 60V872C426 902.928 400.928 928 370 928H60C29.0721 928 4 902.928 4 872V60C4 29.0721 29.0721 4 60 4Z" stroke="#1a1a1a" strokeWidth="4"/>

            {/* Main Bezel - stroke only, no fill to show screen content */}
            <path d="M60 12H370C396.51 12 418 33.4903 418 60V872C418 898.51 396.51 920 370 920H60C33.4903 920 12 898.51 12 872V60C12 33.4903 33.4903 12 60 12Z" fill="none" stroke="#111" strokeWidth="2"/>

            {/* Buttons Left */}
            <path d="M-3 120H0V155H-3C-4.1 155 -5 154.1 -5 153V122C-5 120.9 -4.1 120 -3 120Z" fill="#444"/>
            <path d="M-3 190H0V260H-3C-4.1 260 -5 259.1 -5 258V192C-5 190.9 -4.1 190 -3 190Z" fill="#444"/>
            <path d="M-3 280H0V350H-3C-4.1 350 -5 349.1 -5 348V282C-5 280.9 -4.1 280 -3 280Z" fill="#444"/>

            {/* Button Right */}
            <path d="M433 220H430V310H433C434.1 310 435 309.1 435 308V222C435 220.9 434.1 220 433 220Z" fill="#444"/>

            {/* Antenna Bands */}
            <rect x="428" y="100" width="2" height="6" fill="#666" opacity="0.5"/>
            <rect x="0" y="100" width="2" height="6" fill="#666" opacity="0.5"/>
            <rect x="428" y="800" width="2" height="6" fill="#666" opacity="0.5"/>
            <rect x="0" y="800" width="2" height="6" fill="#666" opacity="0.5"/>
         </svg>

         {/* Dynamic Island Overlay - z-30 to appear above screen content */}
         <svg
            viewBox="0 0 430 932"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full z-30 pointer-events-none"
         >
            {/* Dynamic Island */}
            <rect x="126" y="26" width="178" height="48" rx="24" fill="black"/>
            <circle cx="340" cy="50" r="10" fill="#111" opacity="0.8"/>
            <circle cx="340" cy="50" r="4" fill="#333" opacity="0.8"/>
         </svg>

         <GlossOverlay borderRadius="48px" />
      </div>
    );
  }

  /* --- iPHONE SE (Classic with Bezels) --- */
  if (type === DeviceType.IPHONE_SE) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/18', ...style }}>
         {/* Body Frame */}
        <div className="absolute inset-[-10px] bg-white rounded-[36px] shadow-sm z-0 border border-gray-300"></div>
        
        {/* Top Bezel Content */}
        <div className="absolute top-0 left-0 right-0 h-[12%] z-20 flex justify-center items-center">
             <div className="w-[60px] h-[6px] bg-gray-300 rounded-full mb-2"></div>
             <div className="w-[8px] h-[8px] bg-gray-900 rounded-full absolute left-[35%] mb-2"></div>
        </div>

        {/* Bottom Bezel Content (Home Button) */}
        <div className="absolute bottom-0 left-0 right-0 h-[12%] z-20 flex justify-center items-center">
             <div className="w-[44px] h-[44px] rounded-full border-[3px] border-gray-200 bg-white"></div>
        </div>

        {/* Buttons */}
        <div className="h-[24px] w-[3px] bg-gray-300 absolute -left-[11px] top-[60px] rounded-l-md"></div>
        <div className="h-[40px] w-[3px] bg-gray-300 absolute -left-[11px] top-[100px] rounded-l-md"></div>
        <div className="h-[40px] w-[3px] bg-gray-300 absolute -left-[11px] top-[150px] rounded-l-md"></div>
        <div className="h-[40px] w-[3px] bg-gray-300 absolute -right-[11px] top-[100px] rounded-r-md"></div>

        {/* Screen Area Container (Inset) */}
        <div className="absolute top-[12%] bottom-[12%] left-[4%] right-[4%] bg-black z-10 overflow-hidden border border-gray-200">
             {renderContent({ borderRadius: '0px' })}
        </div>
        
        <GlossOverlay borderRadius="0px" />
      </div>
    );
  }

  /* --- SAMSUNG S24 ULTRA (Boxy, Sharp) --- */
  if (type === DeviceType.SAMSUNG_S24) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
         {/* Screen Container */}
         <div className="absolute inset-[1.5%] rounded-[4px] bg-black overflow-hidden z-20">
            {renderContent({ borderRadius: '2px' })}
         </div>

         {/* SVG Frame */}
         <svg viewBox="0 0 440 940" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <rect x="0" y="0" width="440" height="940" rx="6" fill="#333"/>
            <rect x="4" y="4" width="432" height="932" rx="2" fill="none"/>

            {/* Buttons */}
            <rect x="440" y="250" width="3" height="60" rx="1.5" fill="#222"/>
            <rect x="440" y="340" width="3" height="100" rx="1.5" fill="#222"/>
         </svg>

         {/* Camera Dot Overlay - z-30 to appear above screen content */}
         <svg viewBox="0 0 440 940" className="absolute inset-0 w-full h-full z-30 pointer-events-none">
            <circle cx="220" cy="30" r="8" fill="#111" stroke="#333" strokeWidth="2"/>
         </svg>

         <GlossOverlay borderRadius="4px" />
      </div>
    );
  }

  /* --- SAMSUNG S23 (Rounded) --- */
  if (type === DeviceType.SAMSUNG_S23) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
         <div className="absolute inset-[3%] rounded-[28px] bg-black overflow-hidden z-20">
            {renderContent({ borderRadius: '20px' })}
         </div>

         <svg viewBox="0 0 430 932" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
             <rect x="0" y="0" width="430" height="932" rx="48" fill="#e2e2e2"/>
             <rect x="8" y="8" width="414" height="916" rx="38" fill="none"/>

             <rect x="430" y="180" width="3" height="50" rx="1.5" fill="#ccc"/>
             <rect x="430" y="260" width="3" height="90" rx="1.5" fill="#ccc"/>
         </svg>

         {/* Camera Dot Overlay - z-30 to appear above screen content */}
         <svg viewBox="0 0 430 932" className="absolute inset-0 w-full h-full z-30 pointer-events-none">
             <circle cx="215" cy="40" r="10" fill="#111"/>
         </svg>

         <GlossOverlay borderRadius="28px" />
      </div>
    );
  }

  /* --- iPHONE 14 PLUS --- */
  if (type === DeviceType.IPHONE_14_PLUS) {
    return (
       <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
         <div className="absolute inset-[3.5%] rounded-[40px] bg-black overflow-hidden z-20">
            {renderContent({ borderRadius: '32px' })}
         </div>

         <svg viewBox="0 0 430 932" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
             <rect x="0" y="0" width="430" height="932" rx="55" fill="#f2f2f2" stroke="#d1d1d1" strokeWidth="2"/>
             <rect x="12" y="12" width="406" height="908" rx="46" fill="none"/>
         </svg>

         {/* Notch Overlay - z-30 to appear above screen content */}
         <svg viewBox="0 0 430 932" className="absolute inset-0 w-full h-full z-30 pointer-events-none">
             <path d="M145 12h140v30c0 12-10 22-22 22H167c-12 0-22-10-22-22V12z" fill="black"/>
         </svg>

         <GlossOverlay borderRadius="40px" />
      </div>
    );
  }

  /* --- ANDROID PIXEL 8 / 7 --- */
  if (type === DeviceType.ANDROID_PIXEL || type === DeviceType.PIXEL_7) {
    const isPixel7 = type === DeviceType.PIXEL_7;
    const cornerRadius = isPixel7 ? '20px' : '30px';
    const frameColor = isPixel7 ? '#f0f0f0' : '#333';

    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/20', ...style }}>
         <div className="absolute inset-[3.5%] rounded-[24px] bg-black overflow-hidden z-20">
            {renderContent({ borderRadius: '20px' })}
         </div>

         <svg viewBox="0 0 412 915" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
             <rect x="0" y="0" width="412" height="915" rx={isPixel7 ? "30" : "40"} fill={frameColor} stroke="#999" strokeWidth="1"/>
             <rect x="10" y="10" width="392" height="895" rx={isPixel7 ? "24" : "34"} fill="none"/>

             <rect x="412" y="150" width="3" height="40" rx="1.5" fill="#555"/>
             <rect x="412" y="210" width="3" height="80" rx="1.5" fill="#555"/>
         </svg>

         {/* Camera Dot Overlay - z-30 to appear above screen content */}
         <svg viewBox="0 0 412 915" className="absolute inset-0 w-full h-full z-30 pointer-events-none">
             <circle cx="206" cy="40" r="10" fill="#111" stroke="#333" strokeWidth="2"/>
         </svg>

         <GlossOverlay borderRadius="24px" />
      </div>
    );
  }

  // Tablet
  return (
    <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '3/4', ...style }}>
         <div className="absolute inset-[20px] rounded-[16px] bg-black overflow-hidden z-30">
            {renderContent({ borderRadius: '12px' })}
         </div>
         <div className="absolute inset-0 bg-[#222] rounded-[32px] -z-10"></div>
    </div>
  );
};

export default DeviceFrame;