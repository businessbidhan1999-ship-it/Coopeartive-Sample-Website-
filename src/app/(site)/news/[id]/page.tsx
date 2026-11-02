import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getNews } from '@/lib/server/content';
import { formatDate } from '@/lib/utils';
import { PageIntro } from '@/components/layout/PageIntro';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = (await getNews()).find((item) => item.id === id);
  return {
    title: article?.title ?? 'Article not found',
    description: article?.excerpt,
    ...(article?.imageUrl
      ? {
          openGraph: {
            title: article.title,
            description: article.excerpt,
            images: [
              {
                url: article.imageUrl,
                width: 1200,
                height: 800,
                alt: article.imageAlt || article.title,
              },
            ],
          },
        }
      : {}),
  };
}
export default async function NewsDetail({ params }: Props) {
  const { id } = await params;
  const item = (await getNews()).find((article) => article.id === id);
  if (!item) notFound();
  return (
    <>
      <PageIntro
        title={item.title}
        description={item.excerpt}
        parent={{ href: '/news', label: 'News & notices' }}
      />
      <section className="section">
        <article className="container prose article-body">
          <div className="article-meta">
            <span>{item.category}</span>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </div>
          {item.imageUrl && (
            <Image
              className="article-cover"
              src={item.imageUrl}
              alt={item.imageAlt || item.title}
              width={1200}
              height={800}
              sizes="(max-width: 820px) 90vw, 740px"
            />
          )}
          {item.content.split('\n\n').map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          <div className="article-footnote">
            This is sample educational content for a fictional cooperative website.
          </div>
          <Link className="text-link" href="/news">
            <ArrowLeft size={17} />
            Back to news & notices
          </Link>
        </article>
      </section>
    </>
  );
}
