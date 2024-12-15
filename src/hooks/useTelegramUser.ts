import { useEffect, useState } from 'react';

interface TelegramUser {
  username: string;
  photoUrl: string;
}

export const useTelegramUser = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    if (tg.initDataUnsafe?.user) {
      setUser({
        username: tg.initDataUnsafe.user.username || 'Anonymous',
        photoUrl: tg.initDataUnsafe.user.photo_url || '/src/images/suit.png'
      });
    }
  }, []);

  return user;
};