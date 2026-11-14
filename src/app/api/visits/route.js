import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Data is stored in <project>/data/visits.json  (no database needed)
const FILE = path.join(process.cwd(), 'data', 'visits.json');
const KEEP_DAYS = 3;
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

// Date key in Bangladesh time (UTC+6) so "today" matches your players' day
const dayKey = (offsetDays = 0) =>
  new Date(Date.now() + DHAKA_OFFSET_MS - offsetDays * 86400000)
    .toISOString()
    .slice(0, 10);

// Simple queue so two requests never write the file at the same time
let queue = Promise.resolve();
const serial = (fn) => {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
};

async function readData() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return {}; // first run or unreadable file: start fresh
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data));
  await fs.rename(tmp, FILE); // atomic replace, no half-written file
}

export async function POST(req) {
  let vid = '';
  try {
    ({ vid } = await req.json());
  } catch {}

  const valid = typeof vid === 'string' && /^[\w-]{8,64}$/.test(vid);
  const today = dayKey(0);
  const yesterday = dayKey(1);

  try {
    const result = await serial(async () => {
      const data = await readData();
      let changed = false;

      if (valid) {
        const list = data[today] || (data[today] = []);
        if (!list.includes(vid)) {
          list.push(vid);
          changed = true;
        }
      }

      // drop days older than KEEP_DAYS
      const keep = new Set(Array.from({ length: KEEP_DAYS }, (_, i) => dayKey(i)));
      for (const k of Object.keys(data)) {
        if (!keep.has(k)) {
          delete data[k];
          changed = true;
        }
      }

      if (changed) await writeData(data);
      return { today: data[today]?.length ?? 0, yesterday: data[yesterday]?.length ?? 0 };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'stats unavailable' }, { status: 500 });
  }
}