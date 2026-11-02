import type { Metadata } from 'next';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageIntro } from '@/components/layout/PageIntro';
import { EnquiryForm } from '@/features/forms/EnquiryForm';
import { getProducts } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Explore membership' };
export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const products = (await getProducts()).map((product) => product.name);
  return (
    <>
      <PageIntro
        title="Every shared journey starts somewhere."
        description="Explore what a first enquiry could look like. This sample form does not create a real account or membership."
      />
      <section className="section">
        <div className="container form-page-grid">
          <div className="form-aside">
            <h2>A simple first step.</h2>
            <p>
              Becoming a member starts with understanding how the cooperative works and what
              membership involves.
            </p>
            <ol className="steps-list">
              <li>
                <span>1</span>
                <div>
                  <h3>Tell us what interests you</h3>
                  <p>Try a sample enquiry about saving, borrowing or membership.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <h3>Know what to ask</h3>
                  <p>A real team would explain eligibility, documents, fees and terms.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <h3>Decide in your own time</h3>
                  <p>Ask questions and read the terms before making a commitment.</p>
                </div>
              </li>
            </ol>
            <p className="aside-note">
              <Check size={18} />
              No payment or documents needed for this demo.
            </p>
            <Link className="text-link" href="/products">
              Explore the sample services <ArrowRight size={16} />
            </Link>
          </div>
          <EnquiryForm
            mode="apply"
            products={products}
            selectedProduct={products.includes(product ?? '') ? product : ''}
          />
        </div>
      </section>
    </>
  );
}
