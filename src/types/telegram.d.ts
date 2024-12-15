interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;  // Sẽ dùng cho ref code
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}