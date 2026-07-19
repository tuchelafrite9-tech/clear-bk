import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Logo = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 49" fill="none">
    <path d="M150 48.115c2.442 0 4.223-1.782 4.223-4.224 0-2.441-1.781-4.223-4.223-4.223s-4.224 1.782-4.224 4.224c0 2.441 1.782 4.223 4.224 4.223Zm63.088-5.015c-3.365 0-5.873-2.112-5.873-4.752 0-3.3 2.904-4.883 6.599-5.213l9.437-.792v2.838c0 4.025-4.751 7.919-9.503 7.919h-.66Zm-105.917 0c-3.365 0-5.873-2.112-5.873-4.752 0-3.3 2.903-4.883 6.599-5.213l9.437-.792v2.838c0 4.025-4.752 7.919-9.503 7.919h-.66Zm62.891-1.056V26.866h10.954c5.676 0 9.503 2.441 9.503 7.589 0 5.213-3.827 7.589-9.503 7.589h-10.954ZM65.596 28.25c.858-5.147 4.026-8.777 9.701-8.777 5.741 0 8.513 3.63 9.239 8.777h-18.94Zm76.749-13.396c-7.787 0-13.199 5.147-13.199 12.67V47.72h6.27V27.525c0-4.157 2.771-7.06 6.929-7.06h5.081v-5.61h-5.081Zm81.236 27.255v5.61h5.939V26.733c0-6.666-4.883-12.539-13.99-12.539-7.721 0-13.396 4.29-13.924 10.69h6.269c.594-3.43 3.498-5.279 7.523-5.279h.33c4.686 0 7.523 2.574 7.523 7.128v.791l-10.295.858c-5.675.462-12.01 2.772-12.01 10.23 0 5.41 4.685 9.766 11.482 9.766 5.61 0 9.833-3.3 11.153-6.27Zm26.199-27.915c-8.645 0-14.716 5.675-14.716 14.188V47.72h6.269V28.78c0-5.411 3.432-8.975 8.447-8.975 5.015 0 8.447 3.564 8.447 8.975v18.94h6.269V28.383c0-8.513-6.071-14.188-14.716-14.188ZM90.41 37.16h-5.874c-1.386 3.564-4.554 5.94-9.041 5.94-6.137 0-9.437-4.356-10.097-9.965h25.275v-2.178c0-10.097-5.94-16.762-15.244-16.762-9.899 0-16.366 7.721-16.366 17.092 0 9.37 6.467 17.092 16.366 17.092 8.117 0 13.462-4.817 14.98-11.219Zm27.254 4.95v5.61h5.939V26.733c0-6.666-4.883-12.539-13.99-12.539-7.721 0-13.397 4.29-13.924 10.69h6.269c.594-3.43 3.497-5.279 7.523-5.279h.33c4.685 0 7.523 2.574 7.523 7.128v.791l-10.295.858c-5.675.462-12.01 2.772-12.01 10.23 0 5.41 4.685 9.766 11.482 9.766 5.61 0 9.833-3.3 11.153-6.27Zm52.332-20.656V7.464h10.162c5.346 0 8.645 2.31 8.645 7.061 0 4.62-3.299 6.93-8.645 6.93h-10.162Zm-6.27 26.265h18.28c8.909 0 14.914-4.817 14.914-12.802 0-6.666-5.015-10.56-9.371-11.153 4.026-1.188 7.656-4.29 7.656-9.767 0-6.995-5.478-12.208-14.453-12.208h-17.026v45.93Zm121.756-18.61 14.254-14.254h-7.721l-15.706 16.3V1.79h-6.269v45.93h6.269v-9.437l4.949-4.883 11.021 14.32H300l-14.518-18.61ZM54.047 1.79h-6.269v45.93h6.27V1.79ZM0 24.754c0 13.33 10.559 23.625 23.757 23.625 7.787 0 14.584-3.63 18.808-9.239l-4.752-3.761c-3.365 4.289-8.117 7.193-14.056 7.193-9.767 0-17.356-7.985-17.356-17.818 0-9.833 7.59-17.818 17.356-17.818 5.94 0 10.69 2.904 14.056 7.193l4.752-3.761c-4.224-5.61-11.02-9.24-18.808-9.24C10.56 1.129 0 11.424 0 24.755Z" fill="currentColor" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-3 mt-0.5 ml-[9px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 8">
    <path d="m11.727 1.5-5 5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const ProductMenu = [
  { label: "Accounts", path: "/products/accounts" },
  { label: "Clearing", path: "/products/clearing" },
  { label: "Embedded Banking", path: "/products/embedded-banking" },
  { label: "Digital Assets", path: "/products/digital-assets" },
  { label: "Business Account", path: "/business-account" },
];

const UseCaseMenu = [
  { label: "Acquirers", path: "/use-cases/acquirers" },
  { label: "Banks", path: "/use-cases/banks" },
  { label: "Building societies and credit unions", path: "/use-cases/building-societies-and-credit-unions" },
  { label: "Corporates", path: "/use-cases/corporates" },
  { label: "Digital asset platforms", path: "/use-cases/digital-assets" },
  { label: "Fintechs", path: "/use-cases/fintech" },
  { label: "Non-bank financial institutions", path: "/use-cases/non-bank-financial-institutions" },
  { label: "Pre-regulated firms", path: "/use-cases/pre-regulated" },
];

const AboutMenu = [
  { section: "Mission", items: [
    { label: "Our company", path: "/about/our-company" },
    { label: "Our leadership", path: "/about/leadership" },
    { label: "Join ClearBank", path: "/about/join-clearbank" },
  ] },
  { section: "Documentation and enquiries", items: [
    { label: "Regulatory and governance", path: "/about/regulatory-governance" },
    { label: "Contact us", path: "/about/contact-us" },
  ] },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-white/50 backdrop-blur-xl"}`}>
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <Link to="/" aria-label="Home" className="z-10">
            <Logo className="w-[100px] md:w-[140px] py-[14px]" />
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="relative md:hidden w-[36px] h-[36px] z-10">
            <span className={`absolute top-[13px] left-[5px] w-[25px] h-[2px] bg-black rounded-full transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute top-[19px] left-[5px] w-[25px] h-[2px] bg-black rounded-full transition-transform ${mobileOpen ? "rotate-45" : "rotate-0"}`} />
            <span className={`absolute top-[19px] left-[5px] w-[25px] h-[2px] bg-black rounded-full transition-transform ${mobileOpen ? "-rotate-45" : "rotate-0"}`} />
            <span className={`absolute top-[25px] left-[5px] w-[25px] h-[2px] bg-black rounded-full transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
          </button>

          <nav className={`${mobileOpen ? "block" : "hidden"} md:block absolute md:static top-full left-0 right-0 bg-white md:bg-transparent`}>
            <ul className="flex flex-col md:flex-row md:items-center md:gap-x-8 p-5 md:p-0">
              <li className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === "products" ? null : "products")}
                  className="flex w-full md:w-auto items-center justify-between text-lg py-2 border-b md:border-b-0 border-transparent hover:border-black transition"
                >
                  <span>Products</span>
                  <ChevronDown />
                </button>
                {openMenu === "products" && (
                  <div className="md:absolute md:top-full md:left-0 md:mt-2 md:bg-white md:shadow-lg md:rounded-2xl md:p-6 md:min-w-[280px]">
                    {ProductMenu.map((item) => (
                      <Link key={item.label} to={item.path} className="block text-lg py-2 hover:text-teal-dark transition">
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-black my-4 hidden md:block" />
                    <div className="text-sm text-gray-500 mb-2 hidden md:block">For Developers</div>
                    <Link to="/products/explore-our-api" className="block text-lg hover:text-teal-dark transition">
                      Explore our API
                    </Link>
                    <div className="text-sm text-gray-600 mt-1 hidden md:block">
                      ClearBank's API enables you to offer real-time payments and innovative banking products to your customers.
                    </div>
                  </div>
                )}
              </li>

              <li className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === "usecases" ? null : "usecases")}
                  className="flex w-full md:w-auto items-center justify-between text-lg py-2 border-b md:border-b-0 border-transparent hover:border-black transition"
                >
                  <span>Use cases</span>
                  <ChevronDown />
                </button>
                {openMenu === "usecases" && (
                  <div className="md:absolute md:top-full md:left-0 md:mt-2 md:bg-white md:shadow-lg md:rounded-2xl md:p-6 md:min-w-[280px]">
                    <div className="text-sm text-gray-500 mb-2 hidden md:block">Who we work with</div>
                    {UseCaseMenu.map((item) => (
                      <Link key={item.label} to={item.path} className="block text-lg py-2 hover:text-teal-dark transition">
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-black my-4 hidden md:block" />
                    <div className="text-sm text-gray-500 mb-2 hidden md:block">Collaborate with us</div>
                    <Link to="/use-cases/partners" className="block text-lg hover:text-teal-dark transition">
                      Partners
                    </Link>
                  </div>
                )}
              </li>

              <li className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === "about" ? null : "about")}
                  className="flex w-full md:w-auto items-center justify-between text-lg py-2 border-b md:border-b-0 border-transparent hover:border-black transition"
                >
                  <span>About</span>
                  <ChevronDown />
                </button>
                {openMenu === "about" && (
                  <div className="md:absolute md:top-full md:left-0 md:mt-2 md:bg-white md:shadow-lg md:rounded-2xl md:p-6 md:min-w-[280px]">
                    {AboutMenu.map((group) => (
                      <div key={group.section}>
                        <div className="text-sm text-gray-500 mb-2 hidden md:block">{group.section}</div>
                        {group.items.map((item) => (
                          <Link key={item.label} to={item.path} className="block text-lg py-2 hover:text-teal-dark transition">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>

              <li>
                <Link to="/learn" className="block text-lg py-2 md:py-0 border-b md:border-b-0 border-transparent hover:border-black transition">
                  Learn
                </Link>
              </li>
              <li>
                <Link to="/my-account" className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 text-lg rounded-full hover:bg-teal-dark hover:text-white transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon compte
                </Link>
              </li>

              <li>
                <Link to="/begin" className="inline-flex items-center bg-teal text-black px-5 py-2 text-lg rounded-full hover:bg-teal-dark hover:text-white transition">
                  <span>Begin</span>
                  <span className="ml-2"><ArrowIcon /></span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}