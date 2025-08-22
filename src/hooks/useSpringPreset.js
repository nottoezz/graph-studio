export function useSpringConfigFor(presetKey) {
  switch (presetKey) {
    case "bounce":
      return { tension: 220, friction: 14, mass: 1 };
    case "grow":
      return { tension: 180, friction: 20 };
    case "fade":
      return { tension: 160, friction: 18 };
    case "sweep":
      return { tension: 190, friction: 18 };
    default:
      return { tension: 170, friction: 26 };
  }
}
