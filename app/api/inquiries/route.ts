import { NextResponse } from "next/server";
import { saveRecord, readData, visible } from "@/lib/store";
import { sameOrigin } from "@/lib/auth";
import { randomUUID } from "crypto";
const limits = new Map<string, { count: number; expires: number }>();
export async function POST(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const d = await req.json();
    if (d.website) return NextResponse.json({ ok: true });
    const key = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    for (const [k, v] of limits) if (v.expires < now) limits.delete(k);
    const v = limits.get(key) || { count: 0, expires: now + 60000 };
    if (v.count >= 5)
      return NextResponse.json(
        { error: "Please wait a minute before trying again." },
        { status: 429 },
      );
    v.count++;
    limits.set(key, v);
    if (
      !d.consent ||
      typeof d.name !== "string" ||
      !d.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(d.email) ||
      !["contact", "showing", "valuation"].includes(d.kind) ||
      [d.name, d.email, d.phone || "", d.message || ""].some(
        (x) => typeof x !== "string" || x.length > 4000,
      )
    )
      throw Error("Please enter your name, a valid email, and consent.");
    if (
      d.kind === "showing" &&
      !(await readData()).properties.some(
        (p) => p.id === d.propertyId && visible(p) && p.status !== "sold",
      )
    )
      throw Error("Select an available listing to request a showing.");
    await saveRecord("inquiry", {
      id: randomUUID(),
      name: d.name,
      email: d.email,
      phone: d.phone || "",
      message:
        (d.propertyAddress
          ? "Property address: " +
            String(d.propertyAddress).slice(0, 300) +
            "\n"
          : "") + (d.message || ""),
      kind: d.kind,
      propertyId: d.propertyId || "",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
