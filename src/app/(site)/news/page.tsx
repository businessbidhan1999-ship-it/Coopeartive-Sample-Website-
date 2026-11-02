import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { getNews } from '@/lib/server/content';
import { formatDate } from '@/lib/utils';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'News & notices' };
export default async function NewsPage() {
  const news = (await getNews()).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageIntro
        title="A little knowledge goes a long way."
        description="Member guides, useful reminders and sample notices from Mero Sahakari."
      />
      <section className="section">
        <div className="container article-list">
          {news.length === 0 && <p>No notices have been published yet. Please check back soon.</p>}
          {news.map((item) => (
            <Link className="article-row" key={item.id} href={`/news/${item.id}`}>
              {item.imageUrl ? (
                <div className="article-thumbnail">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    width={480}
                    height={320}
                    sizes="(max-width: 700px) 90vw, 240px"
                  />
                </div>
              ) : (
                <div className="article-symbol">
                  <BookOpen size={29} strokeWidth={1.4} />
                </div>
              )}
              <div>
                <div className="article-meta">
                  <span>{item.category}</span>
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                </div>
                <h2>{item.title}</h2>
                <p>{item.excerpt}</p>
              </div>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
