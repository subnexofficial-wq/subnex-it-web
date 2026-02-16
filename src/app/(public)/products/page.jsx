
import { getAllProducts } from "@/actions/productActions";
import ProductListClient from "@/Components/ProductListClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  let products = [];
  try {
    products = await getAllProducts();
  } catch (error) {
    console.error("Products page load failed:", error);
  }
  return <ProductListClient initialProducts={products || []} />;
}
