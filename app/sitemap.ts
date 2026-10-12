import { MetadataRoute } from "next";
import { readData, visible } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://kikrealty.com";
  return [
    ...[
      "",
      "/listings",
      "/buyers",
      "/sellers",
      "/about",
      "/contact",
      "/valuation",
    ].map((p) => ({ url: base + p })),
    ...(await readData()).properties
      .filter(visible)
      .map((p) => ({ url: base + "/listings/" + p.id })),
  ];
}
