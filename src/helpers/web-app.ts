import type WebApp from "@twa-dev/sdk";

let TelegramWebApp: typeof WebApp | null = null;

if (typeof window !== "undefined") {
  import("@twa-dev/sdk")
    .then((module) => {
      TelegramWebApp = module.default;
    })
    .catch((error) => {
      console.error("Failed to load @twa-dev/sdk:", error);
    });
}

export { TelegramWebApp };
