import { useState } from "react";
import GlassCard from "../component/GlassCard";

export default function Section3() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlassCard>
      <div className="flex flex-col">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-5xl font-bold mb-6 text-white flex justify-between items-center hover:scale-101 transition-transform"
        >
          Projects
          <span className="ml-4 text-2xl">{isOpen ? "▲" : "▼"}</span>
        </button>

        {/* Dropdown Content */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition mt-4">
            <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-white">
              iPhone Three.js Animation
            </h3>
            <p className="text-md opacity-80 mb-4 text-white">
              Built a scroll-driven 3D landing page using{" "}
              <span className="font-semibold">React Three Fiber</span> and{" "}
              <span className="font-semibold">Tailwind CSS</span>. Features a
              rotating iPhone model, smooth camera transitions, and text synced
              with animations — inspired by Apple’s product showcases.
            </p>
            <div className="flex gap-4">
              <a
                href="https://andreicai.github.io/Project1/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl 
                           transition-transform duration-300 hover:scale-110"
              >
                Live Demo
              </a>
              <a
                href="https://github.com/ANDREICai/Project1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-xl 
                           transition-transform duration-300 hover:scale-110"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
