import Drawer from "@/component/Drawer";
import Header from "@/component/Header";
import Sidebar from "@/component/Sidebar";
import { useAuth } from "@/contextStore/Index";
import React from "react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="hidden lg:block fixed z-50 w-200px">
        {/* sidebar Component */}
        <Sidebar />
      </div>
      {/*  */}
      <div className="lg:ml-[200px] flex flex-col flex-1">
        {/* nav component for desktop*/}
        <div className="hidden lg:block">
          <Header user={user} />
        </div>
        <Drawer user={user} />

        <div className="container mx-auto px-4 py-5">
          {/* content outlet*/}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
