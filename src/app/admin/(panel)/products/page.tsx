import Link from "next/link";
import { db } from "@/lib/db";
import { deleteProduct, toggleProduct } from "@/app/actions/admin";
export default async function Products() {
  const list = await db.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return (<><div className="flex justify-between items-center"><h1 className="font-display text-3xl text-forest">Products</h1><Link href="/admin/products/new" className="bg-forest text-paper px-4 py-2">Add product</Link></div>
    {list.length === 0 ? <p className="mt-8 text-soil">No products yet. Add your first product.</p> :
      <ul className="mt-6 grid gap-3">{list.map(p => (<li key={p.id} className="bg-white border border-sand p-4 flex flex-wrap items-center gap-3 justify-between">
        <div><p className="font-medium">{p.name}</p><p className="text-sm text-soil">{p.category?.name ?? "Uncategorised"} | {p.published ? "Published" : "Draft"}</p></div>
        <div className="flex gap-4 text-sm"><Link href={`/admin/products/${p.id}`} className="underline">Edit</Link>
          <form action={toggleProduct.bind(null, p.id, !p.published)}><button className="underline">{p.published ? "Unpublish" : "Publish"}</button></form>
          <form action={deleteProduct.bind(null, p.id)}><button className="underline text-red-800">Delete</button></form></div></li>))}</ul>}</>);
}
