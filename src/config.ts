// Telegram bot sozlamalari (kod orqali yoki .env fayldan)
export const TELEGRAM_CONFIG = {
  botToken: (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined) || '',
  chatId: (import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined) || '',
};
