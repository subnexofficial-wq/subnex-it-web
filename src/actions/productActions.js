

import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function getAllProducts() {
  const { db } = await getDB();
  const data = await db.collection("products").find({ active: true }).sort({ createdAt: -1 }).toArray();
  return data.map(p => ({ ...p, _id: p._id.toString() }));
}


export async function getProductById(id) {
  try {
    const { db } = await getDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) return null;
    return { ...product, _id: product._id.toString() };
  } catch (error) {
    return null;
  }
}


export async function getRelatedProducts(category, currentId) {
  try {
    const { db } = await getDB();
    const related = await db.collection("products")
      .find({ 
        category: category, 
        active: true, 
        _id: { $ne: new ObjectId(currentId) } 
      })
      .limit(10)
      .toArray();
    return related.map(p => ({ ...p, _id: p._id.toString() }));
  } catch (error) {
    return [];
  }
}