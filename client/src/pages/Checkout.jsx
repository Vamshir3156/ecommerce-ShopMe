import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";
import api from "../lib_api";
import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const items = useSelector((s) => s.cart.items);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => items.reduce((a, c) => a + c.price * c.qty, 0),
    [items]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (items.length === 0) return setStatus("Your cart is empty.");

    try {
      setLoading(true);
      //Ask backend to create a PaymentIntent
      const { data } = await api.post("/payments/create-intent", {
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
      });
      const clientSecret = data.clientSecret;

      //Confirm payment with card input
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setStatus(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        //Save the order after successful payment
        const { data: order } = await api.post("/orders", {
          items: items.map((i) => ({
            productId: i.id,
            title: i.title,
            qty: i.qty,
            price: i.price,
          })),
          amount: total,
        });
        dispatch(clearCart());
        setStatus(`✅ Payment successful. Order ${order.id} placed!`);
      }
    } catch (err) {
      setStatus(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Checkout</h2>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm">
            <span>
              {i.title} × {i.qty}
            </span>
            <span>${(i.qty * i.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t pt-3">
        <span className="font-bold">Total</span>
        <span className="text-lg font-black">${total.toFixed(2)}</span>
      </div>

      <div className="border rounded px-3 py-2">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button className="btn btn-primary w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay now"}
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}

      <p className="text-xs text-gray-500">
        Use Stripe test card 4242 4242 4242 4242 — any future expiry, any CVC,
        any ZIP.
      </p>
    </form>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
