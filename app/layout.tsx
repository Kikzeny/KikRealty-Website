import type { Metadata } from "next";
import { Header, Footer } from "@/components/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kikrealty.com",
  ),
  title: {
    default: "KikRealty | A more personal way home",
    template: "%s | KikRealty",
  },
  description:
    "Explore KikRealty-managed homes and connect with Kikzeny Cartagena for a thoughtful, personal real estate experience.",
  robots:
    process.env.NEXT_PUBLIC_APPROVED_LAUNCH === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
  openGraph: {
    title: "KikRealty | A more personal way home",
    description: "Exceptional homes. Personal service.",
    type: "website",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
