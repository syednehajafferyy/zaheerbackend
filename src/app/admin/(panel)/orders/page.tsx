import { db } from "@/lib/db";
import { setOrderStatus, deleteOrder } from "@/app/actions/order";

const statuses = ["NEW", "CONFIRMED", "FULFILLED", "CANCELLED"] as const;

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="font-display text-3xl text-forest font-semibold">Customer Orders</h1>
      {orders.length === 0 && <p className="mt-8 text-soil">No orders placed yet.</p>}
      <ul className="mt-6 grid gap-4">
        {orders.map((o) => (
          <li key={o.id} className="bg-white border border-sand p-5 rounded">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-sand pb-3">
              <div>
                <span className="font-display text-lg font-semibold text-forest">{o.name}</span>
                <p className="text-sm text-soil mt-1">📞 {o.phone} | 📍 {o.address}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded ${
                  o.status === "NEW" ? "bg-amber-100 text-amber-900 border border-amber-300" :
                  o.status === "CONFIRMED" ? "bg-blue-100 text-blue-900 border border-blue-300" :
                  o.status === "FULFILLED" ? "bg-emerald-100 text-emerald-900 border border-emerald-300" :
                  "bg-gray-100 text-gray-700 border border-gray-300"
                }`}>
                  {o.status}
                </span>
                <p className="text-xs text-soil mt-1">{o.createdAt.toLocaleDateString("en-GB")}</p>
              </div>
            </div>

            <div className="my-3">
              <h3 className="text-xs font-semibold uppercase text-soil mb-1">Items:</h3>
              <ul className="list-disc list-inside text-sm text-ink">
                {o.items.map((i) => (
                  <li key={i.id}>
                    <span className="font-medium">{i.name}</span> × {i.quantity}
                  </li>
                ))}
              </ul>
              {o.notes && (
                <p className="text-sm text-soil italic mt-2 bg-sand/30 p-2 rounded">
                  Note: {o.notes}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-sand text-sm">
              <span className="text-xs text-soil">Status:</span>
              {statuses.map((s) => (
                <form key={s} action={setOrderStatus.bind(null, o.id, s)}>
                  <button
                    disabled={o.status === s}
                    className="px-2 py-1 text-xs border rounded border-sand hover:bg-forest hover:text-paper disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors"
                  >
                    {s}
                  </button>
                </form>
              ))}
              <form action={deleteOrder.bind(null, o.id)} className="ml-auto">
                <button className="text-xs text-red-700 hover:underline">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
