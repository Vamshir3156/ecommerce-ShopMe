import { useEffect, useState } from "react";
import api from "../../lib_api";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/orders/admin/all");
        setOrders(data);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="card">Loading orders...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-4 p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black">Admin · Orders</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-3">Order ID</th>
              <th className="py-2 pr-3">Customer Email</th>
              <th className="py-2 pr-3">Amount</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Placed At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-2 pr-3 font-mono">{o.id}</td>
                <td className="py-2 pr-3">{o.user_email}</td>
                <td className="py-2 pr-3">${o.amount.toFixed(2)}</td>
                <td className="py-2 pr-3">{o.status}</td>
                <td className="py-2 pr-3">
                  {new Date(o.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
