import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("filter") || "7days"; 
    const specificDate = searchParams.get("date");

    const { db } = await getDB();
    let startDate, endDate;
    let chartDataArray = [];

    // --- Date Logic ---
    if (specificDate) {
      startDate = new Date(specificDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(specificDate);
      endDate.setHours(23, 59, 59, 999);
      for (let i = 0; i < 24; i += 3) {
        const d = new Date(startDate);
        d.setHours(i, 0, 0, 0);
        chartDataArray.push(d);
      }
    } else if (filterType === "month") {
      startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const daysInMonth = new Date().getDate(); 
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(new Date().getFullYear(), new Date().getMonth(), i);
        d.setHours(0, 0, 0, 0);
        chartDataArray.push(d);
      }
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        chartDataArray.push(d);
      }
    }

    const dateQuery = { $gte: startDate, $lte: specificDate ? endDate : new Date() };

    // Fetch data for the period
    const [allProducts, allUsers, allOrders, transactions, approvedOrders, approvedAutomationOrders, totalProductsCount, totalUsersCount, totalOrdersCount] = await Promise.all([
      db.collection("products").find({ createdAt: dateQuery }).toArray(),
      db.collection("users").find({ createdAt: dateQuery }).toArray(),
      db.collection("orders").find({ createdAt: dateQuery }).toArray(),
      db.collection("transactions").find({ status: "approved", submittedAt: dateQuery }).toArray(),
      db
        .collection("orders")
        .find({
          status: "completed",
          updatedAt: dateQuery,
        })
        .toArray(),
      db
        .collection("automation_orders")
        .find({
          status: "completed",
          paymentStatus: "paid",
          updatedAt: dateQuery,
        })
        .toArray(),
      db.collection("products").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("orders").countDocuments(),
    ]);

    const transactionRevenue = transactions.reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0);
    const orderRevenue = approvedOrders.reduce(
      (acc, curr) => acc + (Number(curr?.pricing?.totalAmount) || 0),
      0
    );
    const automationRevenue = approvedAutomationOrders.reduce(
      (acc, curr) =>
        acc +
        (Number(curr?.orderDetails?.finalPrice) ||
          Number(curr?.pricing?.totalAmount) ||
          Number(curr.amount) ||
          0),
      0
    );
    const totalRevenue = transactionRevenue + orderRevenue + automationRevenue;

    const chartData = chartDataArray.map(date => {
      let label;
      if (specificDate) {
        label = date.getHours() + ":00";
      } else if (filterType === "month") {
        label = date.getDate().toString();
      } else {
        label = date.toLocaleDateString("en-US", { weekday: "short" });
      }

      const filterByTime = (item, dateField) => {
        const itemDate = new Date(item[dateField]);
        if (specificDate) {
          return itemDate.getHours() >= date.getHours() && itemDate.getHours() < date.getHours() + 3;
        }
        return itemDate.toDateString() === date.toDateString();
      };

      const transactionIncome = transactions
        .filter(t => filterByTime(t, 'submittedAt'))
        .reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0);

      const orderIncome = approvedOrders
        .filter(o => filterByTime(o, 'updatedAt'))
        .reduce((acc, curr) => acc + (Number(curr?.pricing?.totalAmount) || 0), 0);

      const automationIncome = approvedAutomationOrders
        .filter(a => filterByTime(a, 'updatedAt'))
        .reduce(
          (acc, curr) =>
            acc +
            (Number(curr?.orderDetails?.finalPrice) ||
              Number(curr?.pricing?.totalAmount) ||
              Number(curr.amount) ||
              0),
          0
        );

      return {
        name: label,
        income: transactionIncome + orderIncome + automationIncome,
        orders: allOrders.filter(o => filterByTime(o, 'createdAt')).length,
        users: allUsers.filter(u => filterByTime(u, 'createdAt')).length,
        products: allProducts.filter(p => filterByTime(p, 'createdAt')).length,
      };
    });

    return NextResponse.json({
      productsCount: totalProductsCount, 
      usersCount: totalUsersCount, 
      totalOrders: totalOrdersCount, 
      totalRevenue, 
      chartData
    });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
