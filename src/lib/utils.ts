export function formatNPR(amount: number) {
  return 'NPR ' + Math.round(amount).toLocaleString('en-IN');
}
export function formatDate(date: string) {
  return new Date(date + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
export function calcEMI(principal: number, annualRate: number, months: number) {
  if (
    ![principal, annualRate, months].every(Number.isFinite) ||
    principal < 0 ||
    annualRate < 0 ||
    months <= 0
  ) {
    throw new RangeError('Use a nonnegative amount and rate, and a positive term');
  }
  const rate = annualRate / 1200;
  const emi =
    rate === 0 ? principal / months : (principal * rate) / (1 - Math.pow(1 + rate, -months));
  return { emi, total: emi * months, interest: emi * months - principal };
}
export function calcFD(principal: number, annualRate: number, months: number) {
  if (
    ![principal, annualRate, months].every(Number.isFinite) ||
    principal < 0 ||
    annualRate < 0 ||
    months <= 0
  ) {
    throw new RangeError('Use a nonnegative amount and rate, and a positive term');
  }
  const interest = (((principal * annualRate) / 100) * months) / 12;
  return { interest, maturity: principal + interest };
}
