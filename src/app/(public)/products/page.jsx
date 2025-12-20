import ProductListClient from "@/Components/ProductListClient";
import getDB from "@/lib/mongodb";


export default async function Page() {
  const { db } = await getDB();
  const data = await db.collection("products").find({ active: true }).toArray();
  
  // সিরিয়ালাইজ ডাটা (ID কনভার্ট)
  const products = data.map(p => ({ ...p, _id: p._id.toString() }));

  return <ProductListClient initialProducts={products} />;
}