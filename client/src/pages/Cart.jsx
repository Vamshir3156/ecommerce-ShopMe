import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQty } from "../store/slices/cartSlice";

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const d = useDispatch();

  const clamp = (n) => Math.min(99, Math.max(1, Number.isFinite(n) ? n : 1));
  const dec = (id, q) => d(updateQty({ id, qty: clamp(q - 1) }));
  const inc = (id, q) => d(updateQty({ id, qty: clamp(q + 1) }));
  const typeQty = (id, v) => d(updateQty({ id, qty: clamp(parseInt(v, 10)) }));

  const subtotal = items.reduce((a, c) => a + Number(c.price) * c.qty, 0);
  const totalItems = items.reduce((a, c) => a + c.qty, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto p-6">
          <div className="rounded-3xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-12 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-500/10 flex items-center justify-center">
              <span className="text-3xl">🛒</span>
            </div>
            <h2 className="text-3xl font-black mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Discover something you’ll love.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg hover:shadow-xl transition"
            >
              Browse products →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[radial-gradient(40rem_20rem_at_0%_0%,rgba(59,130,246,0.06),transparent),radial-gradient(35rem_20rem_at_100%_0%,rgba(99,102,241,0.06),transparent)] dark:bg-[radial-gradient(40rem_20rem_at_0%_0%,rgba(59,130,246,0.12),transparent),radial-gradient(35rem_20rem_at_100%_0%,rgba(99,102,241,0.12),transparent)]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((i) => {
              const lineTotal = Number(i.price) * i.qty;
              return (
                <div
                  key={i.id}
                  className="group rounded-3xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-4 sm:p-5 transition hover:-translate-y-[1px] hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{i.title}</p>
                        <span className="text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-white/10 border border-gray-200/60 dark:border-white/10 text-gray-600 dark:text-gray-400 rounded-full px-2 py-0.5">
                          In cart
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        ${Number(i.price).toFixed(2)} each
                      </p>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-xl overflow-hidden border border-gray-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5">
                        <button
                          type="button"
                          onClick={() => dec(i.id, i.qty)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-40"
                          disabled={i.qty <= 1}
                          aria-label={`Decrease quantity of ${i.title}`}
                        >
                          −
                        </button>
                        <input
                          className="w-12 text-center outline-none py-1 bg-transparent"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={i.qty}
                          onChange={(e) => typeQty(i.id, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => inc(i.id, i.qty)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 dark:hover:bg白/10 disabled:opacity-40"
                          disabled={i.qty >= 99}
                          aria-label={`Increase quantity of ${i.title}`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total + remove */}
                    <div className="text-right min-w-[6rem]">
                      <div className="font-bold">${lineTotal.toFixed(2)}</div>
                      <button
                        className="text-xs underline text-gray-500 hover:text-red-600 transition mt-1"
                        onClick={() => d(removeFromCart(i.id))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="rounded-3xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 h-fit sticky top-24 space-y-4">
            <h3 className="text-xl font-bold">Order Summary</h3>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent dark:via-white/10 my-2" />

            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-black">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block text-center w-full rounded-2xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg hover:shadow-xl hover:-translate-y-[1px] active:translate-y-0 transition"
            >
              Proceed to checkout
            </Link>

            <Link
              to="/"
              className="block text-center text-sm underline text-gray-800 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
