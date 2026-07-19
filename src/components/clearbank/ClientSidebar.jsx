import React from "react";
import { Home, User, ArrowLeftRight, CreditCard, Wallet, PiggyBank, ShieldCheck, TrendingUp, FileText } from "lucide-react";

const navItems = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "compte", label: "Compte", icon: User },
  { id: "virement", label: "Virement", icon: ArrowLeftRight },
  { id: "paiement", label: "Paiement", icon: CreditCard },
  { id: "carte", label: "Carte", icon: Wallet },
  { id: "epargne", label: "Épargne", icon: PiggyBank },
  { id: "assurance", label: "Assurance", icon: ShieldCheck },
  { id: "bourse", label: "Bourse", icon: TrendingUp },
  { id: "document", label: "Document", icon: FileText },
];

export default function ClientSidebar({ active, onSelect }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] sticky top-[80px] py-6">
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-teal/10 text-teal-dark"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-teal-dark" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export { navItems };