import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { ProductIcon } from '@/features/products/ProductIcon';
import { getProducts } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ category: string; slug: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = (await getProducts()).find((p) => p.slug === slug && p.category === category);
  return { title: product?.name ?? 'Product not found', description: product?.description };
}
export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = (await getProducts()).find((p) => p.slug === slug && p.category === category);
  if (!product) notFound();
  return (
    <>
      <PageIntro
        title={product.name}
        description={product.description}
        parent={{ href: '/products', label: 'Savings & loans' }}
      />
      <section className="section">
        <div className="container detail-grid">
          <article className="prose">
            <h2>How this could help</h2>
            <p>
              Use this sample product as a starting point for a conversation. Before choosing a real
              service, ask for written terms, a full fee schedule and confirmation of your
              eligibility.
            </p>
            <ul className="check-list">
              {product.features.map((item) => (
                <li key={item}>
                  <Check size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h2>Prepare for the conversation</h2>
            <p>
              A provider may ask for the following documents. Requirements vary, so confirm the list
              before visiting. Please do not send documents through this demo.
            </p>
            <ul>
              {product.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {product.interestRates && (
              <>
                <h2>Sample term options</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Annual rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.interestRates.map((row) => (
                      <tr key={row.period}>
                        <td>{row.period}</td>
                        <td>{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <h2>Support along the way</h2>
            <ul>
              {product.facilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <aside className="product-summary">
            <span className="product-symbol">
              <ProductIcon name={product.icon} size={32} />
            </span>
            <h2>A plan you understand.</h2>
            <p>Illustrative annual rate</p>
            <strong className="summary-rate">
              {product.rateValue}% <small>p.a.</small>
            </strong>
            <p>
              Sample terms only. Fees, eligibility and security requirements would be confirmed by a
              real provider.
            </p>
            <Link className="button" href={`/apply?product=${encodeURIComponent(product.name)}`}>
              Explore this service <ArrowUpRight size={17} />
            </Link>
            <Link className="text-link" href="/#calculator">
              Try the calculator
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
