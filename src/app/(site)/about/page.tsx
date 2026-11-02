import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Users, Handshake, Sprout } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
export const metadata: Metadata = { title: 'Our cooperative' };
export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="A shared future starts close to home."
        description="A familiar face. An honest conversation. People working together for the things that matter."
      />
      <section className="section">
        <div className="container story-grid">
          <Image
            className="story-image"
            src="/images/community.webp"
            alt="Animated Nepali neighbours talking about their plans in a courtyard"
            width={1440}
            height={960}
            sizes="(max-width: 800px) 90vw, 45vw"
          />
          <div className="prose">
            <h2>
              More than an account.
              <br />A sense of belonging.
            </h2>
            <p>
              A cooperative brings people together to meet needs they share. Members save, borrow
              responsibly and take part in decisions about how the organisation is run.
            </p>
            <p>
              Mero Sahakari imagines that experience with everyday life in Nepal in mind: a
              household saving for school, a farmer planning the next season, a shopkeeper taking a
              careful step forward.
            </p>
            <p>
              Our name means “my cooperative”. The idea behind it is simple: you should feel
              welcome, informed and heard.
            </p>
          </div>
        </div>
      </section>
      <section className="section section-tinted">
        <div className="container">
          <div className="section-heading">
            <h2>The things we would stand for.</h2>
            <p>A cooperative earns trust through the way it treats people, every day.</p>
          </div>
          <div className="principles-grid">
            {[
              {
                icon: Users,
                title: 'A voice for every member',
                text: 'Membership means participation. Clear information helps people take part in decisions with confidence.',
              },
              {
                icon: Handshake,
                title: 'Careful, honest service',
                text: 'Explain the costs, listen to questions and give people time to decide what is right for them.',
              },
              {
                icon: Sprout,
                title: 'Progress that stays local',
                text: 'Support the skills, small businesses and shared ambitions that make a neighbourhood stronger.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon size={32} strokeWidth={1.4} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Meet the people in this story.</h2>
            <p>Fictional names and illustrated characters bring this sample cooperative to life.</p>
          </div>
          <div className="link-panels">
            <Link href="/about/board">
              <h3>Board of directors</h3>
              <p>The members guiding the cooperative’s direction.</p>
              <ArrowUpRight />
            </Link>
            <Link href="/about/management">
              <h3>Our management team</h3>
              <p>The people supporting the everyday member experience.</p>
              <ArrowUpRight />
            </Link>
            <Link href="/about/chairman">
              <h3>A note from our chairperson</h3>
              <p>A few words about the kind of cooperative we imagine.</p>
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="section section-tinted" id="about-demo">
        <div className="container prose">
          <h2>A sample made for real conversations.</h2>
          <p>
            This website is a demonstration for clients exploring a new website for a cooperative in
            Nepal. Mero Sahakari is not a registered financial institution and does not offer
            savings accounts, loans or investment services.
          </p>
          <p>
            Names, illustrated people, branch locations, articles, products and rates are sample
            content. Forms demonstrate an enquiry journey and do not create a membership or
            financial account. Please use invented details when trying them.
          </p>
          <p>
            Before using this template for a real organisation, replace the sample information with
            approved content, verified contact details and the organisation’s own terms and privacy
            information.
          </p>
        </div>
      </section>
    </>
  );
}
