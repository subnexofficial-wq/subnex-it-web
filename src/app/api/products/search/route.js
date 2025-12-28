

import { searchProducts } from "@/actions/productActions";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const products = await searchProducts(query);
  return NextResponse.json(products);
}