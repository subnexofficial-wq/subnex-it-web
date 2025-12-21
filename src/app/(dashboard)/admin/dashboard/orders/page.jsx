export default function OrdersPage() {
  return (
    <div className="admin-card p-6">
      <h1 className="text-xl font-semibold mb-4">
        Orders
      </h1>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Order ID</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3">#ORD-1023</td>
            <td className="text-green-600">Completed</td>
            <td>৳ 1,499</td>
          </tr>
          <tr>
            <td className="py-3">#ORD-1024</td>
            <td className="text-yellow-600">Pending</td>
            <td>৳ 799</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}