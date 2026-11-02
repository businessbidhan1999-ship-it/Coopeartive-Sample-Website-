export const COOKIE_NAME = 'mero_sahakari_session';
export function sessionHours() {
  const value = Number(process.env.SESSION_EXPIRY_HOURS ?? 8);
  return Number.isFinite(value) && value >= 1 && value <= 168 ? value : 8;
}
export function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('Set AUTH_SECRET to at least 32 characters');
  return new TextEncoder().encode(secret);
}
