import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SmoothScrollWrapper({ children }) {
  const [lenisInstance, setLenisInstance] = useState(null);
  const lenisRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: true,
    });

    setLenisInstance(lenisRef.current);

    function raf(time) {
      lenisRef.current.raf(time);
      ScrollTrigger.update(); // Sync GSAP animations
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenisRef.current.destroy();
  }, []);

  if (!lenisInstance) return null;

  return <>{children({ scrollInstance: lenisInstance })}</>;
}
