import { db } from "@/lib/db";

export default async function Dash() {
  const [a, b, c, d, e, f] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { published: true } }),
    db.inquiry.count(),
    db.inquiry.count({ where: { status: "PENDING" } }),
    db.order.count(),
    db.order.count({ where: { status: "NEW" } })
  ]);
  const s = [
    ["Total products", a],
    ["Published products", b],
    ["Total orders", e],
    ["New orders", f],
    ["Total inquiries", c],
    ["Pending inquiries", d]
  ];
  return (
    <>
      <h1 className="font-display text-3xl text-forest font-semibold">Dashboard</h1>
      <dl className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {s.map(([l, n]) => (
          <div key={l as string} className="bg-white border border-sand p-5 rounded">
            <dt className="text-sm text-soil font-medium">{l}</dt>
            <dd className="font-display text-3xl mt-1 text-forest font-bold">{n}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
