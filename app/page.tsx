import Link from "next/link";
import { ArrowUpRight, KeyRound, House, Handshake } from "lucide-react";
import { readData, visible } from "@/lib/store";
import { PropertyCard } from "@/components/listings";
export const dynamic = "force-dynamic";
export default async function Home() {
  const properties = (await readData()).properties.filter(
    (p) => visible(p) && p.featured,
  );
  return (
    <>
      <section className="hero">
        <img
          className="hero-photo"
          src="/images/architectural-inspiration.webp"
          alt="AI architectural inspiration: a fictional luxury villa with a pool"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light">EXCEPTIONAL HOMES. PERSONAL SERVICE.</p>
          <h1>
            More than a home.
            <br />A place to <em>belong.</em>
          </h1>
          <p>
            Thoughtful guidance. Meaningful connections.
            <br />
            Discover your next chapter with KikRealty.
          </p>
          <div className="hero-actions">
            <Link className="button gold" href="/listings">
              Explore my listings <ArrowUpRight size={18} />
            </Link>
            <Link className="hero-link" href="/contact">
              Let’s find your home <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <span>AI ARCHITECTURAL INSPIRATION · NOT A LISTING</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>
      <div className="intro-strip">
        <span>Inspired living.</span>
        <i />
        <span>Personal attention.</span>
        <i />
        <span>Exceptional possibilities.</span>
      </div>
      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">THE KIKREALTY COLLECTION</p>
            <h2>
              Homes with a story.
              <br />
              <em>Find yours.</em>
            </h2>
          </div>
          <div>
            <p>
              Distinctive properties, thoughtfully presented.
              <br />
              Every listing is personally managed by KikRealty.
            </p>
            <Link className="text-link" href="/listings">
              View all listings <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        {properties.length ? (
          <div className="property-grid">
            {properties.slice(0, 3).map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="collection-preview">
            <div className="collection-image">
              <img
                src="/images/interior-inspiration.webp"
                alt="AI design inspiration: a fictional sunlit living room"
              />
              <span>AI DESIGN INSPIRATION · NOT A LISTING</span>
            </div>
            <div className="collection-copy">
              <p className="eyebrow">A NEW COLLECTION IS COMING</p>
              <h3>
                Your next chapter,
                <br />
                beautifully considered.
              </h3>
              <p>
                Our verified property collection is being prepared. Tell us what
                home means to you, and let’s explore the possibilities together.
              </p>
              <Link className="text-link" href="/contact">
                Be the first to connect ↗
              </Link>
            </div>
          </div>
        )}
      </section>
      <section className="services section">
        <p className="eyebrow">YOUR VISION. OUR COMMITMENT.</p>
        <h2>
          Every move deserves
          <br />
          <em>a personal touch.</em>
        </h2>
        <div className="service-grid">
          {[
            {
              icon: <KeyRound />,
              title: "Find your place",
              copy: "From the first conversation to the keys in your hand, a thoughtful approach to buying your next home.",
              href: "/buyers",
              link: "The buying experience",
            },
            {
              icon: <House />,
              title: "Make your next move",
              copy: "A considered strategy, compelling presentation, and personal guidance for selling your property.",
              href: "/sellers",
              link: "The selling experience",
            },
            {
              icon: <Handshake />,
              title: "Know your home’s potential",
              copy: "Start with a personal assessment and a conversation about your property and your plans.",
              href: "/valuation",
              link: "Request a home valuation",
            },
          ].map((s) => (
            <article key={s.title}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
              <Link className="text-link" href={s.href}>
                {s.link} ↗
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="about-teaser section">
        <div className="about-art">
          <span>K</span>
          <p>
            REAL ESTATE.
            <br />
            WITH YOU AT THE CENTER.
          </p>
        </div>
        <div>
          <p className="eyebrow">MEET KIKZENY CARTAGENA</p>
          <h2>
            Real connection.
            <br />
            <em>Lasting confidence.</em>
          </h2>
          <p>
            Buying or selling a home is personal. Your real estate experience
            should be, too. Connect directly with Kikzeny to talk about what
            matters most to you and take the next step at your pace.
          </p>
          <Link className="text-link" href="/about">
            Get to know Kikzeny ↗
          </Link>
        </div>
      </section>
      <section className="cta">
        <p className="eyebrow">LET’S BEGIN YOUR NEXT CHAPTER</p>
        <h2>
          Your next move starts
          <br />
          with a <em>conversation.</em>
        </h2>
        <Link className="button gold" href="/contact">
          Let’s connect ↗
        </Link>
      </section>
    </>
  );
}
