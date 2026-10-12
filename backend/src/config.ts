export interface Config {
  port: number;
  corsOrigins: string[];
  databasePath: string;
  /** Empty string means the admin area is switched off. */
  adminToken: string;
  trustProxy: number;
  /** Enquiries one visitor may send per 10 minutes. */
  inquiryRateLimit: number;
  telegram: { botToken: string; chatId: string } | null;
}

export function loadConfig(): Config {
  try {
    process.loadEnvFile();
  } catch {
    // No .env file — rely on real environment variables (normal in production)
  }

  const env = process.env;
  const botToken = env.TELEGRAM_BOT_TOKEN ?? '';
  const chatId = env.TELEGRAM_CHAT_ID ?? '';

  return {
    port: Number(env.PORT) || 4000,
    corsOrigins: (env.CORS_ORIGIN ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    databasePath: env.DATABASE_PATH || './data/dani-lodge.db',
    adminToken: env.ADMIN_TOKEN ?? '',
    trustProxy: Number(env.TRUST_PROXY) || 0,
    inquiryRateLimit: 5,
    telegram: botToken && chatId ? { botToken, chatId } : null,
  };
}
