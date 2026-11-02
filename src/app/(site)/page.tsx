import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Handshake,
  Users,
  FileCheck2,
  BookOpen,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { getNews, getProducts } from '@/lib/server/content';
import { ProductExplorer } from '@/features/products/ProductExplorer';
import { Calculator } from '@/features/calculator/Calculator';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, news] = await Promise.all([getProducts(), getNews()]);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="nepali-greeting" lang="ne">
              आफ्नोपनको साथ, हरेक पाइलामा।
            </p>
            <h1>
              Your hopes. Our shared <span>tomorrow.</span>
            </h1>
            <p className="hero-description">
              A little saved today. A business started tomorrow. Let’s take the next step, together.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/products">
                Explore savings & loans <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/about">
                Get to know us <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <Image
              src="/images/hero-cooperative.webp"
              alt="Three-dimensional illustration of a savings passbook and savings pot alongside a Nepali home, schoolbooks and rice stalks"
              width={1440}
              height={960}
              priority
              sizes="(max-width: 800px) 100vw, 58vw"
            />
            <div className="hero-caption">
              <span lang="ne">सँगै बचत, सँगै प्रगति।</span>
              <span>Rooted in community.</span>
            </div>
          </div>
        </div>
      </section>
      <div className="notice-strip">
        <div className="container notice-inner">
          <span className="notice-title">A note for visitors</span>
          <p>
            You’re exploring a sample cooperative website. All services and rates are illustrative.
          </p>
          <Link href="/about#about-demo">
            About this demo <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>A place for your everyday plans.</h2>
            <p>
              Whether you’re building a saving habit or growing a livelihood, start with what
              matters to you.
            </p>
          </div>
          <ProductExplorer products={products} compact />
          <div className="section-end">
            <span>Every good plan starts with a conversation.</span>
            <Link className="text-link" href="/products">
              See all savings & loans <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="community-section">
        <div className="container community-grid">
          <div>
            <p className="nepali-line" lang="ne">
              मेरो मात्र होइन, हाम्रो सहकारी।
            </p>
            <h2>
              Built around people.
              <br />
              Held together by trust.
            </h2>
            <p>
              A cooperative belongs to its members. It’s a place to ask questions, make careful
              decisions and have a say in what comes next.
            </p>
            <Link className="text-link" href="/about">
              The idea behind Mero Sahakari <ArrowRight size={17} />
            </Link>
          </div>
          <div className="values-list">
            {[
              {
                icon: Users,
                title: 'Your voice matters',
                text: 'Members take part in decisions and help shape the cooperative’s direction.',
              },
              {
                icon: FileCheck2,
                title: 'Clarity comes first',
                text: 'Understand the rates, documents and next steps before making a commitment.',
              },
              {
                icon: Handshake,
                title: 'Support that feels personal',
                text: 'A familiar conversation, in plain language, with room for all your questions.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div className="value-row" key={title}>
                <Icon size={27} strokeWidth={1.5} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="calculator">
        <div className="container">
          <div className="section-heading">
            <h2>Make a little room for planning.</h2>
            <p>
              Try a few numbers. See what a monthly repayment or a fixed deposit could look like.
            </p>
          </div>
          <Calculator />
        </div>
      </section>
      <section className="section section-tinted">
        <div className="container">
          <div className="section-heading">
            <h2>Good to know.</h2>
            <p>Practical guides and small reminders for your next financial conversation.</p>
          </div>
          <div className="news-grid">
            {news.slice(0, 3).map((item, i) => (
              <Link
                className={i === 0 ? 'news-card news-featured' : 'news-card'}
                href={`/news/${item.id}`}
                key={item.id}
              >
                {item.imageUrl ? (
                  <div className="news-image">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title}
                      width={960}
                      height={640}
                      sizes="(max-width: 700px) 90vw, 32vw"
                    />
                  </div>
                ) : (
                  <div className="news-illustration">
                    <BookOpen size={52} strokeWidth={1} />
                  </div>
                )}
                <div className="news-card-body">
                  <div className="article-meta">
                    <span>{item.category}</span>
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span className="text-link">
                    Read the guide <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-end">
            <span>Information that’s easier to understand.</span>
            <Link className="text-link" href="/news">
              All news & notices <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container visit-banner">
          <div className="visit-symbol">
            <MapPin size={40} strokeWidth={1.2} />
          </div>
          <div>
            <h2>Some things are better talked through.</h2>
            <p>Explore the member journey, ask a question or find a sample branch near you.</p>
          </div>
          <Link className="button" href="/contact">
            Let’s have a conversation <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
