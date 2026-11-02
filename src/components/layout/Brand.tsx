import Image from 'next/image';
import Link from 'next/link';

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Mero Sahakari home">
      <Image src="/images/brand/logo.webp" alt="" width={54} height={54} priority />
      <span>
        <strong>Mero Sahakari</strong>
        <small lang="ne">मेरो सहकारी, हाम्रो भविष्य</small>
      </span>
    </Link>
  );
}
