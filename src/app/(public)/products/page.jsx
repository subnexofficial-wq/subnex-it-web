
import { getAllProducts } from "@/actions/productActions";
import ProductListClient from "@/Components/ProductListClient";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
const baseUrl = getSiteUrl();

export const metadata = {
  title: "All Products | Subnex",
  description:
    "Browse all Subnex products including downloadable digital products, subscriptions, and services.",
  alternates: {
    canonical: `${baseUrl}/products`,
  },
};

export default async function Page() {
  let products = [];
  try {
    products = await getAllProducts();
  } catch (error) {
    console.error("Products page load failed:", error);
  }
  return <ProductListClient initialProducts={products || []} />;
}
