import { useEffect, useRef } from "react";

// Shared store for text color brightness
export const gridColorStore = { value: 0 };

export default function GridBackground() {
  const canvasRef = useRef(null);
  const bufferRef = useRef(null);
  const ripples = useRef([]);
  const candles = useRef([]);
  const NUM_CANDLES = 120;
  const MAX_RIPPLES = 15;
  const LANE_WIDTH = 16;
  const cursor = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    bufferRef.current = document.createElement("canvas");
    const buffer = bufferRef.current;
    const bctx = buffer.getContext("2d");

    let scrollFactor = 0;
    const smoothFactor = { value: 0 };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const endScroll = document.body.scrollHeight - window.innerHeight;
      scrollFactor = Math.min(Math.max(scrollTop / endScroll, 0), 1);
    };
    window.addEventListener("scroll", handleScroll);

    const resize = () => {
      canvas.width = buffer.width = window.innerWidth;
      canvas.height = buffer.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const numLanes = Math.floor(buffer.width / LANE_WIDTH);

    const createCandles = () => {
      const usedLanes = new Set();
      candles.current = [];
      for (let i = 0; i < NUM_CANDLES; i++) {
        let lane;
        do lane = Math.floor(Math.random() * numLanes);
        while (usedLanes.has(lane));
        usedLanes.add(lane);

        candles.current.push({
          x: lane * LANE_WIDTH + 4,
          y: Math.random() * buffer.height,
          speed: 0.3 + Math.random() * 0.7,
          bodyHeight: 12 + Math.random() * 28,
          wickHeight: 4 + Math.random() * 10,
          color: Math.random() > 0.5 ? "#33ff33" : "#ff3333",
        });
      }
    };
    createCandles();

    const addRipple = (x, y, strong = false) => {
      ripples.current.push({
        x,
        y,
        radius: strong ? 120 : 100,
        alpha: strong ? 0.8 : 0.5,
        speed: strong ? 8 : 5,
        decay: strong ? 0.94 : 0.96,
      });
      if (ripples.current.length > MAX_RIPPLES) ripples.current.shift();
    };

    const handleMouseMove = (e) => {
      cursor.current.targetX = e.clientX;
      cursor.current.targetY = e.clientY;
      if (Math.random() < 0.1) addRipple(e.clientX, e.clientY);
    };

    const handleClick = (e) => addRipple(e.clientX, e.clientY, true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const drawCandles = () => {
      bctx.clearRect(0, 0, buffer.width, buffer.height);
      candles.current.forEach((c) => {
        bctx.fillStyle = c.color;
        bctx.shadowBlur = 4;
        bctx.shadowColor = c.color;
        bctx.fillRect(c.x, c.y, 6, c.bodyHeight);
        bctx.shadowBlur = 0;

        bctx.beginPath();
        bctx.strokeStyle = c.color;
        bctx.lineWidth = 2;
        bctx.moveTo(c.x + 3, c.y);
        bctx.lineTo(c.x + 3, c.y - c.wickHeight);
        bctx.moveTo(c.x + 3, c.y + c.bodyHeight);
        bctx.lineTo(c.x + 3, c.y + c.bodyHeight + c.wickHeight);
        bctx.stroke();

        c.y += c.speed;
        if (c.y - c.wickHeight > buffer.height) {
          c.y = -c.bodyHeight - c.wickHeight;
          c.speed = 0.3 + Math.random() * 0.7;
          c.bodyHeight = 12 + Math.random() * 28;
          c.wickHeight = 4 + Math.random() * 10;
          c.color = Math.random() > 0.5 ? "#33ff33" : "#ff3333";
        }
      });
    };

    const drawDistortion = (x, y, radius, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;

      const blockSize = 64;
      for (let i = Math.max(0, x - radius); i < Math.min(buffer.width, x + radius); i += blockSize) {
        for (let j = Math.max(0, y - radius); j < Math.min(buffer.height, y + radius); j += blockSize) {
          const dx = i + blockSize / 2 - x;
          const dy = j + blockSize / 2 - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius) {
            const strength = (radius - dist) / radius;
            const offsetX = Math.sin((i + performance.now() / 200) / 25) * strength * 6;
            const offsetY = Math.cos((j + performance.now() / 200) / 25) * strength * 6;
            ctx.drawImage(buffer, i, j, blockSize, blockSize, i + offsetX, j + offsetY, blockSize, blockSize);
          }
        }
      }

      ctx.restore();
    };

    const drawRipples = () => {
      ripples.current.forEach((r) => {
        r.radius += r.speed;
        r.alpha *= r.decay;
        if (r.alpha > 0.01) drawDistortion(r.x, r.y, r.radius, r.alpha);
      });
      ripples.current = ripples.current.filter((r) => r.alpha > 0.01);
    };

    const drawGrid = () => {
      // grid color inversely proportional to background
      const lineVal = 255 - Math.floor(smoothFactor.value * 255);
      const alpha = lineVal < 128 ? 0.25 : 0.1;
      ctx.strokeStyle = `rgba(${lineVal},${lineVal},${lineVal},${alpha})`;
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
    };

    const animate = () => {
      cursor.current.x += (cursor.current.targetX - cursor.current.x) * 0.15;
      cursor.current.y += (cursor.current.targetY - cursor.current.y) * 0.15;

      smoothFactor.value += (scrollFactor - smoothFactor.value) * 0.05;

      if (performance.now() % 10 < 1) {
        ripples.current.push({
          x: cursor.current.x,
          y: cursor.current.y,
          radius: 90,
          alpha: 0.25,
          speed: 3,
          decay: 0.97,
        });
      }

      const bgVal = Math.floor(smoothFactor.value * 255);
      ctx.fillStyle = `rgb(${bgVal},${bgVal},${bgVal})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gridColorStore.value = bgVal;

      drawGrid();
      drawCandles();
      drawRipples();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />;
}
