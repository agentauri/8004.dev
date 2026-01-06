# Accessibility Guidelines

Agent Explorer is committed to WCAG 2.1 Level AA compliance. This document outlines our accessibility standards and testing procedures.

## Compliance Target

- **WCAG 2.1 Level AA** - Our primary compliance target
- **Section 508** - U.S. federal accessibility requirements
- **EN 301 549** - European accessibility standard

## Testing Strategy

### Automated Testing

We use [axe-core](https://www.deque.com/axe/) via Playwright for automated accessibility testing:

```bash
# Run accessibility tests
pnpm test:a11y

# Run full accessibility audit
pnpm test:e2e e2e/accessibility-full.spec.ts
```

### Manual Testing

Automated tests catch ~30% of accessibility issues. Manual testing is required for:

1. **Screen Reader Testing**
   - Test with VoiceOver (macOS)
   - Test with NVDA (Windows)
   - Verify content order and announcements

2. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify focus visibility
   - Test modal focus trapping

3. **Color Contrast**
   - Use browser devtools or Contrast Checker
   - Test in light/dark modes (when available)

## Standards Checklist

### Perceivable

| Requirement | Status | Notes |
|------------|--------|-------|
| Text alternatives for images | ✅ | All images have alt text |
| Captions/transcripts for media | N/A | No media content |
| Content adaptable | ✅ | Responsive design |
| Distinguishable content | ✅ | 4.5:1 contrast ratio |

### Operable

| Requirement | Status | Notes |
|------------|--------|-------|
| Keyboard accessible | ✅ | All interactions via keyboard |
| Enough time | ✅ | No time limits |
| No seizure triggers | ✅ | No flashing content |
| Navigable | ✅ | Skip links, landmarks |
| Input modalities | ✅ | Touch targets 24px+ |

### Understandable

| Requirement | Status | Notes |
|------------|--------|-------|
| Readable | ✅ | lang attribute set |
| Predictable | ✅ | Consistent navigation |
| Input assistance | ✅ | Error identification |

### Robust

| Requirement | Status | Notes |
|------------|--------|-------|
| Compatible | ✅ | Valid HTML, ARIA |

## Component Guidelines

### Buttons

```tsx
// Good - Accessible button
<button type="button" aria-label="Close modal">
  <X size={20} />
</button>

// Bad - Missing accessible name
<button type="button">
  <X size={20} />
</button>
```

### Form Inputs

```tsx
// Good - Label associated with input
<label htmlFor="search-input" className="sr-only">
  Search agents
</label>
<input
  id="search-input"
  type="search"
  aria-describedby="search-hint"
/>
<span id="search-hint" className="text-sm text-gray-500">
  Search by name or description
</span>

// Bad - No label
<input type="search" placeholder="Search..." />
```

### Images

```tsx
// Good - Descriptive alt text
<img src="/agent-avatar.png" alt="Agent avatar for TradingBot" />

// Good - Decorative image
<img src="/decoration.png" alt="" role="presentation" />

// Bad - Missing or unhelpful alt
<img src="/icon.png" alt="icon" />
```

### Modals

```tsx
// Good - Accessible modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Settings</h2>
  {/* Focus trap implemented */}
</div>
```

### Links

```tsx
// Good - Descriptive link text
<a href="/agent/123">View TradingBot details</a>

// Bad - Ambiguous link text
<a href="/agent/123">Click here</a>
```

## Color Palette Contrast

Our design system maintains WCAG AA contrast ratios:

| Text Color | Background | Ratio | Status |
|------------|------------|-------|--------|
| `--pixel-white` (#FFFFFF) | `--pixel-black` (#000000) | 21:1 | ✅ AAA |
| `--pixel-white` (#FFFFFF) | `--pixel-gray-800` (#2A2A2A) | 12.6:1 | ✅ AAA |
| `--pixel-blue-sky` (#5C94FC) | `--pixel-black` (#000000) | 6.3:1 | ✅ AA |
| `--pixel-gold-coin` (#FCC03C) | `--pixel-black` (#000000) | 11.1:1 | ✅ AAA |

## Keyboard Shortcuts

Press `?` to view all keyboard shortcuts. Shortcuts are disabled when:
- Focus is in an input field
- A modal is open (except Escape to close)

## Screen Reader Support

The application uses ARIA landmarks for easy navigation:

- `<header>` - Site header with navigation
- `<main>` - Primary content area
- `<footer>` - Site footer with links
- `<nav>` - Navigation sections

## Testing Tools

1. **axe DevTools** - Browser extension for manual testing
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Chrome DevTools accessibility audit
4. **VoiceOver** - macOS built-in screen reader
5. **NVDA** - Free Windows screen reader

## Reporting Issues

If you encounter accessibility issues:

1. Open an issue on GitHub
2. Include:
   - Page URL
   - Browser and assistive technology used
   - Steps to reproduce
   - Expected behavior
   - Actual behavior

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Deque University](https://dequeuniversity.com/)
- [A11y Project](https://www.a11yproject.com/)
