# Web Builder

A visual drag-and-drop web page builder built from scratch with **Vue 3 + TypeScript + Pinia**. Inspired by [GrapesJS](https://grapesjs.com/).

## Features

- **Drag & Drop** — Drag blocks from the left panel onto the canvas
- **In-place Text Editing** — Click to select, click again to edit text directly on canvas
- **Style Panel** — Edit layout, spacing, typography, background, border, and effects
- **Traits Panel** — Edit HTML attributes (src, href, alt, etc.) and CSS classes
- **Layer Tree** — Navigate and manage the component hierarchy
- **Undo / Redo** — Full history with Ctrl+Z / Ctrl+Y
- **Device Preview** — Switch between Desktop, Tablet, and Mobile views
- **Export HTML** — Download a clean standalone HTML file
- **Save / Load JSON** — Save your work as JSON and reload it later
- **Preview** — Open the page in a new browser tab

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
cd web-builder
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## How to Use

### Adding Components

1. Browse blocks in the **Blocks** tab on the left panel
2. Drag any block onto the white canvas area
3. Drop onto a **Section**, **Container**, or **Column** to nest inside it

### Editing Text

1. **Single click** a text component (Heading, Text, Button, Link) — selects it (blue outline)
2. **Click again** — enters edit mode (orange outline), type freely
3. **Click outside** or press **Esc** — exits edit mode and saves

### Editing Styles

1. Click a component to select it
2. Open the **Style** tab on the right panel
3. Expand any sector (Layout, Spacing, Typography, etc.) and change values

### Editing Attributes

1. Click a component to select it
2. Open the **Traits** tab on the right panel
3. Edit attributes like `src` for images, `href` for links, `placeholder` for inputs

> **Tip for images:** Paste a **direct image URL** (ending in `.jpg`, `.png`, `.svg`, etc.) into the Source field. Right-click any image on the web → "Copy Image Address" to get a direct URL.

### Layer Tree

- Switch to the **Layers** tab on the left panel to see the component tree
- Click a layer row to select that component
- Click the **✕** button to delete a component

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Click` | Select component |
| `Click` (on selected text) | Enter edit mode |
| `Esc` | Exit edit mode |
| `Delete` / `Backspace` | Delete selected component |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+D` | Duplicate selected component |

---

## Available Blocks

### Layout
| Block | Description |
|---|---|
| Section | Full-width padded container |
| Container | Centered max-width wrapper |
| 2 Columns | Flexbox two-column row |
| 3 Columns | Flexbox three-column row |

### Basic
| Block | Description |
|---|---|
| Heading | `<h1>` heading text |
| Text | `<p>` paragraph text |
| Button | Styled `<button>` |
| Image | `<img>` with placeholder |
| Link | `<a>` anchor element |
| Divider | `<hr>` horizontal rule |

### Media
| Block | Description |
|---|---|
| Video | `<video>` with controls |

### Forms
| Block | Description |
|---|---|
| Input | Text input field |

---

## Project Structure

```
web-builder/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.ts                          # App entry point
    ├── App.vue                          # Root component
    ├── types/
    │   └── index.ts                     # TypeScript interfaces
    ├── stores/
    │   └── editor.ts                    # Pinia store (all editor state)
    ├── utils/
    │   ├── idGenerator.ts               # Unique ID generation
    │   └── htmlExporter.ts              # Export tree to HTML string
    ├── blocks/
    │   ├── defaultBlocks.ts             # Built-in block definitions
    │   └── styleSectors.ts              # Style panel sector config
    └── components/
        ├── EditorLayout.vue             # Main 3-panel layout
        ├── toolbar/
        │   └── Toolbar.vue              # Top bar (undo, save, export, preview)
        ├── canvas/
        │   ├── Canvas.vue               # Editing surface + drop zone
        │   └── ComponentNode.vue        # Recursive component renderer
        └── panels/
            ├── BlockPanel.vue           # Left: draggable block palette
            ├── LayerPanel.vue           # Left: layer tree
            ├── LayerNode.vue            # Recursive layer tree node
            ├── StylePanel.vue           # Right: CSS style editor
            └── TraitPanel.vue           # Right: HTML attributes editor
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) | UI framework (Composition API) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Vite](https://vitejs.dev/) | Build tool & dev server |

---

## Extending the Builder

### Add a New Block

Add an entry to `src/blocks/defaultBlocks.ts`:

```typescript
{
  id: 'my-block',
  label: 'My Block',
  category: 'Basic',
  icon: '★',
  template: () => ({
    type: 'my-block',
    tag: 'div',
    label: 'My Block',
    attrs: {},
    styles: { padding: '20px', background: '#fff' },
    classes: [],
    content: 'Hello World',
    children: [],
    draggable: true,
    selectable: true,
    droppable: false,
    locked: false,
  }),
}
```

### Add a New Style Property

Add an entry to any sector in `src/blocks/styleSectors.ts`:

```typescript
{
  label: 'Cursor',
  property: 'cursor',
  type: 'select',
  options: [
    { value: 'default', label: 'Default' },
    { value: 'pointer', label: 'Pointer' },
    { value: 'not-allowed', label: 'Not Allowed' },
  ],
}
```
