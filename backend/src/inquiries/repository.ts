import type { Db } from '../db.js';
import type { InquiryInput, InquiryStatus, Interest } from './schema.js';

export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  interest: Interest;
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  handledAt: string | null;
}

const COLUMNS = `
  id, name, phone, interest,
  check_in AS checkIn, check_out AS checkOut,
  guests, message, status,
  created_at AS createdAt, handled_at AS handledAt
`;

export function createInquiryRepository(db: Db) {
  const insert = db.prepare(`
    INSERT INTO inquiries (name, phone, interest, check_in, check_out, guests, message)
    VALUES (@name, @phone, @interest, @checkIn, @checkOut, @guests, @message)
  `);
  const byId = db.prepare(`SELECT ${COLUMNS} FROM inquiries WHERE id = ?`);
  const all = db.prepare(`SELECT ${COLUMNS} FROM inquiries ORDER BY created_at DESC, id DESC`);
  const byStatus = db.prepare(
    `SELECT ${COLUMNS} FROM inquiries WHERE status = ? ORDER BY created_at DESC, id DESC`
  );
  const updateStatus = db.prepare(`
    UPDATE inquiries
    SET status = @status,
        handled_at = CASE WHEN @status = 'handled' THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now') END
    WHERE id = @id
  `);
  const countNew = db.prepare(`SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'`);

  return {
    create(input: InquiryInput): Inquiry {
      // Dates and guest count only make sense for a stay
      const isStay = input.interest === 'stay';
      const { lastInsertRowid } = insert.run({
        name: input.name,
        phone: input.phone,
        interest: input.interest,
        checkIn: (isStay && input.checkIn) || null,
        checkOut: (isStay && input.checkOut) || null,
        guests: (isStay && input.guests) || null,
        message: input.message,
      });
      return byId.get(lastInsertRowid) as Inquiry;
    },

    list(status?: InquiryStatus): Inquiry[] {
      return (status ? byStatus.all(status) : all.all()) as Inquiry[];
    },

    setStatus(id: number, status: InquiryStatus): Inquiry | undefined {
      updateStatus.run({ id, status });
      return byId.get(id) as Inquiry | undefined;
    },

    countNew(): number {
      return (countNew.get() as { n: number }).n;
    },
  };
}

export type InquiryRepository = ReturnType<typeof createInquiryRepository>;
