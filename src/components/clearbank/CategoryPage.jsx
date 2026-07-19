import React from "react";
import { Link } from "react-router-dom";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

export default function CategoryPage({ category }) {
  const hasGroups = !!category.groups;

  return (
    <>
      {/* Hero */}
      <section className="pt-[120px] md:pt-[180px] pb-12 md:pb-20">
        <div className="cb-container">
          <h1 className="cb-h1 mb-6 md:mb-8">{category.title}</h1>
          <p className="cb-h6 max-w-[813px] text-gray-600">{category.intro}</p>
        </div>
      </section>

      {hasGroups ? (
        // Grouped layout (Use cases, About)
        category.groups.map((group, gi) => (
          <section key={group.label} className={gi > 0 ? "pt-12 md:pt-16" : ""}>
            <div className="cb-container">
              <div className="cb-body2 text-gray-500 mb-6 md:mb-8">{group.label}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-12 md:pb-16">
                {group.items.map((item) => (
                  <Link
                    key={item.slug}
                    to={item.path || `#`}
                    className="bg-white border border-gray-300 p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-start transition hover:border-transparent hover:bg-teal group"
                  >
                    <h2 className="cb-h5 mb-2">{item.title}</h2>
                    <div className="cb-body1 text-gray-600 flex-grow group-hover:text-black transition">
                      {item.description}
                    </div>
                    <span className="cb-btn-outline mt-4 group-hover:border-transparent text-sm">
                      Learn more <ArrowRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        // Products / Learn layout
        <section className="pb-12 md:pb-20">
          <div className="cb-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {category.subcategories.map((item) => (
                <Link
                  key={item.slug}
                  to={item.path || `#`}
                  className="bg-gray-50 p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col transition hover:bg-teal group"
                >
                  {item.video && (
                    <video className="w-full max-w-[200px] mx-auto mb-6" autoPlay playsInline loop muted>
                      <source src={item.video} type="video/webm" />
                    </video>
                  )}
                  <h2 className="cb-h4 mb-2">{item.title}</h2>
                  <div className="cb-body1 text-gray-600 flex-grow group-hover:text-black transition">
                    {item.description}
                  </div>
                  <span className="cb-btn-outline mt-4 group-hover:border-transparent text-sm">
                    Learn more <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative">
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