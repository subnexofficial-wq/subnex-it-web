import Link from "next/link";

const products = [
  { id: 1, title: "Netflix Premium", price: 499, status: "Active" },
  { id: 2, title: "Spotify Family", price: 299, status: "Inactive" },
];

export default function ProductsPage() {
  return (
    <div className="admin-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          href="/admin/dashboard/products/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
        >
          + Add Product
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-3">{p.title}</td>
              <td>৳ {p.price}</td>
              <td className={p.status === "Active" ? "text-green-600" : "text-gray-400"}>
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}