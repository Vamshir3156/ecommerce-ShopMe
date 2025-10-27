import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../lib_api";
import Modal from "../../components/Modal";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCcw,
  FiSearch,
  FiSave,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiImage,
} from "react-icons/fi";

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    image: "",
    price: 0,
    category: "",
    stock: 10,
    rating: 4.5,
  });

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "title", dir: "asc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(new Set());
  const [previewUrl, setPreviewUrl] = useState("");
  const searchRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setList(Array.isArray(data) ? data : []);
      setSelected(new Set());
      setError(null);
    } catch (e) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.key === "n" || e.key === "N") && !open) {
        e.preventDefault();
        openCreate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openCreate = () => {
    setEditing(null);
    const nextId = "p" + Date.now();
    setForm({
      id: nextId,
      title: "",
      description: "",
      image: "",
      price: 0,
      category: "",
      stock: 10,
      rating: 4.5,
    });
    setPreviewUrl("");
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      id: p.id ?? "",
      title: p.title ?? "",
      description: p.description ?? "",
      image: p.image ?? "",
      price: Number(p.price ?? 0),
      category: p.category ?? "",
      stock: Number(p.stock ?? 0),
      rating: Number(p.rating ?? 0),
    });
    setPreviewUrl(p.image || "");
    setOpen(true);
  };

  const save = async () => {
    try {
      if (!form.title?.trim()) return alert("Title is required");
      if (form.price === "" || isNaN(Number(form.price)))
        return alert("Valid price is required");

      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || "",
        image:
          form.image?.trim() ||
          "/images/" + (form.category?.toLowerCase() || "item") + ".jpg",
        price: Number(form.price),
        category: form.category?.trim() || "",
        stock: Number(form.stock || 0),
        rating: Number(form.rating || 0),
      };

      if (editing) {
        await api.put(`/products/${editing}`, payload);
      } else {
        await api.post("/products", { id: form.id, ...payload });
      }

      setOpen(false);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const removeSelected = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} selected item(s)?`)) return;
    try {
      for (const id of selected) {
        await api.delete(`/products/${id}`);
      }
      await load();
    } catch (e) {
      alert("Bulk delete failed");
    }
  };

  const toggleSort = (key) => {
    setSort((prev) => {
      const dir =
        prev.key === key ? (prev.dir === "asc" ? "desc" : "asc") : "asc";
      return { key, dir };
    });
  };

  const sortedFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = q
      ? list.filter((p) =>
          [p.title, p.category, p.id].some((x) =>
            String(x || "")
              .toLowerCase()
              .includes(q)
          )
        )
      : list.slice();

    rows.sort((a, b) => {
      const { key, dir } = sort;
      const A = a?.[key];
      const B = b?.[key];
      let cmp = 0;
      if (typeof A === "number" && typeof B === "number") cmp = A - B;
      else cmp = String(A ?? "").localeCompare(String(B ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [list, query, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / perPage));
  const pageSafe = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (pageSafe - 1) * perPage;
    return sortedFiltered.slice(start, start + perPage);
  }, [sortedFiltered, pageSafe, perPage]);

  const toggleSelected = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    const idsOnPage = slice.map((p) => p.id);
    const allSelected = idsOnPage.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) idsOnPage.forEach((id) => next.delete(id));
      else idsOnPage.forEach((id) => next.add(id));
      return next;
    });
  };

  const SortHeader = ({ label, col }) => (
    <button
      type="button"
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 font-semibold hover:opacity-80"
      title={`Sort by ${label}`}
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

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded" />
        </div>
        <div className="card overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 border-b last:border-0 bg-gray-50" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-red-600 flex items-center justify-between">
        <div>{error}</div>
        <button className="btn flex items-center gap-2" onClick={load}>
          <FiRefreshCcw /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight">Admin · Products</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchRef}
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search (/, title, category, id)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              className="btn flex items-center gap-2"
              onClick={load}
              title="Refresh"
            >
              <FiRefreshCcw /> Refresh
            </button>
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={openCreate}
              title="New product (n)"
            >
              <FiPlus /> New product
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        {selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <span>
              <span className="font-semibold">{selected.size}</span> selected
            </span>
            <button
              className="btn flex items-center gap-2"
              onClick={removeSelected}
            >
              <FiTrash2 /> Delete selected
            </button>
          </div>
        ) : (
          <span className="opacity-70">
            Tip: press "/" to search, "n" to create
          </span>
        )}
        <label className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            className="border rounded px-2 py-1"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-left border-b">
              <th className="py-2 pr-3 w-10">
                <input
                  type="checkbox"
                  onChange={toggleAllOnPage}
                  checked={
                    slice.length > 0 && slice.every((p) => selected.has(p.id))
                  }
                  aria-label="Select all on page"
                />
              </th>
              <th className="py-2 pr-3">
                <SortHeader label="ID" col="id" />
              </th>
              <th className="py-2 pr-3">Image</th>
              <th className="py-2 pr-3">
                <SortHeader label="Title" col="title" />
              </th>
              <th className="py-2 pr-3">
                <SortHeader label="Category" col="category" />
              </th>
              <th className="py-2 pr-3">
                <SortHeader label="Price" col="price" />
              </th>
              <th className="py-2 pr-3">
                <SortHeader label="Stock" col="stock" />
              </th>
              <th className="py-2 pr-3">
                <SortHeader label="Rating" col="rating" />
              </th>
              <th className="py-2 pr-3" />
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              slice.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-2 pr-3 align-center">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelected(p.id)}
                      aria-label={`Select ${p.title}`}
                    />
                  </td>
                  <td className="py-2 pr-3 font-mono text-xs align-center">
                    {p.id}
                  </td>
                  <td className="py-2 pr-3 align-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt="thumb"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiImage className="opacity-40" />
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-3 align-center">
                    <div className="font-medium leading-5">{p.title}</div>
                    {/* {p.description ? (
                      <div className="text-gray-500 line-clamp-2 max-w-[40ch]">
                        {p.description}
                      </div>
                    ) : null} */}
                  </td>
                  <td className="py-2 pr-3 align-center">
                    {p.category || <span className="opacity-50">—</span>}
                  </td>
                  <td className="py-2 pr-3 align-center">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="py-2 pr-3 align-center">{p.stock}</td>
                  <td className="py-2 pr-3 align-center">⭐ {p.rating}</td>
                  <td className="py-2 pr-3 align-center whitespace-nowrap">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        className="btn flex items-center gap-1"
                        onClick={() => openEdit(p)}
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        className="btn flex items-center gap-1"
                        onClick={() => remove(p.id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between items-center text-sm gap-3">
        <div>
          Page {pageSafe} of {totalPages} · Showing {slice.length} /{" "}
          {sortedFiltered.length}
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

      <Modal
        open={open}
        title={editing ? "Edit product" : "Create product"}
        onClose={() => setOpen(false)}
        actions={
          <>
            <button
              className="btn flex items-center gap-1"
              onClick={() => setOpen(false)}
            >
              <FiX /> Cancel
            </button>
            <button
              className="btn btn-primary flex items-center gap-1"
              onClick={save}
            >
              <FiSave /> {editing ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">
            <div>ID</div>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              disabled={!!editing}
            />
          </label>
          <label className="text-sm">
            <div>
              Title <span className="text-red-500">*</span>
            </div>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="text-sm md:col-span-2">
            <div>Description</div>
            <textarea
              className="w-full border rounded px-2 py-1"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <div>Category</div>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <div>Image URL</div>
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="/images/headphones.jpg"
              value={form.image}
              onChange={(e) => {
                setForm({ ...form, image: e.target.value });
                setPreviewUrl(e.target.value);
              }}
            />
            <div className="mt-2 flex items-center gap-3">
              <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center border">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage className="opacity-40" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Leave blank to auto-use{" "}
                <code>/images/&lt;category&gt;.jpg</code>
              </p>
            </div>
          </label>
          <label className="text-sm">
            <div>
              Price <span className="text-red-500">*</span>
            </div>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <div>Stock</div>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <div>Rating</div>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Tip: If you leave Image blank, a default like{" "}
          <code>/images/&lt;category&gt;.jpg</code> is used.
        </p>
      </Modal>
    </div>
  );
}
