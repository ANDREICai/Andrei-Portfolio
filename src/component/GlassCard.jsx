// GlassCard.js
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GlassCard({ children, className = "" }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;

gsap.fromTo(
  el,
  { y: 50, opacity: 0, scale: 0.95 },
  {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play reverse play reverse",
    },
  }
);

  }, []);

  return (
<div
  ref={cardRef}
  className={`relative w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl
              px-6 py-10 my-50
              backdrop-blur-lg border border-white/20
              rounded-3xl shadow-lg text-white text-center
              transform ${className}`}
>
      {children}
    </div>
  );
}
