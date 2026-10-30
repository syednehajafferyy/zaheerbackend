import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/ProductForm";
export default async function Edit({ params }: { params: { id: string } }) {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  const product = params.id === "new" ? undefined : await db.product.findUnique({ where: { id: params.id } });
  if (params.id !== "new" && !product) notFound();
  return <><h1 className="font-display text-3xl text-forest mb-6">{product ? "Edit product" : "Add product"}</h1><ProductForm product={product ?? undefined} categories={categories} /></>;
}
