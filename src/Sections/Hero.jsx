import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import GridBackground from "../component/GridBackground";
import  Model  from "../component/Block1";
import CameraAnimation from "../component/cameraRig3";

export default function Hero() {
  return (
    <div id="hero-section" className="relative w-screen h-[200vh] bg-black">
      {/* Candlestick grid */}
      <GridBackground />

      {/* Fixed 3D scene */}
      <div className="fixed top-0 left-0 w-screen h-screen z-10">
        <Canvas camera={{ position: [0, 0.6, -6], fov: 75 }}>
          <Environment>
            <Lightformer
              intensity={4}
              position={[0, 10, -10]}
              scale={[30, 10, 1]}
            />
          </Environment>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={3} />

          <CameraAnimation />
        </Canvas>
      </div>
    </div>
  );
}
