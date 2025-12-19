import type { MouseEventHandler, ReactNode, TouchEventHandler } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onTouchStart?: TouchEventHandler<HTMLAnchorElement>;
}

function Link({
  href,
  children,
  className,
  target,
  rel,
  onClick,
  onMouseEnter,
  onTouchStart,
}: LinkProps) {
  return (
    <a
      href={typeof href === 'string' ? href : '#'}
      className={className}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
    >
      {children}
    </a>
  );
}

export default Link;
