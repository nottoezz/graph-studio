/**
 * InteractionHint.jsx
 * -----------------------------------------------------------------------------
 * Inline help that appears while the user interacts and fades after `idleMs`.
 * Listens to pointer/wheel/touch events on the R3F canvas.
 *
 * Props:
 * - position?: [number, number, number] = [0, 0, 0]
 * - idleMs?: number = 1200                 // hide after this idle window
 * - delayMs?: number                       // legacy alias for idleMs
 * - message?: string = "Drag to orbit • Scroll to zoom"
 */

import React, { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function InteractionHint({
  position = [0, 0, 0],
  idleMs = 1200,
  delayMs, // legacy alias for idleMs
  message = "Drag to orbit • Scroll to zoom",
}) {
  const { gl } = useThree();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const timeoutMs =
    typeof delayMs === "number" && !Number.isNaN(delayMs) ? delayMs : idleMs;

  useEffect(() => {
    // Attach to the renderer's canvas; show on activity, hide after idle.
    const el = gl.domElement;

    const showAndScheduleHide = () => {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), timeoutMs);
    };

    const hideNow = () => setVisible(false);

    el.addEventListener("pointerdown", showAndScheduleHide);
    el.addEventListener("pointermove", showAndScheduleHide);
    el.addEventListener("wheel", showAndScheduleHide, { passive: true });
    el.addEventListener("touchstart", showAndScheduleHide, { passive: true });
    el.addEventListener("touchmove", showAndScheduleHide, { passive: true });
    el.addEventListener("pointerleave", hideNow);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      el.removeEventListener("pointerdown", showAndScheduleHide);
      el.removeEventListener("pointermove", showAndScheduleHide);
      el.removeEventListener("wheel", showAndScheduleHide);
      el.removeEventListener("touchstart", showAndScheduleHide);
      el.removeEventListener("touchmove", showAndScheduleHide);
      el.removeEventListener("pointerleave", hideNow);
    };
  }, [gl, timeoutMs]);

  return (
    <Html position={position} center>
      <div
        style={{
          // presentation
          padding: "10px 14px",
          borderRadius: 12,
          fontSize: 13.5,
          lineHeight: 1.35,
          letterSpacing: 0.1,
          color: "#e6eaf2",
          background:
            "linear-gradient(180deg, rgba(12,16,28,0.82), rgba(10,14,24,0.74))",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 8px 22px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)",
          backdropFilter: "blur(6px)",
          // behavior
          transition: "opacity 200ms ease",
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </div>
    </Html>
  );
}
