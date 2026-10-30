import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().regex(/^[+0-9\s-]{7,20}$/, "Valid phone required"),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(5).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400, headers: corsHeaders });
    }
    const inquiry = await db.inquiry.create({
      data: parsed.data
    });
    return NextResponse.json({ ok: true, message: "Inquiry received successfully", id: inquiry.id }, { status: 201, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
