"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans" suppressHydrationWarning>
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
