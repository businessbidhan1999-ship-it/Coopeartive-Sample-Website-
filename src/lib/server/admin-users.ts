import { readJSON, writeJSON } from './store';
import type { AdminUser } from './auth';

const STORE_NAME = 'admins';

export async function getAdminUsersFromFile(): Promise<AdminUser[]> {
  try {
    return await readJSON<AdminUser[]>(STORE_NAME);
  } catch {
    // File doesn't exist yet ,  seed from ADMIN_USERS env var
    const raw = process.env.ADMIN_USERS;
    if (!raw) return [];
    try {
      const users = JSON.parse(raw) as AdminUser[];
      await writeJSON(STORE_NAME, users);
      return users;
    } catch {
      console.error('ADMIN_USERS env var is not valid JSON');
      return [];
    }
  }
}

export async function saveAdminUsers(users: AdminUser[]): Promise<void> {
  await writeJSON(STORE_NAME, users);
}

export async function updateUserPassword(username: string, newHash: string): Promise<boolean> {
  const users = await getAdminUsersFromFile();
  const user = users.find((u) => u.username === username);
  if (!user) return false;
  user.passwordHash = newHash;
  await saveAdminUsers(users);
  return true;
}
