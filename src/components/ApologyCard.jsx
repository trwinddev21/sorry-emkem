import { useState, useCallback, useRef } from "react";
import DisagreeButton from "./DisagreeButton";
import "./ApologyCard.css";

const APOLOGY_LINES = [
  {
    emoji: "🍵",
    text: "Tớ thấy áy náy, có lỗi quá nên nghĩ ra cách 'matcha gaugau meomeo' này gửi cậu nè.",
  },
  {
    emoji: "🐾",
    text: "Tớ nói chuyện vụng về, nhưng thật sự chân thành so diii cậu huhhh.",
  },
  {
    emoji: "🐶",
    text: "Một ly matcha siêu to khổng lồ, hai ly, à không...hai mươi chăm tỷ ly luôn nhaaa cậu.",
  },
  {
    emoji: "🐱",
    text: "Tớ mua hai đôi tất, một tất là mèo, hai là tất cá. To la tat meo, cau la tat ca.",
  },
  {
    emoji: "🌿",
    text: "Huhhhh soooo diiiii cậu x vô cùng tận lầnnnnn.",
  },
];

export default function ApologyCard({ onAgree, agreed }) {
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);

  const handleAgreeClick = useCallback(
    (e) => {
      if (agreed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleId.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== id)),
        800,
      );
      onAgree();
    },
    [agreed, onAgree],
  );

  return (
    <div className="card-wrapper">
      {/* Decorative blobs */}
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />

      <article className="apology-card">
        {/* Header */}
        <header className="card-header">
          <div className="mascot-wrap">
            <img
              src="/matcha_mascot.png"
              alt="Cute matcha latte mascot holding cat and dog plushies"
              className="mascot-img"
            />
            <div className="mascot-glow" aria-hidden="true" />
          </div>

          {/* <div className="header-badges">
            <span className="badge badge-green">🍵 Lời Xin Lỗi Matcha</span>
            <span className="badge badge-blush">🐾 Gửi Kèm Yêu Thương</span>
          </div> */}

          <h1 className="card-title">
            Sorry emkem 🌿
            <span className="title-sub">
              ~ Lời xin lỗi chân thành thơm mùi matcha latte ~
            </span>
          </h1>
        </header>

        {/* Divider */}
        <div className="divider">
          <span>🌿</span>
          <span className="divider-line" />
          <span>🍵</span>
          <span className="divider-line" />
          <span>🌿</span>
        </div>

        {/* Message lines */}
        <section className="apology-body" aria-label="Apology message">
          {APOLOGY_LINES.map((line, i) => (
            <div
              key={i}
              className="apology-line"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="line-emoji">{line.emoji}</span>
              <p className="line-text">{line.text}</p>
            </div>
          ))}

          {/* Cute pets row */}
          {/* <div className="pets-row" aria-hidden="true">
            <div className="pet-bubble">
              <span className="pet-icon">🐱</span>
              <span className="pet-speech">Tha cho ảnh đi!</span>
            </div>
            <div className="matcha-cup">🍵</div>
            <div className="pet-bubble pet-bubble-right">
              <span className="pet-icon">🐶</span>
              <span className="pet-speech">Xin em~ 🥺</span>
            </div>
          </div> */}
        </section>

        {/* Divider */}
        <div className="divider">
          <span>💚</span>
          <span className="divider-line" />
          <span>🌸</span>
          <span className="divider-line" />
          <span>💚</span>
        </div>

        {/* Question */}
        <div className="question-wrap">
          <p className="question-text">Cậu tha lỗi cho tớ nha nha 🍵💚</p>
          <p className="question-sub">
            (Cậu chọn đi...meomeo và gâugâu đang nhìn đó 🐱🐶)
          </p>
        </div>

        {/* Buttons */}
        <div className="buttons-area">
          {/* Agree button */}
          <button
            id="btn-agree"
            className={`btn-agree ${agreed ? "btn-agreed" : ""}`}
            onClick={handleAgreeClick}
            disabled={agreed}
          >
            {ripples.map((r) => (
              <span
                key={r.id}
                className="btn-ripple"
                style={{ left: r.x, top: r.y }}
              />
            ))}
            <span className="btn-icon">{agreed ? "🥰" : "✅"}</span>
            <span>{agreed ? "Yay!! Cảm ơn cậu!! 🥰" : "Tớ tha thứ 💚"}</span>
          </button>

          {/* Disagree button — escapes on hover/click */}
          {!agreed && <DisagreeButton />}
        </div>

        {/* Footer paw prints */}
        <footer className="card-footer" aria-hidden="true">
          <span className="paw">🐾</span>
          <span className="footer-text">trongphongakahoangtumua</span>
          <span className="paw">🐾</span>
        </footer>
      </article>
    </div>
  );
}
