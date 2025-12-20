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
        className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center"
        style={radiusStyle}
      >
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-sm font-medium">Drop Image</span>
        </div>
      </div>
    );
  };

  // Subtle glass overlay - very minimal
  const GlossOverlay = ({ borderRadius }: { borderRadius: string }) => (
    <div className="absolute inset-0 pointer-events-none z-40"
         style={{
           borderRadius,
           background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 20%)',
         }}
    />
  );

  /* =============================================
     iPHONE 17 PRO / iPHONE 17 PRO MAX
     Smaller Dynamic Island, Thinner bezels, New camera design
  ============================================= */
  if (type === DeviceType.IPHONE_17_PRO || type === DeviceType.IPHONE_17_PRO_MAX) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
        {/* Screen Content */}
        <div className="absolute inset-[2%] rounded-[56px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '0px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 430 932" fill="none" xmlns="http://www.w3.org/2000/svg"
             className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="titanium_17" x1="0" y1="0" x2="430" y2="932" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7a7a7a"/>
              <stop offset="0.1" stopColor="#5a5a5a"/>
              <stop offset="0.25" stopColor="#3a3a3a"/>
              <stop offset="0.5" stopColor="#2a2a2a"/>
              <stop offset="0.75" stopColor="#3a3a3a"/>
              <stop offset="0.9" stopColor="#5a5a5a"/>
              <stop offset="1" stopColor="#7a7a7a"/>
            </linearGradient>
            <filter id="frame_shadow_17" x="-20" y="-20" width="470" height="972">
              <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#000" floodOpacity="0.45"/>
            </filter>
            <linearGradient id="button_shine_17" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#666"/>
              <stop offset="0.5" stopColor="#444"/>
              <stop offset="1" stopColor="#666"/>
            </linearGradient>
          </defs>

          {/* Outer Frame - Thinner bezels */}
          <rect x="0" y="0" width="430" height="932" rx="62" fill="url(#titanium_17)" filter="url(#frame_shadow_17)"/>

          {/* Inner bezel - ultra thin */}
          <rect x="3" y="3" width="424" height="926" rx="59" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
          <rect x="8" y="8" width="414" height="916" rx="54" stroke="#111" strokeWidth="1" fill="none"/>

          {/* Side Buttons - Left */}
          <rect x="-4" y="170" width="4" height="30" rx="2" fill="url(#button_shine_17)"/>
          <rect x="-4" y="220" width="4" height="65" rx="2" fill="url(#button_shine_17)"/>
          <rect x="-4" y="305" width="4" height="65" rx="2" fill="url(#button_shine_17)"/>

          {/* Power Button - Right */}
          <rect x="430" y="260" width="4" height="85" rx="2" fill="url(#button_shine_17)"/>

          {/* Camera Control Button - Right */}
          <rect x="430" y="420" width="4" height="50" rx="2" fill="#4a4a4a"/>
        </svg>

        {/* Dynamic Island - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none" style={{ aspectRatio: '9/19.5' }}>
          <svg viewBox="0 0 430 932" className="w-full h-full">
            <defs>
              <filter id="di_shadow_17">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
              </filter>
            </defs>
            <rect x="155" y="18" width="120" height="36" rx="18" fill="black" filter="url(#di_shadow_17)"/>
            <circle cx="240" cy="36" r="7" fill="#1a1a1a"/>
            <circle cx="240" cy="36" r="4.5" fill="#0a0a0a"/>
            <circle cx="238" cy="34" r="1.2" fill="#333" opacity="0.6"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="56px" />
      </div>
    );
  }

  /* =============================================
     iPHONE 16 PRO / iPHONE 16 PRO MAX
     Dynamic Island, Ultra-thin bezels, Titanium
  ============================================= */
  if (type === DeviceType.IPHONE_16_PRO || type === DeviceType.IPHONE_16_PRO_MAX) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
        {/* Screen Content */}
        <div className="absolute inset-[2.5%] rounded-[52px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '0px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 430 932" fill="none" xmlns="http://www.w3.org/2000/svg"
             className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="titanium_16" x1="0" y1="0" x2="430" y2="932" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6a6a6a"/>
              <stop offset="0.15" stopColor="#4a4a4a"/>
              <stop offset="0.3" stopColor="#2a2a2a"/>
              <stop offset="0.5" stopColor="#1a1a1a"/>
              <stop offset="0.7" stopColor="#2a2a2a"/>
              <stop offset="0.85" stopColor="#4a4a4a"/>
              <stop offset="1" stopColor="#6a6a6a"/>
            </linearGradient>
            <filter id="frame_shadow_16" x="-20" y="-20" width="470" height="972">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.4"/>
            </filter>
            <linearGradient id="button_shine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#555"/>
              <stop offset="0.5" stopColor="#333"/>
              <stop offset="1" stopColor="#555"/>
            </linearGradient>
          </defs>

          {/* Outer Frame */}
          <rect x="0" y="0" width="430" height="932" rx="58" fill="url(#titanium_16)" filter="url(#frame_shadow_16)"/>

          {/* Inner bezel */}
          <rect x="4" y="4" width="422" height="924" rx="54" stroke="#1a1a1a" strokeWidth="4" fill="none"/>
          <rect x="10" y="10" width="410" height="912" rx="50" stroke="#111" strokeWidth="1" fill="none"/>

          {/* Side Buttons - Left */}
          <rect x="-4" y="180" width="4" height="35" rx="2" fill="url(#button_shine)"/>
          <rect x="-4" y="240" width="4" height="70" rx="2" fill="url(#button_shine)"/>
          <rect x="-4" y="330" width="4" height="70" rx="2" fill="url(#button_shine)"/>

          {/* Power Button - Right */}
          <rect x="430" y="280" width="4" height="90" rx="2" fill="url(#button_shine)"/>

          {/* Camera Control Button - Right (new on 16) */}
          <rect x="430" y="450" width="4" height="45" rx="2" fill="#3a3a3a"/>
        </svg>

        {/* Dynamic Island - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 430 932" className="w-full h-full">
            <defs>
              <filter id="di_shadow_16">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3"/>
              </filter>
            </defs>
            <rect x="140" y="22" width="150" height="40" rx="20" fill="black" filter="url(#di_shadow_16)"/>
            <circle cx="250" cy="42" r="8" fill="#1a1a1a"/>
            <circle cx="250" cy="42" r="5" fill="#0a0a0a"/>
            <circle cx="248" cy="40" r="1.5" fill="#333" opacity="0.6"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="52px" />
      </div>
    );
  }

  /* =============================================
     iPHONE 15 PRO / iPHONE 15 PRO MAX
  ============================================= */
  if (type === DeviceType.IPHONE_15_PRO || type === DeviceType.IPHONE_15_PRO_MAX) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
        <div className="absolute inset-[3%] rounded-[48px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '0px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 430 932" fill="none" xmlns="http://www.w3.org/2000/svg"
             className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="titanium_15" x1="0" y1="0" x2="430" y2="932" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5E5E5E"/>
              <stop offset="0.1" stopColor="#3A3A3A"/>
              <stop offset="0.3" stopColor="#222222"/>
              <stop offset="0.7" stopColor="#222222"/>
              <stop offset="0.9" stopColor="#3A3A3A"/>
              <stop offset="1" stopColor="#5E5E5E"/>
            </linearGradient>
            <filter id="frame_shadow_15" x="-20" y="-20" width="470" height="972">
              <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#000" floodOpacity="0.35"/>
            </filter>
          </defs>

          <rect x="0" y="0" width="430" height="932" rx="55" fill="url(#titanium_15)" filter="url(#frame_shadow_15)"/>
          <rect x="4" y="4" width="422" height="924" rx="51" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
          <rect x="10" y="10" width="410" height="912" rx="48" stroke="#111" strokeWidth="1" fill="none"/>

          {/* Buttons */}
          <rect x="-3" y="120" width="3" height="35" rx="1.5" fill="#444"/>
          <rect x="-3" y="190" width="3" height="70" rx="1.5" fill="#444"/>
          <rect x="-3" y="280" width="3" height="70" rx="1.5" fill="#444"/>
          <rect x="430" y="220" width="3" height="90" rx="1.5" fill="#444"/>
        </svg>

        {/* Dynamic Island - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 430 932" className="w-full h-full">
            <rect x="126" y="26" width="178" height="48" rx="24" fill="black"/>
            <circle cx="260" cy="50" r="10" fill="#111"/>
            <circle cx="260" cy="50" r="6" fill="#0a0a0a"/>
            <circle cx="258" cy="48" r="2" fill="#333" opacity="0.5"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="48px" />
      </div>
    );
  }

  /* =============================================
     iPHONE 14 PRO
  ============================================= */
  if (type === DeviceType.IPHONE_14_PRO || type === DeviceType.IPHONE_14_PLUS) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
        <div className="absolute inset-[3.5%] rounded-[42px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '32px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 430 932" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <linearGradient id="steel_14" x1="0" y1="0" x2="430" y2="932" gradientUnits="userSpaceOnUse">
              <stop stopColor="#888"/>
              <stop offset="0.3" stopColor="#555"/>
              <stop offset="0.7" stopColor="#555"/>
              <stop offset="1" stopColor="#888"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="430" height="932" rx="52" fill="url(#steel_14)"/>
          <rect x="6" y="6" width="418" height="920" rx="46" stroke="#333" strokeWidth="2" fill="none"/>
        </svg>

        {/* Dynamic Island - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 430 932" className="w-full h-full">
            <rect x="126" y="26" width="178" height="48" rx="24" fill="black"/>
            <circle cx="260" cy="50" r="8" fill="#1a1a1a"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="42px" />
      </div>
    );
  }

  /* =============================================
     SAMSUNG S24 ULTRA
     Squared edges, titanium frame, flat display
  ============================================= */
  if (type === DeviceType.SAMSUNG_S24_ULTRA || type === DeviceType.SAMSUNG_S24) {
    const isUltra = type === DeviceType.SAMSUNG_S24_ULTRA;
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
        <div className={`absolute inset-[1.5%] ${isUltra ? 'rounded-[6px]' : 'rounded-[12px]'} bg-black overflow-hidden z-20`}>
          {renderContent({ borderRadius: isUltra ? '4px' : '10px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 440 940" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <linearGradient id="samsung_frame" x1="0" y1="0" x2="440" y2="940" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4a4a4a"/>
              <stop offset="0.2" stopColor="#2a2a2a"/>
              <stop offset="0.5" stopColor="#1a1a1a"/>
              <stop offset="0.8" stopColor="#2a2a2a"/>
              <stop offset="1" stopColor="#4a4a4a"/>
            </linearGradient>
            <filter id="samsung_shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.4"/>
            </filter>
          </defs>

          <rect x="0" y="0" width="440" height="940" rx={isUltra ? 8 : 16} fill="url(#samsung_frame)" filter="url(#samsung_shadow)"/>
          <rect x="3" y="3" width="434" height="934" rx={isUltra ? 5 : 13} stroke="#222" strokeWidth="2" fill="none"/>

          {/* Volume + Power buttons */}
          <rect x="440" y="250" width="3" height="50" rx="1" fill="#333"/>
          <rect x="440" y="320" width="3" height="80" rx="1" fill="#333"/>
        </svg>

        {/* Punch-hole camera - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 440 940" className="w-full h-full">
            <circle cx="220" cy="28" r="10" fill="#0a0a0a"/>
            <circle cx="220" cy="28" r="6" fill="black"/>
            <circle cx="218" cy="26" r="1.5" fill="#222" opacity="0.5"/>
          </svg>
        </div>

        <GlossOverlay borderRadius={isUltra ? "6px" : "12px"} />
      </div>
    );
  }

  /* =============================================
     SAMSUNG GALAXY Z FOLD
  ============================================= */
  if (type === DeviceType.SAMSUNG_FOLD) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/22', ...style }}>
        <div className="absolute inset-[2%] rounded-[8px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '6px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 380 930" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <linearGradient id="fold_frame" x1="0" y1="0" x2="380" y2="930">
              <stop stopColor="#3a3a3a"/>
              <stop offset="0.5" stopColor="#1a1a1a"/>
              <stop offset="1" stopColor="#3a3a3a"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="380" height="930" rx="10" fill="url(#fold_frame)"/>
          <rect x="3" y="3" width="374" height="924" rx="7" stroke="#333" strokeWidth="2" fill="none"/>
          {/* Fold hinge indicator */}
          <line x1="0" y1="465" x2="380" y2="465" stroke="#444" strokeWidth="1" strokeDasharray="4 4"/>
        </svg>

        {/* Camera - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 380 930" className="w-full h-full">
            <circle cx="190" cy="25" r="8" fill="#0a0a0a"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="8px" />
      </div>
    );
  }

  /* =============================================
     GOOGLE PIXEL 9 PRO / PIXEL 9
     Rounded design, camera bar
  ============================================= */
  if (type === DeviceType.PIXEL_9_PRO || type === DeviceType.PIXEL_9 || type === DeviceType.PIXEL_8_PRO) {
    const isPro = type === DeviceType.PIXEL_9_PRO || type === DeviceType.PIXEL_8_PRO;
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/20', ...style }}>
        <div className="absolute inset-[3%] rounded-[36px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '28px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 412 915" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <linearGradient id="pixel_frame" x1="0" y1="0" x2="412" y2="915">
              <stop stopColor={isPro ? "#2a2a2a" : "#e8e8e8"}/>
              <stop offset="0.5" stopColor={isPro ? "#1a1a1a" : "#d8d8d8"}/>
              <stop offset="1" stopColor={isPro ? "#2a2a2a" : "#e8e8e8"}/>
            </linearGradient>
            <filter id="pixel_shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3"/>
            </filter>
          </defs>

          <rect x="0" y="0" width="412" height="915" rx="45" fill="url(#pixel_frame)" filter="url(#pixel_shadow)"/>
          <rect x="4" y="4" width="404" height="907" rx="41" stroke={isPro ? "#333" : "#bbb"} strokeWidth="2" fill="none"/>

          {/* Buttons */}
          <rect x="412" y="200" width="3" height="40" rx="1.5" fill={isPro ? "#444" : "#ccc"}/>
          <rect x="412" y="260" width="3" height="80" rx="1.5" fill={isPro ? "#444" : "#ccc"}/>
        </svg>

        {/* Punch-hole camera - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 412 915" className="w-full h-full">
            <circle cx="206" cy="38" r="10" fill="#0a0a0a"/>
            <circle cx="206" cy="38" r="6" fill="black"/>
            <circle cx="204" cy="36" r="1.5" fill="#333" opacity="0.4"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="36px" />
      </div>
    );
  }

  /* =============================================
     iPHONE SE (Classic with Home Button)
  ============================================= */
  if (type === DeviceType.IPHONE_SE) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/18', ...style }}>
        <div className="absolute inset-[-8px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-[32px] z-0 border border-gray-300"/>

        {/* Top bezel with speaker */}
        <div className="absolute top-0 left-0 right-0 h-[12%] z-20 flex justify-center items-center">
          <div className="w-[50px] h-[5px] bg-gray-400 rounded-full mb-1"/>
          <div className="w-[8px] h-[8px] bg-gray-800 rounded-full absolute left-[38%]"/>
        </div>

        {/* Home button */}
        <div className="absolute bottom-0 left-0 right-0 h-[12%] z-20 flex justify-center items-center">
          <div className="w-[42px] h-[42px] rounded-full border-[3px] border-gray-300 bg-white shadow-inner"/>
        </div>

        {/* Buttons */}
        <div className="h-[22px] w-[3px] bg-gray-400 absolute -left-[10px] top-[55px] rounded-l"/>
        <div className="h-[35px] w-[3px] bg-gray-400 absolute -left-[10px] top-[90px] rounded-l"/>
        <div className="h-[35px] w-[3px] bg-gray-400 absolute -left-[10px] top-[135px] rounded-l"/>
        <div className="h-[35px] w-[3px] bg-gray-400 absolute -right-[10px] top-[95px] rounded-r"/>

        <div className="absolute top-[12%] bottom-[12%] left-[5%] right-[5%] bg-black z-10 overflow-hidden border border-gray-300">
          {renderContent({ borderRadius: '0px' })}
        </div>
      </div>
    );
  }

  /* =============================================
     iPAD PRO 13" / 11"
  ============================================= */
  if (type === DeviceType.IPAD_PRO_13 || type === DeviceType.IPAD_PRO_11 || type === DeviceType.TABLET) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '3/4', ...style }}>
        <div className="absolute inset-[2.5%] rounded-[20px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '14px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 600 800" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <linearGradient id="ipad_frame" x1="0" y1="0" x2="600" y2="800">
              <stop stopColor="#3a3a3a"/>
              <stop offset="0.3" stopColor="#2a2a2a"/>
              <stop offset="0.7" stopColor="#2a2a2a"/>
              <stop offset="1" stopColor="#3a3a3a"/>
            </linearGradient>
            <filter id="ipad_shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#000" floodOpacity="0.3"/>
            </filter>
          </defs>

          <rect x="0" y="0" width="600" height="800" rx="32" fill="url(#ipad_frame)" filter="url(#ipad_shadow)"/>
          <rect x="6" y="6" width="588" height="788" rx="26" stroke="#222" strokeWidth="2" fill="none"/>
        </svg>

        {/* Camera - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 600 800" className="w-full h-full">
            <circle cx="300" cy="25" r="6" fill="#1a1a1a"/>
            <circle cx="300" cy="25" r="3" fill="#0a0a0a"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="20px" />
      </div>
    );
  }

  /* =============================================
     LEGACY: SAMSUNG S23
  ============================================= */
  if (type === DeviceType.SAMSUNG_S23) {
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/19.5', ...style }}>
        <div className="absolute inset-[3%] rounded-[28px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '20px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 430 932" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <rect x="0" y="0" width="430" height="932" rx="45" fill="#e2e2e2"/>
          <rect x="6" y="6" width="418" height="920" rx="39" stroke="#ccc" strokeWidth="2" fill="none"/>
          <rect x="430" y="180" width="3" height="50" rx="1.5" fill="#ccc"/>
          <rect x="430" y="260" width="3" height="90" rx="1.5" fill="#ccc"/>
        </svg>

        {/* Camera - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 430 932" className="w-full h-full">
            <circle cx="215" cy="40" r="10" fill="#111"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="28px" />
      </div>
    );
  }

  /* =============================================
     LEGACY: PIXEL 7 / ANDROID_PIXEL
  ============================================= */
  if (type === DeviceType.PIXEL_7 || type === DeviceType.ANDROID_PIXEL) {
    const isPixel7 = type === DeviceType.PIXEL_7;
    return (
      <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '9/20', ...style }}>
        <div className="absolute inset-[3.5%] rounded-[24px] bg-black overflow-hidden z-20">
          {renderContent({ borderRadius: '20px' })}
        </div>

        {/* SVG Frame - Below screen content */}
        <svg viewBox="0 0 412 915" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <rect x="0" y="0" width="412" height="915" rx={isPixel7 ? 30 : 40} fill={isPixel7 ? "#f0f0f0" : "#333"} stroke="#999" strokeWidth="1"/>
          <rect x="412" y="150" width="3" height="40" rx="1.5" fill="#555"/>
          <rect x="412" y="210" width="3" height="80" rx="1.5" fill="#555"/>
        </svg>

        {/* Camera - Above screen content */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 412 915" className="w-full h-full">
            <circle cx="206" cy="40" r="10" fill="#111" stroke="#333" strokeWidth="2"/>
          </svg>
        </div>

        <GlossOverlay borderRadius="24px" />
      </div>
    );
  }

  // Fallback - Generic tablet
  return (
    <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '3/4', ...style }}>
      <div className="absolute inset-[20px] rounded-[16px] bg-black overflow-hidden z-20">
        {renderContent({ borderRadius: '12px' })}
      </div>
      <div className="absolute inset-0 bg-[#222] rounded-[32px] -z-10"/>
    </div>
  );
};

export default DeviceFrame;
