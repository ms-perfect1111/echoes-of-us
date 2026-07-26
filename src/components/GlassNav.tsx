import { Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import { useVault } from "@/lib/vault";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/maze", label: "The Way Back" },
  { to: "/gallery", label: "Memories" },
  { to: "/hug", label: "Hug" },
  { to: "/letter", label: "Letter" },
] as const;

export const GlassNav = () => {
  const { unlocked, hydrated } = useVault();

  return (
    <nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="glass-panel flex items-center gap-1 rounded-full px-2 py-2 sm:gap-2 sm:px-3">
        {links.map((l) => {
          const gated = l.to === "/gallery" && hydrated && !unlocked;
          return (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground bg-white/10" }}
              className={cn(
                "relative rounded-full px-3 py-1.5 text-[0.68rem] tracking-[0.22em] text-foreground/60 uppercase transition-all duration-300 hover:bg-white/10 hover:text-foreground sm:text-[0.72rem]",
              )}
            >
              <span className="flex items-center gap-1.5">
                {gated && <Lock className="size-3 opacity-70" aria-hidden />}
                {l.to === "/gallery" && unlocked && (
                  <Sparkles className="size-3 text-starlight" aria-hidden />
                )}
                {l.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default GlassNav;
