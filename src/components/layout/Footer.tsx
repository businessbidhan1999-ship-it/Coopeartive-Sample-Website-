import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Brand } from './Brand';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-intro">
            <Brand />
            <p>
              Small steps. Shared hopes.
              <br />A better tomorrow, together.
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <Link href="/about">Our cooperative</Link>
            <Link href="/products">Savings & loans</Link>
            <Link href="/products#rates">Illustrative rates</Link>
            <Link href="/news">News & notices</Link>
          </div>
          <div>
            <h2>Our people</h2>
            <Link href="/about/board">Board of directors</Link>
            <Link href="/about/management">Management team</Link>
            <Link href="/about/chairman">Chairperson’s message</Link>
            <Link href="/branches">Branch locations</Link>
          </div>
          <div>
            <h2>Let’s talk</h2>
            <p>
              Kathmandu Valley, Nepal
              <br />
              Illustrative office location
            </p>
            <Link className="text-link" href="/contact">
              Visit the contact page <ArrowUpRight size={15} />
            </Link>
            <Link href="/apply">Explore membership</Link>
          </div>
        </div>
        <div className="demo-note">
          <span className="demo-label">Made for demonstration</span>
          <p>
            Mero Sahakari is a fictional cooperative. People, locations, services and rates are
            illustrative. This website does not accept deposits or provide financial services.
            Please use sample details in forms.
          </p>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Mero Sahakari. A sample website for Nepal’s cooperatives.
          </span>
          <span lang="ne">सहकार्यमा विश्वास।</span>
        </div>
      </div>
    </footer>
  );
}
