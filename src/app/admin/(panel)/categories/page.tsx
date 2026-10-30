import { db } from "@/lib/db";
import { saveCategory, deleteCategory } from "@/app/actions/admin";
export default async function Cats() {
  const list = await db.category.findMany({ orderBy: { name: "asc" } }); const i = "border border-sand bg-white px-3 py-2";
  return (<><h1 className="font-display text-3xl text-forest">Categories</h1>
    <form action={saveCategory} className="mt-6 flex flex-wrap gap-2"><input name="name" required placeholder="Category name" className={i} /><input name="description" placeholder="Description" className={`${i} flex-1`} /><button className="bg-forest text-paper px-4">Add category</button></form>
    {list.length === 0 && <p className="mt-8 text-soil">No categories yet.</p>}
    <ul className="mt-6 grid gap-3">{list.map(c => (<li key={c.id} className="bg-white border border-sand p-3 flex flex-wrap gap-2 items-center">
      <form action={saveCategory} className="flex flex-wrap gap-2 flex-1"><input type="hidden" name="id" value={c.id} /><input name="name" defaultValue={c.name} required className={i} /><input name="description" defaultValue={c.description ?? ""} className={`${i} flex-1`} /><button className="underline">Save changes</button></form>
      <form action={deleteCategory.bind(null, c.id)}><button className="underline text-red-800">Delete</button></form></li>))}</ul></>);
}
