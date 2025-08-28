import { useState, useEffect } from "react";
import GridBackground from './component/GridBackground';
import Loading2D from './component/LoadingScreen'; // <-- import the new loading screen
import Section1 from "./sections/Section1";
import Section2 from "./sections/Section2";
import Section3 from "./sections/Section3";
import Section4 from "./sections/Section4";
import Section5 from "./sections/Section5";
import Section6 from "./sections/Section6";
import Header from "./sections/Header";
import Sidebar from "./sections/Sidebar";
import SmoothScrollWrapper from "./component/SmoothScrollWrapper";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate load time (or fetch initial data here)
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Show loading screen until ready
    return <Loading2D />;
  }

  return (
    <SmoothScrollWrapper>
      {({ scrollInstance }) => (
        <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden">
          <GridBackground />
          <Sidebar scrollInstance={scrollInstance} />
          <Header />

          <main className="relative z-0 flex flex-col w-full max-w-[1200px] mx-auto px-6">
            <section id="hero" className="w-full min-h-screen flex items-center justify-center">
              <Section1 />
            </section>
            <section id="section1" className="w-full min-h-screen flex items-center justify-center">
              <Section2 />
            </section>
            <section id="section2" className="w-full min-h-screen flex items-center justify-center">
              <Section3 />
            </section>
            <section id="section3" className="w-full min-h-screen flex items-center justify-center">
              <Section4 />
            </section>
            <section id="section4" className="w-full min-h-screen flex items-center justify-center">
              <Section5 />
            </section>
            <section id="section5" className="w-full min-h-screen flex items-center justify-center">
              <Section6 />
            </section>
          </main>
        </div>
      )}
    </SmoothScrollWrapper>
  );
}

export default App;
