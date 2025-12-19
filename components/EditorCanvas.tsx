import React from 'react';
import { ScreenConfig, TextConfig } from '../types';
import DeviceFrame from './DeviceFrame';
import { BackgroundRenderer } from './backgrounds';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface EditorCanvasProps {
  config: ScreenConfig;
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom?: number;
  pan?: { x: number; y: number };
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ config, canvasRef, zoom = 0.3, pan = { x: 0, y: 0 } }) => {
  const { background, text, devices } = config;

  const getAlignClass = (align: TextConfig['alignment']) => {
    switch (align) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      default: return 'text-center items-center';
    }
  };

  const isTextTop = text.position === 'top';

  // Calcular dimensiones escaladas para centrado
  const scaledWidth = CANVAS_WIDTH * zoom;
  const scaledHeight = CANVAS_HEIGHT * zoom;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="relative shadow-2xl overflow-hidden"
        ref={canvasRef}
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          // Compensar el tamaño visual para que flex center funcione
          margin: `${(scaledHeight - CANVAS_HEIGHT) / 2}px ${(scaledWidth - CANVAS_WIDTH) / 2}px`,
        }}
      >
        {/* Background Layer */}
        <BackgroundRenderer
          config={background}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />

        <div className={`absolute inset-0 w-full h-full flex flex-col p-20 ${isTextTop ? 'justify-start pt-32' : 'justify-end pb-32'}`}>
            
            {/* Text Area */}
            <div
              className={`relative z-20 flex flex-col pointer-events-none ${getAlignClass(text.alignment)}`}
              style={{
                order: isTextTop ? 0 : 2,
                marginTop: isTextTop ? '0' : 'auto',
                marginBottom: isTextTop ? 'auto' : '0',
                maxWidth: `${text.maxWidth || 100}%`,
              }}
            >
              <h1
                className="leading-tight mb-6 whitespace-pre-wrap"
                style={{
                  color: text.titleColor,
                  fontSize: `${text.titleSize || 80}px`,
                  fontFamily: text.fontFamily,
                  fontWeight: text.titleWeight || 700,
                  letterSpacing: `${text.letterSpacing || 0}px`,
                  lineHeight: text.lineHeight || 1.2,
                  textShadow: text.textShadow
                    ? `0 4px ${text.textShadowBlur || 12}px ${text.textShadowColor || 'rgba(0,0,0,0.15)'}`
                    : 'none',
                }}
              >
                {text.title}
              </h1>
              <h2
                className="leading-normal opacity-90 whitespace-pre-wrap"
                style={{
                  color: text.subtitleColor,
                  fontSize: `${text.subtitleSize || 48}px`,
                  fontFamily: text.fontFamily,
                  fontWeight: text.subtitleWeight || 500,
                  letterSpacing: `${text.letterSpacing || 0}px`,
                  lineHeight: text.lineHeight || 1.2,
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