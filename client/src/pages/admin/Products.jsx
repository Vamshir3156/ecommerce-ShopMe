import React from "react";
import { useEffect, useState } from "react";
import api from "../../lib_api";
import Modal from "../../components/Modal";

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

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setList(data);
    } catch (e) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      id: "p" + Date.now(),
      title: "",
      description: "",
      image: "",
      price: 0,
      category: "",
      stock: 10,
      rating: 4.5,
    });
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ ...p });
    setOpen(true);
  };

  const save = async () => {
    try {
      if (!form.title || !form.price)
        return alert("Title and Price are required");
      if (editing) {
        await api.put("/products/" + editing, {
          title: form.title,
          description: form.description,
          image:
            form.image ||
            "/images/" + (form.category?.toLowerCase() || "item") + ".jpg",
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          rating: Number(form.rating),
        });
      } else {
        await api.post("/products", {
          id: form.id,
          title: form.title,
          description: form.description,
          image:
            form.image ||
            "/images/" + (form.category?.toLowerCase() || "item") + ".jpg",
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          rating: Number(form.rating),
        });
      }
      setOpen(false);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete("/products/" + id);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Admin · Products</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          New product
        </button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Title</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">Stock</th>
              <th className="py-2 pr-3">Rating</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2 pr-3 font-mono">{p.id}</td>
                <td className="py-2 pr-3">{p.title}</td>
                <td className="py-2 pr-3">{p.category}</td>
                <td className="py-2 pr-3">${Number(p.price).toFixed(2)}</td>
                <td className="py-2 pr-3">{p.stock}</td>
                <td className="py-2 pr-3">⭐ {p.rating}</td>
                <td className="py-2 pr-3">
                  <div className="flex gap-2">
                    <button className="btn" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button className="btn" onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editing ? "Edit product" : "Create product"}
        onClose={() => setOpen(false)}
        actions={
          <>
            <button className="btn" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save}>
              {editing ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">
            <div>Id</div>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              disabled={!!editing}
            />
          </label>
          <label className="text-sm">
            <div>Title *</div>
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
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <div>Price *</div>
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
