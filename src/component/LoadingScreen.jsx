import { useEffect, useRef, useState } from "react";

export default function Loading2D({ onFinish }) {
  const canvasRef = useRef(null);
  const candles = useRef([]);
  const NUM_CANDLES = 120;
  const LANE_WIDTH = 16;

  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const numLanes = Math.floor(canvas.width / LANE_WIDTH);

    // Initialize candles
    const createCandles = () => {
      candles.current = [];
      for (let i = 0; i < NUM_CANDLES; i++) {
        const lane = Math.floor(Math.random() * numLanes);
        candles.current.push({
          x: lane * LANE_WIDTH + 4,
          y: Math.random() * canvas.height,
          speed: 0.2 + Math.random() * 0.3,
          bodyHeight: 12 + Math.random() * 28,
          wickHeight: 4 + Math.random() * 10,
          color: Math.random() > 0.5 ? "#33ff33" : "#ff3333",
          opacity: 0, // fade-in
        });
      }
    };
    createCandles();

    // Animate candles and grid
    const animate = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw white grid
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw candles
      candles.current.forEach((c) => {
        if (c.opacity < 1) c.opacity += 0.005; // subtle fade-in

        ctx.globalAlpha = c.opacity;
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, 6, c.bodyHeight);

        ctx.beginPath();
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2;
        ctx.moveTo(c.x + 3, c.y);
        ctx.lineTo(c.x + 3, c.y - c.wickHeight);
        ctx.moveTo(c.x + 3, c.y + c.bodyHeight);
        ctx.lineTo(c.x + 3, c.y + c.bodyHeight + c.wickHeight);
        ctx.stroke();

        c.y += c.speed;
        if (c.y - c.wickHeight > canvas.height) c.y = -c.bodyHeight - c.wickHeight;
      });
      ctx.globalAlpha = 1;

      // Animate "Loading Market Data..."
      const dotCount = Math.floor((performance.now() / 400) % 4);
      const dotsStr = ".".repeat(dotCount);
      ctx.font = "32px monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(`Loading Market Data${dotsStr}`, canvas.width / 2, canvas.height / 2);

      requestAnimationFrame(animate);
    };
    animate();

    // Fade-out after 2.5s
    const fadeTimer = setTimeout(() => {
      const fadeInterval = setInterval(() => {
        setOpacity((prev) => {
          if (prev <= 0) {
            clearInterval(fadeInterval);
            if (onFinish) onFinish();
            return 0;
          }
          return prev - 0.01;
        });
      }, 16); // ~60fps
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      window.removeEventListener("resize", resize);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        opacity,
        transition: "opacity 1s linear",
        position: "fixed",
        inset: 0,
        zIndex: 50,
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
