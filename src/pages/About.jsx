import React from "react";
import CategoryPage from "@/components/clearbank/CategoryPage";
import { siteData } from "@/components/clearbank/data";

export default function About() {
  const data = {
    ...siteData.about,
    groups: siteData.about.groups.map((g) => ({
      ...g,
      items: g.items.map((i) => ({ ...i, path: `/about/${i.slug}` })),
    })),
  };
  return <CategoryPage category={data} />;
}