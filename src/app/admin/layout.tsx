'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Newspaper,
  Wallet,
  LineChart,
  MapPin,
  Users,
  Inbox,
  Settings,
  KeyRound,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';
import { Brand } from '@/components/layout/Brand';
import '@/styles/admin.css';
const links = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/news', label: 'News & notices', icon: Newspaper },
  { href: '/admin/products', label: 'Products', icon: Wallet },
  { href: '/admin/rates', label: 'Interest rates', icon: LineChart },
  { href: '/admin/branches', label: 'Branches', icon: MapPin },
  { href: '/admin/team', label: 'Our people', icon: Users },
  { href: '/admin/submissions', label: 'Demo enquiries', icon: Inbox },
  { href: '/admin/settings', label: 'Site settings', icon: Settings },
  { href: '/admin/credentials', label: 'Credentials', icon: KeyRound },
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(),
    router = useRouter();
  const [open, setOpen] = useState(false),
    [pending, setPending] = useState(false);
  const [session, setSession] = useState<{ username: string; role: string } | null>(null);
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setSession(data);
      })
      .catch(() => {});
  }, [pathname]);
  async function logout() {
    setPending(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error();
      router.push('/admin/login');
      router.refresh();
    } catch {
      setPending(false);
    }
  }
  if (pathname === '/admin/login') return <div className="admin-area">{children}</div>;
  return (
    <div className="admin-area admin-shell">
      <aside className={open ? 'admin-sidebar is-open' : 'admin-sidebar'}>
        <Brand />
        <nav aria-label="Administration">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              href={href}
              onClick={() => setOpen(false)}
              key={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ArrowUpRight size={18} />
            View website
          </Link>
          <button onClick={logout} disabled={pending}>
            <LogOut size={18} />
            {pending ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-header">
          <button
            className="admin-menu"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close admin navigation' : 'Open admin navigation'}
            aria-expanded={open}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
          <span>Website administration</span>
          {session && (
            <span>
              {session.username} <small>{session.role}</small>
            </span>
          )}
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
