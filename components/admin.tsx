"use client";
import { useState } from "react";
import { Property, Inquiry } from "@/lib/store";
const blank: Property = {
  id: "",
  address: "",
  city: "",
  state: "FL",
  zip: "",
  price: null,
  beds: null,
  baths: null,
  sqft: null,
  description: "",
  amenities: [],
  photos: [],
  status: "draft",
  featured: false,
  verified: false,
  source: "",
};
export default function Admin({
  initial,
  requests,
}: {
  initial: Property[] | null;
  requests: Inquiry[];
}) {
  const [rows, setRows] = useState(initial);
  const [inquiries, setInquiries] = useState(requests);
  const [edit, setEdit] = useState<Property | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    const r = await fetch("/api/properties");
    if (!r.ok) throw Error("Session expired. Please sign in again.");
    const d = await r.json();
    setRows(d.properties);
    setInquiries(d.inquiries);
  }
  return (
    <div className="section page admin">
      <p className="eyebrow">PRIVATE WORKSPACE</p>
      <h1>Listing management.</h1>
      <p role="status">{msg}</p>
      {!rows ? (
        <form
          className="inquiry"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const r = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  password: new FormData(e.currentTarget).get("password"),
                }),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              await refresh();
              setMsg("");
            } catch (e) {
              setMsg((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Admin password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button disabled={busy} className="button dark">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-actions">
            <button
              className="button dark"
              onClick={() => setEdit({ ...blank, id: crypto.randomUUID() })}
            >
              Add a property +
            </button>
            <button
              className="button outline"
              onClick={async () => {
                await fetch("/api/admin", { method: "DELETE" });
                setRows(null);
                setEdit(null);
              }}
            >
              Sign out
            </button>
          </div>
          <div className="admin-list">
            {rows.map((p) => (
              <button key={p.id} onClick={() => setEdit(p)}>
                <span>
                  {p.address}
                  <small>
                    {p.city}, {p.state} · {p.status}{" "}
                    {p.verified ? "· verified" : "· awaiting verification"}
                  </small>
                </span>
                <span>Edit ↗</span>
              </button>
            ))}
          </div>
          {edit && (
            <form
              className="inquiry editor"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  const r = await fetch("/api/properties", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(edit),
                  });
                  const d = await r.json();
                  if (!r.ok) throw Error(d.error);
                  await refresh();
                  setEdit(null);
                  setMsg("Property saved.");
                } catch (e) {
                  setMsg((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h3>Edit property</h3>
              <div className="form-grid">
                {(["address", "city", "state", "zip"] as const).map((k) => (
                  <label key={k}>
                    {k}
                    <input
                      value={edit[k]}
                      required
                      onChange={(e) =>
                        setEdit({ ...edit, [k]: e.target.value })
                      }
                    />
                  </label>
                ))}
                {(["price", "beds", "baths", "sqft"] as const).map((k) => (
                  <label key={k}>
                    {k}
                    <input
                      type="number"
                      min="0"
                      step={k === "baths" ? "0.5" : "1"}
                      value={edit[k] ?? ""}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          [k]:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              <label>
                Description
                <textarea
                  aria-label="Description"
                  rows={5}
                  value={edit.description}
                  onChange={(e) =>
                    setEdit({ ...edit, description: e.target.value })
                  }
                />
              </label>
              <label>
                Amenities (one per line)
                <textarea
                  aria-label="Amenities (one per line)"
                  value={edit.amenities.join("\n")}
                  onChange={(e) =>
                    setEdit({ ...edit, amenities: e.target.value.split("\n") })
                  }
                />
              </label>
              <label>
                Approved photo HTTPS URLs (one per line)
                <textarea
                  aria-label="Approved photo HTTPS URLs (one per line)"
                  value={edit.photos.join("\n")}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      photos: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                />
              </label>
              <label>
                Verification source
                <input
                  value={edit.source}
                  onChange={(e) => setEdit({ ...edit, source: e.target.value })}
                />
              </label>
              <label>
                Status
                <select
                  value={edit.status}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      status: e.target.value as Property["status"],
                    })
                  }
                >
                  {["draft", "published", "pending", "sold", "archived"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={edit.verified}
                  onChange={(e) =>
                    setEdit({ ...edit, verified: e.target.checked })
                  }
                />
                I have verified these details and have permission to use all
                photos.
              </label>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={edit.featured}
                  onChange={(e) =>
                    setEdit({ ...edit, featured: e.target.checked })
                  }
                />
                Feature on homepage
              </label>
              <div className="admin-actions">
                <button disabled={busy} className="button dark">
                  {busy ? "Saving…" : "Save property"}
                </button>
                <button
                  type="button"
                  className="button outline"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          <h2>Inquiry inbox</h2>
          {!inquiries.length ? (
            <p>No inquiries yet.</p>
          ) : (
            inquiries
              .slice()
              .reverse()
              .map((i) => (
                <article className="inbox" key={i.id}>
                  <p className="eyebrow">
                    {i.kind} · {new Date(i.createdAt).toLocaleString()}
                  </p>
                  <h3>{i.name}</h3>
                  <a href={"mailto:" + i.email}>{i.email}</a>
                  <p>{i.phone}</p>
                  <p className="preserve">{i.message}</p>
                  {i.propertyId && <small>Property: {i.propertyId}</small>}
                </article>
              ))
          )}
        </>
      )}
    </div>
  );
}
