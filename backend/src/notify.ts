import type { Config } from './config.js';
import type { Inquiry } from './inquiries/repository.js';
import { INTERESTS } from './inquiries/schema.js';

export type Notifier = (inquiry: Inquiry) => void;

function formatMessage(inquiry: Inquiry): string {
  return [
    `New enquiry #${inquiry.id} — Dani Lodge`,
    '',
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    `Interested in: ${INTERESTS[inquiry.interest]}`,
    inquiry.checkIn && `Check-in: ${inquiry.checkIn}`,
    inquiry.checkOut && `Check-out: ${inquiry.checkOut}`,
    inquiry.guests && `Guests: ${inquiry.guests}`,
    '',
    inquiry.message,
  ]
    .filter((line) => line !== null && line !== 0 && line !== undefined)
    .join('\n');
}

/**
 * Returns a function that tells the lodge about a new enquiry.
 * Never throws and never delays the visitor's response: the enquiry is already
 * saved, so a failed notification is logged and can be seen in /admin instead.
 */
export function createNotifier(config: Config): Notifier {
  const { telegram } = config;
  if (!telegram) return () => {};

  return (inquiry) => {
    fetch(`https://api.telegram.org/bot${telegram.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: telegram.chatId, text: formatMessage(inquiry) }),
      signal: AbortSignal.timeout(10_000),
    })
      .then((res) => {
        if (!res.ok) console.error(`Telegram notification failed for enquiry #${inquiry.id}: HTTP ${res.status}`);
      })
      .catch((err: unknown) => {
        console.error(`Telegram notification failed for enquiry #${inquiry.id}:`, err);
      });
  };
}
