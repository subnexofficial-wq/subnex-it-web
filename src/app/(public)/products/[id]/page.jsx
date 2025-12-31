
import { getProductById, getRelatedProducts } from "@/actions/productActions";
import SingleProductClient from "@/Components/SingleProductClient";
import { notFound } from "next/navigation";

export default async function ProductDetails({ params }) {
  const { id } = await params;


  const product = await getProductById(id);


  if (!product) {
    notFound(); 
  }

  const relatedProducts = await getRelatedProducts(product.category, id);

  return (
    <SingleProductClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}