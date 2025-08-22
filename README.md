# Graph Studio

I built **Graph Studio** as a small, focused playground for making clean 3D charts with React and three.js. It lets me switch between **Bar**, **Line**, and **Scatter** visualizations, tweak colors and motion, paste or import data, and export a high-res PNG or a reusable JSON scene config. It’s intentionally minimal—fast to try ideas, clean enough to ship demos.

---

## Highlights

- **3D charts with R3F**: Bars, polylines, and scatter points rendered in three.js via `@react-three/fiber`.
- **Motion presets**: Subtle entrance animations powered by `@react-spring/three` (e.g., `fade`, `grow`, `bounce`, `sweep`) with a duration slider.
- **Palettes**: Curated color sets plus support for custom arrays.
- **Axes & labels**: Simple XY axes, optional grid, and label placement that stays readable.
- **Orbit controls**: Drag to orbit, wheel to zoom, pan enabled. I persist the camera/target in `localStorage` so my view sticks across reloads.
- **PNG export**: One click to capture a sharp PNG from the current frame.
- **JSON import/export**: Save a scene (template, palette, labels, data, animation) and restore it later.
- **Human-friendly data entry**: Paste numbers or point pairs; the app is forgiving about separators.
- **Modern dark UI**: Spacious layout with a “glassy” look that doesn’t get in the way of the chart.

---

## Tech Stack

- **React** + **@react-three/fiber** (R3F)
- **@react-three/drei** (helpers like `OrbitControls`, `Html`, `Text`, `Line`)
- **@react-spring/three** (animation)
- Plain CSS-in-JS style objects (no CSS framework)

---

## Getting Started

### Prereqs
- Node 18+ recommended.

### Install

```bash
npm install
```

### Run

```bash
# If using Vite (typical)
npm run dev

# If this project is set up with CRA instead
npm start
```

Then open the printed local URL in your browser.

### Build

```bash
npm run build
# (Optional) if using Vite:
npm run preview
```

---

## Using the App

1. **Pick a template** (3D Bar, 3D Line, 3D Scatter).
2. **Choose a palette** or switch to your custom array.
3. **Select an animation preset** and adjust **Duration**.
4. **Toggle grid** and edit **X/Y labels**.
5. **Paste data** (see formats below) and click **Apply**.
6. Hit **Play** to retrigger entrance animations.
7. **Export PNG** for a high-res snapshot.
8. **Export JSON** to save everything, or **Import JSON** to restore a scene.

---

## Data Formats

### Bar / Line
- Accepts numbers separated by commas, spaces, newlines, or semicolons.

Examples:
```
12, 18, 9, 24, 16
```
```
12
18
9
24
16
```
```
12; 18; 9; 24; 16
```

### Scatter
- One pair per row. Each row can be `"x y"` or `"x,y"`.
- Rows can be split by newlines or semicolons.
- Suggested range is `0..1` for both axes (the scene normalizes point positions to width/height).

Examples:
```
0.2,0.5
0.4,0.8
0.85,0.3
```
```
0.2 0.5; 0.4 0.8; 0.85 0.3
```

---

## JSON Import / Export

Click **Export JSON** to download a file (e.g., `graph-config.json`) you can re-import later.  
I keep validation intentionally light and only apply known fields.

Schema (illustrative):
```json
{
  "template": "bar" | "line" | "scatter",
  "paletteName": "Professional",
  "palette": ["#2563eb", "#7c3aed", "..."],  // used if paletteName is absent/invalid
  "showGrid": true,
  "xLabel": "Categories",
  "yLabel": "Values",
  "duration": 1.1,
  "presetKey": "grow",
  "data": [12, 18, 9, 24, 16]                // or [{ "x":0.4, "y":0.7 }, ...] for scatter
}
```

Notes:
- When importing, I temporarily disable template defaults so the incoming data isn’t clobbered.
- If `paletteName` is valid, it wins; otherwise a provided `palette` array is used.

---

## Controls & UX

- **Orbit**: drag with primary button / touch drag  
- **Zoom**: mouse wheel / pinch  
- **Pan**: middle/right drag  
- **View persistence**: I save `camera.position`, `controls.target`, and `fov` per template key (e.g., `graph_view_bar`) in `localStorage`.  
- **Interaction hint**: A small floating hint appears while you interact and fades after inactivity.

---

## PNG Export

- The export button uses an internal `Capture` utility that:
  - Temporarily increases the renderer’s pixel ratio,
  - Forces a render,
  - Reads the canvas (`toDataURL`) and downloads as PNG,
  - Restores the previous pixel ratio immediately.
- The R3F `<Canvas>` sets `gl={{ preserveDrawingBuffer: true }}` to ensure capture works after rendering.

---

## Project Structure (high level)

```
src/
  components/
    Axes.jsx
    AxisLabels.jsx
    Capture.jsx
    InteractionHint.jsx
    graphs/
      Bars.jsx
      Polyline.jsx
      Scatter.jsx
  scene/
    GraphScene.jsx
  styles/
    ui.js
  ui/
    Section.jsx
    Field.jsx
  constants/
    palettes.js
    presets.js
    defaultData.js
  utils/
    parseData.js
  GraphStudio.jsx
```

---

## Customization

- **Add palettes**: Edit `constants/palettes`.
- **Tweak motion**: Presets live behind `useSpringPreset`/`useSpringConfigFor` usage in the graph components. Add your own curve/tension or new preset keys and wire them into the dropdown.
- **New chart types**: Follow the patterns in `graphs/`—accept normalized inputs, keep animations small and opinionated, and expose minimal props.

---

## Performance Tips

- Keep series sizes reasonable (especially scatter point counts).
- Grid divisions should be modest to avoid overdraw.
- Avoid cranking `dpr` too high—PNG export already boosts resolution on demand.
- Light counts and shadowing are purposely minimal; keep it that way for interactivity.

---

## Troubleshooting

- **Blank PNG / empty export**: Ensure the browser allows canvas capture and that `preserveDrawingBuffer` is set (it is by default in `GraphScene`).
- **Data won’t apply**: Check separators and number formats. For scatter, ensure each row has two valid numbers.
- **View doesn’t persist**: Confirm `localStorage` isn’t disabled/private-mode-blocked.
- **Nothing renders**: Verify WebGL support and that the dev server is running without errors.

---

## Roadmap (nice-to-haves)

- Tooltips / value labels
- Multi-series overlays
- Axis ticks/legends
- CSV import
- Theming switch / light mode
- Image export presets (transparent BG, sizes)

---

## License

MIT. Use it freely. If you make something cool with it, I’d love to see it.

---

## Acknowledgements

- The `@react-three/fiber` and `@react-three/drei` communities for making three.js feel ergonomic in React.
- `react-spring` for delightful motion without extra weight.
