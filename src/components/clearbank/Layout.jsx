import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/clearbank/Header";
import Footer from "@/components/clearbank/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}