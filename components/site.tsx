"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <Link className="brand" href="/">
        KIK<span>REALTY</span>
        <small>EXCEPTIONAL HOMES. PERSONAL SERVICE.</small>
      </Link>
      <button
        className="menu"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "open" : ""}>
        {[
          ["My Listings", "/listings"],
          ["Buy", "/buyers"],
          ["Sell", "/sellers"],
          ["About", "/about"],
        ].map(([t, u]) => (
          <Link onClick={() => setOpen(false)} key={u} href={u}>
            {t}
          </Link>
        ))}
        <Link className="nav-contact" href="/contact">
          Let’s connect <ArrowUpRight size={16} />
        </Link>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="brand">
          KIK<span>REALTY</span>
          <p>A more personal way home.</p>
        </div>
        <div>
          <a href="tel:+12153596910">215-359-6910</a>
          <a href="mailto:kikzenyc@gmail.com">kikzenyc@gmail.com</a>
          <p>Connect with Kikzeny Cartagena</p>
        </div>
        <div>
          <Link href="/listings">My Listings</Link>
          <Link href="/valuation">Home Valuation</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="legal">
        <p>
          {process.env.NEXT_PUBLIC_BROKERAGE_NAME || "LPT Realty LLC"}{" "}
          {process.env.NEXT_PUBLIC_BROKERAGE_ADDRESS ||
            "1400 S International Parkway, Suite 1020, Lake Mary, FL 32746"}{" "}
          {process.env.NEXT_PUBLIC_BROKERAGE_PHONE}{" "}
          {process.env.NEXT_PUBLIC_LICENSE_INFORMATION ||
            "LPT Realty, Inc. | CA DRE #02249735 | Kimberly McKeag — Designated Broker"}
        </p>
        <p>
          Equal Housing Opportunity. We welcome all buyers and sellers and do
          not discriminate on the basis of race, color, religion, sex,
          disability, familial status, national origin, or other protected
          characteristics. Property information is subject to verification,
          availability, and change. No MLS or IDX feed is used.{" "}
          {process.env.NEXT_PUBLIC_BROKERAGE_DISCLOSURES}
        </p>
        <div>
          <span>© {new Date().getFullYear()} KikRealty</span>
          <Link href="/privacy">Privacy notice</Link>
          <Link href="/disclosures">Disclosures</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
