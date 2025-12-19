
export default function PaymentsPage() {
  return (
    <div className="admin-card p-6">
      <h1 className="text-xl font-semibold mb-4">
        Payments
      </h1>

      <ul className="space-y-3 text-sm">
        <li className="flex justify-between">
          <span>bKash</span>
          <span>৳ 1,20,000</span>
        </li>
        <li className="flex justify-between">
          <span>Nagad</span>
          <span>৳ 75,000</span>
        </li>
        <li className="flex justify-between">
          <span>Card</span>
          <span>৳ 50,000</span>
        </li>
      </ul>
    </div>
  );
}