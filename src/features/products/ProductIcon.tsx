import {
  Sprout,
  Store,
  GraduationCap,
  Home,
  Wallet,
  Landmark,
  CalendarDays,
  Trees,
  HandCoins,
} from 'lucide-react';
const icons = {
  Sprout,
  Store,
  GraduationCap,
  Home,
  Wallet,
  Landmark,
  CalendarDays,
  Trees,
  HandCoins,
};
export function ProductIcon({ name, size = 26 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] ?? HandCoins;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
