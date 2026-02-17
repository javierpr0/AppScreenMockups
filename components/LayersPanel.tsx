import React from 'react';
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
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
  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= devices.length) return;

    const newDevices = [...devices];
    // Swap zIndex values between the two devices
    const tempZ = newDevices[index].zIndex;
    newDevices[index] = { ...newDevices[index], zIndex: newDevices[targetIndex].zIndex };
    newDevices[targetIndex] = { ...newDevices[targetIndex], zIndex: tempZ };

    onUpdateDevices(newDevices);

    // Keep selection following the moved device
    if (selectedIndex === index) {
      onSelectDevice(targetIndex);
    } else if (selectedIndex === targetIndex) {
      onSelectDevice(index);
    }
  };

  if (devices.length <= 1) return null;

  // Display order: highest zIndex first (top layer)
  const layerOrder = devices
    .map((device, index) => ({ device, index }))
    .sort((a, b) => b.device.zIndex - a.device.zIndex);

  return (
    <div className="space-y-1">
      {layerOrder.map(({ device, index }) => {
        const isSelected = index === selectedIndex;

        return (
          <div
            key={device.id}
            onClick={() => onSelectDevice(index)}
            className={cn(
              'group flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer',
              isSelected
                ? 'bg-indigo-600/20 border border-indigo-500/30'
                : 'hover:bg-zinc-800/50 border border-transparent'
            )}
          >
            {/* Drag hint */}
            <GripVertical className="w-3 h-3 text-zinc-600 shrink-0" />

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

            {/* Reorder buttons */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayer(index, 'up');
                }}
                disabled={index <= 0}
                className="p-0.5 text-zinc-600 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed"
                title="Move up (higher z-index)"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayer(index, 'down');
                }}
                disabled={index >= devices.length - 1}
                className="p-0.5 text-zinc-600 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed"
                title="Move down (lower z-index)"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

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
