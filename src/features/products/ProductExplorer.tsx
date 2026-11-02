'use client';
import { useState } from 'react';
import type { Product } from '@/types/content';
import { ProductCard } from './ProductCard';
export function ProductExplorer({
  products,
  compact = false,
}: {
  products: Product[];
  compact?: boolean;
}) {
  const [category, setCategory] = useState('deposit');
  const options = [
    ['deposit', 'Save for tomorrow'],
    ['loan', 'Borrow with a plan'],
    ['microfinance', 'Grow together'],
  ];
  const filtered = products.filter((product) => product.category === category);
  return (
    <div>
      <div className="tabs" role="group" aria-label="Choose a product category">
        {options.map(([value, label]) => (
          <button key={value} aria-pressed={value === category} onClick={() => setCategory(value)}>
            {label}
          </button>
        ))}
      </div>
      <div className="product-grid" aria-live="polite">
        {(compact ? filtered.slice(0, 3) : filtered).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && (
          <p>There are no products in this category yet. Please explore another category.</p>
        )}
      </div>
    </div>
  );
}
