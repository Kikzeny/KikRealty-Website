import { NextResponse } from "next/server";
import { authorized, sameOrigin } from "@/lib/auth";
import { readData, saveRecord, Property } from "@/lib/store";
export async function GET() {
  if (!(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readData());
}
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const p = (await req.json()) as Property;
    if (
      !/^[a-z0-9-]{1,100}$/.test(p.id) ||
      !p.address ||
      !p.city ||
      !p.state ||
      !p.zip ||
      !["draft", "published", "pending", "sold", "archived"].includes(
        p.status,
      ) ||
      typeof p.verified !== "boolean" ||
      typeof p.featured !== "boolean" ||
      !Array.isArray(p.photos) ||
      !Array.isArray(p.amenities)
    )
      throw Error("Complete the required property fields.");
    if (
      [p.price, p.beds, p.baths, p.sqft].some(
        (n) =>
          n !== null && (typeof n !== "number" || !Number.isFinite(n) || n < 0),
      )
    )
      throw Error("Numeric fields must be positive numbers.");
    if (
      typeof p.description !== "string" ||
      typeof p.source !== "string" ||
      p.description.length > 20000 ||
      p.source.length > 2000 ||
      p.photos.length > 60 ||
      p.amenities.length > 100 ||
      p.amenities.some((a) => typeof a !== "string" || a.length > 300)
    )
      throw Error("Invalid description, source, photos, or amenities.");
    if (
      p.photos.some((u) => typeof u !== "string" || !u.startsWith("https://"))
    )
      throw Error("Photos must use HTTPS URLs.");
    if (
      ["published", "pending", "sold"].includes(p.status) &&
      (!p.verified || !p.source || !p.photos.length || !p.description)
    )
      throw Error(
        "Publishing requires verified details, a source, description, and approved photos.",
      );
    if (
      ["published", "pending", "sold"].includes(p.status) &&
      !process.env.NEXT_PUBLIC_BROKERAGE_NAME
    )
      throw Error("Configure brokerage identification before publishing.");
    await saveRecord("property", p);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
