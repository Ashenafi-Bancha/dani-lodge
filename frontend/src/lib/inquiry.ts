import { whatsappLink } from '@/lib/site';

/** Keep in sync with INTERESTS in backend/src/inquiries/schema.ts */
export const INTERESTS = {
  stay: 'A stay at the lodge',
  meeting: 'The meeting hall',
  cafe: 'The café',
  event: 'A gathering or event',
  other: 'Something else',
} as const;

export type Interest = keyof typeof INTERESTS;

export interface Inquiry {
  name: string;
  phone: string;
  interest: Interest;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  message: string;
}

/** Dates and guest count chosen in the hero's availability bar. */
export type StayRequest = Required<Pick<Inquiry, 'checkIn' | 'checkOut' | 'guests'>>;

/** Today's date in the visitor's own time zone, as YYYY-MM-DD for date inputs. */
export function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

export function validateInquiry(inquiry: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!inquiry.name.trim()) errors.name = 'Please enter your name';
  if (inquiry.phone.replace(/\D/g, '').length < 9) errors.phone = 'Please enter a valid phone number';
  if (!inquiry.message.trim()) errors.message = 'Please tell us a little about your request';
  return errors;
}

/** The same enquiry as a ready-to-send WhatsApp chat, used when the server cannot be reached. */
export function inquiryWhatsappLink(inquiry: Inquiry): string {
  const showStayDetails = inquiry.interest === 'stay';
  const text = [
    'Hello Dani Lodge, I would like to make an enquiry.',
    '',
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    `Interested in: ${INTERESTS[inquiry.interest]}`,
    showStayDetails && inquiry.checkIn && `Check-in: ${inquiry.checkIn}`,
    showStayDetails && inquiry.checkOut && `Check-out: ${inquiry.checkOut}`,
    showStayDetails && inquiry.guests && `Guests: ${inquiry.guests}`,
    '',
    inquiry.message,
  ]
    .filter((line) => line !== false && line !== undefined)
    .join('\n');
  return whatsappLink(text);
}

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'invalid'; errors: InquiryErrors }
  | { status: 'failed'; message: string };

// Empty in development (Vite proxies /api to the backend); set VITE_API_URL
// when the API is hosted on a different address from the website.
const API_URL: string = import.meta.env.VITE_API_URL ?? '';

const UNREACHABLE = 'We could not send your enquiry just now.';

/** Sends an enquiry to the lodge through the backend. `website` is the spam honeypot. */
export async function submitInquiry(inquiry: Inquiry, website = ''): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...inquiry, website }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return { status: 'failed', message: UNREACHABLE };
  }

  if (res.ok) return { status: 'sent' };

  const body: { error?: string; fields?: InquiryErrors } = await res.json().catch(() => ({}));
  if (res.status === 400 && body.fields) return { status: 'invalid', errors: body.fields };
  // 429 carries a message worth showing; anything else is a server or proxy fault
  return { status: 'failed', message: (res.status === 429 && body.error) || UNREACHABLE };
}
