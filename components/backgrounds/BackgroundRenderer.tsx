import React from 'react';
import { BackgroundConfig } from '../../types';
import MeshGradientBackground from './MeshGradientBackground';
import PatternBackground from './PatternBackground';
import ImageBackground from './ImageBackground';

interface BackgroundRendererProps {
  config: BackgroundConfig;
  width: number;
  height: number;
}

const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({ config, width, height }) => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  };

  switch (config.type) {
    case 'solid':
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: config.color1,
          }}
        />
      );

    case 'gradient':
      return (
        <div
          style={{
            ...baseStyle,
            background: `linear-gradient(${config.direction}, ${config.color1}, ${config.color2})`,
          }}
        />
      );

    case 'mesh':
      if (!config.mesh) return null;
      return (
        <MeshGradientBackground
          config={config.mesh}
          width={width}
          height={height}
        />
      );

    case 'pattern':
      if (!config.pattern) return null;
      return (
        <PatternBackground
          config={config.pattern}
          width={width}
          height={height}
        />
      );

    case 'image':
      if (!config.image) return null;
      return (
        <ImageBackground
          config={config.image}
          width={width}
          height={height}
        />
      );

    default:
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: config.color1,
          }}
        />
      );
  }
};

export default BackgroundRenderer;
