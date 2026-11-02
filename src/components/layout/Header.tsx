'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X, MapPin } from 'lucide-react';
import { Brand } from './Brand';

const links = [
  ['/', 'Home'],
  ['/about', 'Our cooperative'],
  ['/products', 'Savings & loans'],
  ['/news', 'News & notices'],
  ['/contact', 'Contact'],
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span lang="ne">नमस्ते। सँगै अघि बढौँ।</span>
          <span>
            A cooperative website demo <span className="utility-divider">|</span>{' '}
            <Link href="/branches">
              <MapPin size={13} /> Find a branch
            </Link>
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="site-navigation"
            className={open ? 'navigation is-open' : 'navigation'}
            aria-label="Main navigation"
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={
                  href === '/'
                    ? pathname === '/'
                      ? 'page'
                      : undefined
                    : pathname.startsWith(href)
                      ? 'page'
                      : undefined
                }
              >
                {label}
              </Link>
            ))}
            <Link className="button button-small" href="/apply" onClick={() => setOpen(false)}>
              Become a member <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
