import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { openDatabase } from './db.js';

const config = loadConfig();
const db = openDatabase(config.databasePath);
const app = createApp(config, db);

const server = app.listen(config.port, () => {
  console.log(`Dani Lodge API listening on http://localhost:${config.port}`);
  if (!config.adminToken) console.warn('ADMIN_TOKEN is not set — the /admin page is disabled.');
  if (!config.telegram) console.log('Telegram notifications are off (no bot token / chat id).');
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
