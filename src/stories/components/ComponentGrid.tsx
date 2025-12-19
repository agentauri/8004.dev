import type { ReactNode } from 'react';

interface ComponentCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * A card for showcasing a component in the gallery.
 */
export function ComponentCard({ title, description, children }: ComponentCardProps) {
  return (
    <div className="p-4 bg-[var(--pixel-gray-800)] rounded border border-[var(--pixel-gray-700)]">
      <h4 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-white)] mb-1">
        {title}
      </h4>
      <p className="text-xs text-[var(--pixel-gray-400)] mb-4">{description}</p>
      <div className="p-4 bg-[var(--pixel-black)] rounded border border-[var(--pixel-gray-600)]">
        {children}
      </div>
    </div>
  );
}

interface ComponentGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

/**
 * A responsive grid for component cards.
 */
export function ComponentGrid({ children, columns = 2 }: ComponentGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return <div className={`grid ${gridCols[columns]} gap-4`}>{children}</div>;
}
