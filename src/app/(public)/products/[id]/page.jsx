
import SingleProductClient from "@/Components/SingleProductClient";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export default async function ProductDetails({ params }) {
  const { id } = await params;
  const { db } = await getDB();

  // ডাটাবেস থেকে প্রোডাক্ট ফেচ করা
  const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

  if (!product) return <div className="text-center py-20">Product not found!</div>;

  // রিলেটেড প্রোডাক্ট ফেচ করা
  const related = await db.collection("products")
    .find({ category: product.category, active: true, _id: { $ne: product._id } })
    .limit(4).toArray();

  // ID গুলোকে স্ট্রিং এ রূপান্তর করে ক্লায়েন্ট কম্পোনেন্টে পাঠানো
  const serializedProduct = { ...product, _id: product._id.toString() };
  const serializedRelated = related.map(p => ({ ...p, _id: p._id.toString() }));

  return <SingleProductClient product={serializedProduct} relatedProducts={serializedRelated} />;
}