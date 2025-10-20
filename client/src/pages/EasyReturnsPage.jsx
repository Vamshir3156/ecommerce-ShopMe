import { RotateCcw, ChevronDown } from "lucide-react";
import { useState } from "react";

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-4 pb-3 text-sm text-gray-700">{a}</div>}
    </div>
  );
}

export default function EasyReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
        <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
          <div className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl bg-white/15">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">
              30-Day Easy Returns
            </h1>
            <p className="text-white/90 mt-1">
              Risk-free shopping with hassle-free exchanges.
            </p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-5 grid md:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Window</p>
          <p className="text-lg font-bold">30 days</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Refund</p>
          <p className="text-lg font-bold">Instant store credit / 3–5d</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Pickup</p>
          <p className="text-lg font-bold">Available in select regions</p>
        </div>
      </div>

      {/* Policy bullets */}
      <div className="mt-6 card p-6">
        <h2 className="text-lg font-bold mb-3">Return policy</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Unused items with original packaging eligible within 30 days.</li>
          <li>Refunds to original payment method or instant store credit.</li>
          <li>Printerless drop-off labels supported at partner locations.</li>
        </ul>
        <div className="mt-5 flex gap-3">
          <a className="btn btn-primary" href="/?sort=popular">
            Shop risk-free
          </a>
          <a className="btn" href="/policies/returns">
            Read full policy
          </a>
        </div>
      </div>

      {/* FAQs */}
      <h2 className="mt-6 mb-3 text-lg font-bold">FAQs</h2>
      <div className="grid gap-2">
        <FAQ
          q="How long do refunds take?"
          a="Store credit is instant. Refunds to cards typically clear in 3–5 business days after inspection."
        />
        <FAQ
          q="Are return labels free?"
          a="Yes, in supported regions. Otherwise a discounted label is offered at checkout."
        />
        <FAQ
          q="Can I exchange sizes?"
          a="Absolutely. Exchanges ship once your return is scanned by the carrier."
        />
      </div>
    </div>
  );
}
