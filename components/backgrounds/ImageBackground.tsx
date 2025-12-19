import React from 'react';
import { BackgroundImageConfig } from '../../types';

interface ImageBackgroundProps {
  config: BackgroundImageConfig;
  width: number;
  height: number;
}

const ImageBackground: React.FC<ImageBackgroundProps> = ({ config, width, height }) => {
  const { src, blur, overlayColor, overlayOpacity, fit } = config;

  if (!src) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#4a4a6a', fontSize: '24px' }}>No image selected</span>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: fit,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          // Scale up slightly when blurred to avoid edge artifacts
          transform: blur > 0 ? 'scale(1.1)' : undefined,
        }}
      />

      {/* Color overlay */}
      {overlayOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}
    </div>
  );
};

export default ImageBackground;
