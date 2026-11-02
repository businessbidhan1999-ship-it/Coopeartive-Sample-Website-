import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Clock3, ArrowUpRight, Mail } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { EnquiryForm } from '@/features/forms/EnquiryForm';
import { getSettings } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Contact' };
export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <PageIntro
        title="There’s always room for a conversation."
        description="A question about a service? Curious about membership? Explore how a cooperative could welcome your enquiry."
      />
      <section className="section">
        <div className="container form-page-grid">
          <div className="form-aside">
            <h2>Namaste. We’re glad you’re here.</h2>
            <p>
              These contact details are illustrative. Use the form to try the demo enquiry flow.
            </p>
            <div className="contact-item">
              <MapPin size={23} />
              <div>
                <h3>Sample office</h3>
                <p>{settings.contact.address}</p>
                <Link className="text-link" href="/branches">
                  Explore sample branches <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
            <div className="contact-item">
              <Clock3 size={23} />
              <div>
                <h3>Illustrative office hours</h3>
                <p>
                  {settings.contact.hours.weekdays}
                  <br />
                  {settings.contact.hours.saturday}
                </p>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={23} />
              <div>
                <h3>Sample email</h3>
                <p className="wrap-anywhere">{settings.contact.email}</p>
                <p className="help-text">
                  This is a placeholder address and does not receive mail.
                </p>
              </div>
            </div>
          </div>
          <EnquiryForm mode="contact" />
        </div>
      </section>
    </>
  );
}
