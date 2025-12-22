
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
        products={getByCategory("tools")}
        sectionTitle="AI & EDUCATION TOOLS"
      />
    </div>
  );
};

export default EducationPage;
