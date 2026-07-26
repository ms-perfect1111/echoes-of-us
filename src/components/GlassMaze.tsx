import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { generateMaze } from "@/lib/maze";
import { useVault } from "@/lib/vault";
import { cn } from "@/lib/utils";

const COLS = 11;
const ROWS = 11;

export const GlassMaze = () => {
  const grid = useMemo(() => generateMaze(COLS, ROWS), []);
  const { unlocked, unlock } = useVault();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<number[]>([0]);
  const [won, setWon] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const move = useCallback(
    (dx: number, dy: number) => {
      if (won) return;
      setPos((p) => {
        const cell = grid[p.y * COLS + p.x];
        if (dx === 1 && cell.right) return p;
        if (dx === -1 && cell.left) return p;
        if (dy === 1 && cell.bottom) return p;
        if (dy === -1 && cell.top) return p;

        const nx = Math.min(Math.max(p.x + dx, 0), COLS - 1);
        const ny = Math.min(Math.max(p.y + dy, 0), ROWS - 1);
        if (nx === p.x && ny === p.y) return p;

        const i = ny * COLS + nx;
        setTrail((t) => (t.includes(i) ? t : [...t, i]));
        return { x: nx, y: ny };
      });
    },
    [grid, won],
  );

  useEffect(() => {
    if (pos.x === COLS - 1 && pos.y === ROWS - 1 && !won) {
      setWon(true);
      unlock();
    }
  }, [pos, won, unlock]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        w: [0, -1],
        s: [0, 1],
        a: [-1, 0],
        d: [1, 0],
      };
      const m = map[e.key];
      if (m) {
        e.preventDefault();
        move(m[0], m[1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1, 0);
    else move(0, dy > 0 ? 1 : -1);
    touchStart.current = null;
  };

  const reset = () => {
    setPos({ x: 0, y: 0 });
    setTrail([0]);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={boardRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="glass-panel relative rounded-[2rem] p-4 sm:p-6"
        style={{ boxShadow: "var(--shadow-glass), var(--shadow-halo)" }}
      >
        <div
          className="grid touch-none"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            width: "min(84vw, 30rem)",
            aspectRatio: "1 / 1",
          }}
        >
          {grid.map((cell, i) => {
            const x = i % COLS;
            const y = Math.floor(i / COLS);
            const isPlayer = pos.x === x && pos.y === y;
            const isGoal = x === COLS - 1 && y === ROWS - 1;
            const inTrail = trail.includes(i);
            return (
              <div
                key={i}
                className={cn(
                  "relative transition-colors duration-500",
                  inTrail && "bg-accent/10",
                )}
                style={{
                  borderTop: cell.top ? "1.5px solid var(--glass-border)" : "1.5px solid transparent",
                  borderRight: cell.right
                    ? "1.5px solid var(--glass-border)"
                    : "1.5px solid transparent",
                  borderBottom: cell.bottom
                    ? "1.5px solid var(--glass-border)"
                    : "1.5px solid transparent",
                  borderLeft: cell.left
                    ? "1.5px solid var(--glass-border)"
                    : "1.5px solid transparent",
                  boxShadow: inTrail
                    ? "inset 0 0 14px color-mix(in oklab, var(--aurora) 30%, transparent)"
                    : undefined,
                }}
              >
                {isGoal && (
                  <span className="absolute inset-1 rounded-full bg-starlight/25 blur-[3px] animate-breathe" />
                )}
                {isPlayer && (
                  <span
                    className="absolute inset-[15%] rounded-full bg-starlight transition-all duration-200"
                    style={{
                      boxShadow:
                        "0 0 18px 4px color-mix(in oklab, var(--starlight) 70%, transparent)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-background/70 px-6 text-center backdrop-blur-xl">
            <Sparkles className="size-6 text-starlight animate-float" />
            <h3 className="font-display text-3xl font-light text-halo">You found the way</h3>
            <p className="max-w-xs text-sm text-foreground/65">
              Every path led back to you. The memory vault is open now.
            </p>
            <Link
              to="/gallery"
              className="sheen mt-2 rounded-full border border-glass-border bg-white/10 px-6 py-2.5 text-[0.7rem] tracking-[0.28em] uppercase transition hover:bg-white/16"
            >
              Open the vault
            </Link>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <div className="grid grid-cols-3 gap-1.5">
          <span />
          <DPad onClick={() => move(0, -1)} label="Up">
            <ArrowUp className="size-4" />
          </DPad>
          <span />
          <DPad onClick={() => move(-1, 0)} label="Left">
            <ArrowLeft className="size-4" />
          </DPad>
          <DPad onClick={reset} label="Restart">
            <RotateCcw className="size-3.5 opacity-70" />
          </DPad>
          <DPad onClick={() => move(1, 0)} label="Right">
            <ArrowRight className="size-4" />
          </DPad>
          <span />
          <DPad onClick={() => move(0, 1)} label="Down">
            <ArrowDown className="size-4" />
          </DPad>
          <span />
        </div>
        <p className="max-w-[12rem] text-[0.65rem] leading-relaxed tracking-[0.2em] text-foreground/45 uppercase">
          Arrow keys, or swipe. {unlocked && !won ? "Already solved once." : "Reach the light."}
        </p>
      </div>
    </div>
  );
};

const DPad = ({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="glass-soft flex size-11 items-center justify-center rounded-2xl transition-all duration-200 hover:scale-105 hover:bg-white/12 active:scale-95"
  >
    {children}
  </button>
);

export default GlassMaze;
