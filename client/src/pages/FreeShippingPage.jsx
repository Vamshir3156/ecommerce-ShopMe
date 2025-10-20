import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { Truck } from "lucide-react";

export default function FreeShippingPage() {
  const products = useSelector((s) => s.products.list);
  const eligible = products.filter(
    (p) => p.free_shipping || Number(p.price) >= 50
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
          <div className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl bg-white/15">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">
              Free Shipping Picks
            </h1>
            <p className="text-white/90 mt-1">
              All orders over <span className="font-semibold">$50</span> ship
              free.
            </p>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Threshold</p>
          <p className="text-lg font-bold">$50+</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Delivery</p>
          <p className="text-lg font-bold">2–5 business days</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Returns</p>
          <p className="text-lg font-bold">30-day window</p>
        </div>
      </div>

      {/* Grid */}
      <h2 className="mt-6 mb-3 text-lg font-bold">Eligible products</h2>
      {eligible.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="font-medium">No eligible items yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Add more products or lower the threshold.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {eligible.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
