import { useEffect, useRef, useState } from "react";
import "./AgreementPopup.css";

const CONFETTI_EMOJIS = [
  "🍵",
  "🌿",
  "🐾",
  "🐱",
  "🐶",
  "💚",
  "✨",
  "🌸",
  "⭐",
  "🍃",
  "💛",
  "🎉",
];

function Confetti() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pieces = [];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.textContent =
        CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        top: -30px;
        font-size: ${14 + Math.random() * 18}px;
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 1.5}s;
        --rot: ${(Math.random() - 0.5) * 720}deg;
        --drift: ${(Math.random() - 0.5) * 200}px;
      `;
      container.appendChild(el);
      pieces.push(el);
    }

    const timer = setTimeout(() => {
      pieces.forEach((p) => p.remove());
    }, 6000);

    return () => {
      clearTimeout(timer);
      pieces.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div ref={containerRef} className="confetti-container" aria-hidden="true" />
  );
}

export default function AgreementPopup({ onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className={`popup-backdrop ${closing ? "closing" : ""}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Được tha thứ rồi!"
    >
      <Confetti />

      <div className={`popup-card ${closing ? "closing" : ""}`}>
        {/* Close button */}
        <button
          className="popup-close"
          onClick={handleClose}
          aria-label="Đóng popup"
        >
          ✕
        </button>

        {/* Celebration image */}
        <div className="popup-image-wrap">
          <img
            src="/celebration_pets.png"
            alt="Chó và mèo đáng yêu đang ăn mừng với matcha latte"
            className="popup-image"
          />
          <div className="popup-image-glow" aria-hidden="true" />
        </div>

        {/* Stars */}
        <div className="popup-stars" aria-hidden="true">
          {["⭐", "✨", "🌟", "✨", "⭐"].map((s, i) => (
            <span
              key={i}
              className="popup-star"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="popup-title">🎉 Yay!! 🎉</h2>

        <p className="popup-subtitle">Được cậu tha thứ ròiiiii 🥰</p>

        {/* Message */}
        {/* <div className="popup-message">
          <p>
            Cảm ơn em nhiều lắm, tình yêu của anh. 💚
            <br />
            Em là người ngọt ngào và tuyệt vời nhất,
            <br />
            và anh hứa sẽ trân trọng em mãi mãi —
          </p>
          <p className="popup-emphasis">
            giống như một ly matcha latte pha hoàn hảo 🍵
            <br />— ấm áp, dịu dàng và tuyệt vời theo cách riêng của nó.
          </p>
        </div> */}

        {/* Pets celebration */}
        {/* <div className="popup-pets" aria-hidden="true">
          <div className="popup-pet">
            <span>🐱</span>
            <span className="popup-pet-text">Méo đây! 💚</span>
          </div>
          <div className="popup-matcha">🍵✨</div>
          <div className="popup-pet popup-pet-right">
            <span>🐶</span>
            <span className="popup-pet-text">Gấu! 🎉</span>
          </div>
        </div> */}

        {/* Footer */}
        <div className="popup-footer">
          <span>🐾</span>
          <span className="popup-footer-text">ngotrongphongakahoangtumua</span>
          <span>🐾</span>
        </div>

        {/* Close button bottom */}
        <button
          className="popup-close-btn"
          onClick={handleClose}
          id="btn-popup-close"
        >
          💚 Đóng
        </button>
      </div>
    </div>
  );
}
