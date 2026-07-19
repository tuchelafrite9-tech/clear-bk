import React from "react";
import CategoryPage from "@/components/clearbank/CategoryPage";
import { siteData } from "@/components/clearbank/data";

export default function Products() {
  const data = {
    ...siteData.products,
    subcategories: siteData.products.subcategories.map((s) => ({
      ...s,
      path: `/products/${s.slug}`,
    })),
  };
  return <CategoryPage category={data} />;
}