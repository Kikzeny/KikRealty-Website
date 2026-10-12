import { notFound } from "next/navigation";
import Link from "next/link";
import Inquiry from "@/components/inquiry";
const content: Record<
  string,
  {
    title: string;
    eyebrow: string;
    intro: string;
    sections: [string, string][];
  }
> = {
  buyers: {
    title: "A home that feels like you.",
    eyebrow: "THE BUYING EXPERIENCE",
    intro:
      "Your priorities shape every step. Let’s make your next chapter a considered, confident one.",
    sections: [
      [
        "Start with what matters",
        "Share your goals, preferred locations, timing, and budget. We’ll discuss financing, representation, and what to expect before beginning your search.",
      ],
      [
        "Explore with intention",
        "Review available properties, arrange showings, and evaluate the features and tradeoffs that matter to you.",
      ],
      [
        "Move forward with confidence",
        "Discuss offer terms, contingencies, inspections, and closing steps with your agent and the appropriate licensed professionals.",
      ],
    ],
  },
  sellers: {
    title: "Your home. Beautifully presented.",
    eyebrow: "THE SELLING EXPERIENCE",
    intro:
      "A personal approach to presenting your property and planning your next move.",
    sections: [
      [
        "A thoughtful beginning",
        "Discuss your plans and review your property, available comparable sales, and current market conditions.",
      ],
      [
        "A considered presentation",
        "Prepare approved photography and accurate property details, then develop a marketing and showing plan tailored to your home.",
      ],
      [
        "Guidance through the details",
        "Evaluate offers and navigate negotiations, inspections, contract milestones, and closing with professional support.",
      ],
    ],
  },
  about: {
    title: "Meet Kikzeny Cartagena.",
    eyebrow: "REAL ESTATE, WITH YOU AT THE CENTER",
    intro:
      "A personal connection is the foundation of a thoughtful real estate experience.",
    sections: [
      [
        "Let’s talk about your next chapter",
        "Connect directly with Kikzeny to discuss your buying or selling goals, ask questions, and plan your next steps.",
      ],
      [
        "Personal attention from the start",
        "Your goals, timing, and priorities belong at the center of the conversation. Reach Kikzeny at 215-359-6910 or kikzenyc@gmail.com.",
      ],
      [
        "Brokerage affiliation",
        "LPT Realty LLC · 1400 S International Parkway, Suite 1020, Lake Mary, FL 32746. Additional Florida licensing and brokerage disclosures are pending confirmation before launch.",
      ],
    ],
  },
  privacy: {
    title: "Your privacy matters.",
    eyebrow: "PRIVACY NOTICE",
    intro:
      "We collect the information you choose to share so we can respond to your real estate requests.",
    sections: [
      [
        "Information we collect",
        "Inquiry forms collect your name, email, optional phone number, message, and related property details. Administrator authentication uses a necessary secure session cookie. This initial version does not use advertising trackers.",
      ],
      [
        "How we use information",
        "We use submitted information to respond to inquiries, coordinate requested services, and keep inquiry records. Hosting and database providers may process information to operate the website. We do not sell your personal information.",
      ],
      [
        "Your choices",
        "Do not submit financial account details or other sensitive information through these forms. To request access, correction, or deletion, contact kikzenyc@gmail.com. Records are retained as needed to respond and meet applicable obligations; the final retention policy must be confirmed before launch.",
      ],
    ],
  },
  disclosures: {
    title: "Clear information. Confident decisions.",
    eyebrow: "REAL ESTATE DISCLOSURES",
    intro:
      "This preview presents KikRealty-managed listings only and does not include MLS or IDX data.",
    sections: [
      [
        "Brokerage identification",
        "LPT Realty LLC · 1400 S International Parkway, Suite 1020, Lake Mary, FL 32746. User-supplied additional identification: LPT Realty, Inc. | CA DRE #02249735 | Kimberly McKeag — Designated Broker. Florida-specific license identification and applicable brokerage disclosures must be confirmed before public launch.",
      ],
      [
        "Property information",
        "Listing details, pricing, status, dimensions, and availability are subject to verification and change. Buyers should independently verify material information. Inspiration photography is decorative and does not depict an offered listing.",
      ],
      [
        "Equal Housing Opportunity",
        "Services are offered without discrimination based on race, color, religion, sex, disability, familial status, national origin, or other characteristics protected by applicable law.",
      ],
      [
        "Valuation requests",
        "A requested market assessment is not an appraisal or a guarantee of sale price. No agency relationship is created solely by submitting a form. Representation and compensation terms are addressed through applicable agreements.",
      ],
    ],
  },
};
export function generateStaticParams() {
  return [...Object.keys(content), "contact", "valuation"].map((page) => ({
    page,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return {
    title:
      content[page]?.title ||
      (page === "valuation" ? "Home Valuation" : "Contact Kikzeny"),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (page === "contact" || page === "valuation")
    return (
      <div className="section page">
        <p className="eyebrow">
          {page === "valuation"
            ? "KNOW YOUR HOME’S POTENTIAL"
            : "LET’S CONNECT"}
        </p>
        <h1>
          {page === "valuation" ? (
            <>
              What could your next
              <br />
              <em>chapter look like?</em>
            </>
          ) : (
            <>
              Great moves begin
              <br />
              with a <em>conversation.</em>
            </>
          )}
        </h1>
        <div className="detail-columns">
          <div>
            <p className="lede">
              {page === "valuation"
                ? "Request a personal market assessment. Share your property address and tell us about your plans."
                : "Whether you’re buying, selling, or just exploring, Kikzeny would love to hear from you."}
            </p>
            <h3>Kikzeny Cartagena</h3>
            <p>
              <a href="tel:+12153596910">215-359-6910</a>
            </p>
            <p>
              <a href="mailto:kikzenyc@gmail.com">kikzenyc@gmail.com</a>
            </p>
            <p className="fine">
              {page === "valuation"
                ? "A market assessment is not an appraisal or a guaranteed sale price."
                : "Your inquiry goes directly to the KikRealty admin inbox. For urgent requests, please call."}
            </p>
          </div>
          <Inquiry kind={page === "valuation" ? "valuation" : "contact"} />
        </div>
      </div>
    );
  const c = content[page];
  if (!c) notFound();
  return (
    <div className="section page information">
      <p className="eyebrow">{c.eyebrow}</p>
      <h1>{c.title}</h1>
      <p className="lede">{c.intro}</p>
      <div className="info-grid">
        {c.sections.map(([t, d], i) => (
          <article key={t}>
            <span className="step">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
      <Link className="button dark" href="/contact">
        Connect with Kikzeny ↗
      </Link>
    </div>
  );
}
