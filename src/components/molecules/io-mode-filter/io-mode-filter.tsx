'use client';

import { AudioLines, Code, FileText, Image, Layers } from 'lucide-react';
import type React from 'react';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

/** Supported input/output modes for agent filtering */
export type IOMode = 'text' | 'json' | 'image' | 'audio' | 'multimodal';

export interface IOModeFilterProps {
  /** Available input modes to display */
  inputModes?: IOMode[];
  /** Available output modes to display */
  outputModes?: IOMode[];
  /** Currently selected input modes */
  selectedInput?: IOMode[];
  /** Currently selected output modes */
  selectedOutput?: IOMode[];
  /** Callback when selection changes */
  onChange?: (input: IOMode[], output: IOMode[]) => void;
  /** Whether the filter is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Mode configuration with icons and labels */
const MODE_CONFIG: Record<IOMode, { icon: React.ElementType; label: string }> = {
  text: { icon: FileText, label: 'Text' },
  json: { icon: Code, label: 'JSON' },
  image: { icon: Image, label: 'Image' },
  audio: { icon: AudioLines, label: 'Audio' },
  multimodal: { icon: Layers, label: 'Multi' },
} as const;

const DEFAULT_MODES: IOMode[] = ['text', 'json', 'image', 'audio', 'multimodal'];

/**
 * IOModeFilter provides filtering controls for agent input/output modes.
 * Allows users to filter agents by their supported input and output formats.
 *
 * @example
 * ```tsx
 * <IOModeFilter
 *   selectedInput={['text', 'json']}
 *   selectedOutput={['json']}
 *   onChange={(input, output) => console.log(input, output)}
 * />
 * ```
 */
export function IOModeFilter({
  inputModes = DEFAULT_MODES,
  outputModes = DEFAULT_MODES,
  selectedInput = [],
  selectedOutput = [],
  onChange,
  disabled = false,
  className,
}: IOModeFilterProps): React.JSX.Element {
  const handleInputToggle = useCallback(
    (mode: IOMode) => {
      if (disabled) return;
      const newInput = selectedInput.includes(mode)
        ? selectedInput.filter((m) => m !== mode)
        : [...selectedInput, mode];
      onChange?.(newInput, selectedOutput);
    },
    [disabled, selectedInput, selectedOutput, onChange],
  );

  const handleOutputToggle = useCallback(
    (mode: IOMode) => {
      if (disabled) return;
      const newOutput = selectedOutput.includes(mode)
        ? selectedOutput.filter((m) => m !== mode)
        : [...selectedOutput, mode];
      onChange?.(selectedInput, newOutput);
    },
    [disabled, selectedInput, selectedOutput, onChange],
  );

  const renderModeButton = (
    mode: IOMode,
    isSelected: boolean,
    onToggle: () => void,
    testIdPrefix: string,
  ) => {
    const config = MODE_CONFIG[mode];
    const Icon = config.icon;

    return (
      <button
        key={mode}
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase',
          'border transition-all duration-150',
          isSelected
            ? 'bg-[var(--pixel-blue-sky)] border-[var(--pixel-blue-sky)] text-white shadow-[0_0_8px_var(--glow-blue)]'
            : 'bg-transparent border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        aria-pressed={isSelected}
        data-testid={`${testIdPrefix}-${mode}`}
      >
        <Icon size={12} aria-hidden="true" />
        <span>{config.label}</span>
      </button>
    );
  };

  return (
    <div className={cn('space-y-4', className)} data-testid="io-mode-filter">
      {/* Input Modes */}
      <div className="space-y-2">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Input Modes
        </span>
        <div className="flex flex-wrap gap-2" data-testid="input-modes-group">
          {inputModes.map((mode) =>
            renderModeButton(
              mode,
              selectedInput.includes(mode),
              () => handleInputToggle(mode),
              'input-mode',
            ),
          )}
        </div>
      </div>

      {/* Output Modes */}
      <div className="space-y-2">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Output Modes
        </span>
        <div className="flex flex-wrap gap-2" data-testid="output-modes-group">
          {outputModes.map((mode) =>
            renderModeButton(
              mode,
              selectedOutput.includes(mode),
              () => handleOutputToggle(mode),
              'output-mode',
            ),
          )}
        </div>
      </div>
    </div>
  );
}
