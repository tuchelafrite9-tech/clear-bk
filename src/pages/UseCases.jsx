import React from "react";
import CategoryPage from "@/components/clearbank/CategoryPage";
import { siteData } from "@/components/clearbank/data";

export default function UseCases() {
  const data = {
    ...siteData.useCases,
    groups: siteData.useCases.groups.map((g) => ({
      ...g,
      items: g.items.map((i) => ({ ...i, path: `/use-cases/${i.slug}` })),
    })),
  };
  return <CategoryPage category={data} />;
}