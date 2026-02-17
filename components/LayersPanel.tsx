import React, { useState, useRef } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { DeviceConfig, DeviceType } from '../types';
import { cn } from '@/lib/utils';

interface LayersPanelProps {
  devices: DeviceConfig[];
  selectedIndex: number;
  onSelectDevice: (index: number) => void;
  onUpdateDevices: (newDevices: DeviceConfig[]) => void;
  onDeleteDevice: (index: number) => void;
}

/** Short label for a device type */
const deviceLabel = (type: DeviceType): string => {
  const labels: Partial<Record<DeviceType, string>> = {
    [DeviceType.IPHONE_17_PRO]: 'i17 Pro',
    [DeviceType.IPHONE_17_PRO_MAX]: 'i17 Pro Max',
    [DeviceType.IPHONE_16_PRO]: 'i16 Pro',
    [DeviceType.IPHONE_16_PRO_MAX]: 'i16 Pro Max',
    [DeviceType.IPHONE_15_PRO]: 'i15 Pro',
    [DeviceType.IPHONE_15_PRO_MAX]: 'i15 Pro Max',
    [DeviceType.IPHONE_14_PRO]: 'i14 Pro',
    [DeviceType.IPHONE_SE]: 'SE',
    [DeviceType.IPAD_PRO_13]: 'iPad 13"',
    [DeviceType.IPAD_PRO_11]: 'iPad 11"',
    [DeviceType.SAMSUNG_S24_ULTRA]: 'S24 Ultra',
    [DeviceType.SAMSUNG_S24]: 'S24',
    [DeviceType.SAMSUNG_FOLD]: 'Z Fold',
    [DeviceType.SAMSUNG_S23]: 'S23',
    [DeviceType.PIXEL_9_PRO]: 'Pixel 9 Pro',
    [DeviceType.PIXEL_9]: 'Pixel 9',
    [DeviceType.PIXEL_8_PRO]: 'Pixel 8 Pro',
  };
  return labels[type] || type;
};

export const LayersPanel: React.FC<LayersPanelProps> = ({
  devices,
  selectedIndex,
  onSelectDevice,
  onUpdateDevices,
  onDeleteDevice,
}) => {
  // Drag state tracks the display-order indices (sorted by zIndex desc)
  const [dragFromDisplay, setDragFromDisplay] = useState<number | null>(null);
  const [dragOverDisplay, setDragOverDisplay] = useState<number | null>(null);
  const dragCounterRef = useRef(0);

  if (devices.length <= 1) return null;

  // Display order: highest zIndex first (top layer)
  const layerOrder = devices
    .map((device, index) => ({ device, index }))
    .sort((a, b) => b.device.zIndex - a.device.zIndex);

  const handleDragStart = (displayIndex: number, e: React.DragEvent) => {
    setDragFromDisplay(displayIndex);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image semi-transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    }
  };

  const handleDragEnd = () => {
    setDragFromDisplay(null);
    setDragOverDisplay(null);
    dragCounterRef.current = 0;
  };

  const handleDragEnter = (displayIndex: number) => {
    dragCounterRef.current++;
    setDragOverDisplay(displayIndex);
  };

  const handleDragLeave = () => {
    dragCounterRef.current--;
    if (dragCounterRef.current <= 0) {
      setDragOverDisplay(null);
      dragCounterRef.current = 0;
    }
  };

  const handleDrop = (targetDisplayIndex: number) => {
    if (dragFromDisplay === null || dragFromDisplay === targetDisplayIndex) {
      handleDragEnd();
      return;
    }

    const fromDeviceIndex = layerOrder[dragFromDisplay].index;
    const toDeviceIndex = layerOrder[targetDisplayIndex].index;

    // Swap zIndex values
    const newDevices = [...devices];
    const tempZ = newDevices[fromDeviceIndex].zIndex;
    newDevices[fromDeviceIndex] = { ...newDevices[fromDeviceIndex], zIndex: newDevices[toDeviceIndex].zIndex };
    newDevices[toDeviceIndex] = { ...newDevices[toDeviceIndex], zIndex: tempZ };

    onUpdateDevices(newDevices);

    // Keep selection following the dragged device
    if (selectedIndex === fromDeviceIndex) {
      onSelectDevice(fromDeviceIndex); // index doesn't change, only zIndex
    }

    handleDragEnd();
  };

  return (
    <div className="space-y-0.5">
      {layerOrder.map(({ device, index }, displayIndex) => {
        const isSelected = index === selectedIndex;
        const isDragging = dragFromDisplay === displayIndex;
        const isDragOver = dragOverDisplay === displayIndex && dragFromDisplay !== displayIndex;

        return (
          <div
            key={device.id}
            draggable
            onDragStart={(e) => handleDragStart(displayIndex, e)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => handleDragEnter(displayIndex)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(displayIndex);
            }}
            onClick={() => onSelectDevice(index)}
            className={cn(
              'group flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer',
              isSelected
                ? 'bg-indigo-600/20 border border-indigo-500/30'
                : 'hover:bg-zinc-800/50 border border-transparent',
              isDragging && 'opacity-40',
              isDragOver && 'border-indigo-400/60 bg-indigo-600/10'
            )}
          >
            {/* Drag handle */}
            <GripVertical className="w-3 h-3 text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing" />

            {/* Device info */}
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <span
                className={cn(
                  'truncate',
                  isSelected ? 'text-zinc-200 font-medium' : 'text-zinc-400'
                )}
              >
                {deviceLabel(device.type)}
              </span>
              {device.image && (
                <span className="text-[9px] text-indigo-400/60 shrink-0">IMG</span>
              )}
            </div>

            {/* Z-Index badge */}
            <span className="text-[9px] text-zinc-600 tabular-nums shrink-0">
              z{device.zIndex}
            </span>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteDevice(index);
              }}
              disabled={devices.length <= 1}
              className="p-0.5 text-zinc-600 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete device"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default LayersPanel;
