import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Enhanced particle system for dynamic background
function ParticleField() {
  const particlesRef = useRef();
  const particleCount = 800;
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spread particles in a larger volume
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;
      
      // Color variation with blues and whites
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i3] = 0.2;     // R
        colors[i3 + 1] = 0.6; // G
        colors[i3 + 2] = 1.0; // B
      } else if (colorChoice < 0.6) {
        colors[i3] = 0.4;     // R
        colors[i3 + 1] = 0.8; // G
        colors[i3 + 2] = 1.0; // B
      } else {
        colors[i3] = 0.9;     // R
        colors[i3 + 1] = 0.95; // G
        colors[i3 + 2] = 1.0; // B
      }
      
      sizes[i] = Math.random() * 3 + 1;
    }
    
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.02;
        positions[i3] += Math.cos(time * 0.3 + i * 0.02) * 0.01;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={particleCount}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - (dist * 2.0);
            alpha = pow(alpha, 2.0);
            
            gl_FragColor = vec4(vColor, alpha * 0.8);
          }
        `}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Enhanced globe with continental outlines
function EnhancedGlobe() {
  const globeRef = useRef();
  const innerGlobeRef = useRef();
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (innerGlobeRef.current) {
      innerGlobeRef.current.rotation.y = state.clock.elapsedTime * -0.05;
    }
  });

  return (
    <group>
      {/* Outer wireframe globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[30, 32, 24]} />
        <meshBasicMaterial 
          color="#1976d2" 
          wireframe 
          transparent 
          opacity={0.2} 
        />
      </mesh>
      
      {/* Inner solid globe with gradient */}
      <mesh ref={innerGlobeRef}>
        <sphereGeometry args={[28, 32, 24]} />
        <shaderMaterial
          uniforms={{
            time: { value: 0 }
          }}
          vertexShader={`
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float time;
            
            void main() {
              vPosition = position;
              vNormal = normal;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float time;
            
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
              vec3 atmosphere = vec3(0.1, 0.4, 0.8) * intensity;
              
              float fresnel = pow(1.0 + dot(vNormal, vec3(0, 0, 1)), 2.0);
              vec3 glow = vec3(0.2, 0.6, 1.0) * fresnel * 0.5;
              
              gl_FragColor = vec4(atmosphere + glow, 0.6);
            }
          `}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Equatorial rings */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[32, 0.2, 8, 64]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[32, 0.15, 8, 64]} />
        <meshBasicMaterial color="#64b5f6" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Dynamic connection nodes with pulsing animation
function ConnectionNode({ position, color, scale = 1 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const pulse = 1 + Math.sin(time * 3 + position[0]) * 0.3;
      meshRef.current.scale.setScalar(scale * pulse * (hovered ? 1.5 : 1));
      meshRef.current.material.opacity = 0.8 + Math.sin(time * 2 + position[1]) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial color={color} transparent />
      </mesh>
      {/* Glow effect */}
      <mesh scale={2}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Enhanced network with curved connections
function GlobalNetwork() {
  const { nodes, connections } = useMemo(() => {
    // Major global financial centers
    const nodePositions = [
      [-25, 15, -8],   // London
      [20, 12, -15],   // Singapore
      [-30, 8, 12],    // New York
      [15, 18, 5],     // Tokyo
      [-5, -12, 25],   // Dubai
      [8, -15, -20],   // Sydney  
      [-15, 20, 0],    // Zurich
      [25, -8, 18],    // Hong Kong
      [-20, -10, -15], // São Paulo
      [12, 5, 22],     // Mumbai
    ];

    const nodes = nodePositions.map((pos, idx) => ({
      position: pos,
      color: ['#64b5f6', '#42a5f5', '#1976d2', '#90caf9'][idx % 4],
      scale: 1 + Math.random() * 0.5
    }));

    const connections = [];
    for (let i = 0; i < nodePositions.length; i++) {
      const connectCount = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < connectCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodePositions.length);
        if (targetIndex !== i) {
          connections.push({
            start: nodePositions[i],
            end: nodePositions[targetIndex],
            color: '#64b5f6'
          });
        }
      }
    }

    return { nodes, connections };
  }, []);

  return (
    <>
      {connections.map((conn, idx) => (
        <CurvedLine key={`line-${idx}`} {...conn} />
      ))}
      {nodes.map((node, idx) => (
        <ConnectionNode key={`node-${idx}`} {...node} />
      ))}
    </>
  );
}

// Curved connection lines with animation
function CurvedLine({ start, end, color }) {
  const lineRef = useRef();
  
  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = startVec.clone().lerp(endVec, 0.5);
    midPoint.multiplyScalar(1.3); // Curve outward from globe center
    
    return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  }, [start, end]);
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={lineRef}>
      <tubeGeometry args={[curve, 32, 0.1, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// Premium camera controls with smooth transitions
function CinematicCamera() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.15;
    const radius = 80 + Math.sin(time * 0.5) * 20;
    
    camera.position.x = Math.sin(time) * radius;
    camera.position.z = Math.cos(time) * radius;
    camera.position.y = 20 + Math.sin(time * 0.7) * 15;
    
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });
  
  return null;
}

// Floating energy orbs for visual interest
function EnergyOrbs() {
  const orbsData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 120
      ],
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      size: 2 + Math.random() * 3
    }));
  }, []);

  return (
    <>
      {orbsData.map((orb, idx) => (
        <EnergyOrb key={idx} {...orb} index={idx} />
      ))}
    </>
  );
}

function EnergyOrb({ position, speed, phase, size, index }) {
  const orbRef = useRef();
  
  useFrame((state) => {
    if (orbRef.current) {
      const time = state.clock.elapsedTime;
      orbRef.current.position.y = position[1] + Math.sin(time * speed + phase) * 8;
      orbRef.current.position.x = position[0] + Math.cos(time * speed * 0.7 + phase) * 5;
      orbRef.current.rotation.x = time * 0.5;
      orbRef.current.rotation.y = time * 0.7;
      
      const pulse = 1 + Math.sin(time * 2 + index) * 0.3;
      orbRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={orbRef} position={position}>
      <octahedronGeometry args={[size, 2]} />
      <meshBasicMaterial 
        color="#90caf9" 
        transparent 
        opacity={0.6}
        wireframe
      />
    </mesh>
  );
}

// Main component with enhanced visuals
export default function FooterMontfront() {
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden rounded-4xl">
      <Canvas 
        camera={{ position: [60, 25, 60], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <fog attach="fog" args={['#0a0a2e', 50, 200]} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.2} color="#e3f2fd" />
        <pointLight position={[30, 30, 30]} intensity={0.8} color="#64b5f6" />
        <pointLight position={[-30, -30, -30]} intensity={0.6} color="#1976d2" />
        <spotLight 
          position={[0, 50, 0]} 
          angle={0.3} 
          penumbra={1} 
          intensity={0.5} 
          color="#42a5f5"
          target-position={[0, 0, 0]}
        />
        
        <ParticleField />
        <EnhancedGlobe />
        <GlobalNetwork />
        <EnergyOrbs />
        <CinematicCamera />
      </Canvas>
      
      {/* Enhanced content overlay */}

      
      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-blue-950/20 z-5"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-5"></div>
    </div>
  );
}