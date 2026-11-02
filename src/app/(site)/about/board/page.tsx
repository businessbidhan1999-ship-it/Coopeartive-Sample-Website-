import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { TeamGrid } from '@/features/team/TeamGrid';
import { getTeam } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Board of directors' };
export default async function BoardPage() {
  const team = await getTeam();
  return (
    <>
      <PageIntro
        title="Guided by people, for people."
        description="Meet the fictional board of Mero Sahakari. Names and animated characters are provided for this demonstration."
        parent={{ href: '/about', label: 'Our cooperative' }}
      />
      <section className="section">
        <div className="container">
          <TeamGrid people={team.boardOfDirectors} />
        </div>
      </section>
    </>
  );
}
