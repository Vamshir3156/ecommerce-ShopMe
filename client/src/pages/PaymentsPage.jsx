import { Lock, CreditCard, Shield, SmartphoneNfc } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg">
        <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
          <div className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl bg-white/15">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">Secure Checkout</h1>
            <p className="text-white/90 mt-1">
              Powered by Stripe · PCI DSS Level 1 · 256-bit SSL
            </p>
          </div>
        </div>
      </div>

      {/* Methods */}
      <h2 className="mt-6 mb-3 text-lg font-bold">Accepted payment methods</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-gray-700" />
          <div>
            <p className="font-semibold">Cards</p>
            <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3">
          <SmartphoneNfc className="w-5 h-5 text-gray-700" />
          <div>
            <p className="font-semibold">Wallets</p>
            <p className="text-sm text-gray-600">Apple Pay, Google Pay</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-700" />
          <div>
            <p className="font-semibold">Bank / UPI</p>
            <p className="text-sm text-gray-600">
              Region-dependent availability
            </p>
          </div>
        </div>
      </div>

      {/* Assurance */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold mb-2">Your data is protected</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            Card details never touch our servers; all processing handled by
            Stripe.
          </li>
          <li>Transport encrypted with TLS 1.2+; HSTS enabled.</li>
          <li>3D Secure (SCA) triggered when required by your issuer.</li>
        </ul>
        <div className="mt-5">
          <a className="btn btn-primary" href="/?sort=popular">
            Start shopping
          </a>
        </div>
      </div>
    </div>
  );
}
