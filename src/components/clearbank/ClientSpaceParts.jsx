import React from "react";

export function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="sm:w-1/3 text-sm text-gray-500 font-medium">{label}</div>
      <div className="sm:w-2/3 text-sm md:text-base text-black">{value || "—"}</div>
    </div>
  );
}

export function PlaceholderSection({ title, desc, icon: Icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 text-center shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon className="w-8 h-8 text-teal-dark" />}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
      <p className="text-gray-500 max-w-md mx-auto">{desc}</p>
    </div>
  );
}

export function SectionHeader({ meta }) {
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-teal-dark" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold">{meta.title}</h1>
    </div>
  );
}