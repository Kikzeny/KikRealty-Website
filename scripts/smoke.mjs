import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
if (
  !["localhost", "127.0.0.1"].includes(new URL(base).hostname) ||
  process.env.DATABASE_URL
)
  throw Error(
    "Smoke fixtures are allowed only against local JSON preview storage.",
  );
const store = new URL("../.data/records.json", import.meta.url);
let backup;
try {
  backup = await fs.readFile(store);
} catch {}
let count = 0;
let cookie = "";
async function request(path, method = "GET", body, auth = false) {
  const r = await fetch(base + path, {
    method,
    headers: {
      Origin: base,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(auth ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return r;
}
try {
  for (const path of [
    "/",
    "/listings",
    "/buyers",
    "/sellers",
    "/about",
    "/contact",
    "/valuation",
    "/privacy",
    "/disclosures",
    "/admin",
    "/robots.txt",
    "/sitemap.xml",
  ]) {
    const r = await request(path);
    assert.equal(r.status, 200, path);
    count++;
  }
  assert.equal((await request("/listings/2183-bent-oak-dr")).status, 404);
  count++;
  assert.equal((await request("/api/properties")).status, 401);
  count++;
  assert.equal((await request("/api/properties", "POST", {})).status, 401);
  count++;
  assert.equal(
    (
      await request("/api/inquiries", "POST", {
        kind: "contact",
        name: "Test",
        email: "invalid",
        consent: true,
      })
    ).status,
    400,
  );
  count++;
  const inquiry = {
    name: "SMOKE TEST ONLY",
    email: "test@example.com",
    phone: "",
    message: "Functional test, not a real request.",
    consent: true,
    kind: "contact",
  };
  assert.equal((await request("/api/inquiries", "POST", inquiry)).status, 200);
  count++;
  if (process.env.TEST_ADMIN_PASSWORD) {
    const r = await request("/api/admin", "POST", {
      password: process.env.TEST_ADMIN_PASSWORD,
    });
    assert.equal(r.status, 200);
    cookie = r.headers.get("set-cookie").split(";")[0];
    count++;
    const data = await (
      await request("/api/properties", "GET", undefined, true)
    ).json();
    assert(data.inquiries.some((i) => i.name === inquiry.name));
    assert(
      data.properties.some(
        (p) => p.id === "2183-bent-oak-dr" && p.status === "draft",
      ),
    );
    count++;
    const p = {
      id: "smoke-test-property",
      address: "TEST FIXTURE — NOT A LISTING",
      city: "Test",
      state: "FL",
      zip: "00000",
      price: 100,
      beds: 3,
      baths: 2,
      sqft: 1000,
      description: "Automated test fixture",
      amenities: ["Test amenity"],
      photos: ["https://example.com/test.jpg"],
      status: "draft",
      featured: false,
      verified: false,
      source: "test fixture",
    };
    assert.equal(
      (await request("/api/properties", "POST", p, true)).status,
      200,
    );
    assert.equal((await request("/listings/" + p.id)).status, 404);
    count++;
    assert.equal(
      (
        await request(
          "/api/properties",
          "POST",
          { ...p, status: "published" },
          true,
        )
      ).status,
      400,
    );
    count++;
    for (const status of ["published", "pending", "sold", "archived"]) {
      assert.equal(
        (
          await request(
            "/api/properties",
            "POST",
            { ...p, status, verified: true },
            true,
          )
        ).status,
        200,
      );
      const r = await request("/listings/" + p.id);
      assert.equal(r.status, status === "archived" ? 404 : 200);
      if (status !== "archived") assert((await r.text()).includes(p.address));
      count++;
      if (status === "published") {
        assert.equal(
          (
            await request("/api/inquiries", "POST", {
              ...inquiry,
              kind: "showing",
              propertyId: p.id,
            })
          ).status,
          200,
        );
        count++;
      }
    }
    assert.equal(
      (
        await request("/api/inquiries", "POST", {
          ...inquiry,
          kind: "valuation",
          propertyAddress: "TEST ADDRESS",
        })
      ).status,
      200,
    );
    const inbox = await (
      await request("/api/properties", "GET", undefined, true)
    ).json();
    assert(
      inbox.inquiries.some(
        (i) => i.kind === "valuation" && i.message.includes("TEST ADDRESS"),
      ),
    );
    count++;
    assert.equal(
      (await request("/api/admin", "DELETE", undefined, true)).status,
      200,
    );
    count++;
  }
  console.log(`${count} functional checks passed.`);
} finally {
  if (!process.env.DATABASE_URL) {
    if (backup) await fs.writeFile(store, backup);
    else await fs.rm(store, { force: true });
  }
}
