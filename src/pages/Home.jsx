import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/clearbank/Header";
import Footer from "@/components/clearbank/Footer";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

const partners = [
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Tide-logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Allica-Bank-Logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Airwallex-Logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Truelayer-logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Capital-on-Tap-Logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Wealthify-logo.svg",
];

const partners2 = [
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Coinbase-Logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/eToro-logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Lemfi-logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Raisin-logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Kraken-logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Paypoint-Logo.svg",
  "https://clear.bank/uploads/images/logo-ticker/_300x80_crop_center-center_none/Pingpong-logo.svg",
];

const products = [
  {
    id: "accounts",
    title: "Accounts",
    video: "https://clear.bank/uploads/assets/CB_Product_Accounts.webm",
    desc: "Choose the fully regulated accounts that work best for your business and your customers.",
  },
  {
    id: "clearing",
    title: "Clearing",
    video: "https://clear.bank/uploads/assets/CB_Product_Clearing.webm",
    desc: "Start processing payments faster and more securely by connecting to the payment schemes via our API.",
  },
  {
    id: "embedded",
    title: "Embedded Banking",
    video: "https://clear.bank/uploads/assets/CB_Product_Embedded.webm",
    desc: "Offer your customers FSCS protected accounts by leveraging our banking licence. We take care of the banking products so you can focus on creating the business that your customers dream of.",
  },
  {
    id: "digital",
    title: "Digital Assets",
    video: "https://clear.bank/uploads/assets/CB_Product-header_Digital_Motion_1280Alpha.webm",
    desc: "Move money on regulated Digital Asset Rails – with 24/7 fiat settlement via SEPA Instant.",
  },
];

const useCases = [
  { title: "Acquirers", desc: "Speeding up settlements for merchants and end customers so everyone can access their money quickly." },
  { title: "Banks", desc: "Enhancing legacy banking systems with our innovative technology." },
  { title: "Corporates", desc: "Accounts and real-time payments powering large-scale corporates." },
  { title: "Digital asset platforms", desc: "Facilitating real-time, scalable accounts that seamlessly clear transactions on and off ramp between fiat and crypto." },
  { title: "Fintechs", desc: "Powering the banking infrastructure of fintechs to live up to customer expectations and keep up with demand." },
  { title: "Pre-regulated firms", desc: "Helping to navigate the journey of becoming a regulated business so that you're set up for success as you launch your proposition in the market." },
  { title: "Non-bank financial institutions", desc: "Give your customers a clear picture of their investments and a smoother journey to wealth." },
  { title: "Building societies and credit unions", desc: "Making the customer experience faster and more efficient for next generation building society and credit union customers." },
];

const news = [
  {
    img: "https://clear.bank/uploads/images/_450x252_crop_center-center_none/Ken_Johnstone_CPO_news_v2.jpg",
    title: "ClearBank appoints Ken Johnstone as Chief Product Officer to accelerate product innovation across the UK and Europe",
    date: "09.07.2026",
  },
  {
    img: "https://clear.bank/uploads/images/_450x252_crop_center-center_none/FuturePay_press_release_news_hero.jpg",
    title: "FuturePay selects ClearBank to expand local GBP and EUR collections across the UK and Europe",
    date: "07.07.2026",
  },
  {
    img: "https://clear.bank/uploads/images/Blog-headers/_450x252_crop_center-center_none/Bybit_press_release_news.jpg",
    title: "ClearBank Europe signs agreement with ByBit EU to provide banking infrastructure and safeguarding across Europe",
    date: "02.06.2026",
  },
];

const LogoTicker = ({ logos, direction }) => {
  const scrollRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setOffset((prev) => {
        const speed = direction === "left" ? 0.5 : -0.5;
        const next = prev + speed;
        return next;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [direction]);

  return (
    <div className="overflow-hidden py-2">
      <div
        className="flex items-center gap-14 whitespace-nowrap"
        style={{ transform: `translateX(${offset % 50}%)` }}
        ref={scrollRef}
      >
        {[...logos, ...logos, ...logos].map((src, i) => (
          <img key={i} src={src} alt="partner logo" className="h-8 md:h-12 w-auto opacity-60 hover:opacity-100 transition" />
        ))}
      </div>
    </div>
  );
};

const ProductSlider = () => {
  const [active, setActive] = useState(0);
  const [color, setColor] = useState("#efefef");

  return (
    <section className="pb-8 md:pb-16">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 md:pr-7">
          <div className="text-lg md:text-xl mb-3 md:mb-4">Our products</div>
        </div>
      </div>
      <div className="flex flex-wrap content-end">
        <div className="w-full md:w-1/2 md:pr-7">
          <div className="flex flex-col justify-between h-full">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <span className="inline-block text-xl font-semibold">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <span className="inline-block text-xl text-gray-400 ml-2 mr-1">—</span>
                <span className="inline-block text-xl text-gray-400">04</span>
              </div>
            </div>
            <div className="pb-12">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  onMouseEnter={() => setActive(i)}
                  className="flex items-start cursor-pointer mb-6 last:mb-0"
                >
                  <h2
                    className={`text-3xl md:text-4xl transition-colors ${active === i ? "text-black" : "text-gray-400"}`}
                  >
                    {product.title}
                    <span className={`inline-block ml-2 transition-transform ${active === i ? "translate-x-0" : "-translate-x-full"} opacity-0`}>
                      <ArrowRight />
                    </span>
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 md:pl-7">
          <div className="rounded-3xl overflow-hidden transition-colors" style={{ backgroundColor: color }}>
            {products.map((product, i) => (
              <div
                key={product.id}
                className={`transition-all duration-300 ${active === i ? "opacity-100" : "hidden"}`}
              >
                <div className="p-6 md:p-12 min-h-[680px] flex flex-col relative justify-start">
                  <h2 className="text-2xl md:hidden mb-10">{product.title}</h2>
                  <video className="mx-auto mb-10 md:mb-16 max-w-[380px]" autoPlay playsInline loop muted>
                    <source src={product.video} type="video/webm" />
                  </video>
                  <div className="mt-auto">
                    <div className="text-lg">
                      <p>{product.desc}</p>
                    </div>
                    <a href={`#${product.id}`} className="inline-flex items-center text-black border border-black rounded-full px-5 py-2 mt-4 hover:bg-black hover:text-white transition">
                      Get started <ArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const UseCaseCarousel = () => {
  const [current, setCurrent] = useState(0);
  const items = useCases;

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  return (
    <section className="overflow-hidden pb-16 md:pb-20">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 pt-8 md:pt-16">
        <h2 className="text-2xl md:text-3xl mb-2 md:mb-3 max-w-[700px]">Who we work with</h2>
      </div>
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 flex items-center justify-between mb-4 py-2.5">
        <div className="py-3">
          <span className="inline-block text-xl font-semibold w-7 lg:w-8">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="inline-block text-xl text-gray-300 ml-2 mr-1">—</span>
          <span className="inline-block text-xl text-gray-300 w-7 lg:w-8">{String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="flex items-center justify-end">
          <button onClick={prev} aria-label="Previous slide" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rotate-180 hover:text-teal-dark transition">
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
              <path d="M40.312 23.737c0-.334-.141-.633-.405-.879L28.165 11.081c-.334-.334-.633-.457-.949-.457-.668 0-1.16.492-1.16 1.143 0 .334.105.632.316.86l5.256 5.31 5.186 4.816-4.078-.194H8.829c-.668 0-1.16.493-1.16 1.178 0 .686.492 1.178 1.16 1.178h23.907l4.095-.193-5.203 4.816-5.256 5.309c-.21.21-.316.527-.316.843 0 .65.492 1.143 1.16 1.143.316 0 .598-.106.861-.352l11.83-11.865c.264-.246.405-.545.405-.879Z" fill="currentColor" />
            </svg>
          </button>
          <button onClick={next} aria-label="Next slide" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center ml-4 hover:text-teal-dark transition">
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
              <path d="M40.312 23.737c0-.334-.141-.633-.405-.879L28.165 11.081c-.334-.334-.633-.457-.949-.457-.668 0-1.16.492-1.16 1.143 0 .334.105.632.316.86l5.256 5.31 5.186 4.816-4.078-.194H8.829c-.668 0-1.16.493-1.16 1.178 0 .686.492 1.178 1.16 1.178h23.907l4.095-.193-5.203 4.816-5.256 5.309c-.21.21-.316.527-.316.843 0 .65.492 1.143 1.16 1.143.316 0 .598-.106.861-.352l11.83-11.865c.264-.246.405-.545.405-.879Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 overflow-hidden">
        <div className="flex gap-2 md:gap-4 transition-transform duration-300" style={{ transform: `translateX(-${current * 100}%)` }}>
          {items.map((item) => (
            <div key={item.title} className="min-w-full bg-white border border-gray-300 p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col items-start transition hover:border-transparent hover:bg-teal group">
              <h3 className="text-xl mb-2 max-w-[428px]">{item.title}</h3>
              <div className="text-base text-gray-600 max-w-[428px] flex-grow group-hover:text-black transition">
                <p>{item.desc}</p>
              </div>
              <a href="#" className="inline-flex items-center border border-black rounded-full px-4 py-2 mt-4 group-hover:border-transparent text-sm">
                Learn more <ArrowRight />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <section>
          <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
            <div className="flex flex-col items-start md:flex-row justify-between pt-[120px] mb-10 md:items-end xl:pt-[240px] min-h-[333px]">
              <div>
                <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold leading-tight">
                  <span className="block">Innovate.</span>
                  <span className="block">Differentiate.</span>
                  <span className="block">Grow.</span>
                </h1>
              </div>
              <div className="mt-6 md:mt-0">
                <a href="#begin" className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-lg hover:bg-teal-dark transition">
                  Begin <ArrowRight />
                </a>
              </div>
            </div>
          </div>
          {/* Mobile video */}
          <div className="md:hidden px-5">
            <div className="relative w-full pb-[84%]">
              <video className="absolute inset-0 object-cover w-full h-full rounded-t-[30px]" src="https://clear.bank/uploads/assets/CB_Homepage_H264_1-1_v03.mp4" autoPlay playsInline loop muted />
            </div>
          </div>
          {/* Desktop video */}
          <div className="hidden md:block w-full max-w-[1440px] mx-auto px-5 lg:px-8">
            <div className="w-full h-full max-h-[597px] min-h-[310px] lg:min-h-[426px] xl:min-h-[520px] rounded-t-[50px] overflow-hidden">
              <video className="object-cover w-full h-full" src="https://clear.bank/uploads/assets/CB_Homepage_H264_3-1_v03.mp4" autoPlay playsInline loop muted />
            </div>
          </div>
        </section>

        {/* Logo Ticker */}
        <section className="py-4 lg:py-8 pt-8 lg:pt-16 overflow-hidden min-h-[188px] lg:min-h-[248px]">
          <LogoTicker logos={partners} direction="left" />
          <LogoTicker logos={partners2} direction="right" />
        </section>

        {/* Display Text CTA */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-10 md:py-16">
          <div className="grid grid-cols-12 items-center md:gap-x-14">
            <div className="col-span-full md:col-span-8">
              <h2 className="text-xl md:text-2xl text-gray-600">
                Leading brands – from fintechs and banks to digital asset platforms and large-scale corporates – use our API to benefit from our fully regulated{" "}
                <strong className="text-black">banking infrastructure and real-time payments access.</strong>
              </h2>
            </div>
          </div>
        </section>

        {/* Product Steps */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-8">
          <ProductSlider />
        </section>

        {/* Heading Body */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-10 md:py-16">
          <p className="text-xl mb-3 md:mb-6">Driven by technology</p>
          <div className="mb-2 md:mb-6">
            <h2 className="text-4xl md:text-5xl w-full max-w-[813px] mb-2 bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent font-bold">
              Be part of the future of banking with our API
            </h2>
          </div>
          <div>
            <div className="text-xl w-full max-w-[813px] text-gray-600">
              With our cloud-based API, we offer banking infrastructure so financial institutions can focus on providing the best service for their customers and stay relevant in a fast-paced market.
            </div>
            <a href="#api" className="inline-flex items-center border border-black rounded-full px-6 py-3 mt-6 text-lg hover:bg-black hover:text-white transition">
              Explore our API <ArrowRight />
            </a>
          </div>
        </section>

        {/* Image Copy 50 */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-8 overflow-hidden">
          <div className="flex flex-col-reverse md:flex-row-reverse flex-wrap md:-mx-7">
            <div className="flex w-full md:w-1/2 md:px-7">
              <div className="flex flex-col w-full max-w-[867px] pb-10 md:pb-0 md:pr-5">
                <div className="text-xl mb-2 md:mb-3">Powered by people</div>
                <h2 className="text-4xl md:text-5xl mb-3 md:mb-4">Your partner in growth</h2>
                <div className="text-xl text-gray-600">
                  We understand the pain of dealing with legacy systems, the cost and the risk involved in innovating in the financial services sector. That's why we set up ClearBank. We're built to support you. That means no shared propositions, no customer overlap and no competition. Your growth is our growth.
                </div>
              </div>
            </div>
            <div className="flex w-full md:w-1/2 md:px-7">
              <div className="mb-6 md:mb-0 w-full">
                <img
                  className="w-full rounded-[30px]"
                  loading="lazy"
                  src="https://clear.bank/uploads/images/In-page-images/_868x868_crop_center-center_none/Powered-by-people-3@2x.jpg"
                  alt="Powered by people"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Text */}
        <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-12 md:py-24">
          <div className="grid grid-cols-12 md:gap-x-14">
            <div className="col-span-full mb-12 md:col-span-6 md:mb-0">
              <div className="w-full max-w-[685px] md:pr-16">
                <h2 className="text-4xl md:text-5xl mb-4">Why choose ClearBank</h2>
                <div className="text-xl">
                  Financial technology with a banking licence, and expert guidance
                </div>
              </div>
            </div>
            <div className="col-span-full md:col-span-6">
              <div className="w-full max-w-[664px] mb-12 md:mb-16 last:mb-0">
                <div className="mb-4">
                  <svg className="w-12 h-12 md:w-20 md:h-20" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="76" height="76" rx="16" fill="#0c7981" />
                    <path d="M38 20v36M20 38h36" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <h4 className="text-2xl">Cloud-based API</h4>
                <div className="text-lg text-gray-600 mt-2">
                  Our cloud-based systems make opening and managing accounts easy and let you clear payments in real-time. Bank better, work smarter and grow faster.
                </div>
              </div>
              <div className="w-full max-w-[664px] mb-12 md:mb-16 last:mb-0">
                <div className="mb-4">
                  <svg className="w-12 h-12 md:w-20 md:h-20" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="38" cy="38" r="38" fill="#0c7981" />
                    <circle cx="38" cy="28" r="8" fill="white" />
                    <path d="M22 56c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="white" strokeWidth="4" fill="none" />
                  </svg>
                </div>
                <h4 className="text-2xl">Powered by people</h4>
                <div className="text-lg text-gray-600 mt-2">
                  You'll get a dedicated relationship manager who understands your business and knows your industry inside out. Backed by a team of specialists, we're always on hand to offer solutions and support.
                </div>
              </div>
              <div className="w-full max-w-[664px] mb-12 md:mb-16 last:mb-0">
                <div className="mb-4">
                  <svg className="w-12 h-12 md:w-20 md:h-20" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38 8L62 18v20c0 14-10 24-24 30C24 62 14 52 14 38V18L38 8Z" fill="#0c7981" />
                    <path d="M30 38l6 6 12-12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <h4 className="text-2xl">Safe and here to stay</h4>
                <div className="text-lg text-gray-600 mt-2">
                  ClearBank is a fully regulated bank in both the United Kingdom and Europe, meaning we hold funds securely at the Bank of England and the European Central Bank.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Carousel */}
        <UseCaseCarousel />

        {/* News Section */}
        <section className="pt-[120px] pb-12 lg:pt-24 lg:pb-20 max-w-[1440px] mx-auto px-5 lg:px-8">
          <div className="justify-between md:flex">
            <div className="text-2xl md:text-3xl mb-12 lg:mb-20">Latest news</div>
          </div>
          <div className="grid grid-cols-12 lg:gap-x-14 gap-y-14">
            {news.map((item) => (
              <div key={item.title} className="col-span-full lg:col-span-4 group cursor-pointer">
                <div className="relative pb-[56%] w-full rounded-2xl overflow-hidden mb-3 md:mb-6">
                  <img
                    className="absolute w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    src={item.img}
                    alt={item.title}
                  />
                </div>
                <h2 className="text-lg max-w-[480px] mb-2 group-hover:text-teal-dark transition">
                  {item.title}
                </h2>
                <div className="text-sm text-gray-500">
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Collaborate Block */}
        <section className="relative group">
          <div className="relative">
            <div className="absolute w-full">
              <img
                className="object-cover w-full h-[372px] md:h-[512px] transition-all duration-500"
                loading="lazy"
                src="https://clear.bank/uploads/images/In-page-images/_1792x557_crop_center-center_none/CTA@2.jpg"
                alt="Ready to collaborate"
              />
            </div>
            <div className="relative px-5 lg:px-15 h-[372px] lg:h-[384px]">
              <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-12 md:gap-x-14 pt-8 md:pt-27 lg:pt-40">
                  <div className="col-span-full md:col-span-6">
                    <h2 className="text-2xl mb-4">Ready to collaborate?</h2>
                  </div>
                  <div className="col-span-full lg:col-span-6">
                    <div className="text-xl mb-4 md:mb-6 w-full max-w-[666px]">
                      Experience the ClearBank difference and begin your journey today.
                    </div>
                    <a href="#begin" className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-lg group-hover:bg-teal-dark transition">
                      Begin <ArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <a href="#begin" className="absolute inset-0" aria-label="Begin"></a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}