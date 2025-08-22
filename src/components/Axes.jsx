/**
 * Axes.jsx
 * -----------------------------------------------------------------------------
 * Minimal X/Y axes for R3F charts with an optional XY-plane grid.
 * X runs at y=0 across `width`; Y runs up the left edge from 0→`height`.
 *
 * Props:
 * - width?: number = 10
 * - height?: number = 6
 * - color?: string = "#9ca3af"
 * - showGrid?: boolean = true
 * - gridDivisions?: number = 10
 * - gridOffset?: [number, number]      // [x,y] offset for the grid
 *
 * Note:
 * gridHelper is square; we size it to `width`, rotate onto the XY plane,
 * center it at y = height/2, and nudge it back slightly to avoid z-fighting.
 */

import React, { useMemo } from "react";

export default function Axes({
  width = 10,
  height = 6,
  color = "#9ca3af",
  showGrid = true,
  gridDivisions = 10,
  gridOffset = [0, 0],
}) {
  const xAxis = useMemo(
    () => new Float32Array([-width / 2, 0, 0, width / 2, 0, 0]),
    [width]
  );

  const yAxis = useMemo(
    () => new Float32Array([-width / 2, 0, 0, -width / 2, height, 0]),
    [width, height]
  );

  return (
    <group>
      {/* X axis at y=0 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={xAxis}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>

      {/* Y axis on the left edge */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={yAxis}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>

      {showGrid && (
        <gridHelper
          args={[width, gridDivisions, color, color]}
          rotation={[Math.PI / 2, 0, 0]} // draw on XY plane
          position={[gridOffset[0], height / 2 + gridOffset[1], -0.001]} // center + slight push back
        />
      )}
    </group>
  );
}
