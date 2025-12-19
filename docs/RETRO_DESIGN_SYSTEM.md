# Agent Explorer - 80s Retro Pixel Art Design System

## Design Philosophy

Agent Explorer will stand out from modern corporate competitors (agent0search, 8004scan) with a **nostalgic 80s arcade aesthetic** inspired by NES/Sega pixel art games, while maintaining **enterprise-grade usability** for blockchain developers and users.

### Core Design Pillars
1. **Instantly Recognizable**: Bold retro aesthetic that creates immediate visual distinction
2. **Highly Functional**: Pixel art as enhancement, not hindrance to UX
3. **Accessibility First**: WCAG 2.1 AA compliant despite decorative elements
4. **Mobile Optimized**: Responsive pixel art that scales properly
5. **Performance Focused**: Lightweight CSS, no heavy images

---

## 1. Color Palette

### Primary Colors (NES/Sega Inspired)

```css
/* Main Brand Colors - Inspired by Super Mario Bros NES palette */
--pixel-blue-sky: #5C94FC;        /* Primary action color - Mario sky blue */
--pixel-red-fire: #FC5454;        /* Error/danger - Fire flower red */
--pixel-green-pipe: #00D800;      /* Success - Warp pipe green */
--pixel-gold-coin: #FCC03C;       /* Highlight/premium - Coin gold */

/* Secondary Accent Colors - Sonic the Hedgehog palette */
--pixel-sonic-blue: #0000FF;      /* Electric blue accents */
--pixel-sonic-yellow: #FFFF00;    /* Energy/active states */
--pixel-emerald: #00FF00;         /* Verified/trusted agents */

/* Dark Theme Base */
--pixel-black: #000000;           /* Pure black background */
--pixel-gray-dark: #1A1A1A;       /* Card backgrounds */
--pixel-gray-800: #2A2A2A;        /* Elevated surfaces */
--pixel-gray-700: #3A3A3A;        /* Borders (inactive) */
--pixel-gray-600: #4A4A4A;        /* Subtle borders */
--pixel-gray-400: #888888;        /* Disabled text */
--pixel-gray-200: #CCCCCC;        /* Secondary text */
--pixel-white: #FFFFFF;           /* Primary text */

/* CRT Glow Effects */
--glow-blue: rgba(92, 148, 252, 0.5);
--glow-green: rgba(0, 216, 0, 0.5);
--glow-gold: rgba(252, 192, 60, 0.5);
--glow-red: rgba(252, 84, 84, 0.5);
```

### Chain-Specific Colors

```css
/* Chain Identity Colors (retro-fied versions) */
--chain-sepolia: #FC5454;         /* Ethereum red */
--chain-base: #5C94FC;            /* Base blue */
--chain-polygon: #9C54FC;         /* Polygon purple */

/* Chain Glow Effects */
--chain-glow-sepolia: rgba(252, 84, 84, 0.4);
--chain-glow-base: rgba(92, 148, 252, 0.4);
--chain-glow-polygon: rgba(156, 84, 252, 0.4);
```

### Semantic Color System

```css
/* Status Colors */
--status-active: var(--pixel-green-pipe);
--status-inactive: var(--pixel-gray-400);
--status-verified: var(--pixel-emerald);
--status-warning: var(--pixel-gold-coin);
--status-error: var(--pixel-red-fire);

/* Trust Score Gradient (8-bit style) */
--trust-low: #FC5454;      /* Red (0-3) */
--trust-med: #FCC03C;      /* Gold (4-6) */
--trust-high: #00D800;     /* Green (7-10) */
```

### Usage Guidelines
- **Backgrounds**: Always use pure black or dark grays - creates authentic CRT feel
- **Text**: White for primary, light gray for secondary - maximum contrast
- **Accents**: Use bright saturated colors sparingly for maximum impact
- **Hover States**: Add glow effects instead of brightness changes
- **Shadows**: Use colored glows instead of traditional drop shadows

---

## 2. Typography

### Font Stack

```css
/* Heading Fonts - Pixel Art */
--font-pixel-display: 'Press Start 2P', 'VT323', monospace;    /* Display headings */
--font-pixel-body: 'Silkscreen', 'VT323', monospace;          /* Subheadings */

/* Body Fonts - Modern Readability */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font Sizes (8px base grid) */
--text-xs: 0.5rem;      /* 8px - Micro labels */
--text-sm: 0.75rem;     /* 12px - Small text */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.5rem;      /* 24px - Subheadings */
--text-xl: 2rem;        /* 32px - Headings */
--text-2xl: 3rem;       /* 48px - Hero text */

/* Line Heights */
--leading-tight: 1.2;   /* Pixel fonts */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.75; /* Long form */

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.05em;  /* Pixel fonts benefit from this */
```

### Font Pairing Strategy

**Display/Headers**: Press Start 2P
- Use for: Page titles, section headers, buttons
- Max 2 lines to avoid readability issues
- Add subtle text-shadow glow for CRT effect
- All caps for maximum impact

**Subheadings**: Silkscreen
- Use for: Card titles, badges, labels
- More readable than Press Start 2P for longer text
- Retains pixel aesthetic

**Body Text**: JetBrains Mono
- Use for: Descriptions, addresses, technical data
- Excellent readability for blockchain addresses
- Developer-friendly monospace
- Supports ligatures for code

**UI Elements**: Inter
- Use for: Form inputs, long paragraphs, documentation
- Modern, clean, accessible
- Variable font for performance

### Typography Rules

```css
/* Display Heading */
.heading-display {
  font-family: var(--font-pixel-display);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--pixel-white);
  text-shadow: 0 0 8px var(--glow-blue);
}

/* Section Heading */
.heading-section {
  font-family: var(--font-pixel-body);
  font-size: var(--text-xl);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-normal);
  color: var(--pixel-white);
}

/* Card Title */
.heading-card {
  font-family: var(--font-pixel-body);
  font-size: var(--text-lg);
  line-height: var(--leading-tight);
  color: var(--pixel-white);
}

/* Body Text */
.text-body {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--pixel-gray-200);
}

/* Label/Badge Text */
.text-label {
  font-family: var(--font-pixel-body);
  font-size: var(--text-sm);
  line-height: var(--leading-tight);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
```

### Accessibility Considerations
- **Minimum Size**: Never use Press Start 2P below 12px
- **Line Length**: Max 60 characters for pixel fonts
- **Contrast**: Always maintain 4.5:1 ratio minimum
- **Fallbacks**: Progressive enhancement with web-safe fallbacks

---

## 3. Component Style Guidelines

### Button System

#### Primary Button (Pixel Style)

```css
.btn-pixel-primary {
  /* Base Structure */
  padding: 12px 24px;
  font-family: var(--font-pixel-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  /* Pixel Border Effect */
  background: var(--pixel-blue-sky);
  border: none;
  position: relative;

  /* 8-bit box shadow (pixel border effect) */
  box-shadow:
    0 4px 0 0 #3A5FCC,          /* Bottom shadow (darker blue) */
    0 0 0 2px var(--pixel-black), /* Black outline */
    0 0 12px var(--glow-blue);   /* Outer glow */

  color: var(--pixel-white);
  cursor: pointer;
  transition: all 0.1s steps(2); /* Stepped animation for retro feel */
}

.btn-pixel-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 #3A5FCC,
    0 0 0 2px var(--pixel-black),
    0 0 20px var(--glow-blue);
}

.btn-pixel-primary:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 0 #3A5FCC,
    0 0 0 2px var(--pixel-black),
    0 0 8px var(--glow-blue);
}

/* Disabled State */
.btn-pixel-primary:disabled {
  background: var(--pixel-gray-600);
  color: var(--pixel-gray-400);
  box-shadow:
    0 4px 0 0 var(--pixel-gray-700),
    0 0 0 2px var(--pixel-black);
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button (Ghost Style)

```css
.btn-pixel-secondary {
  padding: 12px 24px;
  font-family: var(--font-pixel-body);
  font-size: var(--text-sm);
  text-transform: uppercase;

  background: transparent;
  border: 2px solid var(--pixel-blue-sky);
  color: var(--pixel-blue-sky);

  box-shadow:
    0 0 0 2px var(--pixel-black),
    inset 0 0 20px rgba(92, 148, 252, 0.1);

  transition: all 0.1s steps(2);
}

.btn-pixel-secondary:hover {
  background: rgba(92, 148, 252, 0.2);
  box-shadow:
    0 0 0 2px var(--pixel-black),
    0 0 12px var(--glow-blue),
    inset 0 0 30px rgba(92, 148, 252, 0.2);
}
```

#### Button Sizes

```css
.btn-xs { padding: 8px 16px; font-size: var(--text-xs); }
.btn-sm { padding: 10px 20px; font-size: var(--text-sm); }
.btn-md { padding: 12px 24px; font-size: var(--text-sm); }
.btn-lg { padding: 16px 32px; font-size: var(--text-base); }
```

### Card Components

#### Agent Card

```css
.card-pixel-agent {
  /* Base Structure */
  background: var(--pixel-gray-dark);
  padding: 16px;

  /* Pixel Border System */
  border: 2px solid var(--pixel-gray-700);
  position: relative;

  /* Corner Pixels (8-bit style corners) */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--pixel-blue-sky);
  }

  &::before {
    top: -2px;
    left: -2px;
    box-shadow:
      calc(100% + 2px) 0 0 var(--pixel-blue-sky),
      0 calc(100% + 2px) 0 var(--pixel-blue-sky),
      calc(100% + 2px) calc(100% + 2px) 0 var(--pixel-blue-sky);
  }

  /* Hover Effect */
  transition: all 0.2s steps(3);
}

.card-pixel-agent:hover {
  border-color: var(--pixel-blue-sky);
  box-shadow:
    0 0 20px var(--glow-blue),
    inset 0 0 40px rgba(92, 148, 252, 0.05);
  transform: translateY(-4px);
}

/* Active/Selected State */
.card-pixel-agent.active {
  border-color: var(--pixel-green-pipe);
  box-shadow:
    0 0 24px var(--glow-green),
    inset 0 0 40px rgba(0, 216, 0, 0.1);
}
```

#### Info Card (Stats/Details)

```css
.card-pixel-info {
  background: var(--pixel-gray-800);
  border: 2px solid var(--pixel-gray-600);
  padding: 12px;

  /* Scanline Effect (optional, subtle) */
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.1) 2px,
      rgba(0, 0, 0, 0.1) 4px
    );
}
```

### Badge System

#### Chain Badge

```css
.badge-chain {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  font-family: var(--font-pixel-body);
  font-size: var(--text-xs);
  text-transform: uppercase;
  padding: 4px 8px;

  border: 2px solid currentColor;
  background: rgba(0, 0, 0, 0.5);

  /* Chain-specific colors */
  &[data-chain="sepolia"] {
    color: var(--chain-sepolia);
    box-shadow: 0 0 8px var(--chain-glow-sepolia);
  }

  &[data-chain="base"] {
    color: var(--chain-base);
    box-shadow: 0 0 8px var(--chain-glow-base);
  }

  &[data-chain="polygon"] {
    color: var(--chain-polygon);
    box-shadow: 0 0 8px var(--chain-glow-polygon);
  }
}
```

#### Status Badge

```css
.badge-status {
  font-family: var(--font-pixel-body);
  font-size: var(--text-xs);
  padding: 2px 6px;

  &[data-status="active"] {
    color: var(--status-active);
    border: 1px solid var(--status-active);
    background: rgba(0, 216, 0, 0.1);
    box-shadow: 0 0 6px var(--glow-green);
  }

  &[data-status="inactive"] {
    color: var(--status-inactive);
    border: 1px solid var(--status-inactive);
    background: rgba(136, 136, 136, 0.1);
  }

  &[data-status="verified"] {
    color: var(--status-verified);
    border: 1px solid var(--status-verified);
    background: rgba(0, 255, 0, 0.1);
    animation: pulse-glow 2s infinite;
  }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 4px var(--glow-green); }
  50% { box-shadow: 0 0 12px var(--glow-green); }
}
```

#### Trust Score Badge

```css
.badge-trust-score {
  font-family: var(--font-pixel-body);
  font-size: var(--text-sm);
  font-weight: bold;
  padding: 4px 8px;
  border: 2px solid currentColor;

  /* Score-based coloring */
  &[data-score="low"] {
    color: var(--trust-low);
    background: rgba(252, 84, 84, 0.1);
    box-shadow: 0 0 8px var(--glow-red);
  }

  &[data-score="medium"] {
    color: var(--trust-med);
    background: rgba(252, 192, 60, 0.1);
    box-shadow: 0 0 8px var(--glow-gold);
  }

  &[data-score="high"] {
    color: var(--trust-high);
    background: rgba(0, 216, 0, 0.1);
    box-shadow: 0 0 8px var(--glow-green);
  }
}
```

### Input Fields

#### Search Input

```css
.input-pixel-search {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  padding: 12px 16px;

  background: var(--pixel-gray-dark);
  border: 2px solid var(--pixel-gray-700);
  color: var(--pixel-white);

  /* Pixel corner effect */
  clip-path: polygon(
    4px 0, calc(100% - 4px) 0,
    100% 4px, 100% calc(100% - 4px),
    calc(100% - 4px) 100%, 4px 100%,
    0 calc(100% - 4px), 0 4px
  );

  transition: all 0.2s;
}

.input-pixel-search:focus {
  outline: none;
  border-color: var(--pixel-blue-sky);
  box-shadow:
    0 0 0 2px var(--pixel-black),
    0 0 16px var(--glow-blue),
    inset 0 0 20px rgba(92, 148, 252, 0.1);
}

.input-pixel-search::placeholder {
  color: var(--pixel-gray-400);
  font-family: var(--font-pixel-body);
  font-size: var(--text-sm);
  text-transform: uppercase;
}
```

#### Select/Dropdown

```css
.select-pixel {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: 8px 12px;
  padding-right: 32px; /* Space for arrow */

  background: var(--pixel-gray-800);
  border: 2px solid var(--pixel-gray-600);
  color: var(--pixel-white);

  /* Custom arrow using pixel art pattern */
  background-image: url("data:image/svg+xml,..."); /* Pixel arrow SVG */
  background-position: right 8px center;
  background-repeat: no-repeat;

  appearance: none;
  cursor: pointer;
}

.select-pixel:hover {
  border-color: var(--pixel-blue-sky);
  box-shadow: 0 0 8px var(--glow-blue);
}
```

### shadcn/ui Component Adaptations

#### Making shadcn Components Retro

```css
/* Override shadcn card styles */
.retro-card {
  @apply bg-pixel-gray-dark border-2 border-pixel-gray-700;
  box-shadow: none; /* Remove default shadows */
}

.retro-card:hover {
  @apply border-pixel-blue-sky;
  box-shadow: 0 0 20px var(--glow-blue);
}

/* Override shadcn button styles */
.retro-button {
  @apply font-pixel-body text-sm uppercase tracking-wide;
  border-radius: 0; /* Remove rounded corners */
  box-shadow:
    0 4px 0 0 currentColor,
    0 0 0 2px var(--pixel-black);
}

/* Override shadcn dialog/modal */
.retro-dialog {
  @apply bg-pixel-gray-dark border-2 border-pixel-blue-sky;
  border-radius: 0;
  box-shadow: 0 0 40px var(--glow-blue);
}

/* Override shadcn tabs */
.retro-tabs-list {
  @apply bg-pixel-gray-800 border-2 border-pixel-gray-600;
  border-radius: 0;
}

.retro-tabs-trigger {
  @apply font-pixel-body text-xs uppercase;
  border-radius: 0;

  &[data-state="active"] {
    @apply bg-pixel-blue-sky text-white;
    box-shadow: 0 0 8px var(--glow-blue);
  }
}
```

---

## 4. Visual Elements

### Border System (Pixel Borders)

#### Standard Pixel Border

```css
/* Simple 2px solid border */
.border-pixel {
  border: 2px solid var(--pixel-gray-700);
}

/* Clipped corner effect (8-bit style) */
.border-pixel-clipped {
  clip-path: polygon(
    8px 0, calc(100% - 8px) 0,
    100% 8px, 100% calc(100% - 8px),
    calc(100% - 8px) 100%, 8px 100%,
    0 calc(100% - 8px), 0 8px
  );
}

/* Pixel corner markers (using pseudo-elements) */
.border-pixel-corners {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -4px;

    /* Draw corner pixels */
    background:
      linear-gradient(var(--pixel-blue-sky) 0 0) top left,
      linear-gradient(var(--pixel-blue-sky) 0 0) top right,
      linear-gradient(var(--pixel-blue-sky) 0 0) bottom left,
      linear-gradient(var(--pixel-blue-sky) 0 0) bottom right;
    background-size: 4px 4px;
    background-repeat: no-repeat;
  }
}
```

#### Animated Border (Loading/Active)

```css
.border-pixel-animated {
  border: 2px solid transparent;
  position: relative;
  background: var(--pixel-gray-dark);
  background-clip: padding-box;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      90deg,
      var(--pixel-blue-sky),
      var(--pixel-green-pipe),
      var(--pixel-gold-coin),
      var(--pixel-blue-sky)
    );
    background-size: 200% 100%;
    animation: border-flow 3s linear infinite;
    z-index: -1;
  }
}

@keyframes border-flow {
  to { background-position: -200% 0; }
}
```

### Shadow/Glow Effects (CRT-Style)

```css
/* Basic CRT glow */
.glow-blue {
  box-shadow: 0 0 20px var(--glow-blue);
}

.glow-green {
  box-shadow: 0 0 20px var(--glow-green);
}

.glow-gold {
  box-shadow: 0 0 20px var(--glow-gold);
}

/* Layered glow (more intense) */
.glow-intense {
  box-shadow:
    0 0 10px var(--glow-blue),
    0 0 20px var(--glow-blue),
    0 0 40px var(--glow-blue);
}

/* Text glow effect */
.text-glow {
  text-shadow:
    0 0 8px currentColor,
    0 0 16px currentColor;
}

/* Scanline overlay (subtle CRT effect) */
.scanlines {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.1) 2px,
      rgba(0, 0, 0, 0.1) 4px
    );
    pointer-events: none;
    z-index: 10;
  }
}

/* Optional: CRT curve effect (use sparingly) */
.crt-curve {
  transform: perspective(1000px) rotateX(0deg);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    pointer-events: none;
  }
}
```

### Iconography Approach

#### Icon Strategy
1. **Primary**: Use pixel art icons (8x8, 16x16, 24x24 grid)
2. **Fallback**: Use Lucide icons with pixelated filter
3. **Custom**: SVG icons designed on pixel grid

```css
/* Pixelate existing icons */
.icon-pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  filter: contrast(1.2);
}

/* Icon sizes (match 8px grid) */
.icon-xs { width: 8px; height: 8px; }
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }

/* Icon with glow */
.icon-glow {
  filter: drop-shadow(0 0 4px currentColor);
}
```

#### Custom Pixel Icons (SVG Examples)

```svg
<!-- Search Icon (16x16) -->
<svg width="16" height="16" viewBox="0 0 16 16">
  <path fill="currentColor" d="M6 2h4v2h-4zm-2 2h2v2h-2zm-2 2h2v2h-2zm8-2h2v2h-2zm2 2h2v2h-2zm0 2h2v2h-2zm2 2h2v2h-2z"/>
</svg>

<!-- Chain Link Icon (16x16) -->
<svg width="16" height="16" viewBox="0 0 16 16">
  <path fill="currentColor" d="M4 4h4v2h-4zm6 0h2v2h-2zm-6 2h2v2h-2zm8 0h2v2h-2zm-6 2h2v2h-2zm4 0h4v2h-4z"/>
</svg>

<!-- Star/Trust Icon (16x16) -->
<svg width="16" height="16" viewBox="0 0 16 16">
  <path fill="currentColor" d="M7 2h2v2h-2zm-2 2h6v2h-6zm-2 2h10v2h-10zm-2 2h14v2h-14zm2 2h10v2h-10zm2 2h6v2h-6z"/>
</svg>
```

### Background Patterns/Textures

```css
/* Subtle grid pattern (8px grid) */
.bg-pixel-grid {
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 8px 8px;
}

/* Dot matrix pattern */
.bg-pixel-dots {
  background-image: radial-gradient(
    circle at center,
    rgba(255,255,255,0.05) 1px,
    transparent 1px
  );
  background-size: 8px 8px;
}

/* Retro stripes (Sonic-style) */
.bg-pixel-stripes {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    rgba(92, 148, 252, 0.05) 8px,
    rgba(92, 148, 252, 0.05) 16px
  );
}

/* Animated star field (optional for headers) */
.bg-starfield {
  position: relative;
  background: var(--pixel-black);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 1px, transparent 1px),
      radial-gradient(circle at 60% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.9) 1px, transparent 1px);
    background-size: 200px 200px, 300px 300px, 250px 250px;
    animation: starfield 120s linear infinite;
  }
}

@keyframes starfield {
  from { background-position: 0 0, 0 0, 0 0; }
  to { background-position: -200px -200px, -300px -300px, -250px -250px; }
}
```

---

## 5. Animations & Micro-interactions

### Animation Principles
- **Stepped timing**: Use `steps()` for authentic 8-bit feel
- **Short duration**: Keep under 300ms for responsiveness
- **Purposeful**: Only animate to communicate state changes
- **Performance**: Use transform and opacity only

### Button Interactions

```css
/* Press effect */
@keyframes btn-press {
  0% { transform: translateY(0); }
  50% { transform: translateY(4px); }
  100% { transform: translateY(0); }
}

.btn-pixel:active {
  animation: btn-press 0.2s steps(2);
}

/* Glow pulse on hover */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px var(--glow-blue); }
  50% { box-shadow: 0 0 20px var(--glow-blue); }
}

.btn-pixel:hover {
  animation: glow-pulse 1s infinite;
}
```

### Loading States

```css
/* Pixel spinner (rotating square) */
@keyframes pixel-spin {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(0.8); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(0.8); }
  100% { transform: rotate(360deg) scale(1); }
}

.loading-pixel {
  width: 16px;
  height: 16px;
  background: var(--pixel-blue-sky);
  animation: pixel-spin 1s steps(4) infinite;
  box-shadow: 0 0 12px var(--glow-blue);
}

/* Retro loading bar */
.loading-bar {
  width: 200px;
  height: 16px;
  background: var(--pixel-gray-800);
  border: 2px solid var(--pixel-gray-600);
  position: relative;
  overflow: hidden;
}

.loading-bar::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 50%;
  background: repeating-linear-gradient(
    90deg,
    var(--pixel-blue-sky) 0,
    var(--pixel-blue-sky) 8px,
    var(--pixel-green-pipe) 8px,
    var(--pixel-green-pipe) 16px
  );
  animation: loading-bar-fill 2s steps(8) infinite;
  box-shadow: 0 0 12px var(--glow-blue);
}

@keyframes loading-bar-fill {
  0% { left: -50%; }
  100% { left: 100%; }
}

/* Blinking cursor (for search/input) */
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.cursor-blink {
  animation: blink 1s steps(2) infinite;
}
```

### Card Hover Effects

```css
/* Lift and glow */
.card-pixel:hover {
  transform: translateY(-4px);
  transition: transform 0.2s steps(2);
}

/* Scanline sweep effect */
@keyframes scanline-sweep {
  0% { top: -100%; }
  100% { top: 100%; }
}

.card-pixel:hover::before {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    transparent,
    rgba(92, 148, 252, 0.5),
    transparent
  );
  animation: scanline-sweep 1s linear;
}

/* Pixel glitch effect (subtle, on click) */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(2px, 2px); }
  100% { transform: translate(0); }
}

.card-pixel:active {
  animation: glitch 0.3s steps(5);
}
```

### Page Transitions

```css
/* Fade in from black (retro game style) */
@keyframes fade-in-game {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.page-enter {
  animation: fade-in-game 0.4s steps(4);
}

/* Slide in from right (like Mario entering pipe) */
@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.content-enter {
  animation: slide-in-right 0.5s steps(8);
}
```

### Badge Animations

```css
/* Trust score count-up animation */
@keyframes score-count {
  0% { content: '0'; }
  10% { content: '1'; }
  20% { content: '2'; }
  30% { content: '3'; }
  40% { content: '4'; }
  50% { content: '5'; }
  60% { content: '6'; }
  70% { content: '7'; }
  80% { content: '8'; }
  90% { content: '9'; }
  100% { content: '10'; }
}

/* Chain badge glow pulse */
@keyframes chain-pulse {
  0%, 100% {
    box-shadow: 0 0 4px currentColor;
  }
  50% {
    box-shadow: 0 0 12px currentColor;
  }
}

.badge-chain {
  animation: chain-pulse 2s infinite;
}
```

### Accessibility Considerations

```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .card-pixel:hover {
    transform: none;
  }

  .loading-pixel,
  .loading-bar::before {
    animation: none;
  }
}

/* Maintain focus indicators */
*:focus-visible {
  outline: 2px solid var(--pixel-blue-sky);
  outline-offset: 4px;
  box-shadow: 0 0 0 4px var(--pixel-black), 0 0 12px var(--glow-blue);
}
```

---

## 6. Usability Considerations

### Readability Optimization

```css
/* Text contrast enforcement */
.text-readable {
  /* Always maintain 4.5:1 minimum contrast */
  color: var(--pixel-white); /* #FFFFFF on #000000 = 21:1 */

  /* Add subtle text shadow for better legibility */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* Secondary text */
.text-secondary {
  color: var(--pixel-gray-200); /* #CCCCCC on #000000 = 12.6:1 */
}

/* Disabled text */
.text-disabled {
  color: var(--pixel-gray-400); /* #888888 on #000000 = 5.9:1 */
}
```

### Font Size Hierarchy for Readability

```css
/* Never go below these minimums */
--min-body: 16px;      /* Body text minimum */
--min-label: 12px;     /* Label/badge minimum */
--min-heading: 18px;   /* Heading minimum */

/* Mobile adjustments */
@media (max-width: 768px) {
  --min-body: 14px;
  --min-label: 11px;
}
```

### Accessibility Checklist

1. **Color Contrast**
   - All text: minimum 4.5:1 ratio
   - Large text (18px+): minimum 3:1 ratio
   - Interactive elements: 3:1 ratio for borders/icons

2. **Keyboard Navigation**
   - All interactive elements focusable
   - Clear focus indicators (2px outline + glow)
   - Logical tab order

3. **Screen Reader Support**
   - Semantic HTML always
   - ARIA labels for icon-only buttons
   - Live regions for dynamic updates

4. **Motion Sensitivity**
   - Respect `prefers-reduced-motion`
   - Provide static alternatives to animations
   - No auto-playing animations over 5 seconds

### Pixel Font Accessibility

```css
/* Strategy: Use pixel fonts for display, readable fonts for content */

/* Headings: Pixel fonts OK (large, short) */
h1, h2, h3 {
  font-family: var(--font-pixel-body);
  font-size: clamp(18px, 4vw, 32px);
}

/* Body text: NEVER use pixel fonts */
p, li, td, span {
  font-family: var(--font-mono); /* JetBrains Mono */
  font-size: clamp(14px, 2vw, 16px);
}

/* Labels/badges: Pixel fonts OK if 11px+ */
.label, .badge {
  font-family: var(--font-pixel-body);
  font-size: max(11px, 0.75rem);
}

/* Addresses/technical text: Monospace only */
.address, .hash, .code {
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: -0.02em; /* Tighter for addresses */
}
```

### Mobile Responsiveness with Retro Style

```css
/* Mobile-first responsive approach */

/* Base (Mobile) */
.container-pixel {
  padding: 16px;
  max-width: 100%;
}

.card-pixel {
  padding: 12px;
}

.btn-pixel {
  padding: 10px 16px;
  font-size: 12px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container-pixel {
    padding: 24px;
    max-width: 768px;
    margin: 0 auto;
  }

  .card-pixel {
    padding: 16px;
  }

  .btn-pixel {
    padding: 12px 24px;
    font-size: 14px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container-pixel {
    padding: 32px;
    max-width: 1200px;
  }

  .card-pixel {
    padding: 20px;
  }
}

/* Touch target sizes (mobile) */
@media (max-width: 768px) {
  /* Minimum 44x44px touch targets */
  .btn-pixel,
  .badge-chain,
  .input-pixel {
    min-height: 44px;
    min-width: 44px;
  }

  /* Increase spacing for touch */
  .btn-pixel + .btn-pixel {
    margin-left: 12px;
  }

  /* Larger icons on mobile */
  .icon {
    width: 24px;
    height: 24px;
  }
}
```

### Responsive Grid System (8px base)

```css
/* 8px grid system for perfect pixel alignment */
.grid-pixel {
  display: grid;
  gap: 16px; /* 2 units */
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .grid-pixel {
    grid-template-columns: 1fr;
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .grid-pixel {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px; /* 3 units */
  }
}

/* Desktop: 3-4 columns */
@media (min-width: 1024px) {
  .grid-pixel {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 32px; /* 4 units */
  }
}
```

### Balance Novelty vs Function

**Design Rules:**
1. **80/20 Rule**: 80% usability, 20% retro flair
2. **Critical paths**: Keep search, filters, navigation ultra-clear
3. **Details**: Add retro touches to non-critical elements (badges, decorations)
4. **Progressive enhancement**: Start functional, layer in retro style

```css
/* Example: Search bar priorities */
.search-bar {
  /* FUNCTION FIRST */
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--pixel-gray-dark);

  /* RETRO ENHANCEMENT */
  border: 2px solid var(--pixel-blue-sky);
  box-shadow: 0 0 20px var(--glow-blue);
}

.search-input {
  /* FUNCTION FIRST */
  flex: 1;
  font-size: 16px; /* Readable size */
  padding: 12px;

  /* RETRO ENHANCEMENT */
  font-family: var(--font-mono); /* Retro but readable */
  border: 2px solid var(--pixel-gray-700);
}
```

---

## 7. CSS Implementation (Tailwind CSS v4)

### Custom Theme Configuration

```css
/* app/globals.css or styles/theme.css */

@layer theme {
  /* Color Palette */
  :root {
    /* Primary Colors */
    --pixel-blue-sky: #5C94FC;
    --pixel-red-fire: #FC5454;
    --pixel-green-pipe: #00D800;
    --pixel-gold-coin: #FCC03C;

    /* Accent Colors */
    --pixel-sonic-blue: #0000FF;
    --pixel-sonic-yellow: #FFFF00;
    --pixel-emerald: #00FF00;

    /* Dark Theme Base */
    --pixel-black: #000000;
    --pixel-gray-dark: #1A1A1A;
    --pixel-gray-800: #2A2A2A;
    --pixel-gray-700: #3A3A3A;
    --pixel-gray-600: #4A4A4A;
    --pixel-gray-400: #888888;
    --pixel-gray-200: #CCCCCC;
    --pixel-white: #FFFFFF;

    /* Glow Effects */
    --glow-blue: rgba(92, 148, 252, 0.5);
    --glow-green: rgba(0, 216, 0, 0.5);
    --glow-gold: rgba(252, 192, 60, 0.5);
    --glow-red: rgba(252, 84, 84, 0.5);

    /* Chain Colors */
    --chain-sepolia: #FC5454;
    --chain-base: #5C94FC;
    --chain-polygon: #9C54FC;

    /* Typography */
    --font-pixel-display: 'Press Start 2P', 'VT323', monospace;
    --font-pixel-body: 'Silkscreen', 'VT323', monospace;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

    /* Spacing (8px grid) */
    --space-1: 8px;
    --space-2: 16px;
    --space-3: 24px;
    --space-4: 32px;
    --space-5: 40px;
    --space-6: 48px;
  }
}

@layer base {
  /* Global Base Styles */
  body {
    background-color: var(--pixel-black);
    color: var(--pixel-white);
    font-family: var(--font-mono);
    font-size: 16px;
    line-height: 1.5;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-pixel-body);
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }

  /* Remove default focus outline, add custom */
  *:focus {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid var(--pixel-blue-sky);
    outline-offset: 4px;
    box-shadow: 0 0 0 4px var(--pixel-black), 0 0 12px var(--glow-blue);
  }
}

@layer utilities {
  /* Custom Utility Classes */

  /* Text Utilities */
  .text-pixel-display {
    font-family: var(--font-pixel-display);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .text-pixel-body {
    font-family: var(--font-pixel-body);
  }

  .text-mono {
    font-family: var(--font-mono);
  }

  .text-glow {
    text-shadow: 0 0 8px currentColor, 0 0 16px currentColor;
  }

  /* Border Utilities */
  .border-pixel {
    border: 2px solid var(--pixel-gray-700);
  }

  .border-pixel-blue {
    border: 2px solid var(--pixel-blue-sky);
  }

  .border-pixel-green {
    border: 2px solid var(--pixel-green-pipe);
  }

  .border-pixel-clipped {
    clip-path: polygon(
      8px 0, calc(100% - 8px) 0,
      100% 8px, 100% calc(100% - 8px),
      calc(100% - 8px) 100%, 8px 100%,
      0 calc(100% - 8px), 0 8px
    );
  }

  /* Glow Utilities */
  .glow-blue {
    box-shadow: 0 0 20px var(--glow-blue);
  }

  .glow-green {
    box-shadow: 0 0 20px var(--glow-green);
  }

  .glow-gold {
    box-shadow: 0 0 20px var(--glow-gold);
  }

  .glow-intense {
    box-shadow:
      0 0 10px var(--glow-blue),
      0 0 20px var(--glow-blue),
      0 0 40px var(--glow-blue);
  }

  /* Background Utilities */
  .bg-pixel-grid {
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 8px 8px;
  }

  .bg-pixel-dots {
    background-image: radial-gradient(
      circle at center,
      rgba(255,255,255,0.05) 1px,
      transparent 1px
    );
    background-size: 8px 8px;
  }

  .scanlines {
    position: relative;
  }

  .scanlines::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.1) 2px,
      rgba(0, 0, 0, 0.1) 4px
    );
    pointer-events: none;
    z-index: 10;
  }

  /* Icon Utilities */
  .icon-pixelated {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }

  /* Animation Utilities */
  .transition-pixel {
    transition: all 0.1s steps(2);
  }

  .transition-smooth {
    transition: all 0.2s ease-out;
  }
}

@layer components {
  /* Pre-built Component Classes */

  /* Buttons */
  .btn-pixel-primary {
    padding: 12px 24px;
    font-family: var(--font-pixel-body);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: var(--pixel-blue-sky);
    border: none;
    color: var(--pixel-white);
    cursor: pointer;
    box-shadow:
      0 4px 0 0 #3A5FCC,
      0 0 0 2px var(--pixel-black),
      0 0 12px var(--glow-blue);
    transition: all 0.1s steps(2);
  }

  .btn-pixel-primary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 0 0 #3A5FCC,
      0 0 0 2px var(--pixel-black),
      0 0 20px var(--glow-blue);
  }

  .btn-pixel-primary:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 0 #3A5FCC,
      0 0 0 2px var(--pixel-black),
      0 0 8px var(--glow-blue);
  }

  .btn-pixel-primary:disabled {
    background: var(--pixel-gray-600);
    color: var(--pixel-gray-400);
    box-shadow:
      0 4px 0 0 var(--pixel-gray-700),
      0 0 0 2px var(--pixel-black);
    cursor: not-allowed;
    transform: none;
  }

  .btn-pixel-secondary {
    padding: 12px 24px;
    font-family: var(--font-pixel-body);
    font-size: 0.75rem;
    text-transform: uppercase;
    background: transparent;
    border: 2px solid var(--pixel-blue-sky);
    color: var(--pixel-blue-sky);
    box-shadow:
      0 0 0 2px var(--pixel-black),
      inset 0 0 20px rgba(92, 148, 252, 0.1);
    transition: all 0.1s steps(2);
    cursor: pointer;
  }

  .btn-pixel-secondary:hover {
    background: rgba(92, 148, 252, 0.2);
    box-shadow:
      0 0 0 2px var(--pixel-black),
      0 0 12px var(--glow-blue),
      inset 0 0 30px rgba(92, 148, 252, 0.2);
  }

  /* Cards */
  .card-pixel {
    background: var(--pixel-gray-dark);
    padding: 16px;
    border: 2px solid var(--pixel-gray-700);
    transition: all 0.2s steps(3);
  }

  .card-pixel:hover {
    border-color: var(--pixel-blue-sky);
    box-shadow:
      0 0 20px var(--glow-blue),
      inset 0 0 40px rgba(92, 148, 252, 0.05);
    transform: translateY(-4px);
  }

  /* Badges */
  .badge-pixel {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-pixel-body);
    font-size: 0.625rem;
    text-transform: uppercase;
    padding: 4px 8px;
    border: 2px solid currentColor;
    background: rgba(0, 0, 0, 0.5);
  }

  /* Inputs */
  .input-pixel {
    font-family: var(--font-mono);
    font-size: 1rem;
    padding: 12px 16px;
    background: var(--pixel-gray-dark);
    border: 2px solid var(--pixel-gray-700);
    color: var(--pixel-white);
    width: 100%;
    transition: all 0.2s;
  }

  .input-pixel:focus {
    outline: none;
    border-color: var(--pixel-blue-sky);
    box-shadow:
      0 0 0 2px var(--pixel-black),
      0 0 16px var(--glow-blue),
      inset 0 0 20px rgba(92, 148, 252, 0.1);
  }

  .input-pixel::placeholder {
    color: var(--pixel-gray-400);
    font-family: var(--font-pixel-body);
    font-size: 0.75rem;
    text-transform: uppercase;
  }
}

/* Responsive Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Tailwind Config (v4 Approach)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pixel: {
          'blue-sky': 'var(--pixel-blue-sky)',
          'red-fire': 'var(--pixel-red-fire)',
          'green-pipe': 'var(--pixel-green-pipe)',
          'gold-coin': 'var(--pixel-gold-coin)',
          'sonic-blue': 'var(--pixel-sonic-blue)',
          'sonic-yellow': 'var(--pixel-sonic-yellow)',
          'emerald': 'var(--pixel-emerald)',
          'black': 'var(--pixel-black)',
          'gray-dark': 'var(--pixel-gray-dark)',
          'gray-800': 'var(--pixel-gray-800)',
          'gray-700': 'var(--pixel-gray-700)',
          'gray-600': 'var(--pixel-gray-600)',
          'gray-400': 'var(--pixel-gray-400)',
          'gray-200': 'var(--pixel-gray-200)',
          'white': 'var(--pixel-white)',
        },
        chain: {
          'sepolia': 'var(--chain-sepolia)',
          'base': 'var(--chain-base)',
          'polygon': 'var(--chain-polygon)',
        },
      },
      fontFamily: {
        'pixel-display': ['var(--font-pixel-display)'],
        'pixel-body': ['var(--font-pixel-body)'],
        'mono': ['var(--font-mono)'],
        'sans': ['var(--font-sans)'],
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px var(--glow-blue)',
        'glow-green': '0 0 20px var(--glow-green)',
        'glow-gold': '0 0 20px var(--glow-gold)',
        'glow-red': '0 0 20px var(--glow-red)',
        'glow-intense': '0 0 10px var(--glow-blue), 0 0 20px var(--glow-blue), 0 0 40px var(--glow-blue)',
        'pixel-btn': '0 4px 0 0 currentColor, 0 0 0 2px var(--pixel-black)',
      },
      transitionTimingFunction: {
        'pixel': 'steps(2)',
        'pixel-smooth': 'steps(4)',
      },
      animation: {
        'pixel-spin': 'pixel-spin 1s steps(4) infinite',
        'glow-pulse': 'glow-pulse 2s infinite',
        'border-flow': 'border-flow 3s linear infinite',
        'scanline-sweep': 'scanline-sweep 1s linear',
      },
      keyframes: {
        'pixel-spin': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(90deg) scale(0.8)' },
          '50%': { transform: 'rotate(180deg) scale(1)' },
          '75%': { transform: 'rotate(270deg) scale(0.8)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px var(--glow-blue)' },
          '50%': { boxShadow: '0 0 20px var(--glow-blue)' },
        },
        'border-flow': {
          'to': { backgroundPosition: '-200% 0' },
        },
        'scanline-sweep': {
          '0%': { top: '-100%' },
          '100%': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Font Loading (Next.js App Router)

```typescript
// app/layout.tsx
import { Press_Start_2P } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel-display',
  display: 'swap',
});

const silkscreen = localFont({
  src: '../fonts/slkscr.ttf',
  variable: '--font-pixel-body',
  display: 'swap',
});

const jetBrainsMono = localFont({
  src: '../fonts/JetBrainsMono-Regular.woff2',
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${silkscreen.variable} ${jetBrainsMono.variable}`}>
      <body className="bg-pixel-black text-pixel-white font-mono">
        {children}
      </body>
    </html>
  );
}
```

### Component Example (Agent Card)

```typescript
// components/organisms/agent-card/agent-card.tsx
import { cn } from '@/lib/utils';

interface AgentCardProps {
  name: string;
  chainId: number;
  trustScore: number;
  isActive: boolean;
  isVerified: boolean;
  className?: string;
  onClick?: () => void;
}

export function AgentCard({
  name,
  chainId,
  trustScore,
  isActive,
  isVerified,
  className,
  onClick,
}: AgentCardProps) {
  const getChainName = (id: number) => {
    const chains: Record<number, string> = {
      11155111: 'sepolia',
      84532: 'base',
      80002: 'polygon',
    };
    return chains[id] || 'unknown';
  };

  const getTrustLevel = (score: number) => {
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  return (
    <div
      className={cn(
        'card-pixel group cursor-pointer',
        'hover:border-pixel-blue-sky hover:shadow-glow-blue',
        'transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-pixel-body text-lg text-pixel-white truncate">
          {name}
        </h3>

        {/* Status Badges */}
        <div className="flex gap-2">
          {isActive && (
            <span
              className="badge-pixel text-pixel-green-pipe border-pixel-green-pipe shadow-glow-green"
              data-status="active"
            >
              ACTIVE
            </span>
          )}
          {isVerified && (
            <span
              className="badge-pixel text-pixel-emerald border-pixel-emerald animate-glow-pulse"
              data-status="verified"
            >
              ✓
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        {/* Chain Badge */}
        <div className="flex items-center gap-2">
          <span className="text-pixel-gray-400 font-pixel-body text-xs">CHAIN:</span>
          <span
            className="badge-pixel"
            data-chain={getChainName(chainId)}
          >
            {getChainName(chainId).toUpperCase()}
          </span>
        </div>

        {/* Trust Score */}
        <div className="flex items-center gap-2">
          <span className="text-pixel-gray-400 font-pixel-body text-xs">TRUST:</span>
          <span
            className="badge-pixel font-bold"
            data-score={getTrustLevel(trustScore)}
          >
            {trustScore}/10
          </span>
        </div>
      </div>

      {/* Footer - View Details */}
      <div className="mt-4 pt-4 border-t-2 border-pixel-gray-700 group-hover:border-pixel-blue-sky transition-colors">
        <span className="font-pixel-body text-xs text-pixel-blue-sky group-hover:text-glow">
          VIEW DETAILS →
        </span>
      </div>
    </div>
  );
}
```

---

## Implementation Checklist

### Phase 1: Foundation ✅
- [x] Install and configure pixel fonts (Press Start 2P, Silkscreen, JetBrains Mono)
- [x] Set up CSS custom properties for color palette
- [x] Configure Tailwind with custom theme
- [x] Create base utility classes
- [x] Test font rendering and readability across devices

### Phase 2: Core Components ✅
- [x] Build button system (primary, secondary, variants)
- [x] Create card components (agent card, info card)
- [x] Implement badge system (chain, status, trust score)
- [x] Build input components (search, select, text)
- [x] Add focus states and accessibility features

### Phase 3: Visual Effects ✅
- [x] Implement glow effects (CSS shadows)
- [x] Add pixel borders and corners
- [x] Create loading animations (spinner, progress bar)
- [x] Add hover/active state transitions
- [x] Implement scanline overlays (optional)

### Phase 4: Responsive & Polish ✅
- [x] Test and refine mobile layouts
- [x] Ensure touch targets are 44x44px minimum
- [x] Add reduced motion alternatives
- [x] Verify WCAG 2.1 AA compliance
- [x] Performance audit (Core Web Vitals)
- [x] Cross-browser testing

### Phase 5: Documentation ✅
- [x] Create Storybook stories for all components
- [x] Document color usage guidelines
- [x] Write typography best practices
- [x] Create component composition examples
- [ ] Build design system showcase page (optional)

---

## Success Metrics

### Visual Impact
- [ ] Users immediately recognize the retro aesthetic
- [ ] Design is distinctly different from competitors
- [ ] Brand recall increases (survey after 1 month)

### Usability
- [ ] Task completion rate ≥ 95% (search and find agent)
- [ ] Time to complete search ≤ 30 seconds
- [ ] Accessibility score (Lighthouse) ≥ 95
- [ ] Mobile usability score ≥ 90

### Performance
- [ ] First Contentful Paint < 800ms
- [ ] Time to Interactive < 1.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Lighthouse Performance ≥ 90

### Technical
- [ ] 100% test coverage maintained
- [ ] All components have Storybook documentation
- [ ] Zero accessibility violations (axe DevTools)
- [ ] Bundle size < 100KB (gzipped)

---

## Resources

### Fonts
- **Press Start 2P**: [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P)
- **Silkscreen**: [Google Fonts](https://fonts.google.com/specimen/Silkscreen) or [DL here](https://www.dafont.com/silkscreen.font)
- **JetBrains Mono**: [Official Site](https://www.jetbrains.com/lp/mono/)
- **VT323** (fallback): [Google Fonts](https://fonts.google.com/specimen/VT323)

### Inspiration & References
- NES Color Palette: [lospec.com/palette-list/nintendo-entertainment-system](https://lospec.com/palette-list/nintendo-entertainment-system)
- Sega Genesis Palette: [lospec.com/palette-list/sega-genesis](https://lospec.com/palette-list/sega-genesis)
- 8-bit UI Kit: [Kenney.nl](https://kenney.nl/assets/ui-pack)
- Pixel Art Icon Pack: [game-icons.net](https://game-icons.net/)

### Tools
- **Pixel Art Editor**: [Aseprite](https://www.aseprite.org/), [Piskel](https://www.piskelapp.com/)
- **Color Contrast Checker**: [WebAIM](https://webaim.org/resources/contrastchecker/)
- **Accessibility Testing**: [axe DevTools](https://www.deque.com/axe/devtools/)
- **Performance Testing**: [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Community
- r/PixelArt - For pixel art inspiration
- r/webdev - For implementation feedback
- Dribbble "retro ui" tag - Design inspiration

---

## Conclusion

This design system creates a **bold, nostalgic aesthetic** that will make Agent Explorer instantly recognizable while maintaining **enterprise-grade usability**. The key is balance: use retro elements for delight and brand identity, but never compromise on core functionality, readability, or accessibility.

The system is designed to:
1. **Stand out** from modern, corporate competitors
2. **Remain functional** for serious blockchain developers
3. **Scale easily** with new components and features
4. **Perform well** across all devices and connections
5. **Meet accessibility** standards (WCAG 2.1 AA)

Start with the foundation (colors, typography, core components), then layer in visual effects progressively. Test frequently with real users to ensure the retro aesthetic enhances rather than hinders the experience.

**Remember**: We're building a discovery platform first, a retro experience second. Every design decision should serve the user's goal of finding and exploring AI agents efficiently.
