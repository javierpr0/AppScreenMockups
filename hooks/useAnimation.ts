import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationConfig, AnimationKeyframe, DeviceConfig } from '../types';
import { ANIMATION_PRESETS } from '../constants';

interface AnimatedValues {
  x: number;
  y: number;
  rotation: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  opacity: number;
}

// Easing function (ease-in-out)
const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Interpolate between two values
const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

// Interpolate keyframes at a given time
const interpolateKeyframes = (
  keyframes: AnimationKeyframe[],
  currentTime: number,
  baseValues: AnimatedValues
): AnimatedValues => {
  if (keyframes.length === 0) return baseValues;

  // Find the two keyframes to interpolate between
  let startFrame = keyframes[0];
  let endFrame = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (currentTime >= keyframes[i].time && currentTime <= keyframes[i + 1].time) {
      startFrame = keyframes[i];
      endFrame = keyframes[i + 1];
      break;
    }
  }

  // Calculate progress between frames
  const frameProgress = endFrame.time === startFrame.time
    ? 1
    : (currentTime - startFrame.time) / (endFrame.time - startFrame.time);

  const easedProgress = easeInOutCubic(frameProgress);

  // Interpolate each property
  const result: AnimatedValues = { ...baseValues };

  const properties: (keyof AnimatedValues)[] = ['x', 'y', 'rotation', 'rotateX', 'rotateY', 'scale', 'opacity'];

  properties.forEach(prop => {
    const startVal = startFrame.properties[prop] ?? baseValues[prop];
    const endVal = endFrame.properties[prop] ?? baseValues[prop];
    result[prop] = lerp(startVal, endVal, easedProgress);
  });

  return result;
};

export interface UseAnimationReturn {
  animatedDevices: DeviceConfig[];
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  currentTime: number;
  isPlaying: boolean;
}

export const useAnimation = (
  devices: DeviceConfig[],
  animationConfig: AnimationConfig,
  onTimeUpdate?: (time: number) => void
): UseAnimationReturn => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const preset = ANIMATION_PRESETS.find(p => p.id === animationConfig.presetId);
  const duration = animationConfig.duration || preset?.duration || 2000;

  // Calculate animated device values
  const animatedDevices = devices.map(device => {
    if (!animationConfig.enabled || !preset) {
      return device;
    }

    const baseValues: AnimatedValues = {
      x: device.x,
      y: device.y,
      rotation: device.rotation,
      rotateX: device.rotateX,
      rotateY: device.rotateY,
      scale: device.scale,
      opacity: 1
    };

    const animated = interpolateKeyframes(preset.keyframes, currentTime, baseValues);

    return {
      ...device,
      x: animated.x,
      y: animated.y,
      rotation: animated.rotation,
      rotateX: animated.rotateX,
      rotateY: animated.rotateY,
      scale: animated.scale
    };
  });

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp - pausedTimeRef.current * duration;
    }

    const elapsed = timestamp - startTimeRef.current;
    let progress = elapsed / duration;

    if (animationConfig.loop) {
      progress = progress % 1;
    } else if (progress >= 1) {
      progress = 1;
      setIsPlaying(false);
    }

    setCurrentTime(progress);
    onTimeUpdate?.(progress);

    if (isPlaying && (animationConfig.loop || progress < 1)) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [duration, animationConfig.loop, isPlaying, onTimeUpdate]);

  // Start animation
  useEffect(() => {
    if (isPlaying && animationConfig.enabled && preset) {
      startTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animationConfig.enabled, preset, animate]);

  const play = useCallback(() => {
    if (!animationConfig.enabled || !preset) return;
    startTimeRef.current = 0;
    setIsPlaying(true);
  }, [animationConfig.enabled, preset]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    pausedTimeRef.current = currentTime;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [currentTime]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
    startTimeRef.current = 0;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const seek = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(1, time));
    setCurrentTime(clampedTime);
    pausedTimeRef.current = clampedTime;
    startTimeRef.current = 0;
  }, []);

  return {
    animatedDevices,
    play,
    pause,
    stop,
    seek,
    currentTime,
    isPlaying
  };
};

export default useAnimation;
