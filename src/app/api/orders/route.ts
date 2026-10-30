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

const orderSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(5).max(300),
  notes: z.string().trim().max(1000).optional(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().min(1),
    productId: z.string().optional()
  })).min(1)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400, headers: corsHeaders });
    }
    const order = await db.order.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        notes: parsed.data.notes || null,
        items: {
          create: parsed.data.items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            productId: i.productId || null
          }))
        }
      },
      include: { items: true }
    });
    return NextResponse.json({ ok: true, message: "Order placed successfully", orderId: order.id }, { status: 201, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
