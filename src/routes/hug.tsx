import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { GlassNav } from "@/components/GlassNav";

import f01 from "/src/assets/hug/01.png";
import f02 from "@/assets/hug/hug-02.png.asset.json";
import f03 from "@/assets/hug/hug-03.png.asset.json";
import f04 from "@/assets/hug/hug-04.png.asset.json";
import f05 from "@/assets/hug/hug-05.png.asset.json";
import f06 from "@/assets/hug/hug-06.png.asset.json";
import f07 from "@/assets/hug/hug-07.png.asset.json";
import f08 from "@/assets/hug/hug-08.png.asset.json";
import f09 from "@/assets/hug/hug-09.png.asset.json";
import f10 from "@/assets/hug/hug-10.png.asset.json";
import f11 from "@/assets/hug/hug-11.png.asset.json";
import f12 from "@/assets/hug/hug-12.png.asset.json";
import f13 from "@/assets/hug/hug-13.png.asset.json";
import f14 from "@/assets/hug/hug-14.png.asset.json";
import f15 from "@/assets/hug/hug-15.png.asset.json";
import f16 from "@/assets/hug/hug-16.png.asset.json";
import f17 from "@/assets/hug/hug-17.png.asset.json";
import f18 from "@/assets/hug/hug-18.png.asset.json";
import f19 from "@/assets/hug/hug-19.png.asset.json";
import f20 from "@/assets/hug/hug-20.png.asset.json";
import f21 from "@/assets/hug/hug-21.png.asset.json";
import f22 from "@/assets/hug/hug-22.png.asset.json";

const FRAMES = [
  /src/assets/hug/01.png, f02, f03, f04, f05, f06, f07, f08, f09, f10, f11,
  f12, f13, f14, f15, f16, f17, f18, f19, f20, f21, f22,
].map((a) => a.url);

const CAPTIONS = [
  { at: 0.06, text: "Come here." },
  { at: 0.42, text: "A virtual hug i owe you" },
  { at: 0.78, text: "Consider yourself held." },
];

export const Route = createFileRoute("/hug")({
  head: () => ({
    meta: [
      { title: "Click To Hug — Across The Distance" },
      {
        name: "description",
        content:
          "A scroll-linked, frame-by-frame hug for a best friend who lives too far away.",
      },
      { property: "og:title", content: "Click To Hug — Across The Distance" },
      {
        property: "og:description",
        content: "Scroll slowly. This one is the closest thing I've got to being there.",
      },
    ],
  }),
  component: HugPage,
});

function HugPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef(0);
  const currentFrame = useRef(-1);
  const targetProgress = useRef(0);
  const easedProgress = useRef(0);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Intelligent preload: decode every frame before the experience starts.
  useEffect(() => {
    let cancelled = false;
    let count = 0;

    const imgs = FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = "async";
      const done = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        if (count === FRAMES.length) setReady(true);
      };
      if (img.complete) {
        done();
      } else {
        img.onload = done;
        img.onerror = done;
      }
      return img;
    });

    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-linked render loop with smoothing — no flicker, no layout thrash.
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      currentFrame.current = -1;
    };

    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.fillStyle = "#07070f";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      currentFrame.current = index;
    };

    const readScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      targetProgress.current = Math.min(Math.max(-rect.top / total, 0), 1);
    };

    const tick = () => {
      easedProgress.current += (targetProgress.current - easedProgress.current) * 0.12;
      const p = easedProgress.current;
      const index = Math.min(
        FRAMES.length - 1,
        Math.max(0, Math.round(p * (FRAMES.length - 1))),
      );
      if (index !== currentFrame.current) drawFrame(index);
      setProgress(p);
      rafRef.current = requestAnimationFrame(tick);
    };

    sizeCanvas();
    readScroll();
    easedProgress.current = targetProgress.current;
    drawFrame(0);
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", sizeCanvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [ready]);

  return (
    <main className="relative">
      <GlassNav />

      <div ref={sectionRef} className="relative" style={{ height: "600vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#07070f]">
          <canvas ref={canvasRef} className="block h-full w-full" />

          {/* Vignette + glass grade */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 45%, rgba(4,4,12,0.85) 100%)",
            }}
          />

          {/* Loading veil */}
          {!ready && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background/90 backdrop-blur-xl">
              <p className="font-display text-3xl font-light text-halo">Getting closer…</p>
              <div className="h-px w-52 overflow-hidden bg-white/15">
                <div
                  className="h-full bg-starlight transition-[width] duration-300"
                  style={{ width: `${(loaded / FRAMES.length) * 100}%` }}
                />
              </div>
              <p className="text-[0.6rem] tracking-[0.4em] text-foreground/45 uppercase">
                {loaded} / {FRAMES.length} frames
              </p>
            </div>
          )}

          {/* Scroll-linked captions */}
          {ready &&
            CAPTIONS.map((c) => {
              const d = Math.abs(progress - c.at);
              const opacity = Math.max(0, 1 - d / 0.14);
              return (
                <p
                  key={c.text}
                  className="pointer-events-none absolute inset-x-0 bottom-24 text-center font-display text-[clamp(1.6rem,4vw,2.8rem)] font-light text-halo"
                  style={{
                    opacity,
                    transform: `translateY(${(1 - opacity) * 18}px)`,
                    transition: "opacity 0.2s linear",
                  }}
                >
                  {c.text}
                </p>
              );
            })}

          {ready && (
            <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
              <div className="glass-soft h-1 w-44 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-starlight/80"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="relative z-10 flex flex-col items-center px-6 py-32 text-center">
        <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-light">
          That's something i owe you but one that i can only do for you virtually.
        </h2>
        <Link
          to="/letter"
          className="sheen glass-panel group mt-10 flex items-center gap-4 rounded-full px-8 py-4"
        >
          <span className="text-[0.7rem] tracking-[0.35em] uppercase">Read the letter</span>
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </section>
    </main>
  );
}
