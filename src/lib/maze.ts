export type Cell = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * Deterministic recursive-backtracker maze so server and client render
 * exactly the same labyrinth.
 */
export function generateMaze(cols: number, rows: number, seed = 20260726) {
  const rnd = seeded(seed);
  const grid: Cell[] = Array.from({ length: cols * rows }, () => ({
    top: true,
    right: true,
    bottom: true,
    left: true,
  }));
  const visited = new Array(cols * rows).fill(false);
  const stack: number[] = [0];
  visited[0] = true;

  const idx = (x: number, y: number) => y * cols + x;

  while (stack.length) {
    const current = stack[stack.length - 1];
    const cx = current % cols;
    const cy = Math.floor(current / cols);

    const neighbours: { i: number; dir: keyof Cell; opp: keyof Cell }[] = [];
    if (cy > 0 && !visited[idx(cx, cy - 1)])
      neighbours.push({ i: idx(cx, cy - 1), dir: "top", opp: "bottom" });
    if (cx < cols - 1 && !visited[idx(cx + 1, cy)])
      neighbours.push({ i: idx(cx + 1, cy), dir: "right", opp: "left" });
    if (cy < rows - 1 && !visited[idx(cx, cy + 1)])
      neighbours.push({ i: idx(cx, cy + 1), dir: "bottom", opp: "top" });
    if (cx > 0 && !visited[idx(cx - 1, cy)])
      neighbours.push({ i: idx(cx - 1, cy), dir: "left", opp: "right" });

    if (!neighbours.length) {
      stack.pop();
      continue;
    }

    const next = neighbours[Math.floor(rnd() * neighbours.length)];
    grid[current][next.dir] = false;
    grid[next.i][next.opp] = false;
    visited[next.i] = true;
    stack.push(next.i);
  }

  return grid;
}
