"use client";

import { useEffect, useState } from "react";

/**
 * Hook to track when hydration is complete.
 * Prevents hydration mismatches by ensuring components wait for client-side hydration
 * before rendering content that depends on localStorage or other browser APIs.
 * 
 * Returns true only after the component has mounted on the client side.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Using a microtask to avoid setState during effect warning
    Promise.resolve().then(() => setHydrated(true));
  }, []);

  return hydrated;
}
