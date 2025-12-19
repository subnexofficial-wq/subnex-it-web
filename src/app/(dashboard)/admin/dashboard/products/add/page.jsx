
"use client";

import { useState } from "react";

export default function AddProductPage() {
  const [form, setForm] = useState({
    title: "",
    price: 0,
    category: "",
    status: "active",
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Product ready to send to backend");
  };

  return (
    <div className="admin-card p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
          className="w-full border rounded p-2"
        />

        {/* Title */}
        <input
          required
          placeholder="Product title"
          className="w-full border rounded p-2"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* Price */}
        <input
          type="number"
          min={0}
          placeholder="Price (min 0)"
          className="w-full border rounded p-2"
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />

        {/* Category */}
        <select
          className="w-full border rounded p-2"
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select category</option>
          <option value="streaming">Streaming</option>
          <option value="education">Education</option>
          <option value="software">Software</option>
        </select>

        {/* Status */}
        <select
          className="w-full border rounded p-2"
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Save Product
        </button>
      </form>
    </div>
  );
}