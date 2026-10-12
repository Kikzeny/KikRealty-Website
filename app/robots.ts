import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: process.env.NEXT_PUBLIC_APPROVED_LAUNCH === "true" ? "/" : [],
      disallow:
        process.env.NEXT_PUBLIC_APPROVED_LAUNCH === "true"
          ? ["/admin", "/api/"]
          : ["/"],
    },
    sitemap: "https://kikrealty.com/sitemap.xml",
  };
}
