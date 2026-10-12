import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
export type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  description: string;
  amenities: string[];
  photos: string[];
  status: "draft" | "published" | "pending" | "sold" | "archived";
  featured: boolean;
  verified: boolean;
  source: string;
};
export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  kind: string;
  propertyId: string;
  createdAt: string;
};
const seed: Property = {
  id: "2183-bent-oak-dr",
  address: "2183 Bent Oak Dr",
  city: "Apopka",
  state: "FL",
  zip: "32712",
  price: null,
  beds: null,
  baths: null,
  sqft: null,
  description: "Awaiting approved property details and supplied photography.",
  amenities: [],
  photos: [],
  status: "draft",
  featured: false,
  verified: false,
  source:
    "https://www.zillow.com/homedetails/2183-Bent-Oak-Dr-Apopka-FL-32712/46028599_zpid/?view=public",
};
const file = path.join(process.cwd(), ".data", "records.json");
type Data = { properties: Property[]; inquiries: Inquiry[] };
let queue: Promise<unknown> = Promise.resolve();
async function db() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`CREATE TABLE IF NOT EXISTS kikrealty_records (id text PRIMARY KEY, kind text NOT NULL, data jsonb NOT NULL)`;
  await sql`INSERT INTO kikrealty_records (id,kind,data) VALUES (${seed.id},'property',${JSON.stringify(seed)}::jsonb) ON CONFLICT DO NOTHING`;
  return sql;
}
async function local(): Promise<Data> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    return { properties: [seed], inquiries: [] };
  }
}
export async function readData(): Promise<Data> {
  if (process.env.DATABASE_URL) {
    const sql = await db();
    const rows = await sql`SELECT kind,data FROM kikrealty_records`;
    return {
      properties: rows
        .filter((r) => r.kind === "property")
        .map((r) => r.data as Property),
      inquiries: rows
        .filter((r) => r.kind === "inquiry")
        .map((r) => r.data as Inquiry),
    };
  }
  if (process.env.VERCEL) throw Error("DATABASE_URL required on Vercel");
  return local();
}
export async function saveRecord(
  kind: "property" | "inquiry",
  record: Property | Inquiry,
) {
  if (process.env.DATABASE_URL) {
    const sql = await db();
    await sql`INSERT INTO kikrealty_records (id,kind,data) VALUES (${record.id},${kind},${JSON.stringify(record)}::jsonb) ON CONFLICT (id) DO UPDATE SET data=EXCLUDED.data`;
    return;
  }
  if (process.env.VERCEL) throw Error("DATABASE_URL required on Vercel");
  const job = queue.then(async () => {
    const data = await local();
    if (kind === "property")
      data.properties = [
        ...data.properties.filter((p) => p.id !== record.id),
        record as Property,
      ];
    else data.inquiries.push(record as Inquiry);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file + ".tmp", JSON.stringify(data, null, 2));
    await fs.rename(file + ".tmp", file);
  });
  queue = job.catch(() => {});
  await job;
}
export function visible(p: Property) {
  return p.verified && ["published", "pending", "sold"].includes(p.status);
}
