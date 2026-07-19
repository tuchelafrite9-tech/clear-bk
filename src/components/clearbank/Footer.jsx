import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 49" fill="none">
    <path d="M150 48.115c2.442 0 4.223-1.782 4.223-4.224 0-2.441-1.781-4.223-4.223-4.223s-4.224 1.782-4.224 4.224c0 2.441 1.782 4.223 4.224 4.223Zm63.088-5.015c-3.365 0-5.873-2.112-5.873-4.752 0-3.3 2.904-4.883 6.599-5.213l9.437-.792v2.838c0 4.025-4.751 7.919-9.503 7.919h-.66Zm-105.917 0c-3.365 0-5.873-2.112-5.873-4.752 0-3.3 2.903-4.883 6.599-5.213l9.437-.792v2.838c0 4.025-4.752 7.919-9.503 7.919h-.66Zm62.891-1.056V26.866h10.954c5.676 0 9.503 2.441 9.503 7.589 0 5.213-3.827 7.589-9.503 7.589h-10.954ZM65.596 28.25c.858-5.147 4.026-8.777 9.701-8.777 5.741 0 8.513 3.63 9.239 8.777h-18.94Zm76.749-13.396c-7.787 0-13.199 5.147-13.199 12.67V47.72h6.27V27.525c0-4.157 2.771-7.06 6.929-7.06h5.081v-5.61h-5.081Zm81.236 27.255v5.61h5.939V26.733c0-6.666-4.883-12.539-13.99-12.539-7.721 0-13.396 4.29-13.924 10.69h6.269c.594-3.43 3.498-5.279 7.523-5.279h.33c4.686 0 7.523 2.574 7.523 7.128v.791l-10.295.858c-5.675.462-12.01 2.772-12.01 10.23 0 5.41 4.685 9.766 11.482 9.766 5.61 0 9.833-3.3 11.153-6.27Zm26.199-27.915c-8.645 0-14.716 5.675-14.716 14.188V47.72h6.269V28.78c0-5.411 3.432-8.975 8.447-8.975 5.015 0 8.447 3.564 8.447 8.975v18.94h6.269V28.383c0-8.513-6.071-14.188-14.716-14.188ZM90.41 37.16h-5.874c-1.386 3.564-4.554 5.94-9.041 5.94-6.137 0-9.437-4.356-10.097-9.965h25.275v-2.178c0-10.097-5.94-16.762-15.244-16.762-9.899 0-16.366 7.721-16.366 17.092 0 9.37 6.467 17.092 16.366 17.092 8.117 0 13.462-4.817 14.98-11.219Zm27.254 4.95v5.61h5.939V26.733c0-6.666-4.883-12.539-13.99-12.539-7.721 0-13.397 4.29-13.924 10.69h6.269c.594-3.43 3.497-5.279 7.523-5.279h.33c4.685 0 7.523 2.574 7.523 7.128v.791l-10.295.858c-5.675.462-12.01 2.772-12.01 10.23 0 5.41 4.685 9.766 11.482 9.766 5.61 0 9.833-3.3 11.153-6.27Zm52.332-20.656V7.464h10.162c5.346 0 8.645 2.31 8.645 7.061 0 4.62-3.299 6.93-8.645 6.93h-10.162Zm-6.27 26.265h18.28c8.909 0 14.914-4.817 14.914-12.802 0-6.666-5.015-10.56-9.371-11.153 4.026-1.188 7.656-4.29 7.656-9.767 0-6.995-5.478-12.208-14.453-12.208h-17.026v45.93Zm121.756-18.61 14.254-14.254h-7.721l-15.706 16.3V1.79h-6.269v45.93h6.269v-9.437l4.949-4.883 11.021 14.32H300l-14.518-18.61ZM54.047 1.79h-6.269v45.93h6.27V1.79ZM0 24.754c0 13.33 10.559 23.625 23.757 23.625 7.787 0 14.584-3.63 18.808-9.239l-4.752-3.761c-3.365 4.289-8.117 7.193-14.056 7.193-9.767 0-17.356-7.985-17.356-17.818 0-9.833 7.59-17.818 17.356-17.818 5.94 0 10.69 2.904 14.056 7.193l4.752-3.761c-4.224-5.61-11.02-9.24-18.808-9.24C10.56 1.129 0 11.424 0 24.755Z" fill="currentColor" />
  </svg>
);

const FooterLink = ({ to, children }) => (
  <li className="mb-2 last:mb-0">
    <Link to={to} className="text-sm text-gray-400 hover:text-white transition">
      {children}
    </Link>
  </li>
);

const FooterColumn = ({ title, links }) => (
  <div className="mb-9 lg:mb-10 break-inside-avoid">
    <div className="text-base leading-tight text-white mb-1">{title}</div>
    <ul className="list-none p-0 m-0">
      {links.map((link) => (
        <FooterLink key={link.label} to={link.to}>
          {link.label}
        </FooterLink>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-black text-gray-500 pt-[66px] pb-[120px] md:pt-20 md:pb-[70px] relative z-[3]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12 md:mb-16">
          <Logo className="w-full max-w-[158px] md:max-w-[232px] text-white mr-[64px] mb-10 md:mb-0" />
          <div className="columns-2 sm:columns-3 gap-x-[27px] md:gap-x-14">
            <FooterColumn
              title="Products"
              links={[
                { label: "Accounts", to: "/accounts" },
                { label: "Clearing", to: "/clearing" },
                { label: "Embedded Banking", to: "/embedded-banking" },
                { label: "Explore our API", to: "/explore-our-api" },
              ]}
            />
            <FooterColumn
              title="Use cases"
              links={[
                { label: "Acquirers", to: "/use-cases/acquirers" },
                { label: "Banks", to: "/use-cases/banks" },
                { label: "Building societies and credit unions", to: "/use-cases/building-societies-and-credit-unions" },
                { label: "Digital asset platforms", to: "/use-cases/digital-assets" },
                { label: "Fintechs", to: "/use-cases/fintech" },
                { label: "Non-bank financial institutions", to: "/use-cases/non-bank-financial-institutions" },
                { label: "Pre-regulated firms", to: "/use-cases/pre-regulated" },
                { label: "Partners", to: "/partners" },
              ]}
            />
            <FooterColumn
              title="About"
              links={[
                { label: "Our company", to: "/our-company" },
                { label: "Join ClearBank", to: "/join-clearbank" },
                { label: "Regulatory and governance", to: "/regulatory-governance" },
                { label: "Reports and accounts", to: "/report-and-accounts" },
                { label: "Press", to: "/press-kit" },
                { label: "Contact us", to: "/contact-us" },
              ]}
            />
            <FooterColumn
              title="Learn"
              links={[
                { label: "Insights", to: "/learn/insights" },
                { label: "Reports", to: "/learn/reports" },
                { label: "Case studies", to: "/learn/case-studies" },
                { label: "News", to: "/learn/news" },
                { label: "Buyer's guide", to: "/learn/buyers-guide" },
              ]}
            />
            <FooterColumn
              title="Follow us"
              links={[
                { label: "LinkedIn", to: "/linkedin" },
                { label: "X.com", to: "/twitter" },
              ]}
            />
            <FooterColumn
              title="Customer support"
              links={[
                { label: "How to make a complaint", to: "/legal/how-to-make-a-complaint" },
                { label: "Fraud", to: "/legal/fraud-and-security" },
                { label: "FSCS protection", to: "/fscs-protection" },
                { label: "FAQs", to: "/faqs" },
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                { label: "Legal", to: "/legal" },
                { label: "Data protection and privacy", to: "/data-protection-and-privacy" },
                { label: "Security", to: "/security" },
                { label: "Modern slavery statement", to: "/modern-slavery-statement" },
                { label: "BCR Commitments", to: "/legal/bcr-commitments" },
              ]}
            />
            <div className="mb-9 lg:mb-10 break-inside-avoid">
              <div className="text-base leading-tight text-white mb-1">Sign up for updates</div>
              <ul className="list-none p-0 m-0">
                <li className="mb-2">
                  <a href="#subscribe" className="inline-flex items-center text-sm text-white border border-white rounded-full px-5 py-2 mt-2 hover:bg-white hover:text-black transition">
                    Count me in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[664px]">
          <div className="text-xs mb-4">Copyright © ClearBank Limited 2026. All rights reserved.</div>
          <div className="text-xs leading-relaxed text-gray-500">
            <p>
              ClearBank Limited is authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority (FRN: 754568). Registered in England and Wales under Company Number 09736376. Registered Address: ClearBank Limited, Level 27, The Broadgate Tower, 20 Primrose Street, London, United Kingdom, EC2A 2EW.&nbsp;
            </p>
            <p className="mt-3">
              ClearBank Limited is a subscriber to the{" "}
              <a href="https://www.wearepay.uk/what-we-do/payment-systems/access-to-payment-systems/code-of-conduct-for-indirect-access-providers/" className="underline hover:text-white">
                Code of Conduct for Indirect Access Providers
              </a>{" "}
              in respect of the indirect access services which it provides to its customers.
            </p>
            <p className="mt-3">
              ClearBank Europe N.V. is authorised by the European Central Bank and regulated by De Nederlandsche Bank. ClearBank Europe N.V. is registered at the Chamber of Commerce Amsterdam Trade Registry under number 89463366. Registered address: ClearBank Europe N.V., Stadhouderskade 85, 1073 AT Amsterdam, The Netherlands. VAT ID is NL864989829B01.
            </p>
            <p className="mt-3">
              ClearBank Group Holdings Limited is a Prudential Regulation Authority approved parent holding company (FRN: 987231). Registered in England and Wales under Company Number 14254435. Registered Address: ClearBank Group Holdings Limited, Level 27, The Broadgate Tower, 20 Primrose Street, London, United Kingdom, EC2A 2EW.&nbsp;
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}