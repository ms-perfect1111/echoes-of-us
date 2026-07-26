import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Lock, MailOpen, Sparkles } from "lucide-react";
import { HorizonHero } from "@/components/ui/horizon-hero-section";
import { Starfield } from "@/components/Starfield";
import { GlassNav } from "@/components/GlassNav";
import { useVault } from "@/lib/vault";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Somewhere In The Stars — For My Best Friend" },
      {
        name: "description",
        content:
          "An interactive letter of missing you: a celestial journey, a maze back to each other, a hidden memory vault and a hug across the distance.",
      },
      { property: "og:title", content: "Somewhere In The Stars — For My Best Friend" },
      {
        property: "og:description",
        content:
          "A cinematic, handcrafted little universe made for one very special person.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { unlocked, hydrated } = useVault();

  return (
    <main className="relative">
      <GlassNav />
      <Starfield count={60} />

      <HorizonHero />

      {/* Journey */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <p className="text-center text-[0.65rem] tracking-[0.5em] text-foreground/45 uppercase">
          The journey
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl text-center font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight font-light">
          There are people you don't just remember. There are people you keep{" "}
          <span className="text-silver">carrying</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-foreground/60">
          This little universe is for you. Take your time with it — find the way back
          through the maze, unlock what's waiting, and stay for the letter at the end.
        </p>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <JourneyCard
            to="/maze"
            step="01"
            title="The way back"
            body="A quiet labyrinth of light. Every turn is me trying to find my way to you again."
            icon={<Sparkles className="size-4" />}
          />
          <JourneyCard
            to={hydrated && unlocked ? "/gallery" : "/maze"}
            step="02"
            title={hydrated && unlocked ? "The memory vault" : "Something is waiting"}
            body={
              hydrated && unlocked
                ? "The vault is open. Every photo, floating exactly where you left it."
                : "Sealed for now. Solve the maze and what's inside will find its light."
            }
            icon={
              hydrated && unlocked ? (
                <Sparkles className="size-4 text-starlight" />
              ) : (
                <Lock className="size-4" />
              )
            }
            locked={hydrated && !unlocked}
          />
          <JourneyCard
            to="/hug"
            step="03"
            title="Click to hug"
            body="The one thing I'd choose over every message ever sent. Scroll it slowly."
            icon={<HeartHandshake className="size-4" />}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/letter"
            className="sheen glass-panel group flex items-center gap-4 rounded-full px-8 py-4 transition-transform duration-500 hover:-translate-y-0.5"
          >
            <MailOpen className="size-4 text-starlight" />
            <span className="text-[0.7rem] tracking-[0.35em] uppercase">
              Read the letter
            </span>
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 pb-16 text-center text-[0.6rem] tracking-[0.4em] text-foreground/35 uppercase">
        Made slowly, on purpose, for you
      </footer>
    </main>
  );
}

function JourneyCard({
  to,
  step,
  title,
  body,
  icon,
  locked,
}: {
  to: string;
  step: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <Link
      to={to}
      className="sheen glass-panel group relative flex flex-col gap-4 rounded-[1.75rem] p-8 transition-all duration-500 hover:-translate-y-1.5"
      style={{ animation: "float 9s ease-in-out infinite" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.65rem] tracking-[0.3em] text-foreground/40">
          {step}
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-white/8 text-foreground/70">
          {icon}
        </span>
      </div>
      <h3 className="font-display text-2xl font-light">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/55">{body}</p>
      {locked && (
        <span className="absolute inset-x-8 bottom-4 h-px bg-gradient-to-r from-transparent via-starlight/40 to-transparent" />
      )}
    </Link>
  );
}
