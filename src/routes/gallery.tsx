import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, X } from "lucide-react";
import { GlassNav } from "@/components/GlassNav";
import { Starfield } from "@/components/Starfield";
import { useVault } from "@/lib/vault";
import { cn } from "@/lib/utils";

import m01 from "@/WhatsApp Image 2026-07-24 at 10.16.14 PM.jpeg";
import m02 from "@/assets/gallery/memory-02.jpeg.asset.json";
import m03 from "@/assets/gallery/memory-03.jpeg.asset.json";
import m04 from "@/assets/gallery/memory-04.jpeg.asset.json";
import m05 from "@/assets/gallery/memory-05.jpeg.asset.json";
import m06 from "@/assets/gallery/memory-06.jpeg.asset.json";
import m07 from "@/assets/gallery/memory-07.jpeg.asset.json";
import m08 from "@/assets/gallery/memory-08.jpeg.asset.json";
import m09 from "@/assets/gallery/memory-09.jpeg.asset.json";
import m10 from "@/assets/gallery/memory-10.jpeg.asset.json";

const MEMORIES = [
  { src: m01.url, caption: "THE MOST AMAZING PERSON EVER. MS PERFECTTTTTTTTTT" },
  { src: m02.url, caption: "Sir Abdur Rehman getting murdered XD" },
  { src: m03.url, caption: "Would happily accept this heel beating from you ^^" },
  { src: m04.url, caption: "Chem lectures with mah angelic bestieeeee" },
  { src: m05.url, caption: "A moment I keep going back to. Pink interior for the pwettiest princess at the pwarty" },
  { src: m06.url, caption: "I miss these ffc mart runs way too much" },
  { src: m07.url, caption: "Us and our endless chai spilling XD" },
  { src: m08.url, caption: "Miss these moments way too much and miss you even more TwT" },
  { src: m09.url, caption: "Half my head is white: Proof im a nana G" },
  { src: m10.url, caption: "The pwettiest person eveeeer" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "The Memory Vault — Photos Of Us" },
      {
        name: "description",
        content:
          "A hidden vault of floating memories, unlocked by finding the way back through the maze of light.",
      },
      { property: "og:title", content: "The Memory Vault — Photos Of Us" },
      {
        property: "og:description",
        content: "Floating, precious, kept safe: the memories waiting behind the maze.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { unlocked, hydrated } = useVault();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (active === null) return;
      if (e.key === "ArrowRight") setActive((a) => ((a ?? 0) + 1) % MEMORIES.length);
      if (e.key === "ArrowLeft")
        setActive((a) => ((a ?? 0) - 1 + MEMORIES.length) % MEMORIES.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const offsets = useMemo(
    () => MEMORIES.map((_, i) => ({ y: (i % 3) * 34, delay: (i % 5) * 0.9 })),
    [],
  );

  if (!hydrated) {
    return (
      <main className="relative min-h-screen">
        <GlassNav />
        <Starfield count={40} seed={31} />
      </main>
    );
  }

  if (!unlocked) {
    return (
      <main className="relative flex min-h-screen flex-col">
        <GlassNav />
        <Starfield count={40} seed={31} />
        <section className="mx-auto flex flex-1 max-w-lg flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel flex size-20 items-center justify-center rounded-full animate-float">
            <Lock className="size-6 text-foreground/60" />
          </div>
          <h1 className="mt-10 font-display text-[clamp(2rem,6vw,3.5rem)] font-light text-halo">
            Something is kept here
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-foreground/55">
            This vault stays closed until the way back is found. There are memories
            inside — I promise they're worth the walk.
          </p>
          <Link
            to="/maze"
            className="sheen glass-panel mt-10 rounded-full px-8 py-3.5 text-[0.7rem] tracking-[0.3em] uppercase transition hover:-translate-y-0.5"
          >
            Find the way
          </Link>
          <div className="mt-16 flex gap-3 opacity-30">
            {MEMORIES.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className="size-14 rounded-2xl bg-white/8 backdrop-blur-3xl"
                style={{ animation: `float ${6 + i}s ease-in-out ${i * 0.4}s infinite` }}
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <GlassNav />
      <Starfield count={55} seed={31} />

      <section className="mx-auto max-w-6xl px-6 pt-32 pb-28">
        <p className="text-center text-[0.6rem] tracking-[0.5em] text-foreground/45 uppercase">
          Chapter two
        </p>
        <h1 className="mt-6 text-center font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-none font-light text-halo">
          The memory vault
        </h1>
        <p className="mx-auto mt-6 max-w-md text-center text-sm leading-relaxed text-foreground/60">
          Floating exactly where I left them. Touch one and it opens.
        </p>

        <div className="mt-20 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {MEMORIES.map((m, i) => (
            <button
              key={m.src}
              type="button"
              onClick={() => setActive(i)}
              className="sheen glass-panel group mb-6 block w-full overflow-hidden rounded-[1.5rem] p-2 text-left transition-all duration-700 hover:-translate-y-2"
              style={{
                marginTop: i === 0 ? 0 : undefined,
                transform: `translateY(${offsets[i].y % 24}px)`,
                animation: `float ${8 + (i % 4)}s ease-in-out ${offsets[i].delay}s infinite`,
              }}
            >
              <img
                src={m.src}
                alt={m.caption}
                loading="lazy"
                className="w-full rounded-[1.1rem] object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              />
              <span className="block px-3 py-3 text-[0.68rem] leading-relaxed tracking-[0.12em] text-foreground/50 uppercase">
                {m.caption}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-500",
          active === null
            ? "pointer-events-none opacity-0"
            : "pointer-events-auto opacity-100",
        )}
      >
        <div
          className="absolute inset-0 bg-background/85 backdrop-blur-2xl"
          onClick={() => setActive(null)}
        />
        {active !== null && (
          <figure
            key={active}
            className="glass-panel relative z-10 max-h-[86vh] max-w-4xl overflow-hidden rounded-[1.75rem] p-3"
            style={{ animation: "scale-in 0.45s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <img
              src={MEMORIES[active].src}
              alt={MEMORIES[active].caption}
              className="max-h-[70vh] w-full rounded-[1.25rem] object-contain"
            />
            <figcaption className="px-4 py-4 text-center text-[0.7rem] tracking-[0.22em] text-foreground/60 uppercase">
              {MEMORIES[active].caption}
            </figcaption>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="glass-soft absolute top-5 right-5 flex size-10 items-center justify-center rounded-full transition hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </figure>
        )}
      </div>
    </main>
  );
}
