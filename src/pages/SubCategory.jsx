import React from "react";
import { useParams, Link } from "react-router-dom";
import { siteData } from "@/components/clearbank/data";
import { interiorPages } from "@/components/clearbank/interiorData";
import InteriorPage from "@/components/clearbank/InteriorPage";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

const findItem = (category, slug) => {
  if (category.subcategories) {
    return category.subcategories.find((s) => s.slug === slug);
  }
  if (category.groups) {
    for (const g of category.groups) {
      const found = g.items.find((i) => i.slug === slug);
      if (found) return found;
    }
  }
  return null;
};

export default function SubCategory() {
  const { category, slug } = useParams();
  const catData = siteData[category];
  const item = catData ? findItem(catData, slug) : null;

  // Check if we have rich interior page data
  const pageKey = `${category === "useCases" ? "use-cases" : category}/${slug}`;
  const interiorData = interiorPages[pageKey];

  if (!item && !interiorData) {
    return (
      <section className="pt-[140px] pb-20">
        <div className="cb-container">
          <h1 className="cb-h2 mb-6">Not found</h1>
          <p className="cb-body1 text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <Link to="/" className="cb-btn-outline">Back to home <ArrowRight /></Link>
        </div>
      </section>
    );
  }

  // Render rich interior page if data exists
  if (interiorData) {
    return <InteriorPage data={interiorData} />;
  }

  // Fallback: simple layout for pages without rich data
  return (
    <>
      <section className="pt-[120px] md:pt-[180px] pb-12 md:pb-20">
        <div className="cb-container">
          <div className="cb-body2 text-gray-500 mb-4">
            <Link to={`/${category === "about" ? "about" : category}`} className="hover:text-teal-dark transition capitalize">
              {catData.title}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">{item.title}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 items-start">
            <div>
              <h1 className="cb-h1 mb-6 md:mb-8">{item.title}</h1>
              <p className="cb-h6 text-gray-600 max-w-[600px]">{item.description}</p>
              <Link to="/begin" className="cb-btn-black mt-8">
                Get started <ArrowRight />
              </Link>
            </div>
            {item.video && (
              <div className="bg-gray-50 rounded-[30px] p-8 md:p-12 flex items-center justify-center">
                <video className="w-full max-w-[380px]" autoPlay playsInline loop muted>
                  <source src={item.video} type="video/webm" />
                </video>
              </div>
            )}
          </div>
        </div>
      </section>

      {item.features && (
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="cb-container">
            <h2 className="cb-h3 mb-8 md:mb-12">Key features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {item.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-dark flex items-center justify-center text-white">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="cb-body1 text-gray-700 pt-2">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-20">
        <div className="cb-container">
          <div className="bg-black text-white rounded-[30px] px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <h2 className="cb-h3">Ready to collaborate?</h2>
            <Link to="/begin" className="cb-btn-teal">
              Begin <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}