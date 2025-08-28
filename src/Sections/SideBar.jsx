import { useState, useEffect, useRef } from "react";
import { useDynamicTextColor } from "../component/hook";

const sections = [
  { id: "hero", label: "Home" },
  { id: "section1", label: "Experience" },
  { id: "section2", label: "Projects" },
  { id: "section3", label: "Skills" },
  { id: "section4", label: "Contact" },
  { id: "section5", label: "Extra" },
];

export default function Sidebar({ scrollInstance }) {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const positionsRef = useRef([]);
  const snapTimeout = useRef(null);
  const textColor = useDynamicTextColor();
  const [offsets, setOffsets] = useState(sections.map(() => 0));
  const [scales, setScales] = useState(sections.map(() => 1));

  useEffect(() => {
    if (!scrollInstance) return;

    const getPositions = () =>
      sections.map(({ id }) => {
        const elem = document.getElementById(id);
        if (!elem) return { id, top: 0, bottom: 0, center: 0 };
        const top = elem.offsetTop;
        const height = elem.offsetHeight;
        return { id, top, bottom: top + height, center: top + height / 2 };
      });

    const updatePositions = () => {
      positionsRef.current = getPositions();
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    const handleScroll = () => {
      const scrollCenter = scrollInstance.scroll + window.innerHeight / 2;

      let nearest = positionsRef.current[0];
      let minDist = Math.abs(scrollCenter - nearest.center);

      positionsRef.current.forEach((sec) => {
        const dist = Math.abs(scrollCenter - sec.center);
        if (dist < minDist) {
          nearest = sec;
          minDist = dist;
        }
      });

      setActiveSection(nearest.id);

      const activeIndex = sections.findIndex((s) => s.id === nearest.id);
      const maxOffset = 40; // active button
      const offsetsTemp = [];
      const scalesTemp = [];

      sections.forEach((_, i) => {
        const distance = Math.abs(i - activeIndex);

        // Ripple X offset
        let offset = Math.max(0, maxOffset - distance * 10);
        offsetsTemp[i] = offset;

        // Ripple scale
        if (distance === 0) scalesTemp[i] = 1.25;
        else if (distance === 1) scalesTemp[i] = 1.15;
        else if (distance === 2) scalesTemp[i] = 1.08;
        else scalesTemp[i] = 1;
      });

      setOffsets(offsetsTemp);
      setScales(scalesTemp);

      if (snapTimeout.current) clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(() => {
        const targetScroll = nearest.center - window.innerHeight / 2;
        scrollInstance.scrollTo(targetScroll, {
          duration: 0.8,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      }, 150);
    };

    scrollInstance.on("scroll", handleScroll);
    handleScroll();

    return () => {
      scrollInstance.off("scroll", handleScroll);
      window.removeEventListener("resize", updatePositions);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, [scrollInstance]);

  const handleClick = (id) => {
    const elem = document.getElementById(id);
    if (!elem || !scrollInstance) return;

    const sectionTop = elem.offsetTop;
    const sectionHeight = elem.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollTo = sectionTop - (viewportHeight / 2 - sectionHeight / 2);

    scrollInstance.scrollTo(scrollTo, {
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  };

  return (
    <nav className="fixed top-1/2 left-6 transform -translate-y-1/2 z-50 flex flex-col gap-4">
      {sections.map((section, index) => {
        const useBlack = ["section3", "section4", "section5"].includes(activeSection);
        const baseClasses = "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300";

        return (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            style={{
              color: textColor,
  transform: `translateX(${offsets[index]}px) scale(${scales[index]})`,
  transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), color 0.1s linear",
            }}
            className={`
              ${baseClasses}
              ${
                activeSection === section.id
                  ? useBlack
                    ? "bg-black/40"
                    : "bg-white/40"
                  : useBlack
                    ? "hover:bg-black/20"
                    : "hover:bg-white/20"
              }
            `}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
