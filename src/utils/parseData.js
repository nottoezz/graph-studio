/**
 * parseData
 * -----------------------------------------------------------------------------
 * Normalizes user input into a numeric series (bar/line) or an array of points (scatter).
 * - Numbers: accepts comma, space, newline, or semicolon separators.
 * - Scatter: each row is "x y" or "x,y"; rows separated by newline or semicolon.
 *
 * @param {string} input      Raw user text
 * @param {"scatter"|"bar"|"line"|string} kind  Parsing mode
 * @returns {number[] | {x:number,y:number}[] | null}
 */
export function parseData(input, kind) {
  try {
    // Empty/whitespace-only input
    if (!input?.trim()) return null;

    if (kind === "scatter") {
      // Parse rows into {x,y}; ignore malformed rows
      const rows = input
        .split(/\n|;/)
        .map((r) => r.trim())
        .filter(Boolean)
        .map((row) => {
          const [xStr, yStr] = row.split(/,|\s+/);
          return { x: parseFloat(xStr), y: parseFloat(yStr) };
        })
        .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y));

      return rows.length ? rows : null;
    }

    // Fallback: parse as a flat numeric list
    const nums = input
      .split(/,|\n|;|\s+/)
      .map((v) => parseFloat(v))
      .filter((v) => !Number.isNaN(v));

    return nums.length ? nums : null;
  } catch {
    // Be conservative on unexpected input/edge cases
    return null;
  }
}
