import { createFileRoute } from "@tanstack/react-router";
import { GlassNav } from "@/components/GlassNav";
import { Starfield } from "@/components/Starfield";
import { GlassMaze } from "@/components/GlassMaze";

export const Route = createFileRoute("/maze")({
  head: () => ({
    meta: [
      { title: "The Way Back — A Maze Of Light" },
      {
        name: "description",
        content:
          "A glowing glass labyrinth about finding your way back to someone who matters. Solve it to unlock the hidden memory vault.",
      },
      { property: "og:title", content: "The Way Back — A Maze Of Light" },
      {
        property: "og:description",
        content: "Find the path through the light and open what's waiting on the other side.",
      },
    ],
  }),
  component: MazePage,
});

function MazePage() {
  return (
    <main className="relative min-h-screen">
      <GlassNav />
      <Starfield count={45} seed={19} />

      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-32 pb-24 text-center">
        <p className="text-[0.6rem] tracking-[0.5em] text-foreground/45 uppercase">
          Chapter one
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-none font-light text-halo">
          The way back
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/60">
          Distance is just a maze with a kinder name. Move the light through it, and
          something I've been keeping for you will finally open.
        </p>

        <div className="mt-16">
          <GlassMaze />
        </div>
      </section>
    </main>
  );
}
