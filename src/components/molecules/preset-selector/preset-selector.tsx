import type React from 'react';
import { cn } from '@/lib/utils';
import { type FilterPreset, isBuiltInPreset } from '@/types/filter-preset';

export interface PresetSelectorProps {
  /** Available presets to display */
  presets: FilterPreset[];
  /** Currently selected preset ID */
  selectedPresetId?: string;
  /** Callback when a preset is selected */
  onSelect: (preset: FilterPreset) => void;
  /** Callback to save the current filters as a new preset */
  onSave?: () => void;
  /** Callback to delete a preset */
  onDelete?: (presetId: string) => void;
  /** Whether save button is enabled */
  canSave?: boolean;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * PresetSelector displays preset filter buttons with save/delete functionality.
 *
 * @example
 * ```tsx
 * <PresetSelector
 *   presets={presets}
 *   selectedPresetId={currentPresetId}
 *   onSelect={handlePresetSelect}
 *   onSave={handleSave}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function PresetSelector({
  presets,
  selectedPresetId,
  onSelect,
  onSave,
  onDelete,
  canSave = true,
  disabled = false,
  className,
}: PresetSelectorProps): React.JSX.Element {
  return (
    <div
      className={cn('space-y-2', className)}
      data-testid="preset-selector"
      data-disabled={disabled}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase',
            'text-[var(--pixel-gray-400)]',
          )}
          data-testid="preset-label"
        >
          Presets
        </span>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={disabled || !canSave}
            className={cn(
              'text-[0.5rem] font-[family-name:var(--font-pixel-body)] uppercase',
              'px-2 py-1 border border-[var(--pixel-gray-600)]',
              'transition-colors',
              canSave && !disabled
                ? 'text-[var(--pixel-blue-text)] hover:bg-[var(--pixel-gray-700)] cursor-pointer'
                : 'text-[var(--pixel-gray-600)] cursor-not-allowed',
            )}
            data-testid="save-preset-button"
            aria-label="Save current filters as preset"
          >
            + Save
          </button>
        )}
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2" data-testid="preset-list">
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          const isBuiltIn = isBuiltInPreset(preset.id);

          return (
            <div key={preset.id} className="relative group" data-testid={`preset-${preset.id}`}>
              <button
                type="button"
                onClick={() => onSelect(preset)}
                disabled={disabled}
                className={cn(
                  'px-3 py-1.5 text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase',
                  'border-2 transition-all',
                  isSelected
                    ? 'bg-[var(--pixel-blue-sky)] border-[var(--pixel-blue-sky)] text-[var(--pixel-black)]'
                    : 'bg-transparent border-[var(--pixel-gray-600)] text-[var(--pixel-gray-300)] hover:border-[var(--pixel-blue-sky)]',
                  disabled && 'opacity-50 cursor-not-allowed',
                  !disabled && 'cursor-pointer',
                )}
                aria-pressed={isSelected}
                aria-label={`Select ${preset.name} preset`}
                data-testid={`preset-button-${preset.id}`}
              >
                {preset.name}
              </button>

              {/* Delete button for custom presets */}
              {!isBuiltIn && onDelete && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(preset.id);
                  }}
                  className={cn(
                    'absolute -top-1 -right-1 w-4 h-4',
                    'flex items-center justify-center',
                    'bg-[var(--pixel-red-fire)] text-[var(--pixel-white)]',
                    'text-[0.5rem] opacity-0 group-hover:opacity-100',
                    'transition-opacity cursor-pointer',
                  )}
                  aria-label={`Delete ${preset.name} preset`}
                  data-testid={`delete-preset-${preset.id}`}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}

        {presets.length === 0 && (
          <span
            className="text-[0.625rem] text-[var(--pixel-gray-500)]"
            data-testid="no-presets-message"
          >
            No presets available
          </span>
        )}
      </div>
    </div>
  );
}
