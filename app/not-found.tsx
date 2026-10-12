import Link from "next/link";
export default function NotFound() {
  return (
    <div className="section page">
      <p className="eyebrow">A DIFFERENT DIRECTION</p>
      <h1>This page is unavailable.</h1>
      <p>The listing may not be published or the page may have moved.</p>
      <Link className="button dark" href="/listings">
        Explore listings ↗
      </Link>
    </div>
  );
}
