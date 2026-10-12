"use client";
import Link from "next/link";
import { useState } from "react";
import { Property } from "@/lib/store";
export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link className="property-card" href={"/listings/" + p.id}>
      <div className="property-image">
        <img src={p.photos[0]} alt={p.address} />
        <span className="badge">
          {p.status === "published" ? "For sale" : p.status}
        </span>
        <span className="photo-arrow">↗</span>
      </div>
      <div className="property-info">
        <strong>
          {p.price !== null
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(p.price)
            : "Price upon request"}
        </strong>
        <h3>{p.address}</h3>
        <p>
          {p.city}, {p.state} {p.zip}
        </p>
        <div className="facts">
          {p.beds !== null && <span>{p.beds} beds</span>}
          {p.baths !== null && <span>{p.baths} baths</span>}
          {p.sqft !== null && <span>{p.sqft.toLocaleString()} sq ft</span>}
        </div>
      </div>
    </Link>
  );
}
export default function Listings({ properties }: { properties: Property[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");
  const rows = properties.filter(
    (p) =>
      (p.address + " " + p.city + " " + p.zip)
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (!status || p.status === status) &&
      (!price || (p.price !== null && p.price <= Number(price))) &&
      (!beds || (p.beds !== null && p.beds >= Number(beds))),
  );
  return (
    <>
      <div className="filters">
        <label>
          Location
          <input
            placeholder="City, address or ZIP"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label>
          Status
          <select
            aria-label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All listings</option>
            <option value="published">For sale</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </label>
        <label>
          Price
          <select
            aria-label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          >
            <option value="">Any price</option>
            <option value="500000">Up to $500,000</option>
            <option value="1000000">Up to $1,000,000</option>
            <option value="2000000">Up to $2,000,000</option>
          </select>
        </label>
        <label>
          Bedrooms
          <select
            aria-label="Bedrooms"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
          >
            <option value="">Any beds</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>
      </div>
      <p className="result-count">
        {rows.length} {rows.length === 1 ? "property" : "properties"}
      </p>
      <div className="property-grid">
        {rows.map((p) => (
          <PropertyCard p={p} key={p.id} />
        ))}
      </div>
      {!rows.length && (
        <div className="empty">
          <h3>
            {properties.length
              ? "A different search may open new doors."
              : "Something exceptional is on the horizon."}
          </h3>
          <p>
            {properties.length
              ? "Try adjusting your filters, or let Kikzeny help with your search."
              : "Our next collection of verified listings is being prepared. Connect with Kikzeny to discuss your next home."}
          </p>
          <Link className="text-link" href="/contact">
            Start a conversation ↗
          </Link>
        </div>
      )}
    </>
  );
}
