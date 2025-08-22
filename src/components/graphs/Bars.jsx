/**
 * Bars.jsx
 * -----------------------------------------------------------------------------
 * Lightweight 3D bar series for R3F with react-spring-driven entrance presets.
 * Normalizes values to `height`, lays out bars across `width`, and staggers
 * animations per bar. Designed to live inside an R3F <Canvas>.
 *
 * Props:
 * - values: number[]                 // bar heights
 * - width?: number = 10              // total horizontal span
 * - height?: number = 6              // max normalized height
 * - palette: string[]                // bar colors (cycled)
 * - presetKey?: "fade" | "grow" | "bounce" | "sweep" | string
 * - duration?: number = 1.1          // scales stagger cadence
 */

import { animated, useSpring } from "@react-spring/three";
import { useSpringConfigFor } from "../../hooks/useSpringPreset";

export default function Bars({
  values,
  width = 10,
  height = 6,
  palette,
  presetKey,
  duration = 1.1,
}) {
  // Normalize bar heights against the largest value; guard against divide-by-zero.
  const maxVal = Math.max(...values, 1);

  const gap = 0.15;
  const barW = (width - gap * (values.length + 1)) / values.length;
  const startX = -width / 2 + gap + barW / 2;

  return (
    <group>
      {values.map((v, i) => {
        const h = (v / maxVal) * height;
        const x = startX + i * (barW + gap);
        const color = palette[i % palette.length];

        return (
          <Bar
            key={i}
            x={x}
            w={barW}
            h={h}
            color={color}
            index={i}
            count={values.length}
            presetKey={presetKey}
            duration={duration}
          />
        );
      })}
    </group>
  );
}

/**
 * Single bar with spring-driven Y scale and optional opacity.
 * Staggering is based on `index`/`count`.
 */
function Bar({ x, w, h, color, index, count, presetKey, duration }) {
  const cfg = useSpringConfigFor(presetKey);

  // Animation presets. Keep them small and opinionated.
  let springProps;
  switch (presetKey) {
    case "fade":
      springProps = {
        from: { o: 0, y: 1 },
        to: { o: 1, y: 1 },
        delay: 0,
        config: cfg,
      };
      break;

    case "grow":
      // Start near-zero to avoid zero-scale artifacts; stagger left→right.
      springProps = {
        from: { o: 1, y: 0.001 },
        to: { o: 1, y: 1 },
        delay: (index / count) * duration * 300,
        config: cfg,
      };
      break;

    case "bounce":
      // Quick overshoot then settle; slightly tighter stagger cadence.
      springProps = {
        from: { o: 1, y: 0.001 },
        to: async (next) => {
          await next({ y: 1.12 });
          await next({ y: 1 });
        },
        delay: (index / count) * duration * 280,
        config: { tension: 240, friction: 12, mass: 0.9 },
      };
      break;

    case "sweep":
      // Opacity sweep left→right; height is static.
      springProps = {
        from: { o: 0, y: 1 },
        to: { o: 1, y: 1 },
        delay: (index / Math.max(1, count - 1)) * duration * 400,
        config: cfg,
      };
      break;

    default:
      springProps = {
        from: { o: 1, y: 1 },
        to: { o: 1, y: 1 },
        immediate: true,
      };
  }

  const spring = useSpring(springProps);

  return (
    <animated.mesh
      position={[x, h / 2, 0]}
      scale={spring.y.to((y) => [1, y, 1])}
    >
      <boxGeometry args={[w, h, 0.5]} />
      <animated.meshStandardMaterial
        color={color}
        transparent
        opacity={spring.o}
        roughness={0.35}
        metalness={0.05}
      />
    </animated.mesh>
  );
}
