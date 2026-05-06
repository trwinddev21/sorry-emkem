import { useState, useCallback, useRef, useEffect } from "react";
import { getCachedVisitorInfo, sendTelegramNotification } from "../utils/telegram";
import "./DisagreeButton.css";

const TAUNTS = [
  "Không đời! 😤",
  "Thử lại đi! 🙈",
  "Đố bắt được tớ! 🐾",
  "Không được! 😹",
  "Chậm quá! 🐶",
  "Hụt rồi! 🌿",
  "Hehe~ 🍵",
  // "Hôm nay không được! 😼",
  "Trượt mất rồi! 🌸",
];

function getRandomPos(btnWidth, btnHeight) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 20;

  const maxX = vw - btnWidth - margin;
  const maxY = vh - btnHeight - margin;

  const x = Math.max(margin, Math.floor(Math.random() * maxX));
  const y = Math.max(margin, Math.floor(Math.random() * maxY));
  return { x, y };
}

export default function DisagreeButton() {
  const [floatingMode, setFloatingMode] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [taunt, setTaunt] = useState("Không đời! 😤");
  const [clickCount, setClickCount] = useState(0);
  const btnRef = useRef(null);
  const posInitialized = useRef(false);
  const lastEscapeTime = useRef(0);

  // Initialize position after first render
  useEffect(() => {
    if (!posInitialized.current && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ x: rect.left, y: rect.top });
      posInitialized.current = true;
    }
  }, []);

  const escape = useCallback(() => {
    const now = Date.now();
    // Cooldown 450ms để tránh việc di chuột quét qua nút đang trượt đi hoặc sự kiện touch kép gửi trùng tin nhắn
    if (now - lastEscapeTime.current < 450) return;
    lastEscapeTime.current = now;

    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const newPos = getRandomPos(rect.width, rect.height);
    const newTaunt = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];

    setPos(newPos);
    setTaunt(newTaunt);
    setFloatingMode(true);
    
    setClickCount((prev) => {
      const newCount = prev + 1;

      // Gửi thông báo hụt nút về Telegram cho mỗi lần di chuột/bấm hụt
      const notifyEscape = async () => {
        const info = await getCachedVisitorInfo();
        const msg = `😤 <b>[sorry-emkem] Tương tác:</b>\n\n` +
                    `Đối phương vừa cố bấm hụt nút <b>Không đồng ý</b> lần thứ <b>${newCount}</b>! 😂\n` +
                    `📍 <b>IP:</b> <code>${info.ip}</code> (${info.city}, ${info.country})`;
        await sendTelegramNotification(msg);
      };
      notifyEscape();

      return newCount;
    });
  }, []);

  // Escape on hover too (sneaky!)
  const handleMouseEnter = useCallback(() => {
    escape();
  }, [escape]);

  // Escape on touch (mobile)
  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault();
      escape();
    },
    [escape],
  );

  // Click also escapes (just in case they're fast)
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      escape();
    },
    [escape],
  );

  const buttonStyle = floatingMode
    ? {
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        transition:
          "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }
    : {};

  return (
    <div className={`disagree-wrap ${floatingMode ? "floating" : ""}`}>
      <button
        id="btn-disagree"
        ref={btnRef}
        className="btn-disagree"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        aria-label="Nút không đồng ý — nó sẽ chạy mất!"
        title={clickCount > 2 ? "Bắt không được đâu! 😹" : ""}
      >
        <span className="disagree-icon">❌</span>
        <span>{taunt}</span>
        {clickCount > 0 && <span className="escape-count">{clickCount}x</span>}
      </button>

      {/* After many attempts, show a helpful hint */}
      {clickCount >= 4 && (
        <div className="hint-bubble" role="status">
          Nút duy nhất hoạt động là cái màu xanh đó~ 🍵💚
        </div>
      )}
    </div>
  );
}
