import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { TeamGrid } from '@/features/team/TeamGrid';
import { getTeam } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Our management team' };
export default async function ManagementPage() {
  const team = await getTeam();
  return (
    <>
      <PageIntro
        title="A familiar face at every step."
        description="Our illustrative management team represents the people who would help members with everyday questions."
        parent={{ href: '/about', label: 'Our cooperative' }}
      />
      <section className="section">
        <div className="container">
          <TeamGrid people={team.topManagement} />
        </div>
      </section>
    </>
  );
}
