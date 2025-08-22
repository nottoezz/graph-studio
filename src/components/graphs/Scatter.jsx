/**
 * Scatter.jsx
 * -----------------------------------------------------------------------------
 * Lightweight R3F scatter plot with react-spring entrance presets.
 * Points are normalized (0..1) and mapped across `width`/`height`.
 *
 * Props:
 * - points: { x:number, y:number }[]
 * - width?: number = 10
 * - height?: number = 6
 * - palette: string[]                  // cycled per point
 * - presetKey?: "fade" | "grow" | "bounce" | "sweep" | string
 * - duration?: number = 1.0            // scales stagger cadence
 */

import { animated, useSpring } from "@react-spring/three";
import { useSpringConfigFor } from "../../hooks/useSpringPreset";

export default function Scatter({
  points,
  width = 10,
  height = 6,
  palette,
  presetKey,
  duration = 1.0,
}) {
  return (
    <group>
      {points.map((p, i) => {
        // Map normalized coords → world space; use x as a left→right stagger key.
        const x = -width / 2 + p.x * width;
        const y = p.y * height;
        const color = palette[i % palette.length];

        return (
          <Dot
            key={i}
            x={x}
            y={y}
            color={color}
            order={p.x}
            presetKey={presetKey}
            duration={duration}
          />
        );
      })}
    </group>
  );
}

/**
 * Single point with spring-driven opacity/scale.
 * Stagger is based on `order` in [0..1] (typically the normalized x).
 */
function Dot({ x, y, color, order, presetKey, duration }) {
  const cfg = useSpringConfigFor(presetKey);

  let springProps;
  switch (presetKey) {
    case "fade": // opacity only
      springProps = {
        from: { o: 0, s: 1 },
        to: { o: 1, s: 1 },
        delay: 0,
        config: cfg,
      };
      break;

    case "grow": // scale up, staggered left→right
      springProps = {
        from: { o: 1, s: 0.2 },
        to: { o: 1, s: 1 },
        delay: order * duration * 250,
        config: cfg,
      };
      break;

    case "bounce": // quick overshoot then settle
      springProps = {
        from: { o: 1, s: 0.2 },
        to: async (next) => {
          await next({ s: 1.2 });
          await next({ s: 1.0 });
        },
        delay: order * duration * 230,
        config: { tension: 250, friction: 11, mass: 0.9 },
      };
      break;

    case "sweep": // opacity sweep left→right
      springProps = {
        from: { o: 0, s: 1 },
        to: { o: 1, s: 1 },
        delay: order * duration * 450,
        config: cfg,
      };
      break;

    default: // no-op
      springProps = {
        from: { o: 1, s: 1 },
        to: { o: 1, s: 1 },
        immediate: true,
      };
  }

  const spring = useSpring(springProps);

  return (
    <animated.mesh position={[x, y, 0]} scale={spring.s.to((s) => [s, s, s])}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <animated.meshStandardMaterial color={color} transparent opacity={spring.o} />
    </animated.mesh>
  );
}
