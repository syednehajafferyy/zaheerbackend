"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { getAdminId } from "@/lib/auth";
async function guard() { if (!(await getAdminId())) redirect("/admin/login"); }
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const bust = () => { for (const p of ["/admin/dashboard", "/admin/products", "/admin/categories", "/admin/inquiries", "/seeds"]) revalidatePath(p); };
const prod = z.object({ name: z.string().trim().min(2).max(120), description: z.string().trim().min(5).max(5000), categoryId: z.string().optional() });
export async function saveProduct(id: string, _: { error?: string }, fd: FormData) {
  await guard();
  const raw: Record<string, FormDataEntryValue> = {};
  fd.forEach((v, k) => { raw[k] = v; });
  const p = prod.safeParse(raw); if (!p.success) return { error: "Name and description are required." };
  const old = id === "new" ? null : await db.product.findUnique({ where: { id } });
  let image = old?.image ?? null; const file = fd.get("file") as File | null;
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/") || file.size > 4_000_000) return { error: "Upload an image under 4 MB." };
    if (!process.env.BLOB_READ_WRITE_TOKEN) return { error: "Image upload needs BLOB_READ_WRITE_TOKEN. See the README." };
    image = (await put(`products/${Date.now()}-${file.name}`, file, { access: "public" })).url;
    if (old?.image) await del(old.image).catch(() => {});
  }
  const data = { name: p.data.name, description: p.data.description, image, published: fd.get("published") === "on", categoryId: p.data.categoryId || null };
  try {
    if (old) await db.product.update({ where: { id }, data });
    else await db.product.create({ data: { ...data, slug: `${slugify(data.name)}-${Date.now().toString(36)}` } });
  } catch { return { error: "Could not save the product." }; }
  bust(); redirect("/admin/products");
}
export async function toggleProduct(id: string, published: boolean) { await guard(); await db.product.update({ where: { id }, data: { published } }); bust(); }
export async function deleteProduct(id: string) { await guard(); const p = await db.product.delete({ where: { id } }); if (p.image) await del(p.image).catch(() => {}); bust(); }
export async function saveCategory(fd: FormData) {
  await guard(); const name = String(fd.get("name") ?? "").trim(); if (name.length < 2) return;
  const data = { name, slug: slugify(name), description: String(fd.get("description") ?? "") || null }; const id = String(fd.get("id") ?? "");
  if (id) await db.category.update({ where: { id }, data }); else await db.category.create({ data }); bust();
}
export async function deleteCategory(id: string) { await guard(); await db.category.delete({ where: { id } }); bust(); }
export async function setInquiryStatus(id: string, status: "PENDING" | "READ" | "RESOLVED") { await guard(); await db.inquiry.update({ where: { id }, data: { status } }); bust(); }
export async function deleteInquiry(id: string) { await guard(); await db.inquiry.delete({ where: { id } }); bust(); }
