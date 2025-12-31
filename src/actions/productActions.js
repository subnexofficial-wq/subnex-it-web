
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { unstable_noStore as noStore } from 'next/cache';

export async function getAllProducts() {
  noStore();
  
  const { db } = await getDB();
  const data = await db
    .collection("products")
    .find({ active: true })
    .sort({ createdAt: -1 })
    .toArray();
  
  return data.map(p => ({ ...p, _id: p._id.toString() }));
}

export async function getProductById(id) {
  noStore(); 
  
  try {
    const { db } = await getDB();
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });
    
    if (!product) return null;
    
    return { ...product, _id: product._id.toString() };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getRelatedProducts(category, currentId) {
  noStore(); // Cache bypass করার জন্য
  
  try {
    const { db } = await getDB();
    const related = await db
      .collection("products")
      .find({ 
        category: category, 
        active: true, 
        _id: { $ne: new ObjectId(currentId) } 
      })
      .limit(10)
      .toArray();
    
    return related.map(p => ({ ...p, _id: p._id.toString() }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}


export async function searchProducts(query) {
  noStore();
  if (!query) return [];
  
  try {
    const { db } = await getDB();
    const products = await db
      .collection("products")
      .find({
        active: true,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } }
        ]
      })
      .limit(8)
      .toArray();

    return products.map(p => ({ ...p, _id: p._id.toString() }));
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}