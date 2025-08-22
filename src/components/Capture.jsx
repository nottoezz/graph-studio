/**
 * Capture.jsx
 * -----------------------------------------------------------------------------
 * Imperative helper to export the current R3F frame as a PNG.
 *
 * Usage:
 *   const ref = useRef();
 *   <Capture ref={ref} />
 *   ref.current.toPNG("graph.png", 2);
 *
 * Notes:
 * - Temporarily increases the renderer pixel ratio for a sharper capture.
 * - Forces a render before reading the canvas.
 */

import React, { forwardRef, useImperativeHandle } from "react";
import { useThree } from "@react-three/fiber";

const Capture = forwardRef(function Capture(_, ref) {
  const { gl, scene, camera } = useThree();

  useImperativeHandle(ref, () => ({
    /**
     * toPNG(name = "graph.png", pixelRatio = 2)
     * Download the current frame as a PNG.
     */
    toPNG: (name = "graph.png", pixelRatio = 2) => {
      const prev = gl.getPixelRatio();
      gl.setPixelRatio(pixelRatio);

      gl.render(scene, camera);
      const url = gl.domElement.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();

      gl.setPixelRatio(prev);
    },
  }));

  return null; // headless utility
});

export default Capture;
