import React, { useMemo } from 'react';
import { PatternConfig, PatternType } from '../../types';

interface PatternBackgroundProps {
  config: PatternConfig;
  width: number;
  height: number;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({ config, width, height }) => {
  const patternId = useMemo(() => `pattern-${Math.random().toString(36).substr(2, 9)}`, []);

  const { type, color, backgroundColor, size, spacing, opacity } = config;

  const getPatternContent = (patternType: PatternType) => {
    const patternSize = size + spacing;

    switch (patternType) {
      case 'dots':
        return {
          width: patternSize,
          height: patternSize,
          content: (
            <circle
              cx={patternSize / 2}
              cy={patternSize / 2}
              r={size / 2}
              fill={color}
            />
          ),
        };

      case 'grid':
        return {
          width: patternSize,
          height: patternSize,
          content: (
            <>
              <line
                x1={0}
                y1={0}
                x2={patternSize}
                y2={0}
                stroke={color}
                strokeWidth={1}
              />
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={patternSize}
                stroke={color}
                strokeWidth={1}
              />
            </>
          ),
        };

      case 'lines':
        return {
          width: patternSize,
          height: patternSize,
          content: (
            <line
              x1={0}
              y1={patternSize}
              x2={patternSize}
              y2={patternSize}
              stroke={color}
              strokeWidth={size / 4}
            />
          ),
        };

      case 'diagonal':
        return {
          width: patternSize,
          height: patternSize,
          content: (
            <line
              x1={0}
              y1={patternSize}
              x2={patternSize}
              y2={0}
              stroke={color}
              strokeWidth={size / 4}
            />
          ),
        };

      case 'waves':
        const waveHeight = size / 2;
        return {
          width: patternSize * 2,
          height: patternSize,
          content: (
            <path
              d={`M 0 ${patternSize / 2}
                  Q ${patternSize / 2} ${patternSize / 2 - waveHeight} ${patternSize} ${patternSize / 2}
                  Q ${patternSize * 1.5} ${patternSize / 2 + waveHeight} ${patternSize * 2} ${patternSize / 2}`}
              fill="none"
              stroke={color}
              strokeWidth={size / 4}
            />
          ),
        };

      default:
        return {
          width: patternSize,
          height: patternSize,
          content: <circle cx={patternSize / 2} cy={patternSize / 2} r={size / 2} fill={color} />,
        };
    }
  };

  const pattern = getPatternContent(type);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Background color */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: backgroundColor,
        }}
      />

      {/* Pattern overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity }}
      >
        <defs>
          <pattern
            id={patternId}
            width={pattern.width}
            height={pattern.height}
            patternUnits="userSpaceOnUse"
          >
            {pattern.content}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

export default PatternBackground;
