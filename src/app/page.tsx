import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center bg-[#FAF7F0] p-6 text-[#25291F]">
      <div className="max-w-md w-full bg-white border border-[#EAE2D0] p-8 rounded shadow-sm text-center">
        <h1 className="font-display text-2xl font-semibold text-[#1F3D2B]">Zaheer Seed Corporation</h1>
        <p className="text-sm text-[#6B7340] font-medium mt-1">Backend API & Admin Portal</p>
        
        <div className="my-6 border-t border-b border-[#EAE2D0] py-4 text-xs text-[#5A4A38] space-y-2 text-left">
          <p>• <strong>API Service:</strong> Active (REST & JSON)</p>
          <p>• <strong>Database:</strong> PostgreSQL (Neon Serverless)</p>
          <p>• <strong>ORM:</strong> Prisma 5.22</p>
          <p>• <strong>Admin Auth:</strong> JWT (Secure httpOnly Cookie)</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/admin/login"
            className="w-full bg-[#1F3D2B] text-[#FAF7F0] py-2.5 px-4 rounded font-medium hover:bg-[#6B7340] transition-colors"
          >
            Admin Sign In
          </Link>
          <Link
            href="/api/health"
            className="w-full border border-[#1F3D2B] text-[#1F3D2B] py-2 px-4 rounded font-medium hover:bg-[#EAE2D0] transition-colors text-sm"
          >
            Check API Health
          </Link>
        </div>
      </div>
    </main>
  );
}
