/**
 * GraphScene.jsx
 * -----------------------------------------------------------------------------
 * Top-level R3F chart scene. Renders axes/labels plus one graph (Bars/Polyline/Scatter),
 * with OrbitControls, a PNG export helper, and simple entrance animations
 * forwarded via `presetKey`/`duration`. View state is persisted in localStorage.
 *
 * Props:
 * - template: "bar" | "line" | "scatter"
 * - data: number[] | { x:number, y:number }[]
 * - palette: string[]
 * - showGrid: boolean
 * - xLabel, yLabel: string
 * - presetKey?: string
 * - duration?: number
 * - playId?: any                      // remounts graph content to retrigger springs
 */

import { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Axes from "../components/Axes";
import AxisLabels from "../components/AxisLabels";
import Capture from "../components/Capture";
import InteractionHint from "../components/InteractionHint";

import Bars from "../components/graphs/Bars";
import Scatter from "../components/graphs/Scatter";
import Polyline from "../components/graphs/Polyline";

export default function GraphScene({
  template,
  data,
  palette,
  showGrid,
  xLabel,
  yLabel,
  presetKey,
  duration,
  playId,
}) {
  const capRef = useRef();
  const controlsRef = useRef();
  const width = 10;
  const height = 6;
  const bg = "#0b1220";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ position: [0, 4, 12], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}   // needed for PNG capture
        dpr={[1, 2]}
      >
        {/* Persist / restore camera + target (keyed per template) */}
        <PersistView controlsRef={controlsRef} storageKey={`graph_view_${template}`} />

        <color attach="background" args={[bg]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 8, 6]} intensity={1.1} />
        <spotLight position={[-8, 10, 8]} angle={0.4} penumbra={0.5} intensity={0.6} />

        {/* Remount graph content to restart springs */}
        <group key={playId ?? 0} position={[0, 0.1, 0]}>
          <Axes width={width} height={height} showGrid={showGrid} />
          <AxisLabels width={width} height={height} xLabel={xLabel} yLabel={yLabel} />

          {/* Select a single graph type */}
          {template === "bar" && Array.isArray(data) && (
            <Bars
              values={data}
              width={width}
              height={height}
              palette={palette}
              presetKey={presetKey}
              duration={duration}
            />
          )}

          {template === "line" && Array.isArray(data) && (
            <Polyline
              values={data}
              width={width}
              height={height}
              palette={palette}
              presetKey={presetKey}
              duration={duration}
            />
          )}

          {template === "scatter" &&
            Array.isArray(data) &&
            data[0]?.x !== undefined && (
              <Scatter
                points={data}
                width={width}
                height={height}
                palette={palette}
                presetKey={presetKey}
                duration={duration}
              />
            )}
        </group>

        <OrbitControls
          ref={controlsRef}
          target={[0, 0, 0]}
          enablePan
          enableZoom
          enableRotate
          minDistance={4}
          maxDistance={24}
        />

        <Capture ref={capRef} />
        <InteractionHint position={[0, height + 0.6, 0]} delayMs={2500} />
      </Canvas>

      <button onClick={() => capRef.current?.toPNG("graph.png", 3)} style={fabStyle}>
        Export PNG
      </button>
    </div>
  );
}

/**
 * PersistView
 * Restores a saved camera/target on mount and saves after OrbitControls end events.
 */
function PersistView({ controlsRef, storageKey = "graph_view_default" }) {
  const { camera } = useThree();

  useEffect(() => {
    // Restore saved view (best-effort).
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v.position)) camera.position.set(...v.position);
        if (typeof v.fov === "number") {
          camera.fov = v.fov;
          camera.updateProjectionMatrix();
        }
        if (controlsRef.current && Array.isArray(v.target)) {
          controlsRef.current.target.set(...v.target);
          controlsRef.current.update();
        }
      }
    } catch {
      /* ignore */
    }

    // Save view when interaction ends (less noisy than on 'change').
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    const save = () => {
      const payload = {
        position: camera.position.toArray(),
        target: ctrl.target.toArray(),
        fov: camera.fov,
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {
        /* ignore */
      }
    };

    ctrl.addEventListener("end", save);
    return () => ctrl.removeEventListener("end", save);
  }, [camera, controlsRef, storageKey]);

  return null;
}

const fabStyle = {
  position: "absolute",
  top: 12,
  right: 12,
  padding: "10px 14px",
  borderRadius: 12,
  background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.15)",
  cursor: "pointer",
  boxShadow:
    "0 10px 24px rgba(37,99,235,0.28), inset 0 0 0 1px rgba(255,255,255,0.08)",
  transition: "transform 0.06s ease, box-shadow 0.2s ease",
};
