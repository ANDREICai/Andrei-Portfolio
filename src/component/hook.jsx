import { useState, useEffect } from "react";
import { gridColorStore } from "./GridBackground";

export function useDynamicTextColor() {
  const [color, setColor] = useState("#fff");

  useEffect(() => {
    let rafId;

    let currentVal = 255; // start white

    const lerp = (a, b, t) => a + (b - a) * t;

    const updateColor = () => {
      const bgVal = gridColorStore.value; // assume 0-255 grayscale

      // Compute perceived brightness (0=dark, 255=light)
      const brightness = bgVal;

      // Compute target text brightness for good contrast
      let targetVal = brightness > 128 ? 0 : 255;

      // Smooth but faster transition
      currentVal = lerp(currentVal, targetVal, 0.25); // increased from 0.08 → 0.25

      const hex = Math.round(currentVal).toString(16).padStart(2, "0");
      setColor(`#${hex}${hex}${hex}`);

      rafId = requestAnimationFrame(updateColor);
    };

    rafId = requestAnimationFrame(updateColor);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return color;
}
