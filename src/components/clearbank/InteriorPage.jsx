import React, { useState } from "react";
import { Link } from "react-router-dom";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

const Hero = ({ data }) => (
  <section>
    <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
      <div className="pt-[80px] md:pt-[120px] pb-8 md:pb-12">
        <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold leading-tight max-w-[900px]">
          {data.heroTitle}
        </h1>
        <Link to="/begin" className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-lg mt-8 hover:bg-teal-dark transition">
          Begin <ArrowRight />
        </Link>
      </div>
    </div>
    <div className="md:hidden px-5">
      <img src={data.heroImageMobile} alt={data.heroTitle} className="w-full rounded-t-[30px]" />
    </div>
    <div className="hidden md:block max-w-[1440px] mx-auto px-5 lg:px-8">
      <img src={data.heroImage} alt={data.heroTitle} className="w-full rounded-t-[50px]" />
    </div>
  </section>
);

const Clients = ({ logos }) => (
  <section className="py-12 md:py-20">
    <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
      <h2 className="text-xl md:text-2xl mb-8 md:mb-12">Our clients</h2>
      <div className="flex flex-wrap items-center gap-x-10 md:gap-x-16 gap-y-8">
        {logos.map((src, i) => (
          <img key={i} src={src} alt={`Client ${i + 1}`} className="h-8 md:h-10 w-auto object-contain opacity-70" loading="lazy" />
        ))}
      </div>
    </div>
  </section>
);

const Features = ({ data }) => {
  const [active, setActive] = useState(0);
  const total = data.features.length;

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
        {data.featuresHeading && (
          <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-[800px]">{data.featuresHeading}</h2>
        )}
        {data.featuresIntro && (
          <p className="text-lg md:text-xl text-gray-600 mb-10 md:mb-16 max-w-[700px]">{data.featuresIntro}</p>
        )}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-14">
          <div className="col-span-12 md:col-span-5">
            <div className="mb-6 flex items-baseline">
              <span className="text-xl font-semibold">{String(active + 1).padStart(2, "0")}</span>
              <span className="text-xl text-gray-400 mx-2">—</span>
              <span className="text-xl text-gray-400">{String(total).padStart(2, "0")}</span>
            </div>
            <div>
              {data.features.map((feature, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  className="cursor-pointer mb-6 last:mb-0"
                >
                  <h3 className={`text-2xl md:text-3xl transition-colors ${active === i ? "text-black" : "text-gray-400"}`}>
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            {data.features.map((feature, i) => (
              <div key={i} className={active === i ? "block" : "hidden"}>
                <p className="text-lg md:text-xl mb-4">{feature.body}</p>
                {feature.body2 && <p className="text-lg md:text-xl text-gray-600">{feature.body2}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ImageBreaker = ({ data }) => (
  <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-8 md:py-16">
    <img src={data.imageBreaker} alt="" className="hidden md:block w-full rounded-[30px]" loading="lazy" />
    <img src={data.imageBreakerMobile} alt="" className="md:hidden w-full rounded-[20px]" loading="lazy" />
  </section>
);

const PowerUp = () => (
  <section className="py-12 md:py-20 bg-gray-50">
    <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
      <h2 className="text-3xl md:text-5xl font-bold mb-4">Power up your business with ClearBank</h2>
      <p className="text-lg md:text-xl text-gray-600 mb-6">Scale at speed with our Accounts, Clearing and Embedded Banking products.</p>
      <Link to="/products" className="inline-flex items-center border border-black rounded-full px-6 py-3 text-lg hover:bg-black hover:text-white transition">
        More about our products <ArrowRight />
      </Link>
    </div>
  </section>
);

const Quotes = ({ quotes }) => {
  const [active, setActive] = useState(0);
  const total = quotes.length;

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
        <div className="mb-8 flex items-baseline">
          <span className="text-xl font-semibold">{String(active + 1).padStart(2, "0")}</span>
          <span className="text-xl text-gray-400 mx-2">—</span>
          <span className="text-xl text-gray-400">{String(total).padStart(2, "0")}</span>
        </div>
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-14">
          <div className="col-span-12 md:col-span-8">
            {quotes.map((q, i) => (
              <div key={i} className={active === i ? "block" : "hidden"}>
                <blockquote className="text-xl md:text-2xl leading-relaxed mb-6">"{q.text}"</blockquote>
                <div className="text-lg font-semibold">{q.author}</div>
                <div className="text-base text-gray-500 mb-6">{q.role}</div>
              </div>
            ))}
            {quotes[active] && quotes[active].logo && (
              <img src={quotes[active].logo} alt="" className="h-8 md:h-10 w-auto object-contain" loading="lazy" />
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            {quotes.map((q, i) => (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer py-3 border-b border-gray-200 transition-colors ${active === i ? "text-black" : "text-gray-400"}`}
              >
                <span className="text-lg">{q.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContentSections = ({ sections }) => (
  <>
    {sections.map((section, i) => (
      <section key={i} className="py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
          <div className={`grid grid-cols-12 gap-x-6 md:gap-x-14 ${section.image ? "items-center" : ""}`}>
            <div className={`col-span-12 ${section.image ? "md:col-span-7" : "md:col-span-8"}`}>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">{section.title}</h2>
              {section.body && <p className="text-lg md:text-xl text-gray-600 mb-4">{section.body}</p>}
              {section.body2 && <p className="text-lg md:text-xl text-gray-600 mb-4">{section.body2}</p>}
              {section.body3 && <p className="text-lg md:text-xl text-gray-600">{section.body3}</p>}
            </div>
            {section.image && (
              <div className="col-span-12 md:col-span-5 mt-8 md:mt-0">
                <img src={section.image} alt="" className="w-full rounded-[30px]" loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </section>
    ))}
  </>
);

const CTA = () => (
  <section className="relative">
    <div className="relative">
      <img
        src="https://clear.bank/uploads/images/In-page-images/_1792x557_crop_center-center_none/70523/CTA@2.jpg"
        alt="Ready to collaborate"
        className="object-cover w-full h-[372px] md:h-[512px]"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8 w-full">
          <div className="max-w-[600px]">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Ready to collaborate?</h2>
            <p className="text-lg md:text-xl text-white mb-6">Experience the ClearBank difference and begin your journey today.</p>
            <Link to="/begin" className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-lg hover:bg-teal-dark transition">
              Begin <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function InteriorPage({ data }) {
  return (
    <>
      <Hero data={data} />
      {data.clients && <Clients logos={data.clients} />}
      <Features data={data} />
      {data.imageBreaker && <ImageBreaker data={data} />}
      <PowerUp />
      {data.quotes && <Quotes quotes={data.quotes} />}
      {data.contentSections && <ContentSections sections={data.contentSections} />}
      <CTA />
    </>
  );
}