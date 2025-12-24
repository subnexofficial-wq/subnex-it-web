
import { getAllProducts } from "@/actions/productActions";
import DynamicProductSection from "@/Components/DynamicProductSection";
import React from "react";

const EducationPage = async () => {
  const products = await getAllProducts();
  const getByCategory = (cat) =>
    products.filter((p) => p.category === cat);

  return (
    <div>
      <DynamicProductSection
        products={getByCategory("subscription")}
        sectionTitle="SUBSCRIPTION"
      />
    </div>
  );
};

export default EducationPage;
