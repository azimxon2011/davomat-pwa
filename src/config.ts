// Telegram bot sozlamalari (kod orqali yoki .env fayldan)
export const TELEGRAM_CONFIG = {
  botToken:
    (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined) ||
    '8815126763:AAFbV8DDUJR1CpK7mEWzOBUuXwx9rL7ArE0',
  chatId:
    (import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined) ||
    '8815126763',
  botUsername: 'qoqon2imdavomatbot',
};
