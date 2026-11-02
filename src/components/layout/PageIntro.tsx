import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
export function PageIntro({
  title,
  description,
  parent,
}: {
  title: string;
  description?: string;
  parent?: { label: string; href: string };
}) {
  return (
    <div className="page-intro">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          {parent && (
            <>
              <Link href={parent.href}>{parent.label}</Link>
              <ChevronRight size={13} />
            </>
          )}
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
