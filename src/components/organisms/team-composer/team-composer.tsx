'use client';

import type React from 'react';
import { memo, useCallback, useState } from 'react';
import type { ComposeTeamInput } from '@/hooks/use-team-composition';
import { cn } from '@/lib/utils';

/** Capability options for team composition */
const CAPABILITY_OPTIONS = [
  { value: 'mcp', label: 'MCP', description: 'Model Context Protocol' },
  { value: 'a2a', label: 'A2A', description: 'Agent-to-Agent' },
  { value: 'x402', label: 'x402', description: 'Payment Protocol' },
] as const;

export interface TeamComposerProps {
  /** Callback when compose is triggered */
  onCompose: (input: ComposeTeamInput) => void;
  /** Whether composition is in progress */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * TeamComposer provides a form for composing an optimal agent team for a task.
 *
 * Includes a task description textarea, team size slider, capability checkboxes,
 * and a submit button. The form validates input before calling onCompose.
 *
 * @example
 * ```tsx
 * <TeamComposer
 *   onCompose={(input) => composeTeam(input)}
 *   isLoading={isPending}
 * />
 * ```
 */
export const TeamComposer = memo(function TeamComposer({
  onCompose,
  isLoading = false,
  className,
}: TeamComposerProps): React.JSX.Element {
  const [task, setTask] = useState('');
  const [maxTeamSize, setMaxTeamSize] = useState(5);
  const [capabilities, setCapabilities] = useState<string[]>([]);

  const handleCapabilityToggle = useCallback((capability: string) => {
    setCapabilities((prev) =>
      prev.includes(capability) ? prev.filter((c) => c !== capability) : [...prev, capability],
    );
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedTask = task.trim();
      if (!trimmedTask) return;

      const input: ComposeTeamInput = {
        task: trimmedTask,
        maxTeamSize,
      };

      if (capabilities.length > 0) {
        input.requiredCapabilities = capabilities;
      }

      onCompose(input);
    },
    [task, maxTeamSize, capabilities, onCompose],
  );

  const isValid = task.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      data-testid="team-composer"
    >
      {/* Task Description */}
      <div>
        <label
          htmlFor="task-description"
          className="block font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider text-[var(--pixel-gray-400)] mb-2"
        >
          Task Description
        </label>
        <textarea
          id="task-description"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Describe the task you want a team of agents to accomplish..."
          rows={4}
          maxLength={1000}
          disabled={isLoading}
          className={cn(
            'w-full px-3 py-2 resize-none',
            'bg-[var(--pixel-black)] border-2 border-[var(--pixel-gray-700)]',
            'font-mono text-sm text-[var(--pixel-gray-100)]',
            'placeholder:text-[var(--pixel-gray-500)]',
            'focus:border-[var(--pixel-blue-sky)] focus:outline-none focus:shadow-[0_0_8px_var(--glow-blue)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          data-testid="task-input"
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[0.625rem] text-[var(--pixel-gray-500)]">
            Describe what you want the team to accomplish
          </span>
          <span
            className={cn(
              'font-mono text-[0.625rem]',
              task.length > 900 ? 'text-[var(--pixel-gold-coin)]' : 'text-[var(--pixel-gray-500)]',
            )}
          >
            {task.length}/1000
          </span>
        </div>
      </div>

      {/* Team Size Slider */}
      <div>
        <label
          htmlFor="team-size"
          className="block font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider text-[var(--pixel-gray-400)] mb-2"
        >
          Max Team Size:{' '}
          <span className="text-[var(--pixel-blue-sky)]" data-testid="team-size-value">
            {maxTeamSize}
          </span>
        </label>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[var(--pixel-gray-500)]">2</span>
          <input
            id="team-size"
            type="range"
            min={2}
            max={10}
            value={maxTeamSize}
            onChange={(e) => setMaxTeamSize(Number(e.target.value))}
            disabled={isLoading}
            className={cn(
              'flex-1 h-2 appearance-none cursor-pointer',
              'bg-[var(--pixel-gray-700)] rounded-none',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
              '[&::-webkit-slider-thumb]:bg-[var(--pixel-blue-sky)]',
              '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--pixel-gray-100)]',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4',
              '[&::-moz-range-thumb]:bg-[var(--pixel-blue-sky)]',
              '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--pixel-gray-100)]',
              '[&::-moz-range-thumb]:cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            data-testid="team-size-slider"
          />
          <span className="font-mono text-xs text-[var(--pixel-gray-500)]">10</span>
        </div>
      </div>

      {/* Capabilities */}
      <div>
        <span className="block font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider text-[var(--pixel-gray-400)] mb-3">
          Required Capabilities (Optional)
        </span>
        <div className="flex flex-wrap gap-2" data-testid="capabilities-group">
          {CAPABILITY_OPTIONS.map((cap) => (
            <button
              key={cap.value}
              type="button"
              onClick={() => handleCapabilityToggle(cap.value)}
              disabled={isLoading}
              className={cn(
                'px-3 py-1.5 border-2 transition-all',
                'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
                capabilities.includes(cap.value)
                  ? [
                      'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
                      'bg-[var(--pixel-green-pipe)]/10',
                      'shadow-[0_0_8px_var(--glow-green)]',
                    ]
                  : [
                      'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)]',
                      'hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
                    ],
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              title={cap.description}
              data-testid={`capability-${cap.value}`}
            >
              {cap.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[0.625rem] text-[var(--pixel-gray-500)] mt-2">
          Filter agents by supported protocols
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={cn(
          'w-full py-3 border-2 transition-all',
          'font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider',
          isValid && !isLoading
            ? [
                'border-[var(--pixel-gold-coin)] text-[var(--pixel-gold-coin)]',
                'hover:bg-[var(--pixel-gold-coin)] hover:text-[var(--pixel-black)]',
                'hover:shadow-[0_0_16px_var(--glow-gold)]',
              ]
            : ['border-[var(--pixel-gray-600)] text-[var(--pixel-gray-500)]'],
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        data-testid="compose-button"
      >
        {isLoading ? 'Building Team...' : 'Build Team'}
      </button>
    </form>
  );
});
