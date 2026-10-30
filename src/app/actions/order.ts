"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminId } from "@/lib/auth";

async function guard() {
  if (!(await getAdminId())) throw new Error("Unauthorized");
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
  })).min(1, "At least one item required")
});

export async function createOrder(data: z.infer<typeof orderSchema>) {
  const parsed = orderSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "Invalid order data" };
  }
  try {
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
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    return { ok: true, orderId: order.id };
  } catch (err) {
    console.error("Order creation failed:", err);
    return { ok: false, error: "Failed to place order" };
  }
}

export async function setOrderStatus(id: string, status: "NEW" | "CONFIRMED" | "FULFILLED" | "CANCELLED") {
  await guard();
  await db.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

export async function deleteOrder(id: string) {
  await guard();
  await db.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
