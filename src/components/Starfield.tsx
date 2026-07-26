import { useEffect, useMemo, useState } from "react";

type Star = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Quiet layer of twinkling stars + slow drifting dust motes. */
export const Starfield = ({ count = 70, seed = 7 }: { count?: number; seed?: number }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = useMemo<Star[]>(() => {
    const rnd = seeded(seed);
    return Array.from({ length: count }, () => ({
      left: rnd() * 100,
      top: rnd() * 100,
      size: rnd() * 2.2 + 0.6,
      delay: rnd() * 8,
      duration: 4 + rnd() * 7,
    }));
  }, [count, seed]);

  if (!mounted) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-starlight"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: "0 0 8px currentColor",
          }}
        />
      ))}
      <div className="absolute top-[-10%] left-1/2 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-accent/12 blur-[120px] animate-breathe" />
    </div>
  );
};

export default Starfield;
