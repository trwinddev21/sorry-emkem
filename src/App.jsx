import { useState, useCallback, useRef, useEffect } from 'react';
import FloatingParticles from './components/FloatingParticles';
import ApologyCard from './components/ApologyCard';
import AgreementPopup from './components/AgreementPopup';
import './App.css';

export default function App() {
  const [agreed, setAgreed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleAgree = useCallback(() => {
    setAgreed(true);
    setTimeout(() => setShowPopup(true), 400);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <div className="app-root">
      {/* Layered background */}
      <div className="bg-layer bg-texture" />
      <div className="bg-layer bg-image" />
      <div className="bg-layer bg-overlay" />

      {/* Floating ambient particles */}
      <FloatingParticles />

      {/* Main content */}
      <main className="app-main">
        <ApologyCard onAgree={handleAgree} agreed={agreed} />
      </main>

      {/* Agreement popup */}
      {showPopup && <AgreementPopup onClose={handleClosePopup} />}
    </div>
  );
}
