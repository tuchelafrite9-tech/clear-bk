import React from "react";
import CategoryPage from "@/components/clearbank/CategoryPage";
import { siteData } from "@/components/clearbank/data";

export default function Learn() {
  const data = {
    ...siteData.learn,
    subcategories: siteData.learn.subcategories.map((s) => ({
      ...s,
      path: `/learn/${s.slug}`,
    })),
  };
  return <CategoryPage category={data} />;
}