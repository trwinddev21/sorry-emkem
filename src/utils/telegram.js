/**
 * Tiện ích lấy thông tin IP và gửi thông báo về Telegram Bot
 */

// Hàm lấy thông tin chi tiết IP (IP, Thành phố, Quốc gia, Nhà mạng)
export async function getVisitorInfo() {
  try {
    // Thử lấy thông tin chi tiết từ ipapi.co (rất đầy đủ và chi tiết)
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Không thể kết nối đến ipapi.co");
    const data = await res.json();
    return {
      ip: data.ip || "Không rõ IP",
      city: data.city || "Không rõ",
      country: data.country_name || "Không rõ",
      org: data.org || "Không rõ nhà mạng",
    };
  } catch (error) {
    console.warn("Lỗi khi lấy thông tin chi tiết từ ipapi.co, chuyển sang dự phòng ipify:", error);
    try {
      // Dự phòng sang ipify (chỉ lấy được IP thuần túy nhưng cực kỳ ổn định)
      const res = await fetch("https://api.ipify.org?format=json");
      if (!res.ok) throw new Error("Không thể kết nối đến ipify");
      const data = await res.json();
      return {
        ip: data.ip || "Không rõ IP",
        city: "Không rõ",
        country: "Không rõ",
        org: "Không rõ nhà mạng",
      };
    } catch (fallbackError) {
      console.error("Lỗi hoàn toàn khi lấy IP:", fallbackError);
      return {
        ip: "Không rõ IP",
        city: "Không rõ",
        country: "Không rõ",
        org: "Không rõ nhà mạng",
      };
    }
  }
}

// Cache thông tin IP để không cần gọi API nhiều lần trong cùng một phiên làm việc
let cachedVisitorInfo = null;

export async function getCachedVisitorInfo() {
  if (!cachedVisitorInfo) {
    cachedVisitorInfo = await getVisitorInfo();
  }
  return cachedVisitorInfo;
}

// Hàm gửi tin nhắn HTML về Telegram Bot
export async function sendTelegramNotification(htmlMessage) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // Kiểm tra xem đã cấu hình token chưa
  if (!token || !chatId || token === "YOUR_TELEGRAM_BOT_TOKEN_HERE" || chatId === "YOUR_TELEGRAM_CHAT_ID_HERE") {
    console.warn("Telegram Bot chưa được cấu hình đầy đủ trong file .env. Bỏ qua việc gửi thông báo.");
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Lỗi từ Telegram API:", errData);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Lỗi kết nối khi gửi thông báo Telegram:", error);
    return false;
  }
}
