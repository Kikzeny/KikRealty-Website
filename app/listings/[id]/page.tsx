import { notFound } from "next/navigation";
import { readData, visible } from "@/lib/store";
import Inquiry from "@/components/inquiry";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = (await readData()).properties.find(
    (p) => p.id === id && visible(p),
  );
  return {
    title: p?.address || "Listing unavailable",
    description: p?.description.slice(0, 160),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = (await readData()).properties.find(
    (p) => p.id === id && visible(p),
  );
  if (!p) notFound();
  return (
    <div className="section page">
      <p className="eyebrow">
        {p.status === "published" ? "FOR SALE" : p.status.toUpperCase()}
      </p>
      <h1>{p.address}</h1>
      <p className="lede">
        {p.city}, {p.state} {p.zip}
      </p>
      <div className="gallery">
        {p.photos.map((u, i) => (
          <a href={u} key={i} target="_blank" rel="noreferrer">
            <img src={u} alt={`${p.address}, property photo ${i + 1}`} />
          </a>
        ))}
      </div>
      <div className="detail-columns">
        <article>
          <h2>
            {p.price !== null
              ? "$" + p.price.toLocaleString()
              : "Price upon request"}
          </h2>
          <p className="facts">
            {p.beds !== null && `${p.beds} beds · `}
            {p.baths !== null && `${p.baths} baths · `}
            {p.sqft !== null && `${p.sqft.toLocaleString()} sq ft`}
          </p>
          <h3>About this property</h3>
          <p className="preserve">{p.description}</p>
          <h3>Features & amenities</h3>
          <ul>
            {p.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="fine">
            Information provided by KikRealty; independently verify all material
            property details.
          </p>
        </article>
        <aside>
          <p className="eyebrow">SEE YOUR NEXT CHAPTER</p>
          <h3>
            {p.status === "sold"
              ? "Explore similar opportunities"
              : "Schedule a showing"}
          </h3>
          {p.status === "sold" ? (
            <a href="/contact">Contact Kikzeny</a>
          ) : (
            <Inquiry kind="showing" propertyId={p.id} />
          )}
        </aside>
      </div>
    </div>
  );
}
