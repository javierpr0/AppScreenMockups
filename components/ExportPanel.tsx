import React from 'react';
import { Download, Package, Loader2, Check } from 'lucide-react';
import { ExportConfig } from '../types';
import { EXPORT_SIZES } from '../constants';
import { ExportProgress } from '../services/exportService';

interface ExportPanelProps {
  exportConfig: ExportConfig;
  onExportConfigChange: (config: ExportConfig) => void;
  onExportSingle: () => void;
  onExportMultiple: () => void;
  isExporting: boolean;
  exportProgress: ExportProgress | null;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  exportConfig,
  onExportConfigChange,
  onExportSingle,
  onExportMultiple,
  isExporting,
  exportProgress,
}) => {

  const toggleSize = (sizeId: string) => {
    const newSelected = exportConfig.selectedSizes.includes(sizeId)
      ? exportConfig.selectedSizes.filter(id => id !== sizeId)
      : [...exportConfig.selectedSizes, sizeId];
    onExportConfigChange({ ...exportConfig, selectedSizes: newSelected });
  };

  const selectAllPlatform = (platform: 'ios' | 'android') => {
    const platformSizes = EXPORT_SIZES.filter(s => s.platform === platform).map(s => s.id);
    const otherSizes = exportConfig.selectedSizes.filter(
      id => !EXPORT_SIZES.find(s => s.id === id && s.platform === platform)
    );
    onExportConfigChange({
      ...exportConfig,
      selectedSizes: [...otherSizes, ...platformSizes]
    });
  };

  const iosSizes = EXPORT_SIZES.filter(s => s.platform === 'ios');
  const androidSizes = EXPORT_SIZES.filter(s => s.platform === 'android');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* iOS Sizes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-blue-400">iOS / App Store</label>
          <button
            onClick={() => selectAllPlatform('ios')}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            Select All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {iosSizes.map(size => (
            <label
              key={size.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                exportConfig.selectedSizes.includes(size.id)
                  ? 'bg-blue-500/10 border-blue-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={exportConfig.selectedSizes.includes(size.id)}
                onChange={() => toggleSize(size.id)}
                className="accent-blue-500 w-4 h-4"
              />
              <div className="flex-1">
                <div className="text-sm text-white">{size.name}</div>
                <div className="text-xs text-slate-500">{size.width} x {size.height}</div>
              </div>
              {exportConfig.selectedSizes.includes(size.id) && (
                <Check size={16} className="text-blue-400" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Android Sizes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-green-400">Android / Google Play</label>
          <button
            onClick={() => selectAllPlatform('android')}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            Select All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {androidSizes.map(size => (
            <label
              key={size.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                exportConfig.selectedSizes.includes(size.id)
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={exportConfig.selectedSizes.includes(size.id)}
                onChange={() => toggleSize(size.id)}
                className="accent-green-500 w-4 h-4"
              />
              <div className="flex-1">
                <div className="text-sm text-white">{size.name}</div>
                <div className="text-xs text-slate-500">{size.width} x {size.height}</div>
              </div>
              {exportConfig.selectedSizes.includes(size.id) && (
                <Check size={16} className="text-green-400" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Format Options */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Format</label>
        <div className="flex gap-3">
          {(['png', 'jpg'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onExportConfigChange({ ...exportConfig, format: fmt })}
              className={`flex-1 py-2 rounded-lg border text-sm uppercase transition-all ${
                exportConfig.format === fmt
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {exportConfig.format === 'jpg' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Quality</span>
              <span>{Math.round(exportConfig.quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1"
              step="0.05"
              value={exportConfig.quality}
              onChange={(e) => onExportConfigChange({
                ...exportConfig,
                quality: parseFloat(e.target.value)
              })}
              className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Export Progress */}
      {exportProgress && (
        <div className="bg-indigo-500/10 border border-indigo-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 size={16} className="animate-spin text-indigo-400" />
            <span className="text-sm text-white">
              Exporting {exportProgress.currentSize}...
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {exportProgress.current} / {exportProgress.total}
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        {exportConfig.selectedSizes.length > 1 ? (
          <button
            onClick={onExportMultiple}
            disabled={isExporting || exportConfig.selectedSizes.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-4 py-3 rounded-xl font-medium transition-all"
          >
            {isExporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Package size={18} />
            )}
            Export ZIP ({exportConfig.selectedSizes.length} sizes)
          </button>
        ) : (
          <button
            onClick={onExportSingle}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white px-4 py-3 rounded-xl font-medium transition-all"
          >
            <Download size={18} />
            Export Single PNG
          </button>
        )}

        <p className="text-xs text-slate-500 text-center">
          {exportConfig.selectedSizes.length > 1
            ? 'All sizes will be exported as a ZIP file'
            : 'Select multiple sizes to export as ZIP'}
        </p>
      </div>
    </div>
  );
};

export default ExportPanel;
