import type { Metadata } from 'next';
import Image from 'next/image';
import { PageIntro } from '@/components/layout/PageIntro';
import { getTeam } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'A note from our chairperson' };
export default async function ChairmanPage() {
  const { chairman } = await getTeam();
  return (
    <>
      <PageIntro
        title="A note from our chairperson."
        description="The people and message on this page are part of our fictional cooperative story."
        parent={{ href: '/about', label: 'Our cooperative' }}
      />
      <section className="section">
        <div className="container letter-grid">
          <aside className="letter-person">
            <Image
              src={chairman.imageUrl || '/images/team/person-1.webp'}
              alt={`Animated character representing ${chairman.name}`}
              width={480}
              height={480}
            />
            <h2>{chairman.name}</h2>
            <p>{chairman.title}</p>
          </aside>
          <article className="prose letter">
            {chairman.message.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <strong>{chairman.name}</strong>
            <p>Mero Sahakari</p>
          </article>
        </div>
      </section>
    </>
  );
}
