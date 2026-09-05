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
        router.push("/login");
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
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans transition-colors duration-300" suppressHydrationWarning>
      {/* Collapsible Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main workspace area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Topbar Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Scrollable page body */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}