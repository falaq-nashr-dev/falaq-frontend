import { useState, useEffect } from "react";
import { TelegramWebApp } from "../helpers/web-app";

// Define the UserData type based on Telegram's user object structure
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

const useTelegramUser = (): UserData | null => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (TelegramWebApp && TelegramWebApp.initDataUnsafe?.user) {
      setUserData(TelegramWebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  return userData;
};

export default useTelegramUser;
