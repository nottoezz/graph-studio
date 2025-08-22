/**
 * Design tokens and shared styles for a spacious, professional dark theme.
 * The scale favors wider layouts, larger padding, and subtle glassy surfaces.
 */

const tokens = {
  colors: {
    text: "#e6eaf2",
    textMuted: "rgba(230,234,242,0.72)",
    panelBg: "rgba(12,16,28,0.78)",
    panelBorder: "rgba(255,255,255,0.06)",
    panelShadow: "0 14px 36px rgba(0,0,0,0.38)",
    headerBg: "rgba(6,10,22,0.7)",
    headerBorder: "rgba(255,255,255,0.08)",
    inputBg: "rgba(10,14,24,0.68)",
    inputBorder: "rgba(255,255,255,0.12)",
    inputShadow: "inset 0 1px 1px rgba(0,0,0,0.5)",
    primary: "#3b82f6",
    primaryStrong: "#2563eb",
    primaryShadow: "0 10px 24px rgba(37,99,235,0.28)",
    secondaryBg: "rgba(148,163,184,0.16)",
    secondaryBorder: "rgba(255,255,255,0.1)",
    cardHeaderOverlay: "rgba(255,255,255,0.05)",
  },
  radii: { lg: 16, md: 12, sm: 8 },
  spacing: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 },
  fonts:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
};

export const styles = {
  app: {
    minHeight: "100vh",
    width: "100%",
    color: tokens.colors.text,
    background: `radial-gradient(1200px 600px at 20% -10%, rgba(37,99,235,0.18), transparent 60%),
       radial-gradient(900px 500px at 120% 10%, rgba(139,92,246,0.16), transparent 60%),
       linear-gradient(to bottom, #0b1220 0%, #0a0f1f 60%, #0b1325 100%)`,
    fontFamily: tokens.fonts,
    fontSize: 14,
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${tokens.colors.headerBorder}`,
    background: tokens.colors.headerBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "12px 20px",
    boxShadow: "0 6px 28px rgba(0,0,0,0.28)",
  },

  main: {
    maxWidth: 1280,
    margin: "24px auto",
    display: "grid",
    gap: 24,
    gridTemplateColumns: "minmax(340px, 420px) minmax(0, 1fr)",
    alignItems: "stretch",
    minHeight: "calc(100vh - 160px)",
  },

  sidebar: {
    background: tokens.colors.panelBg,
    border: `1px solid ${tokens.colors.panelBorder}`,
    borderRadius: tokens.radii.lg,
    overflow: "auto",
    maxHeight: "calc(100vh - 220px)",
    minWidth: 0,
    boxShadow: tokens.colors.panelShadow,
  },

  canvasCard: {
    background: tokens.colors.panelBg,
    border: `1px solid ${tokens.colors.panelBorder}`,
    borderRadius: tokens.radii.lg,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflow: "hidden",
    boxShadow: tokens.colors.panelShadow,
  },

  previewBody: {
    flex: 1,
    minHeight: 560,
    height: "clamp(560px, 72vh, 980px)",
  },

  cardHeader: {
    padding: "14px 18px",
    borderBottom: `1px solid ${tokens.colors.panelBorder}`,
    fontWeight: 600,
    background: `linear-gradient(90deg, ${tokens.colors.cardHeaderOverlay}, rgba(255,255,255,0))`,
  },

  // Shared inner section body
  sectionBody: {
    padding: 18,
    display: "grid",
    gap: 18,
  },

  // Form label
  fieldLabel: {
    fontSize: 13,
    opacity: 0.8,
  },

  btnPrimary: {
    padding: "10px 16px",
    borderRadius: tokens.radii.md,
    background: `linear-gradient(180deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryStrong} 100%)`,
    color: "white",
    border: "none",
    cursor: "pointer",
    boxShadow: `${tokens.colors.primaryShadow}, inset 0 0 0 1px rgba(255,255,255,0.08)`,
    transition: "transform 0.06s ease, box-shadow 0.2s ease, opacity 0.2s ease",
    outline: "none",
  },

  btnSecondary: {
    padding: "10px 16px",
    borderRadius: tokens.radii.md,
    background: tokens.colors.secondaryBg,
    color: tokens.colors.text,
    border: `1px solid ${tokens.colors.secondaryBorder}`,
    cursor: "pointer",
    transition: "background 0.2s ease, opacity 0.2s ease",
  },

  input: {
    background: tokens.colors.inputBg,
    color: tokens.colors.text,
    border: `1px solid ${tokens.colors.inputBorder}`,
    borderRadius: tokens.radii.md,
    padding: "12px 14px",
    minWidth: 0,
    boxShadow: tokens.colors.inputShadow,
    outline: "none",
    fontSize: 14,
    lineHeight: 1.35,
  },
};

export { tokens };
