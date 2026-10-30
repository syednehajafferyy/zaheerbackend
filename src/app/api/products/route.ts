import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  try {
    const products = await db.product.findMany({
      where: {
        published: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {})
      },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ ok: true, products }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
