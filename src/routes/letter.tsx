import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { GlassNav } from "@/components/GlassNav";
import { Starfield } from "@/components/Starfield";
import { AuroraShaderBackground } from "@/components/ui/animated-shader-background";
import { LampContainer } from "@/components/ui/lamp";

export const Route = createFileRoute("/letter")({
  head: () => ({
    meta: [
      { title: "The Letter — Everything I Never Said Out Loud" },
      {
        name: "description",
        content:
          "A quiet, handwritten-feeling letter to a best friend about missing her and how much she is loved.",
      },
      { property: "og:title", content: "The Letter — Everything I Never Said Out Loud" },
      {
        property: "og:description",
        content: "Read slowly. This is the part I mean the most.",
      },
    ],
  }),
  component: LetterPage,
});

const PARAGRAPHS = [
  "I've started this a hundred times in my head and it never comes out right, so I'm just going to say it plainly: I miss you. Not in a dramatic way. In the small, constant way, the kind that shows up in the middle of an ordinary Tuesday when something funny happens and you're the first person I want to tell.",
  "You have this way of making the world feel less heavy. You never made me explain myself twice. You laughed at the parts of me I was embarrassed about until they stopped being embarrassing. You remembered the tiny things nobody else bothered to remember, and somehow that made me feel like a whole person.",
  "I don't think you know how rare that is. People are kind sometimes. You are kind consistently, even when you're tired, even when nobody is watching, even when life is being unfair to you. That's not a personality trait,that's a decision you make over and over, and I've watched you make it.",
  "I'm sorry for the silences. Life got loud and I got distracted, and distance is quietly good at convincing you that people move on. But nothing about you feels far away to me. You're stitched into how I think, how I joke, what I find beautiful. You're in the reflex.",
  "So here's what I want you to know: you are not a chapter I finished. You're the person I keep saving a seat for. Whatever happens, I'm always with you. Your kinght is always here to serve you, your majesty.",
  "Thank you for every hour you gave me. Thank you for being soft when the world wasn't. Thank you for being exactly, specifically you.",
];

function LetterPage() {
  return (
    <main className="relative min-h-screen">
      <GlassNav />
      <AuroraShaderBackground opacity={0.45} />
      <Starfield count={40} seed={53} />

      <LampContainer className="pt-20">
        <h1 className="text-center font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-none font-light text-silver">
          To you, still
        </h1>
        <p className="mt-6 text-center text-[0.62rem] tracking-[0.5em] text-foreground/45 uppercase">
          A letter that took too long
        </p>
      </LampContainer>

      <section className="mx-auto -mt-52 max-w-2xl px-6 pb-40">
        <article className="glass-panel rounded-[2rem] px-7 py-12 sm:px-14 sm:py-16">
          {PARAGRAPHS.map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className="mb-7 font-display text-[1.15rem] leading-[1.95] font-light text-foreground/85 sm:text-[1.3rem]">
                {p}
              </p>
            </Reveal>
          ))}
          <Reveal delay={420}>
            <p className="mt-12 text-right font-display text-xl font-light text-starlight">
              — always yours, in every version of this life
            </p>
          </Reveal>
        </article>

        <div className="mt-14 flex justify-center">
          <Link
            to="/"
            className="sheen glass-soft group flex items-center gap-3 rounded-full px-7 py-3.5 text-[0.68rem] tracking-[0.3em] uppercase"
          >
            <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" />
            Back to the stars
          </Link>
        </div>
      </section>
    </main>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        filter: shown ? "blur(0px)" : "blur(8px)",
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 1.1s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
