import { useCallback, useEffect, useState } from "react";

const KEY = "memory-vault-unlocked";
const EVENT = "memory-vault-change";

export function isVaultUnlocked() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function unlockVault() {
  try {
    window.localStorage.setItem(KEY, "true");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function relockVault() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Hydration-safe read of the vault state. */
export function useVault() {
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setUnlocked(isVaultUnlocked());
    sync();
    setHydrated(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const unlock = useCallback(() => unlockVault(), []);

  return { unlocked, hydrated, unlock };
}
