import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ProductIcon } from './ProductIcon';
import type { Product } from '@/types/content';
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card" href={`/products/${product.category}/${product.slug}`}>
      <div className="product-card-top">
        <span className="product-symbol">
          <ProductIcon name={product.icon} />
        </span>
        <ArrowUpRight size={20} className="card-arrow" />
      </div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-card-bottom">
        <strong>
          {product.rateValue}% <small>p.a.</small>
        </strong>
        <span>Illustrative {product.category === 'loan' ? 'starting rate' : 'rate'}</span>
      </div>
    </Link>
  );
}
