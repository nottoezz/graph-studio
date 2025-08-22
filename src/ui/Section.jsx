// src/ui/Section.jsx
import React from "react";
import { styles } from "../styles/ui";

export default function Section({ title, children }) {
  return (
    <div>
      <div style={styles.cardHeader}>{title}</div>
      <div style={{ padding: 16, display: "grid", gap: 16 }}>{children}</div>
    </div>
  );
}
