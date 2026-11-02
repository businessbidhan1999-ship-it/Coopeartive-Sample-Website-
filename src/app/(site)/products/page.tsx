import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { ProductExplorer } from '@/features/products/ProductExplorer';
import { getProducts, getRates } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Savings & loans' };
export default async function ProductsPage() {
  const [products, rates] = await Promise.all([getProducts(), getRates()]);
  return (
    <>
      <PageIntro
        title="A little closer to your plans."
        description="Explore everyday savings, purposeful borrowing and support for a shared livelihood. All products shown are illustrative."
      />
      <section className="section">
        <div className="container">
          <ProductExplorer products={products} />
        </div>
      </section>
      <section className="section section-tinted" id="rates">
        <div className="container">
          <div className="section-heading">
            <h2>Know the numbers before you decide.</h2>
            <p>
              These are sample annual rates for demonstration. They are not current market rates or
              an offer from a registered cooperative.
            </p>
          </div>
          <div className="rates-grid">
            {[
              ['Savings & deposits', rates.deposits],
              ['Loans', rates.loans],
            ].map(([title, rows]) => (
              <div key={String(title)}>
                <h3>{String(title)}</h3>
                <div className="table-scroll">
                  <table>
                    <caption className="sr-only">
                      Illustrative {String(title)} interest rates
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Annual rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(rows as typeof rates.loans).map((row) => (
                        <tr key={row.product}>
                          <th scope="row">{row.product}</th>
                          <td>
                            {row.minRate === row.maxRate
                              ? row.minRate
                              : `${row.minRate} to ${row.maxRate}`}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
