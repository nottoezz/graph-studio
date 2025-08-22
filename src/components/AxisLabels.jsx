/**
 * AxisLabels.jsx
 * -----------------------------------------------------------------------------
 * X/Y axis labels using drei <Text>. X is centered below the chart; Y is rotated
 * 90° and centered on the left.
 *
 * Props:
 * - width?: number = 10         // used to position Y
 * - height?: number = 6         // used to position Y
 * - xLabel?: string = "X"
 * - yLabel?: string = "Y"
 */

import React from "react";
import { Text } from "@react-three/drei";

export default function AxisLabels({
  width = 10,
  height = 6,
  xLabel = "X",
  yLabel = "Y",
}) {
  return (
    <group>
      {/* X label (below y=0) */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.35}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        {xLabel}
      </Text>

      {/* Y label (rotated, centered on left) */}
      <Text
        position={[-width / 2 - 0.7, height / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.35}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        {yLabel}
      </Text>
    </group>
  );
}
