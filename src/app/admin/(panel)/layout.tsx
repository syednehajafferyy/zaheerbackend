import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminId } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function Panel({ children }: { children: React.ReactNode }) {
  if (!(await getAdminId())) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#25291F]">
      <header className="border-b border-[#EAE2D0] bg-white px-4 md:px-8 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="font-display font-semibold text-[#1F3D2B] text-lg">Zaheer Seed Admin</span>
        <nav className="flex flex-wrap gap-4 text-sm flex-1" aria-label="Admin">
          {["dashboard", "products", "categories", "orders", "inquiries"].map(s => (
            <Link key={s} href={`/admin/${s}`} className="hover:text-[#1F3D2B] capitalize font-medium text-[#5A4A38]">
              {s}
            </Link>
          ))}
        </nav>
        <form action={signOut}><button className="text-sm underline text-[#5A4A38] hover:text-red-700">Sign out</button></form>
      </header>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">{children}</div>
    </div>
  );
}
