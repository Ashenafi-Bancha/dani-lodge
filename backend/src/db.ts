import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import Database from 'better-sqlite3';

export type Db = Database.Database;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS inquiries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    phone      TEXT NOT NULL,
    interest   TEXT NOT NULL,
    check_in   TEXT,
    check_out  TEXT,
    guests     INTEGER,
    message    TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'handled')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    handled_at TEXT
  );
  CREATE INDEX IF NOT EXISTS inquiries_status_created ON inquiries (status, created_at DESC);
`;

/** Opens (and creates if needed) the database. Pass ':memory:' for tests. */
export function openDatabase(path: string): Db {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.exec(SCHEMA);
  return db;
}
