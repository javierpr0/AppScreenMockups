import React from 'react';
import { ScreenConfig, TextConfig } from '../types';
import DeviceFrame from './DeviceFrame';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface EditorCanvasProps {
  config: ScreenConfig;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ config, canvasRef }) => {
  const { background, text, devices } = config;

  const getBackgroundStyle = () => {
    if (background.type === 'solid') {
      return { backgroundColor: background.color1 };
    }
    return { 
      background: `linear-gradient(${background.direction}, ${background.color1}, ${background.color2})` 
    };
  };

  const getAlignClass = (align: TextConfig['alignment']) => {
    switch (align) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      default: return 'text-center items-center';
    }
  };

  const isTextTop = text.position === 'top';

  return (
    <div className="flex justify-center items-center p-8 bg-slate-900/50 min-h-full overflow-auto">
      <div 
        className="relative shadow-2xl overflow-hidden shrink-0"
        ref={canvasRef}
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: 'scale(0.30)', // Fixed preview scale
          transformOrigin: 'top center',
          ...getBackgroundStyle()
        }}
      >
        <div className={`absolute inset-0 w-full h-full flex flex-col p-20 ${isTextTop ? 'justify-start pt-32' : 'justify-end pb-32'}`}>
            
            {/* Text Area */}
            <div 
              className={`relative z-20 flex flex-col pointer-events-none ${getAlignClass(text.alignment)}`}
              style={{ 
                order: isTextTop ? 0 : 2,
                marginTop: isTextTop ? '0' : 'auto',
                marginBottom: isTextTop ? 'auto' : '0'
              }}
            >
              <h1 
                className="font-bold leading-tight mb-6 whitespace-pre-wrap"
                style={{ 
                  color: text.titleColor, 
                  fontSize: '80px',
                  fontFamily: text.fontFamily,
                  textShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                {text.title}
              </h1>
              <h2 
                className="font-medium leading-normal opacity-90 whitespace-pre-wrap"
                style={{ 
                  color: text.subtitleColor, 
                  fontSize: '48px',
                  fontFamily: text.fontFamily,
                }}
              >
                {text.subtitle}
              </h2>
            </div>

            {/* Devices Container - Absolute positioning center with 3D perspective */}
            <div
                className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
                style={{ perspective: '2000px' }}
            >
                <div
                    className="absolute top-1/2 left-1/2 w-0 h-0"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {devices.map((device) => {
                        const shadowStyle = device.shadow.enabled
                        ? `0px ${device.shadow.offsetY}px ${device.shadow.blur}px ${device.shadow.color}${Math.round(device.shadow.opacity * 255).toString(16).padStart(2, '0')}`
                        : 'none';

                        return (
                            <div
                                key={device.id}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: '800px',
                                    transformStyle: 'preserve-3d',
                                    transform: `
                                        translate(-50%, -50%)
                                        translate(${device.x}px, ${device.y}px)
                                        rotateX(${device.rotateX || 0}deg)
                                        rotateY(${device.rotateY || 0}deg)
                                        rotate(${device.rotation}deg)
                                        scale(${device.scale})
                                    `,
                                    transformOrigin: 'center center',
                                    zIndex: device.zIndex,
                                    filter: `drop-shadow(${shadowStyle})`
                                }}
                            >
                                <DeviceFrame
                                    type={device.type}
                                    imageSrc={device.image}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;