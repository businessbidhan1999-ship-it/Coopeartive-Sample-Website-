// src/lib/utils.ts

/** Sanitize string for safe DOM insertion */
export function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Format number as Nepali Rupees */
export function formatNPR(amount: number): string {
  return "NPR " + Math.round(amount).toLocaleString("en-IN");
}

/** Format date string */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Calculate loan EMI */
export function calcEMI(principal: number, annualRate: number, months: number) {
  const r = annualRate / 1200;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const total = emi * months;
  const interest = total - principal;
  const fee = principal * 0.01;
  return { emi, total, interest, fee };
}

/** Calculate Fixed Deposit returns */
export function calcFD(principal: number, annualRate: number, months: number) {
  const t = months / 12;
  const interest = principal * (annualRate / 100) * t;
  const maturity = principal + interest;
  const tax = interest * 0.05;
  const net = maturity - tax;
  return { interest, maturity, tax, net };
}

/** Validate email — requires proper TLD (2+ chars, no spaces) */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

/** Validate Nepali phone — strips formatting, requires 7–15 digits */
export function isValidPhone(phone: string): boolean {
  const digits = phone.trim().replace(/[\s\-\(\)\.]/g, "");
  // Must be purely digits (with optional leading +), 7–15 chars
  return /^\+?\d{7,15}$/.test(digits);
}

/** Clamp number between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** Class name helper */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
