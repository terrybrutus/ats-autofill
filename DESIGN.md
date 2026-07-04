# Design Brief — ATS Autofill

## Direction
Cool Serene preset. Deep ocean blue accent on calm cool off-white surfaces. Professional, minimal, trustworthy — a tool a job seeker opens, trusts, and leaves.

## Tone
Quiet confidence. No hype, no gradients shouting for attention. Generous whitespace, restrained color, one accent doing all the work.

## Differentiation
Most ATS tools feel like enterprise SaaS dashboards. ATS Autofill feels like a calm writing surface — the accent only appears where the user acts.

## Color Palette
| Token | Light (OKLCH) | Dark (OKLCH) | Usage |
|---|---|---|---|
| background | 0.985 0.004 220 | 0.18 0.014 240 | App canvas |
| foreground | 0.22 0.02 240 | 0.94 0.005 220 | Body text |
| card | 0.995 0.003 220 | 0.215 0.016 240 | Surfaces |
| primary/accent | 0.42 0.14 240 | 0.7 0.14 240 | CTA, focus, active |
| muted-foreground | 0.55 0.015 235 | 0.66 0.012 230 | Captions, counts |
| border | 0.9 0.01 230 | 0.32 0.018 235 | Hairlines |
| destructive | 0.55 0.22 25 | 0.65 0.19 22 | Errors |

## Typography
Display: Space Grotesk (headings, brand, button labels). Body: DM Sans (all running text, inputs). Mono: Space Grotesk fallback. Heading tracking -0.02em. Body 16px base.

## Elevation & Depth
Subtle only. `shadow-subtle` (two-layer, near-invisible). No drop shadows on cards by default — borders carry separation. Accent surfaces use fill, not shadow.

## Structural Zones
Header (brand left, subtitle right). Two-column desktop: left = Profile input (sticky), right = Question + Answer + Recent. Stacks single-column under `md`. Footer disclaimer full-width.

## Spacing & Rhythm
8px base grid. Section gaps 32px (desktop) / 24px (mobile). Card padding 24px. Input padding 12px 16px. Tight 6px radii on inputs/buttons, 8px on cards.

## Component Patterns
Textarea: full-width, hairline border, focus ring = primary. Button: primary fill, white label, 6px radius. Recent list: compact rows, hover bg-secondary. Copy button: ghost, icon + label.

## Motion
200–300ms ease-out for focus, hover, list row enter. No page transitions. No parallax. Respect `prefers-reduced-motion`.

## Constraints
No external AI in UI (doNotBuild). No multi-profile switcher. Single profile persisted in backend. Keep it under 2 mins to build — minimal components, no over-engineering.

## Signature Detail
The primary accent appears in exactly three places: the active Generate button, the focus ring on inputs, and the copy-success check. Nowhere else. Restraint is the brand.
