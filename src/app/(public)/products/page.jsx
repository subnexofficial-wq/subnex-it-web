
import { getAllProducts } from "@/actions/productActions";
import ProductListClient from "@/Components/ProductListClient";

export default async function Page() {

  const products = await getAllProducts();


  return <ProductListClient initialProducts={products || []} />;
}