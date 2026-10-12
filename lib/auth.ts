import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
export function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function token() {
  const time = String(Date.now() + 8 * 60 * 60 * 1000);
  return (
    time +
    "." +
    createHmac("sha256", process.env.AUTH_SECRET!).update(time).digest("hex")
  );
}
export async function authorized() {
  const v = (await cookies()).get("kik_admin")?.value;
  if (!v || !process.env.AUTH_SECRET) return false;
  const [time, sig] = v.split(".");
  return (
    Number(time) > Date.now() &&
    equal(
      sig || "",
      createHmac("sha256", process.env.AUTH_SECRET).update(time).digest("hex"),
    )
  );
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      url.host === req.headers.get("host")
    );
  } catch {
    return false;
  }
}
