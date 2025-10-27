import React, { useEffect, useMemo, useState } from "react";
import api from "../../lib_api";
import {
  FiRefreshCcw,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "created_at", dir: "desc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders/admin/all");
      setOrders(data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSort = (key) => {
    setSort((prev) => {
      const dir =
        prev.key === key ? (prev.dir === "asc" ? "desc" : "asc") : "asc";
      return { key, dir };
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = q
      ? orders.filter((o) =>
          [o.id, o.user_email, o.status].some((x) =>
            String(x || "")
              .toLowerCase()
              .includes(q)
          )
        )
      : orders.slice();

    rows.sort((a, b) => {
      const { key, dir } = sort;
      const A = a?.[key];
      const B = b?.[key];
      const cmp = String(A ?? "").localeCompare(String(B ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [orders, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageSafe = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (pageSafe - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, pageSafe, perPage]);

  const SortHeader = ({ label, col }) => (
    <button
      type="button"
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 font-semibold hover:opacity-80"
    >
      <span>{label}</span>
      {sort.key === col ? (
        sort.dir === "asc" ? (
          <FiChevronUp />
        ) : (
          <FiChevronDown />
        )
      ) : (
        <span className="opacity-40">⇅</span>
      )}
    </button>
  );

  if (loading)
    return (
      <div className="card animate-pulse p-4 h-screen flex items-center justify-center text-lg">
        Loading orders...
      </div>
    );
  if (error)
    return (
      <div className="card text-red-600 flex items-center justify-between p-4 h-screen">
        <div>{error}</div>
        <button className="btn flex items-center gap-2" onClick={load}>
          <FiRefreshCcw /> Retry
        </button>
      </div>
    );

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-none p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white shadow-sm">
        <h1 className="text-2xl font-black">Admin · Orders</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by id, email, or status"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button className="btn flex items-center gap-2" onClick={load}>
            <FiRefreshCcw /> Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="card rounded-none shadow-none border-none h-full overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 border-b">
              <tr className="text-left">
                <th className="py-3 px-4">
                  <SortHeader label="Order ID" col="id" />
                </th>
                <th className="py-3 px-4">
                  <SortHeader label="Customer Email" col="user_email" />
                </th>
                <th className="py-3 px-4">
                  <SortHeader label="Amount" col="amount" />
                </th>
                <th className="py-3 px-4">
                  <SortHeader label="Status" col="status" />
                </th>
                <th className="py-3 px-4">
                  <SortHeader label="Placed At" col="created_at" />
                </th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                slice.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 font-mono text-xs">{o.id}</td>
                    <td className="py-2 px-4">{o.user_email}</td>
                    <td className="py-2 px-4">
                      ${Number(o.amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 capitalize">{o.status}</td>
                    <td className="py-2 px-4">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-none p-4 flex flex-wrap justify-between items-center text-sm bg-white border-t shadow-inner">
        <div>
          Page {pageSafe} of {totalPages} · Showing {slice.length} /{" "}
          {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn"
            disabled={pageSafe <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="btn"
            disabled={pageSafe >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
