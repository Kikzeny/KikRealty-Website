import Listings from "@/components/listings";
import { readData, visible } from "@/lib/store";
export const metadata = { title: "My Listings" };
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <div className="section page">
      <p className="eyebrow">EXCLUSIVELY KIKREALTY</p>
      <h1>
        Find a place to <em>belong.</em>
      </h1>
      <p className="lede">
        Explore properties entered and managed by KikRealty. No MLS or IDX feed.
      </p>
      <Listings properties={(await readData()).properties.filter(visible)} />
    </div>
  );
}
