"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/login";
      } else {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-400 font-bold text-sm">
        Memeriksa akses...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-x-hidden" suppressHydrationWarning>
      {/* Collapsible Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main workspace area */}
      <div className={`flex min-h-screen flex-col w-full min-w-0 transition-all duration-300 ${sidebarOpen ? "md:pl-64" : "md:pl-0"}`}>
        {/* Dynamic Topbar Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Scrollable page body */}
        <main className="flex-1 w-full min-w-0">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}