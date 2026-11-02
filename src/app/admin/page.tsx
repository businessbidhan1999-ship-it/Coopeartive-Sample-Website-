import Link from 'next/link';
import { getProducts, getNews, getBranches } from '@/lib/server/content';
import { ArrowUpRight, Newspaper, Wallet, MapPin, Inbox } from 'lucide-react';
export const dynamic = 'force-dynamic';
export default async function AdminDashboard() {
  const [products, news, branches] = await Promise.all([getProducts(), getNews(), getBranches()]);
  return (
    <>
      <h1>Welcome to Mero Sahakari.</h1>
      <p className="admin-intro">
        Manage the sample content your visitors see. Saved changes appear on the next page request.
      </p>
      <div className="admin-stats">
        {[
          { label: 'Products', value: products.length, href: '/admin/products', icon: Wallet },
          { label: 'News & notices', value: news.length, href: '/admin/news', icon: Newspaper },
          { label: 'Branches', value: branches.length, href: '/admin/branches', icon: MapPin },
        ].map(({ label, value, href, icon: Icon }) => (
          <Link href={href} key={label}>
            <Icon size={25} />
            <strong>{value}</strong>
            <span>{label}</span>
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </div>
      <h2 className="admin-section-title">Where would you like to start?</h2>
      <div className="admin-quick-links">
        <Link href="/admin/news">
          <Newspaper size={22} />
          <span>Publish a notice</span>
          <ArrowUpRight size={17} />
        </Link>
        <Link href="/admin/products">
          <Wallet size={22} />
          <span>Update a product</span>
          <ArrowUpRight size={17} />
        </Link>
        <Link href="/admin/submissions">
          <Inbox size={22} />
          <span>Review demo enquiries</span>
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <h2 className="admin-section-title">Recent articles</h2>
      <div className="admin-articles">
        {news.map((item) => (
          <Link href="/admin/news" key={item.id}>
            <span>{item.title}</span>
            <small>{item.category}</small>
            <ArrowUpRight size={17} />
          </Link>
        ))}
      </div>
    </>
  );
}
