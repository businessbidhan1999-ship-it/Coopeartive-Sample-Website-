import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { getBranches, getSettings } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Branch locations' };
export default async function BranchesPage() {
  const [branches, settings] = await Promise.all([getBranches(), getSettings()]);
  return (
    <>
      <PageIntro
        title="Closer to your community."
        description="Explore illustrative locations around the Kathmandu Valley. These are sample offices, not real service points."
      />
      <section className="section">
        <div className="container">
          <div className="branch-list">
            {branches.map((branch) => (
              <article className="branch-row" key={branch.id}>
                <MapPin size={28} strokeWidth={1.5} />
                <div>
                  <span className="subtle-label">{branch.type}</span>
                  <h2>{branch.name}</h2>
                  <p>{branch.address}</p>
                  <p>Sample contact person: {branch.inCharge}</p>
                </div>
                <div>
                  <p>{settings.contact.hours.weekdays}</p>
                  <p>{settings.contact.hours.saturday}</p>
                  <Link className="text-link" href="/contact">
                    Make a demo enquiry <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="help-text">
            Locations are illustrative. No real appointments or branch visits are arranged through
            this demo.
          </p>
        </div>
      </section>
    </>
  );
}
