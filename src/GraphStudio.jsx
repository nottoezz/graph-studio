// src/GraphStudio.jsx
/**
 * GraphStudio
 * -----------------------------------------------------------------------------
 * Small playground for composing R3F charts. Manages UI state (template, data,
 * palette, animation) and renders <GraphScene/> with those props.
 * Supports JSON import/export for full scene configs.
 */

import React, { useEffect, useRef, useState } from "react";
import GraphScene from "./scene/GraphScene";

import { PALETTES } from "./constants/palettes";
import { PRESETS } from "./constants/presets";
import {
  DEFAULT_DATA_BAR,
  DEFAULT_DATA_LINE,
  DEFAULT_DATA_SCATTER,
} from "./constants/defaultData";
import { parseData } from "./utils/parseData";
import Section from "./ui/Section";
import Field from "./ui/Field";
import { styles } from "./styles/ui";

export default function GraphStudio() {
  const [template, setTemplate] = useState("bar");
  const [paletteName, setPaletteName] = useState("Professional");
  const [palette, setPalette] = useState(PALETTES.Professional);
  const [customPalette, setCustomPalette] = useState(false); // lock palette when user supplies a custom array

  const [showGrid, setShowGrid] = useState(true);
  const [xLabel, setXLabel] = useState("Categories");
  const [yLabel, setYLabel] = useState("Values");
  const [duration, setDuration] = useState(1.1);
  const [presetKey, setPresetKey] = useState("grow");

  const [playId, setPlayId] = useState(0);
  const triggerPlay = () => setPlayId((n) => n + 1);

  const [dataInput, setDataInput] = useState(DEFAULT_DATA_BAR.join(", "));
  const [data, setData] = useState(DEFAULT_DATA_BAR);

  // When switching template via UI, load template defaults (but not during JSON import)
  const [skipTemplateReset, setSkipTemplateReset] = useState(false);

  useEffect(() => {
    if (skipTemplateReset) return;
    if (template === "bar") {
      setData(DEFAULT_DATA_BAR);
      setDataInput(DEFAULT_DATA_BAR.join(", "));
    } else if (template === "line") {
      setData(DEFAULT_DATA_LINE);
      setDataInput(DEFAULT_DATA_LINE.join(", "));
    } else if (template === "scatter") {
      setData(DEFAULT_DATA_SCATTER);
      setDataInput(DEFAULT_DATA_SCATTER.map((p) => `${p.x},${p.y}`).join("\n"));
    }
  }, [template, skipTemplateReset]);

  // Keep palette synced with named selection unless a custom array is active
  useEffect(() => {
    if (!customPalette) setPalette(PALETTES[paletteName]);
  }, [paletteName, customPalette]);

  function applyData() {
    const parsed = parseData(dataInput, template);
    if (parsed) setData(parsed);
    else {
      alert(
        "Could not parse your data. For bar/line, provide numbers separated by commas or new lines. For scatter, provide pairs like '0.4, 0.7' on each line."
      );
    }
  }

  function randomize() {
    if (template === "scatter") {
      const pts = Array.from({ length: 8 }, () => ({
        x: Math.random(),
        y: Math.random(),
      }));
      setData(pts);
      setDataInput(
        pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("\n")
      );
    } else {
      const len = 6 + Math.floor(Math.random() * 6);
      const arr = Array.from({ length: len }, () =>
        Math.round(6 + Math.random() * 24)
      );
      setData(arr);
      setDataInput(arr.join(", "));
    }
  }

  function exportConfig() {
    const cfg = {
      template,
      paletteName,
      palette,
      showGrid,
      xLabel,
      yLabel,
      duration,
      presetKey,
      data,
    };
    const blob = new Blob([JSON.stringify(cfg, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Import JSON ----------
  const fileRef = useRef(null);

  const onClickImport = () => fileRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so selecting the same file again still fires onChange
    if (!file) return;
    try {
      const text = await file.text();
      const cfg = JSON.parse(text);
      applyImportedConfig(cfg);
    } catch (err) {
      console.error(err);
      alert("Invalid JSON file. Please check the format and try again.");
    }
  };

  /**
   * Apply a previously exported config. Validation is shallow by design—
   * only known fields are applied, and template defaults are temporarily
   * suppressed to avoid clobbering imported data.
   */
  function applyImportedConfig(cfg) {
    const nextTemplate = ["bar", "line", "scatter"].includes(cfg?.template)
      ? cfg.template
      : template;

    setSkipTemplateReset(true);
    setTemplate(nextTemplate);

    // Palette: prefer a valid named palette; otherwise accept a custom array
    if (cfg?.paletteName && PALETTES[cfg.paletteName]) {
      setCustomPalette(false);
      setPaletteName(cfg.paletteName);
    } else if (Array.isArray(cfg?.palette) && cfg.palette.length > 0) {
      setCustomPalette(true);
      setPalette(cfg.palette);
    }

    if (typeof cfg?.showGrid === "boolean") setShowGrid(cfg.showGrid);
    if (typeof cfg?.xLabel === "string") setXLabel(cfg.xLabel);
    if (typeof cfg?.yLabel === "string") setYLabel(cfg.yLabel);
    if (typeof cfg?.duration === "number") setDuration(cfg.duration);

    if (cfg?.presetKey && PRESETS[cfg.presetKey]) {
      setPresetKey(cfg.presetKey);
    }

    // Data and editable textarea content
    if (Array.isArray(cfg?.data)) {
      if (nextTemplate === "scatter") {
        const ok = cfg.data.every(
          (p) => p && typeof p.x === "number" && typeof p.y === "number"
        );
        if (ok) {
          setData(cfg.data);
          setDataInput(cfg.data.map((p) => `${p.x},${p.y}`).join("\n"));
        }
      } else {
        const ok = cfg.data.every((n) => typeof n === "number");
        if (ok) {
          setData(cfg.data);
          setDataInput(cfg.data.join(", "));
        }
      }
    }

    // Allow one frame with the imported template before re-enabling defaults
    requestAnimationFrame(() => setSkipTemplateReset(false));

    // Replay springs for a visual confirmation
    triggerPlay();
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              height: 32,
              width: 32,
              borderRadius: 12,
              background: "rgba(255,255,255,0.07)",
              display: "grid",
              placeItems: "center",
            }}
          >
            📊
          </div>
          <h1 style={{ fontSize: 16, margin: 0 }}>Graph Studio</h1>
          <span style={{ fontSize: 12, opacity: 0.7 }}>React + three.js</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={styles.btnSecondary} onClick={onClickImport}>
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            style={{ display: "none" }}
          />
          <button style={styles.btnSecondary} onClick={exportConfig}>
            Export JSON
          </button>
          <button style={styles.btnPrimary} onClick={triggerPlay}>
            Play
          </button>
          <button style={styles.btnPrimary} onClick={randomize}>
            Randomize Data
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <Section title="Configure">
            <Field label="Template">
              <select
                value={template}
                onChange={(e) => {
                  setCustomPalette(false); // revert to named palettes when switching templates
                  setTemplate(e.target.value);
                }}
                style={styles.input}
              >
                <option value="bar">3D Bar</option>
                <option value="line">3D Line</option>
                <option value="scatter">3D Scatter</option>
              </select>
            </Field>

            <Field label="Color palette">
              <select
                value={paletteName}
                onChange={(e) => {
                  setCustomPalette(false);
                  setPaletteName(e.target.value);
                }}
                style={styles.input}
              >
                {Object.keys(PALETTES).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                {palette.map((c, i) => (
                  <div
                    key={i}
                    title={c}
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: c,
                    }}
                  />
                ))}
              </div>
            </Field>

            <Field label="Animation preset">
              <select
                value={presetKey}
                onChange={(e) => setPresetKey(e.target.value)}
                style={styles.input}
              >
                {Object.entries(PRESETS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 12, opacity: 0.8 }}>
                  Duration (s): {duration.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={0.2}
                  max={3.5}
                  step={0.05}
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </Field>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="X label">
                <input
                  style={styles.input}
                  value={xLabel}
                  onChange={(e) => setXLabel(e.target.value)}
                />
              </Field>
              <Field label="Y label">
                <input
                  style={styles.input}
                  value={yLabel}
                  onChange={(e) => setYLabel(e.target.value)}
                />
              </Field>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                id="grid"
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              <label htmlFor="grid">Show grid</label>
            </div>

            <Field label="Data">
              <textarea
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder={
                  template === "scatter"
                    ? "x,y\n0.2,0.5\n0.4,0.8"
                    : "12, 18, 9, 24, 16"
                }
                style={{ ...styles.input, minHeight: 120 }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  style={{ ...styles.btnPrimary, flex: 1, minWidth: 120 }}
                  onClick={applyData}
                >
                  Apply
                </button>
                <button
                  style={{ ...styles.btnSecondary, minWidth: 120 }}
                  onClick={randomize}
                >
                  Randomize
                </button>
              </div>
              <p style={{ fontSize: 12, opacity: 0.7 }}>
                Bar/Line: numbers separated by commas or new lines. Scatter: one
                pair per line (0..1 range suggested).
              </p>
            </Field>
          </Section>
        </div>

        {/* Canvas */}
        <div style={styles.canvasCard}>
          <div style={styles.cardHeader}>Preview</div>
          <div style={styles.previewBody}>
            <GraphScene
              template={template}
              data={data}
              palette={palette}
              showGrid={showGrid}
              xLabel={xLabel}
              yLabel={yLabel}
              presetKey={presetKey}
              duration={duration}
              playId={playId}
            />
          </div>
        </div>
      </main>

      <footer
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "16px",
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        Tip: export the JSON to save your scene configuration, then import it
        later to restore everything (template, palette, labels, data, and
        animation preset).
      </footer>
    </div>
  );
}
