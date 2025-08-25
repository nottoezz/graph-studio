// src/ui/PaletteEditor.jsx
import React, { useRef } from "react";
import { PALETTES } from "../constants/palettes";
import { styles, tokens } from "../styles/ui";

/**
 * PaletteEditor
 * Minimal editor for picking a named palette and tweaking colors inline.
 * Clicking a chip opens a color picker and flips into custom mode.
 */
const pill = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 8,
  border: `1px solid ${tokens.colors.secondaryBorder}`,
  background: tokens.colors.secondaryBg,
  color: tokens.colors.text,
  display: "inline-flex",
  alignItems: "center",
  lineHeight: 1.2,
};

export default function PaletteEditor({
  paletteName,
  palette,
  customPalette,
  onChangePaletteName,
  onChangePalette,
  onChangeCustomPalette,
}) {
  const colorRefs = useRef([]);

  function normalizeHex(hex) {
    if (typeof hex !== "string") return "#000000";
    const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!m) return "#000000";
    const v = m[1];
    if (v.length === 3)
      return (
        "#" +
        v
          .split("")
          .map((c) => c + c)
          .join("")
          .toLowerCase()
      );
    return "#" + v.toLowerCase();
  }

  function handleThemeChange(e) {
    const next = e.target.value;
    onChangeCustomPalette(false);
    onChangePaletteName(next);
  }

  function handleChipClick(i) {
    onChangeCustomPalette(true);
    colorRefs.current[i]?.click();
  }

  function handleColorChange(i, value) {
    const hex = normalizeHex(value);
    const next = [...palette];
    next[i] = hex;
    onChangePalette(next);
  }

  function resetToNamed() {
    onChangeCustomPalette(false);
    onChangePalette(PALETTES[paletteName]);
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          value={paletteName}
          onChange={handleThemeChange}
          style={styles.input}
        >
          {Object.keys(PALETTES).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        {customPalette && (
          <span
            title="Custom palette active"
            style={{ ...pill, opacity: 0.85 }}
          >
            Custom
          </span>
        )}

        {customPalette && (
          <button onClick={resetToNamed} style={{ ...pill, cursor: "pointer" }}>
            Reset to {paletteName}
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 8,
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {palette.map((c, i) => (
          <React.Fragment key={i}>
            {/* Hidden color input per chip */}
            <input
              type="color"
              value={c}
              ref={(el) => (colorRefs.current[i] = el)}
              onChange={(e) => handleColorChange(i, e.target.value)}
              style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
                width: 0,
                height: 0,
              }}
              aria-hidden
              tabIndex={-1}
            />

            {/* Visible chip (click to edit) */}
            <div
              title={`${c} (click to edit)`}
              onClick={() => handleChipClick(i)}
              style={{
                height: 18,
                width: 18,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.15)",
                background: c,
                cursor: "pointer",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(0,0,0,0.2)",
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
