import React, { useMemo } from 'react';
import { MeshGradientConfig } from '../../types';

interface MeshGradientBackgroundProps {
  config: MeshGradientConfig;
  width: number;
  height: number;
}

const MeshGradientBackground: React.FC<MeshGradientBackgroundProps> = ({ config, width, height }) => {
  const filterId = useMemo(() => `mesh-blur-${Math.random().toString(36).substr(2, 9)}`, []);

  const { points, blur } = config;

  if (!points || points.length === 0) {
    return <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1e1e1e' }} />;
  }

  // Calculate circle radius based on canvas size
  const baseRadius = Math.min(width, height) * 0.35;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>

        {/* Base background from first point color */}
        <rect width={width} height={height} fill={points[0]?.color || '#000'} />

        {/* Render each mesh point as a blurred circle */}
        <g filter={`url(#${filterId})`}>
          {points.map((point, index) => {
            const cx = (point.x / 100) * width;
            const cy = (point.y / 100) * height;
            // Vary radius slightly for more organic feel
            const radius = baseRadius * (0.8 + (index % 3) * 0.2);

            return (
              <circle
                key={point.id}
                cx={cx}
                cy={cy}
                r={radius}
                fill={point.color}
                opacity={0.9}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default MeshGradientBackground;
