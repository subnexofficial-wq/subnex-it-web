import { getAllProducts } from "@/actions/productActions";
import DynamicProductSection from "@/Components/DynamicProductSection";
import React from "react";

const StreamingPage = async () => {
  const products = await getAllProducts();
  const getByCategory = (cat) =>
    products.filter((p) => p.category === cat);

  return (
    <div>
      <DynamicProductSection
        products={getByCategory("streaming")}
        sectionTitle="PREMIUM STREAMING"
      />
    </div>
  );
};

export default StreamingPage;
