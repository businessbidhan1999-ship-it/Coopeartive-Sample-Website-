export interface Product {
  id: string;
  slug: string;
  name: string;
  icon: string;
  category: 'loan' | 'deposit' | 'microfinance';
  rate: string;
  rateValue: number;
  description: string;
  features: string[];
  requirements: string[];
  facilities: string[];
  interestRates?: { period: string; rate: string }[];
}
export interface Person {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}
export interface Team {
  chairman: { name: string; title: string; message: string; imageUrl: string };
  boardOfDirectors: Person[];
  topManagement: Person[];
}
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  featured: boolean;
  imageUrl?: string;
  imageAlt?: string;
}
export interface Branch {
  id: string;
  name: string;
  type: string;
  inCharge: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  isHQ: boolean;
}
export interface Rates {
  loans: Rate[];
  deposits: Rate[];
}
export interface Rate {
  product: string;
  minRate: number;
  maxRate: number;
  unit: string;
}
