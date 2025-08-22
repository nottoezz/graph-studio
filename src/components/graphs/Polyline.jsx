/**
 * Polyline.jsx
 * -----------------------------------------------------------------------------
 * Minimal R3F polyline with optional point markers and preset entrance anims (react-spring).
 * Values are normalized to `height` and laid out across `width`.
 *
 * Props:
 * - values: number[]                  // y-values left→right
 * - width?: number = 10
 * - height?: number = 6
 * - palette: [lineColor, pointColor, ...]
 * - presetKey?: "fade" | "sweep" | "grow" | "bounce" | string
 */

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { animated, useSpring, to as springTo } from "@react-spring/three";
import { useSpringConfigFor } from "../../hooks/useSpringPreset";

export default function Polyline({
  values,
  width = 10,
  height = 6,
  palette,
  presetKey,
}) {
  // Guard: avoid divide-by-zero on an empty series.
  const maxVal = Math.max(...values, 1);

  const step = width / Math.max(values.length - 1, 1);

  // Compute world-space points once per input set.
  const pts = useMemo(
    () =>
      values.map((v, i) => [-width / 2 + i * step, (v / maxVal) * height, 0]),
    [values, width, height, maxVal, step]
  );

  const cfg = useSpringConfigFor(presetKey);

  let springProps;
  switch (presetKey) {
    case "fade": // opacity only
      springProps = {
        from: { o: 0, sx: 1, sy: 1 },
        to: { o: 1, sx: 1, sy: 1 },
        config: cfg,
      };
      break;
    case "sweep": // scale X from ~0 → 1
      springProps = {
        from: { o: 1, sx: 0.001, sy: 1 },
        to: { o: 1, sx: 1, sy: 1 },
        config: cfg,
      };
      break;
    case "grow": // scale Y from ~0 → 1
      springProps = {
        from: { o: 1, sx: 1, sy: 0.001 },
        to: { o: 1, sx: 1, sy: 1 },
        config: cfg,
      };
      break;
    case "bounce": // quick overshoot then settle
      springProps = {
        from: { o: 1, sx: 1, sy: 0.001 },
        to: async (next) => {
          await next({ sy: 1.1 });
          await next({ sy: 1.0 });
        },
        config: { tension: 240, friction: 12 },
      };
      break;
    default: // no-op
      springProps = {
        from: { o: 1, sx: 1, sy: 1 },
        to: { o: 1, sx: 1, sy: 1 },
        immediate: true,
      };
  }

  // o = opacity, sx = scaleX, sy = scaleY
  const spring = useSpring(springProps);
  const scaleVec = springTo([spring.sx, spring.sy], (sx, sy) => [sx, sy, 1]);

  return (
    <animated.group scale={scaleVec}>
      <Line
        points={pts}
        color={palette[0]}
        worldUnits
        lineWidth={0.06}
        transparent
        opacity={spring.o}
      />
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={palette[1]} />
        </mesh>
      ))}
    </animated.group>
  );
}
