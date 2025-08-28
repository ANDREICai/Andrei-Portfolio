import { useState } from "react";
import FooterMontfront from "../component/FooterMontFront";
import GlassCard from "../component/GlassCard";

export default function Section6() {
  const [isOpen, setIsOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const startDrag = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.parentElement.getBoundingClientRect();

    const update = (clientX) => {
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pct);
    };

    const handleMouseMove = (ev) => update(ev.clientX);
    const handleTouchMove = (ev) => update(ev.touches[0].clientX);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);

    const stop = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchend", stop);
    };

    document.addEventListener("mouseup", stop);
    document.addEventListener("touchend", stop);
  };

  return (
    <GlassCard>
      <div className="flex flex-col">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl font-semibold mb-3 text-black flex justify-between items-center hover:scale-101 transition-transform"
        >
          Three.js
          <span className="ml-2 text-xl">{isOpen ? "▲" : "▼"}</span>
        </button>

        {/* Dropdown */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative w-full h-80 rounded-lg overflow-hidden ">
            
            {/* Original */}
            <div className="absolute inset-0">
              <FooterMontfront />
            </div>

            {/* Inverted */}
            <div
              className="absolute inset-0"
              style={{
                filter: "invert(1) hue-rotate(180deg)",
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <FooterMontfront />
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
              style={{ left: `${sliderPosition}%` }}
            />

            {/* Handle */}
            <div
              className="absolute top-1/2 w-6 h-6 bg-white rounded-full border border-gray-400 z-30 cursor-pointer transform -translate-y-1/2 -translate-x-1/2 shadow-sm hover:scale-110 transition"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            />

            {/* Labels */}
            <span className="absolute top-3 left-3 text-xs text-gray-600">Inverted</span>
            <span className="absolute top-3 right-3 text-xs text-white/80">Original</span>
          </div>

          {/* Small note */}
<p className="text-center text-xs text-black/50 mt-10 animate-bounce">
  Drag to compare original vs inverted rendering
</p>
        </div>
      </div>
    </GlassCard>
  );
}
