"use client";
import { useState } from "react";
export default function Inquiry({
  kind = "contact",
  propertyId = "",
}: {
  kind?: string;
  propertyId?: string;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="inquiry"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setStatus("");
        const f = e.currentTarget;
        const d = Object.fromEntries(new FormData(f));
        try {
          const r = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...d, kind, propertyId }),
          });
          const j = await r.json();
          if (!r.ok) throw Error(j.error);
          setStatus(
            "Thank you. Your request has been received. Kikzeny will follow up using your contact details.",
          );
          f.reset();
        } catch (e) {
          setStatus(
            (e as Error).message || "Unable to send. Please call 215-359-6910.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="form-grid">
        <label>
          Your name
          <input name="name" required autoComplete="name" maxLength={200} />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
          />
        </label>
      </div>
      <label>
        Phone number <span>(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" maxLength={50} />
      </label>
      {kind === "valuation" && (
        <label>
          Property address
          <input name="propertyAddress" required maxLength={300} />
        </label>
      )}
      <label>
        {kind === "showing"
          ? "Preferred showing dates and questions"
          : "How can I help?"}
        <textarea name="message" rows={4} required maxLength={3000} />
      </label>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <label className="consent">
        <input type="checkbox" name="consent" required />I agree to be contacted
        about this request and have read the{" "}
        <a href="/privacy">privacy notice</a>. No marketing consent is required.
      </label>
      <button className="button dark" disabled={busy}>
        {busy
          ? "Sending…"
          : kind === "valuation"
            ? "Request my valuation"
            : kind === "showing"
              ? "Request a showing"
              : "Send your message"}{" "}
        <span>↗</span>
      </button>
      <p role="status">{status}</p>
    </form>
  );
}
