import React, { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Html, ContactShadows, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import GlassCard from "../component/GlassCard";
// Glass card component (assuming you have this)

const skills = [
  { name: "React", color: "#61DAFB", desc: "Frontend library for building UI components." },
  { name: "Tailwind", color: "#0DC9A0", desc: "Utility-first CSS framework for rapid styling." },
  { name: "HTML", color: "#E34F26", desc: "Markup language for structuring web pages." },
  { name: "CSS", color: "#2965F1", desc: "Stylesheet language for designing web pages." },
  { name: "Javascript", color: "#F7DF1E", desc: "Programming language for interactive websites." },
  { name: "Three.js", color: "#8E44AD", desc: "3D library for web-based graphics." },
  { name: "Node.js", color: "#3C873A", desc: "Backend JavaScript runtime environment." },
  { name: "Python", color: "#306998", desc: "General-purpose programming language." },
  { name: "AI", color: "#FF6D00", desc: "Artificial Intelligence tools and APIs." },
];

// Enhanced background with floating particles
function EnhancedBackground() {
  const { scene } = useThree();
  
  useMemo(() => {
    // Add fog for depth
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
  }, [scene]);

  return (
    <>
      {/* Ambient particles */}
      <Sparkles 
        count={100} 
        scale={[150, 150, 150]} 
        size={2} 
        speed={0.3}
        opacity={1}
        color="#ffffff"
      />
      
      {/* Colored light particles */}
      <Sparkles 
        count={30} 
        scale={[120, 120, 120]} 
        size={3} 
        speed={0.5}
        opacity={0.3}
        color="#3b82f6"
      />
    </>
  );
}

// Generate random non-overlapping positions
const randomPositions = [];
const minDistance = 2.2;
for (let i = 0; i < skills.length; i++) {
  let pos, ok = false, tries = 0;
  while (!ok && tries < 500) {
    pos = [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6];
    ok = randomPositions.every(([x, y, z]) => {
      const dx = x - pos[0], dy = y - pos[1], dz = z - pos[2];
      return Math.sqrt(dx*dx + dy*dy + dz*dz) >= minDistance;
    });
    tries++;
  }
  randomPositions.push(pos || [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4]);
}

function SkillSphere({ index, skill, hoveredIndex, setHoveredIndex, positionsRef, mouse }) {
  const groupRef = useRef();
  const sphereRef = useRef();
  const glowRef = useRef();
  const innerSphereRef = useRef();
  const current = useRef([...randomPositions[index]]);
  const target = useRef([...current.current]);
  const scaleRef = useRef(1);
  const rot = useRef([Math.random() * Math.PI, Math.random() * Math.PI, 0]);
  const pulseRef = useRef(0);

  // Enhanced materials
  const sphereMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: skill.color,
    roughness: 0.1,
    metalness: 0.7,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    transmission: 0.2,
    thickness: 0.4,
    ior: 1.5,
    emissive: new THREE.Color(skill.color).multiplyScalar(0.1),
  }), [skill.color]);

  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: skill.color,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
  }), [skill.color]);

  const innerMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: skill.color,
    transparent: true,
    opacity: 0.2,
  }), [skill.color]);

  useFrame((state, dt) => {
    pulseRef.current += dt * 2;
    let [tx, ty, tz] = randomPositions[index];

    // Repulsion from hovered spheres
    if (hoveredIndex !== null && hoveredIndex !== index) {
      const [hx, hy, hz] = positionsRef.current[hoveredIndex] || [0,0,0];
      const dx = tx - hx, dy = ty - hy, dz = tz - hz;
      const dist = Math.max(0.001, Math.sqrt(dx*dx + dy*dy + dz*dz));
      const force = Math.min(2.2 / (dist + 0.1), 1);
      tx += (dx / dist) * force * 0.9;
      ty += (dy / dist) * force * 0.9;
      tz += (dz / dist) * force * 0.9;
    }

    // Cursor-follow effect for hovered sphere
    if (hoveredIndex === index) {
      const factor = 0.8;
      tx += mouse.current[0] * factor;
      ty += mouse.current[1] * factor;
    }

    target.current = [tx, ty, tz];

    // Smooth interpolation
    const k = 0.12;
    current.current[0] += (target.current[0] - current.current[0]) * k;
    current.current[1] += (target.current[1] - current.current[1]) * k;
    current.current[2] += (target.current[2] - current.current[2]) * k;
    positionsRef.current[index] = [...current.current];

    // Scale animation
    const desiredScale = hoveredIndex === index ? 1.6 : 1;
    scaleRef.current += (desiredScale - scaleRef.current) * 0.18;

    // Apply position, rotation, scale
    if (groupRef.current) {
      groupRef.current.position.set(...current.current);
      groupRef.current.scale.setScalar(scaleRef.current);
      rot.current[0] += dt * 0.25 * (hoveredIndex === index ? 1.5 : 1);
      rot.current[1] += dt * 0.2 * (hoveredIndex === index ? 1.5 : 1);
      groupRef.current.rotation.set(rot.current[0], rot.current[1], 0);
    }

    // Enhanced material effects
    const isHovered = hoveredIndex === index;
    const pulse = Math.sin(pulseRef.current) * 0.5 + 0.5;
    
    if (sphereRef.current?.material) {
      sphereRef.current.material.emissiveIntensity = isHovered ? 0.6 + pulse * 0.2 : 0.15 + pulse * 0.05;
    }
    
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = isHovered ? 0.3 + pulse * 0.15 : 0.12 + pulse * 0.03;
    }
    
    if (innerSphereRef.current?.material) {
      innerSphereRef.current.material.opacity = isHovered ? 0.4 + pulse * 0.2 : 0.15 + pulse * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={1}>
      <group
        ref={groupRef}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredIndex(index); document.body.style.cursor = "pointer"; }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredIndex(null); document.body.style.cursor = "default"; }}
      >
        {/* Large invisible hit sphere */}
        <mesh visible={false}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Outer glow */}
        <mesh ref={glowRef} scale={1.3}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <primitive object={glowMaterial} />
        </mesh>

        {/* Inner energy sphere */}
        <mesh ref={innerSphereRef} scale={0.6}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <primitive object={innerMaterial} />
        </mesh>

        {/* Core sphere */}
        <mesh ref={sphereRef}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <primitive object={sphereMaterial} />
        </mesh>

        {/* Wireframe overlay */}
        <mesh scale={1.02}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial 
            color={skill.color} 
            wireframe 
            transparent 
            opacity={hoveredIndex === index ? 0.25 : 0.08}
          />
        </mesh>

        {/* Enhanced Tooltip */}
        {hoveredIndex === index && (
          <Html 
            center 
            style={{ 
              pointerEvents: "none", 
              transform: "translateY(-2.2em)",
            }}
          >
            <div
              className="px-4 py-3 rounded-xl shadow-2xl text-sm text-white bg-black/90 backdrop-blur-md border border-white/30 flex flex-col items-center w-48 transform transition-all duration-300"
              style={{ 
                textAlign: "center",
                boxShadow: `0 10px 40px rgba(${parseInt(skill.color.slice(1,3), 16)}, ${parseInt(skill.color.slice(3,5), 16)}, ${parseInt(skill.color.slice(5,7), 16)}, 0.3)`
              }}
            >
              <div className="text-2xl mb-2">{skill.icon}</div>
              <div className="font-bold text-lg mb-1" style={{color: skill.color}}>
                {skill.name}
              </div>
              <div className="opacity-90 text-xs leading-relaxed">
                {skill.desc}
              </div>
            </div>
          </Html>
        )}

        {/* Hover glow */}
        {hoveredIndex === index && (
          <pointLight 
            intensity={1.2} 
            distance={4} 
            color={skill.color}
            decay={2}
          />
        )}
      </group>
    </Float>
  );
}

export default function Section4() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const positionsRef = useRef(randomPositions.map((p) => [...p]));
  const mouse = useRef([0, 0]);

  // Hint is visible only if not hovering and not dragging
  const dragHintVisible = !isDragging && hoveredIndex === null;

  return (
    <GlassCard>
      <h2 className="text-4xl font-bold mb-6 text-center text-black">Skills</h2>
      <div
        className="w-full h-[300px] relative rounded-2xl overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          mouse.current = [x, y];
        }}
        style={{
          background: "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.95) 100%)"
        }}
      >
        {/* Enhanced drag hint */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 transition-all duration-1000"
          style={{ 
            opacity: dragHintVisible ? 1 : 0,
            transform: dragHintVisible ? 'scale(1)' : 'scale(0.8)'
          }}
        >
          <div
            className=" text-white px-6 py-3 rounded-xl text-sm font-medium select-none backdrop-blur-sm border border-white/20 shadow-lg"
            style={{
              animation: dragHintVisible ? "dragBounce 1.5s ease-in-out infinite" : "none",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
            }}
          >
            🖱️ Drag to explore • Hover to learn more
          </div>
        </div>

        <Suspense fallback={
                <Html center>
                  <div className="flex flex-col items-center text-black">
                    <div className="loader w-12 h-12 border-4 border-t-4 border-white rounded-full animate-spin mb-4"></div>
                    <p>Loading 3D Model...</p>
                  </div>
                </Html>
        }>
          <Canvas
            camera={{ position: [0, 0, 14], fov: 55 }}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance"
            }}
          >
            {/* Enhanced lighting setup */}
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[8, 10, 5]} 
              intensity={1.2} 
              color="#ffffff"
            />
            <directionalLight 
              position={[-8, -6, -5]} 
              intensity={0.4} 
              color="#3b82f6" 
            />
            <pointLight 
              position={[0, 0, 10]} 
              intensity={0.6} 
              color="#8b5cf6" 
            />

            {/* HDRI environment */}
            
            <EnhancedBackground />
            
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.5}
              onStart={() => setIsDragging(true)}
              onEnd={() => setIsDragging(false)}
            />
        
            {skills.map((skill, index) => (
              <SkillSphere
                key={skill.name}
                index={index}
                skill={skill}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                positionsRef={positionsRef}
                mouse={mouse}
              />
            ))}
            
            <ContactShadows
              position={[0, -3.2, 0]}
              scale={30}
              blur={2.6}
              opacity={0.35}
              far={8}
              color="#000000"
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Enhanced bounce keyframes */}
      <style>{`
        @keyframes dragBounce {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.9;
          }
          50% { 
            transform: translateY(-10px) scale(1.02); 
            opacity: 1;
          }
        }
      `}</style>
    </GlassCard>
  );
}