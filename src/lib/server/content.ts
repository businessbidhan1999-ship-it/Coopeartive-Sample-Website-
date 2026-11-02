import 'server-only';
import { readJSON } from './store';
import type { Product, Team, NewsItem, Branch, Rates } from '@/types/content';
import settings from '@/content/settings.json';

export const getSettings = () => readJSON<typeof settings>('settings');
export const getProducts = () => readJSON<Product[]>('products');
export const getTeam = () => readJSON<Team>('team');
export const getNews = () => readJSON<NewsItem[]>('news');
export const getBranches = () => readJSON<Branch[]>('branches');
export const getRates = () => readJSON<Rates>('rates');
