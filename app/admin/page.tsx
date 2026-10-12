import { authorized } from "@/lib/auth";
import { readData } from "@/lib/store";
import Admin from "@/components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const ok = await authorized();
  const d = ok ? await readData() : null;
  return (
    <Admin initial={d?.properties || null} requests={d?.inquiries || []} />
  );
}
