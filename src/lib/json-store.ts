// src/lib/json-store.ts
// Server-side JSON file read/write utility.
// Uses a simple in-process lock to prevent concurrent write corruption.
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// Simple lock map to serialize writes per file
const writeLocks = new Map<string, Promise<void>>();

function filePath(name: string): string {
  // Prevent path traversal: only allow alphanumeric, hyphens, slashes for subdirs
  const safe = name.replace(/[^a-zA-Z0-9\-_/]/g, "");
  return path.join(DATA_DIR, `${safe}.json`);
}

export async function readJSON<T>(name: string): Promise<T> {
  const fp = filePath(name);
  const raw = await fs.readFile(fp, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJSON<T>(name: string, data: T): Promise<void> {
  const fp = filePath(name);
  const dir = path.dirname(fp);

  // Chain writes to prevent concurrent file corruption
  const prev = writeLocks.get(name) ?? Promise.resolve();
  const next = prev.then(async () => {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fp, JSON.stringify(data, null, 2), "utf-8");
  });
  writeLocks.set(name, next);
  await next;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
