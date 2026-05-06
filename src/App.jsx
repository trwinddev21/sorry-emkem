import { useState, useCallback, useRef, useEffect } from 'react';
import FloatingParticles from './components/FloatingParticles';
import ApologyCard from './components/ApologyCard';
import AgreementPopup from './components/AgreementPopup';
import { getCachedVisitorInfo, sendTelegramNotification } from './utils/telegram';
import './App.css';

export default function App() {
  const [agreed, setAgreed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const visitNotified = useRef(false);

  // Gửi thông báo có người vừa truy cập trang web về Telegram Bot
  useEffect(() => {
    const notifyVisit = async () => {
      // Dùng sessionStorage để tránh spam thông báo khi họ bấm F5 load lại trang liên tục
      if (sessionStorage.getItem('visited_notified') || visitNotified.current) return;
      visitNotified.current = true;
      sessionStorage.setItem('visited_notified', 'true');

      const info = await getCachedVisitorInfo();
      const timeString = new Date().toLocaleString('vi-VN');

      const msg = `🌿 <b>[sorry-emkem] Có người vừa mở trang web!</b>\n\n` +
                  `📍 <b>IP:</b> <code>${info.ip}</code>\n` +
                  `🗺️ <b>Vị trí:</b> ${info.city}, ${info.country}\n` +
                  `🌐 <b>Nhà mạng:</b> ${info.org}\n` +
                  `⏰ <b>Thời gian:</b> ${timeString}`;

      await sendTelegramNotification(msg);
    };

    notifyVisit();
  }, []);

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
