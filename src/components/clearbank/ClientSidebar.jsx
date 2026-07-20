import React from "react";
import { Home, User, ArrowLeftRight, CreditCard, Wallet, PiggyBank, ShieldCheck, TrendingUp, FileText, Receipt, PenTool } from "lucide-react";

const navItems = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "compte", label: "Compte", icon: User },
  { id: "convention", label: "Convention", icon: PenTool },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "virement", label: "Virement", icon: ArrowLeftRight },
  { id: "paiement", label: "Paiement", icon: CreditCard },
  { id: "carte", label: "Carte", icon: Wallet },
  { id: "epargne", label: "Épargne", icon: PiggyBank },
  { id: "assurance", label: "Assurance", icon: ShieldCheck },
  { id: "bourse", label: "Bourse", icon: TrendingUp },
  { id: "document", label: "Documents", icon: FileText },
];

export default function ClientSidebar({ active, onSelect, items }) {
  const navList = items || navItems;
  return (
    <aside className="flex flex-col w-56 md:w-64 shrink-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-[calc(100vh-80px)] sticky top-[80px] py-6 px-3">
      <div className="px-3 mb-6">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Menu</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {navList.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "bg-teal text-black shadow-lg shadow-teal/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-black" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-3 pt-6 mt-6 border-t border-white/10">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Besoin d'aide ?</p>
          <p className="text-sm text-white font-medium">Contactez votre conseiller</p>
        </div>
      </div>
    </aside>
  );
}

export { navItems };