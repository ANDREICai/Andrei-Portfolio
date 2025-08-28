import { useState, useRef, useEffect } from "react";
import GlassCard from "../component/GlassCard";

export default function Section2() {
  const [showCV, setShowCV] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const overlayRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      closeOverlay();
    }
  };

  const closeOverlay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowCV(false);
    }, 300); // match the transition duration
  };

  // Prevent background scrolling when CV is open
  useEffect(() => {
    if (showCV) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Cleanup: restore background scrolling
        document.body.style.overflow = 'unset';
      };
    }
  }, [showCV]);

  // Prevent all scrolling on the overlay backdrop
  const handleOverlayWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOverlayTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {/* CV Overlay */}
      {showCV && (
        <div
          ref={overlayRef}
          onClick={handleBackdropClick}
          onWheel={handleOverlayWheel}
          onTouchMove={handleOverlayTouchMove}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all duration-300 ${
            isClosing ? "opacity-0 backdrop-blur-none" : "opacity-100 backdrop-blur-sm"
          }`}
          style={{ touchAction: 'none' }}
        >
          <GlassCard
            className={`w-11/12 max-w-4xl p-8 relative transition-transform duration-300 ${
              isClosing ? "scale-95" : "scale-100"
            }`}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ touchAction: 'auto' }}
          >
            <h2 className="text-5xl font-bold mb-6 text-center">My CV</h2>

            {/* Scrollable content */}
            <div
              className="max-h-[70vh] overflow-y-auto text-white/90 space-y-6 pr-2"
            >
              {/* Personal Info */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">Personal Information</h3>
                <p>Name: Andrei Cornea</p>
                <p>Phone: 07472 405719</p>
                <p>Email: Andreicornea20@icloud.com</p>
                <p>Location: Whitburn, Bathgate</p>
                <p>Age: 18</p>
              </div>

              {/* Profile */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">Profile</h3>
                <p>
                  Hi, my name is Andrei. I am a highly reliable and proactive school leaver
                  with exceptional interpersonal skills and a growth mindset. I excel in
                  both collaborative and independent environments, consistently
                  demonstrating punctuality, professionalism, and solution-oriented thinking.
                </p>
              </div>

              {/* Core Competencies */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">Core Competencies</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Customer Excellence: customer service, active listening, conflict resolution</li>
                  <li>Operational Efficiency: time management, multitasking, organizational skills</li>
                  <li>Team Collaboration: reliable team contributor, supportive leadership potential</li>
                  <li>Personal Attributes: confidence under pressure, proactive problem-solving</li>
                  <li>Technical Skills: First Aid Certified (SCQF 6), Microsoft Office Suite, Creative Design</li>
                </ul>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">Education</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Politics (Grade A)</li>
                  <li>Business Management (Grade A)</li>
                  <li>Design & Manufacture (Grade B)</li>
                  <li>Modern Studies (Grade B)</li>
                  <li>Computing Science (Grade C)</li>
                  <li>English (Grade C)</li>
                  <li>National 5 Mathematics (Pass)</li>
                </ul>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">Certifications</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>First Aid at Work | SCQF Level 6</li>
                </ul>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">Experience</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Kastriot's Gyros 2 Go Livingston - Server (1 year)</li>
                  <li>Lickalicious Whitburn - Sweet Shop Server (1 year)</li>
                </ul>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">Interests</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Competitive Muay Thai Training</li>
                  <li>Fitness Regimen</li>
                  <li>Industry-Relevant Reading</li>
                  <li>Team-Based Social Activities</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={closeOverlay}
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/80 transition"
              >
                Close CV
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Main Section2 */}
      <GlassCard
        id="experience"
        className="flex flex-col items-center justify-center text-center"
      >
        <h2 className="text-5xl font-bold mb-6">Experience</h2>

        <div className="bg-white/5 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition mt-6 w-full max-w-xl">
          <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
            1 Years Experience coding.
          </h3>
        </div>

        <div className="bg-white/5 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition mt-6 w-full max-w-xl">
          <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setShowCV(true)}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg 
                         transition-transform duration-300 hover:scale-110 hover:bg-white/80"
            >
              View CV
            </button>
          </h3>
        </div>
      </GlassCard>
    </>
  );
}