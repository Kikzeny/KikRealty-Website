import { NextResponse } from "next/server";
import { equal, token, sameOrigin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!rateLimit(req, "login", 10, 15 * 60000))
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  if (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET)
    return NextResponse.json(
      { error: "Admin access is not configured." },
      { status: 503 },
    );
  try {
    const data = await req.json();
    if (!equal(String(data.password || ""), process.env.ADMIN_PASSWORD))
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    const res = NextResponse.json({ ok: true });
    res.cookies.set("kik_admin", token(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 28800,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid sign-in request" },
      { status: 400 },
    );
  }
}
export async function DELETE(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("kik_admin");
  return res;
}
