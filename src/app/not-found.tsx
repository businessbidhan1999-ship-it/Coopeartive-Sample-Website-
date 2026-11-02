import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return (
    <main className="not-found container">
      <p className="nepali-line" lang="ne">
        यो पृष्ठ भेटिएन।
      </p>
      <h1>This path ends here.</h1>
      <p>The page may have moved, or the address may have a small typo.</p>
      <Link className="button" href="/">
        <ArrowLeft size={17} />
        Back to Mero Sahakari
      </Link>
    </main>
  );
}
