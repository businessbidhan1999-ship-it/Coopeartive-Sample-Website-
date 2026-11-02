import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const directory = path.join(process.cwd(), 'data');
const locks = new Map<string, Promise<unknown>>();

function filePath(name: string) {
  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(name)) throw new Error('Invalid store name');
  return path.join(directory, `${name}.json`);
}

export async function readJSON<T>(name: string): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(filePath(name), 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    if (name.startsWith('submissions/')) return [] as T;
    return JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'src/content', `${name}.json`), 'utf8'),
    ) as T;
  }
}

export async function updateJSON<T>(
  name: string,
  update: (current: T) => T | Promise<T>,
): Promise<T> {
  const previous = locks.get(name) ?? Promise.resolve();
  const next = previous
    .catch(() => {})
    .then(async () => {
      const current = await readJSON<T>(name);
      const value = await update(current);
      await persist(name, value);
      return value;
    });
  locks.set(name, next);
  try {
    return await next;
  } finally {
    if (locks.get(name) === next) locks.delete(name);
  }
}

async function persist<T>(name: string, data: T) {
  const destination = filePath(name);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, JSON.stringify(data, null, 2) + '\n', { mode: 0o600 });
    await fs.rename(temporary, destination);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export async function writeJSON<T>(name: string, data: T): Promise<void> {
  const previous = locks.get(name) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(() => persist(name, data));
  locks.set(name, next);
  try {
    await next;
  } finally {
    if (locks.get(name) === next) locks.delete(name);
  }
}

export const generateId = randomUUID;
