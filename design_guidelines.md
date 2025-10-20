# City Safety Radar — Mumbai: Design Guidelines

## Design Approach

**Selected Approach**: Custom Dark Dashboard with Radar/Tech Aesthetic

The user has specified a "city-tech radar aesthetic" with dark mode and neon accents. This is a data-heavy utility dashboard requiring high information density while maintaining visual impact through strategic use of color and glass-morphism effects.

---

## Core Design Elements

### A. Color Palette

**Dark Mode Foundation** (Primary):
- Background Base: 220 15% 8% (deep navy-black)
- Surface Cards: 220 15% 12% (slightly elevated)
- Elevated Elements: 220 15% 16% (floating cards)
- Borders/Dividers: 220 10% 25% (subtle separation)

**Neon Safety Indicators**:
- Unsafe Zone (Red): 0 85% 60% (bright neon red)
- Moderate Zone (Yellow): 45 95% 55% (vibrant amber)
- Safe Zone (Green): 142 75% 50% (electric green)

**Accent Colors**:
- Primary CTA: 200 95% 55% (cyan neon - for route planning, primary actions)
- Alert Warning: 25 95% 60% (neon orange - for live alerts)
- Data Visualization: 270 85% 65% (electric purple - for charts/graphs)

**Text Hierarchy**:
- Primary Text: 0 0% 95% (near-white)
- Secondary Text: 220 10% 65% (muted gray)
- Tertiary/Labels: 220 8% 45% (subtle gray)

### B. Typography

**Font System**:
- Primary Font: 'Inter' (Google Fonts) - clean, modern, excellent readability for data
- Monospace Font: 'JetBrains Mono' (Google Fonts) - for scores, coordinates, technical data

**Type Scale**:
- Hero/Section Headers: text-4xl font-bold (2.25rem)
- Card Headers: text-xl font-semibold (1.25rem)
- Body Text: text-base (1rem)
- Data Labels: text-sm font-medium (0.875rem)
- Metrics/Scores: text-2xl font-mono (1.5rem)
- Micro-text: text-xs (0.75rem)

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 to p-6
- Card spacing: gap-4 to gap-6
- Section margins: my-6 to my-8
- Icon-to-text spacing: gap-2

**Grid Structure**:
- Main Layout: 70% map view / 30% sidebar (desktop)
- Mobile: Full-width stacked (map top, controls bottom)
- Cards: max-w-sm to max-w-md for floating elements

### D. Component Library

**Navigation**:
- Top bar with app logo/title (left), safety legend (center), user reports button (right)
- Height: h-16
- Background: Backdrop blur with glass effect (bg-gray-900/80 backdrop-blur-md)
- Border bottom: Subtle neon glow (border-b border-cyan-500/30)

**Map Container**:
- Full viewport height minus navigation (h-[calc(100vh-4rem)])
- Heatmap overlay with opacity-based color intensity
- Region polygons with glow effects on hover
- Interactive markers with pulsing animation for active incidents

**Floating Cards** (Route Planner, Alerts Panel):
- Glass-morphism: bg-gray-900/90 backdrop-blur-lg
- Border: border border-gray-700/50
- Shadow: Neon glow (shadow-lg shadow-cyan-500/10)
- Border radius: rounded-xl
- Padding: p-6
- Positioned: absolute with z-index layering

**Safety Score Display**:
- Large circular progress indicators
- Neon ring color based on score (red/yellow/green)
- Monospace font for numerical score
- Micro-indicators below (lighting, crowd, incidents icons with values)

**Alert Cards**:
- Compact horizontal layout
- Icon (left) + Message (center) + Timestamp (right)
- Border-left accent based on severity (border-l-4 border-orange-500)
- Background: bg-gray-800/60
- Padding: p-4
- Gap between cards: gap-3

**Input Fields** (Route Planner):
- Dark background: bg-gray-800
- Border: border-gray-600 focus:border-cyan-500
- Text: text-white
- Placeholder: text-gray-400
- Padding: px-4 py-3
- Autocomplete dropdown: Same glass-morphism as cards

**Buttons**:
- Primary CTA: bg-cyan-500 hover:bg-cyan-400 with subtle glow effect
- Secondary: bg-gray-700 hover:bg-gray-600
- Danger/Report: bg-red-500 hover:bg-red-400
- Text: font-medium
- Padding: px-6 py-3
- Rounded: rounded-lg

**Legend Component**:
- Horizontal bar in top navigation
- Three color blocks with labels
- Icons: Circle indicators with corresponding safety colors
- Text: text-xs uppercase tracking-wider

**Live Alerts Panel** (Sidebar):
- Scrollable container (max-h-96 overflow-y-auto)
- Auto-refresh indicator (pulsing dot)
- Timestamp in text-xs text-gray-400
- Grouped by severity (critical first)

**User Report Form**:
- Modal overlay: bg-black/70 backdrop-blur-sm
- Form card: Glass-morphism style
- Input fields for location, description, category
- Image upload placeholder (optional)
- Submit button: Neon cyan with glow

**Privacy Banner**:
- Bottom-fixed or top notification
- bg-gray-800/95 backdrop-blur
- Icon + Text + Dismiss button
- Border: border-t border-cyan-500/30
- Padding: p-4
- Text: text-sm

### E. Special Effects

**Neon Glow Effects**:
- Apply to high-priority elements (CTAs, unsafe zones, active routes)
- Implementation: box-shadow with color/20 to color/40 opacity
- Pulse animation for real-time alerts (animate-pulse on icon)

**Glass Morphism**:
- All floating cards and overlays
- backdrop-blur-lg with bg-opacity between 80-95%
- Subtle border-gray-700/50

**Radar Scan Animation**:
- Subtle rotating gradient overlay on map (simulates scanning)
- Low opacity (10-15%)
- Slow rotation (20s duration)
- Applied to map container

**Data Transitions**:
- Score updates: Smooth counter animation
- Heatmap regions: Color fade transitions (transition-colors duration-500)
- Route drawing: Animated path reveal

---

## Images

**No hero image required** - this is a utility dashboard, not a marketing page.

**Map Background**: Full-screen interactive Mapbox/Leaflet map of Mumbai

**Optional Iconography**:
- Safety score icons: Shield, Eye, Alert Triangle
- Facility icons: Police station, Hospital, Street light
- Weather icons: Cloud, Rain, Sun (for context)
- Use Heroicons or Lucide React via CDN

---

## Layout Structure

**Desktop Layout**:
```
┌─────────────────────────────────────┐
│ Navigation Bar (Logo | Legend | CTA)│
├──────────────────────┬──────────────┤
│                      │              │
│                      │  Floating    │
│    Interactive       │  Sidebar:    │
│    Mumbai Map        │  • Alerts    │
│    (Heatmap Overlay) │  • Reports   │
│                      │              │
│  [Route Planner      │              │
│   Floating Card]     │              │
│                      │              │
└──────────────────────┴──────────────┘
```

**Mobile Layout**:
- Full-width map (60vh)
- Bottom sheet for controls (slide-up)
- Floating route planner button
- Hamburger menu for sidebar content

---

## Key Principles

1. **Information Density**: Pack data efficiently without clutter - use hierarchical sizing and color to guide attention
2. **Real-time Clarity**: Visual indicators (pulsing dots, color changes) for live updates
3. **Safety-First Color Coding**: Consistent red/yellow/green throughout all components
4. **Tactile Interaction**: Hover states with glow intensification, click feedback with subtle scale
5. **Dark Immersion**: Minimize eye strain with true dark backgrounds, not dark gray
6. **Data Accessibility**: High contrast for scores and critical information (WCAG AAA where possible)